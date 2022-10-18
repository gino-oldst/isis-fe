// @flow
import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { matchSorter } from 'match-sorter';
import Button from '../../base/Button/Button';
import Badge from '../../base/Badge/Badge';
import Typography from '../../base/Typography/Typography';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDropdown from '../../base/CustomDropdown/CustomDropdown';
import Select from '../../base/Select/Select';
import makeAnimated from 'react-select/animated';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { kFormatter, getTextColor, truncateText, capitalize, sourceMaker, numberWithCommas, getStatusCounter } from '../../../utils/helpers';
import { ALERT_ESCALATION_OPTIONS, ALERT_STATUS_OPTIONS, COMMUNICATION_ALERT_SOURCE_OPTIONS, COMMUNICATION_ALERT_STATUS_OPTIONS } from '../../../config/constants';
import {
    Table as ReactstrapTable,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Row,
    Col
} from 'reactstrap';
import { components } from 'react-select';
import filterIcon from '../../../assets/images/ic_filter.svg';
import './table.scss';

import { useTable, useRowSelect, useFilters, useGlobalFilter, usePagination, useSortBy, useAsyncDebounce, useExpanded } from 'react-table';
import { setIsRowSelected, setTablePageSize, setActivePage, setAppliedFilters, resetAppliedFilters, setAlertsDateRange, setFilteredRows, setSortedColumn, setAllRowsSelected, setTablePageChange } from '../../../redux/modules/isisTable';
import Highlighter from 'react-highlight-words';
import makeData from './makeData';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import DatePicker from 'react-datepicker';
import { after } from 'underscore';

// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <span>
            Search:{' '}
            <input
                value={value || ''}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} records...`}
                style={{
                    fontSize: '1.1rem',
                    border: '0'
                }}/>
        </span>
    );
}

// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter }
}) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => setFilter(e.target.value || undefined)} // Set undefined to remove the filter entirely
            placeholder={`Search ${count} records...`}/>
    );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
    column: { Header, filterValue, setFilter, preFilteredRows, id }
}) {
    const dispatch = useDispatch();
    const [selectFilter, setSelectFilter] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [isCheckAll, setIsCheckAll] = useState(false);
    const { table, selected, columnFilterValues, searchFilterValue } = useSelector(({ communicationSearch }) => communicationSearch);
    // const { table } = useSelector(({ behaviours }) => behaviours);
    const { appliedFilters, filtersReset, dateRange } = useSelector(({ isisTable }) => isisTable);

    const header = Header.toLowerCase();
    const columnFiltersWithCheckbox = ['behaviourCode', 'escalation', 'assignedUser', 'source'];
    const columnFiltersSearcheable = ['book', 'client'];
    const columnFiltersWithSearchbox = ['expander', 'receiver'];
    const rootPath = window.location.pathname.split('/')[1];

    if (rootPath === 'alerts') {
        columnFiltersSearcheable.push('ticker');
        columnFiltersWithSearchbox.pop();
    } else {
        columnFiltersWithSearchbox.push('ticker');
        columnFiltersSearcheable.pop();
    }

    useEffect(() => {
        setFilter(selectFilter);
    }, [selectFilter]);

    useEffect(() => {
        if (filtersReset) {
            setFilter([]);
            setSearchFilter('');
            setIsCheckAll(false);
            setSelectFilter([]);
        }
    }, [filtersReset]);

    const handleFilterChange = (e, value) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectFilter([...selectFilter, value]);
        } else {
            setSelectFilter([...selectFilter.filter(val => val !== value)]);
        }

        dispatch(setAppliedFilters(id, value, isChecked, columnFiltersWithCheckbox.includes(id)));
    };

    const handleResetFilter = () => {
        setFilter([]);
        setSelectFilter([]);
        setSearchFilter('');
        setIsCheckAll(false);
        dispatch(resetAppliedFilters(id));
    };

    const handleSelectFilterChange = selected => {
        dispatch(setActivePage(0));
        dispatch(setAppliedFilters(id, selected, true, columnFiltersWithCheckbox.includes(id)));
    };

    const handleSearch = value => {
        dispatch(setAppliedFilters(id, value, true, columnFiltersWithCheckbox.includes(id)));

        setSearchFilter(value);
    };

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);

        if (id == 'source') {
            setSelectFilter(table.data.map((alert) => {
                dispatch(setAppliedFilters(id, alert.source, true, columnFiltersWithCheckbox.includes(id)));

                return alert.source;
            }));
        }

        if (isCheckAll) {
            setSelectFilter([]);

            if (id == 'source') {
                table.data.map((alert) => dispatch(setAppliedFilters(id, alert.source, false, columnFiltersWithCheckbox.includes(id))));
            }
        }
    };

    const columnIsFiltered = () => {
        const hasFilterOn = appliedFilters.filter(filter => filter.id === id && filter.value.length > 0);

        if (hasFilterOn.length > 0) return <FontAwesomeIcon className='table__filter-icon-active cursor-pointer' icon='filter' />;

        return <img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />;
    };

    const Option = props => {
        return (
            <div className='d-flex'>
                <components.Option {...props}>
                    <input
                        type='checkbox'
                        checked={props.isSelected}
                        style={{ verticalAlign: 'middle' }}
                        onChange={() => null}/>{' '}
                    <label style={{ fontSize: '14px', verticalAlign: 'top' }}>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const allOption = {
        label: 'Select all',
        value: '*'
    };

    const ValueContainer = ({ children, ...props }) => {
        const currentValues = props.getValue();
        let toBeRendered = children;

        if (currentValues.some(val => val.value === allOption.value)) {
            toBeRendered = [[children[0][0]], children[1]];
        }

        return (
            <components.ValueContainer {...props}>
                {toBeRendered}
            </components.ValueContainer>
        );
    };

    const MultiValue = props => {
        let labelToBeDisplayed = `${props.data.label} `;

        if (props.data.value === allOption.value) {
            labelToBeDisplayed = 'All is selected';
        }

        return (
            <components.MultiValue {...props}>
                <span>{labelToBeDisplayed}</span>
            </components.MultiValue>
        );
    };

    const animatedComponents = makeAnimated();

    const renderFilterWithSearchbar = () => {
        return columnFiltersWithSearchbox.includes(id) &&
        <DropdownItem header={true}>
            <Input type='text' name='search' placeholder='Search...'
                bsSize='md' value={searchFilter} onChange={e => handleSearch(e.target.value)} />
        </DropdownItem>;
    };

    // List of all cars satisfing all the filters
    const [filterOptions, setFilteredOptions] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleDateFrom = (date) => {
        setStartDate(date);
        dispatch(setAlertsDateRange('start', date));
    };

    const handleDateTo = (date) => {
        setEndDate(date);
        dispatch(setAlertsDateRange('end', date));
    };

    const renderFilterWithCheckboxColumns = () => {
        let options = [];

        switch (header) {
            case 'date & time':
                return <>
                    <FormGroup>
                        <Typography weight='regular' variant='size-14' color='color-3'>Date From</Typography>
                        <DatePicker
                            className='w-100 mb-3'
                            selected={startDate}
                            onChange={(date) => handleDateFrom(date)}
                            showTimeInput={true}
                            dateFormat='MMMM d, yyyy h:mm aa'/>
                    </FormGroup>
                    <FormGroup>
                        <Typography weight='regular' variant='size-14' color='color-3'>Date To</Typography>
                        <DatePicker
                            className='w-100'
                            selected={endDate}
                            onChange={(date) => handleDateTo(date)}
                            showTimeInput={true}
                            dateFormat='MMMM d, yyyy h:mm aa'/>
                    </FormGroup>
                </>;
                break;
            case 'recipient':
                if (columnFilterValues) {
                    options = columnFilterValues.emails.map(email => ({
                        label: email.value,
                        inputComponent: <Input type='checkbox' checked={selectFilter.includes(email.value.toUpperCase()) || appliedFilters.filter(filter => filter.id === 'sender' && filter.value.includes(email.value)).length}
                            onChange={e => handleFilterChange(e, email.value.toUpperCase())}/>
                    }));
                }

                break;
            case 'sender':
                if (columnFilterValues) {
                    options = columnFilterValues.emails.map(email => ({
                        label: email.value,
                        inputComponent: <Input type='checkbox' checked={selectFilter.includes(email.value.toUpperCase()) || appliedFilters.filter(filter => filter.id === 'sender' && filter.value.includes(email.value)).length}
                            onChange={e => handleFilterChange(e, email.value.toUpperCase())}/>
                    }));
                }

                break;
            case 'source':
                options = Object.keys(COMMUNICATION_ALERT_SOURCE_OPTIONS).map(statusOpt => ({
                    label: statusOpt,
                    inputComponent: <Input type='checkbox' checked={selectFilter.includes(statusOpt.toUpperCase()) || appliedFilters.filter(filter => filter.id === 'source' && filter.value.includes(statusOpt)).length || isCheckAll}
                        onChange={e => handleFilterChange(e, statusOpt.toUpperCase())}/>
                }));
                break;
            case 'status':
                options = Object.keys(COMMUNICATION_ALERT_STATUS_OPTIONS).map(statusOpt => ({
                    label: statusOpt,
                    inputComponent: <Input type='checkbox' checked={selectFilter.includes(statusOpt.toUpperCase()) || appliedFilters.filter(filter => filter.id === 'source' && filter.value.includes(statusOpt)).length || isCheckAll}
                        onChange={e => handleFilterChange(e, statusOpt.toUpperCase())}/>
                }));
                break;
            case 'alert':
                if (columnFilterValues) {
                    options = columnFilterValues.keywords.map(keyword => ({
                        label: keyword.value,
                        inputComponent: <Input type='checkbox' checked={selectFilter.includes(keyword.value.toUpperCase()) || appliedFilters.filter(filter => filter.id === 'alert' && filter.value.includes(keyword.value)).length}
                            onChange={e => handleFilterChange(e, keyword.value.toUpperCase())}/>
                    }));
                }

                break;
            default:
                break;
        }

        return <>
            <FormGroup className='mb-3'>
                <Input type='text' name='search' placeholder='Search...'
                    bsSize='md' value={filterOptions} onChange={e => setFilteredOptions(e.target.value)} />
            </FormGroup>
            <FormGroup key={'select_all'} check={true}>
                <Label check={true} className='d-flex align-items-center'>
                    <Input type='checkbox' checked={isCheckAll}
                        onChange={handleSelectAll}/>
                    <Typography weight='regular' variant='size-16' color='color-3'>Select all</Typography>
                </Label>
            </FormGroup>
            {options.filter(option => option.label.toLowerCase().includes(filterOptions.toLowerCase())).map((opt, idx) => (
                <FormGroup key={opt.label} check={true}>
                    <Label check={true} className='d-flex align-items-center'>
                        {opt.inputComponent}
                        <Typography weight='regular' variant='size-16' color='color-3'>{opt.label}</Typography>
                    </Label>
                </FormGroup>
            ))}
        </>;
    };

    // Render a multi-select box
    return (
        <CustomDropdown tag='span'
            toggle={columnIsFiltered()}
            className='isis-filter'>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <div className='table__filter-options overflow-auto'>
                {renderFilterWithCheckboxColumns()}
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2' onClick={() => handleResetFilter()}/>
        </CustomDropdown>
    );
}

// For row selection
// Marking this as to look into
const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef();
        const dispatch = useDispatch();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
            rest.title.toLowerCase() === 'toggle all rows selected' && dispatch(setAllRowsSelected(rest.checked));
        }, [resolvedRef, indeterminate, rest.checked]);

        return (
            <>
                <input type='checkbox' ref={resolvedRef} {...rest} />
            </>
        );
    }
);

// Our table component
function IsisTable({
    loading,
    isTimeout,
    columns,
    data,
    tablePagination,
    totalNoOfRecords,
    activePage,
    selectableRows,
    globalFilter,
    pagination,
    sortable,
    viewDetails,
    hideHeader,
    renderRowSubComponent,
    isDisabled,
    fetching,
    toggleSelection
}) {
    const [isAsc, setIsAsc] = useState(true);
    const [sortBy, setSortBy] = useState('id');

    const filterTypes = useMemo(
        () => ({
            fuzzyText: fuzzyTextFilterFn,
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];

                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            }
        }),
        []
    );

    const defaultColumn = useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        page,
        pageCount,
        gotoPage,
        previousPage,
        setPageSize,
        state: { pageSize, expanded },
        toggleAllRowsSelected
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect,
        hooks => { // push column for the checkbox
            selectableRows && hooks.visibleColumns.push(columns => [
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div style={{ padding: '10px 0' }} className='selectrs d-flex align-items-center'>
                            <IndeterminateCheckbox
                                disabled={isDisabled}
                                {...row.getToggleRowSelectedProps()}/>
                        </div>
                    )
                },
                ...columns
            ]);
        }
    );

    const { toggle, selectedRows } = useSelector(({ isisTable }) => isisTable);

    useEffect(() => {
        toggleAllRowsSelected(false);
    }, [toggle]);

    useEffect(() => {
        // dispatch(setAppliedFilters(state.filters));
        dispatch(setFilteredRows(page.map(p => p.original.id)));
    }, [state.filters]);

    const dispatch = useDispatch();
    const maxPage = 3; // max page for pagination button

    const selectedRowsIsis = rows.filter(row => row.isSelected === true);
    const [previousSelectedRows, setPreviousSelectedRows] = useState([]);
    /**
     *
     * Store past Selected Rows and Current Selected Rows
     * Comapare past and current selected rows
     * if object is in the past and not in current
     * then slice it from the redux row selected or its clone
     *
     */

    const getDifference = (array1, array2) => {
        return array1.filter(({ value: id1 }) => !array2.some(({ value: id2 }) => id2 === id1));
    };

    useEffect(() => {
        var selectedRowsClone = JSON.parse(JSON.stringify(selectedRows));

        var notInSelected = [];
        var toBeSpliced = [];
        var compareList = [];
        var dispatchList = [];

        // See if not existing in previous selected row if not in currently selected
        if (selectedRowsClone.length > selectedRowsIsis.length) {
            toBeSpliced = selectedRowsClone.filter(function(o1) {
                return selectedRowsIsis.length === 0
                    ? o1
                    : !selectedRowsIsis.some(function(o2) {
                        return o1.alerts.data[0].commMessageId === o2.original.alerts.data[0].commMessageId; // return the ones with equal id
                    });
            });
        }

        // Splice from the array
        toBeSpliced.map(row => {
            if (row.alerts.data.length === row.alerts.totalNoOfRecords) {
                selectedRowsClone.splice(selectedRowsClone.findIndex(item => item.alerts.data[0].commMessageId === row.alerts.data[0].commMessageId), 1);
            }
        });

        selectedRowsIsis.map(row => {
            var index = selectedRowsClone.findIndex(item => item.alerts.data.length < row.original.alerts.data.length && item.alerts.data[0].commMessageId === row.original.alerts.data[0].commMessageId);

            if (index > -1) {
                selectedRowsClone.splice(index, 1);
            }
        });

        // check if there are candidates to be appended to the redux selectedRow
        notInSelected = selectedRowsIsis.map((row, index) => {
            if (selectedRowsClone.length > 0) {
                return selectedRowsClone.map(srow => {
                    if (row.original.alerts.data[0].commMessageId != srow.alerts.data[0].commMessageId) {
                        return row;
                    } else {
                        return null;
                    }
                })[0];
            } else {
                return row;
            }
        }).filter(function(element) {
            return element !== null;
        });

        compareList = [...selectedRowsClone, ...notInSelected.map(row => { return row.original; })];
        dispatchList = compareList.map(JSON.stringify).reverse() // convert to JSON string the array content, then reverse it (to check from end to begining)
            .filter(function(item, index, compareList) { return compareList.indexOf(item, index + 1) === -1; }) // check if there is any occurence of the item in whole array
            .reverse().map(JSON.parse); // revert it to original state

        setPreviousSelectedRows(selectedRowsIsis);

        dispatch(setIsRowSelected(dispatchList.length, dispatchList));
    }, [selectedRowsIsis.length]);

    // set pageSize to redux that triggers alerts list api call
    useEffect(() => {
        dispatch(setTablePageSize(pageSize));
    }, [pageSize]);

    const setTableActivePage = page => {
        dispatch(setActivePage(page));
        // add another dispatch here
        dispatch(setTablePageChange(true));
    };

    const handleSort = (key) => {
        setTableActivePage(0);

        if (key === sortBy) {
            setIsAsc(!isAsc);
            dispatch(setSortedColumn(key, !isAsc ? 'ASC' : 'DESC'));
        } else {
            setSortBy(key);
            setIsAsc(true);
            dispatch(setSortedColumn(key, 'ASC'));
        }
    };

    const renderSortControl = (key) =>
        sortBy === key
            ? isAsc ? ' 🔼' : ' 🔽'
            : <FontAwesomeIcon icon='sort' size='sm' className='table__sort-icon' />;

    return (
        <>
            <ReactstrapTable responsive={true} {...getTableProps()}>
                <thead>
                    {globalFilter &&
                        <tr>
                            <th
                                colSpan={visibleColumns.length}
                                style={{
                                    textAlign: 'left'
                                }}>
                                <GlobalFilter
                                    preGlobalFilteredRows={preGlobalFilteredRows}
                                    globalFilter={state.globalFilter}
                                    setGlobalFilter={setGlobalFilter}/>
                            </th>
                        </tr>
                    }
                    {!hideHeader && headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    <span onClick={() => column.id !== 'alertId' && column.id !== 'keyword' && column.id !== 'policiesStatus' && column.id !== 'selection' && column.id !== 'chainLinkId' && column.id !== 'id' && column.id !== 'message' &&
                                            column.id !== 'expander' && column.id !== 'status' && column.id !== 'recipient' && column.id !== 'recipients' &&
                                            handleSort(column.id == 'senderSearch' ? 'sender' : column.id == 'date' ? 'timeSent' : column.id == 'alertSource' ? 'source' : column.id)}
                                    className={() => column.id !== 'alertId' && column.id !== 'keyword' && column.id !== 'policiesStatus' && column.id !== 'selection' && column.id !== 'chainLinkId' && column.id !== 'id' && column.id !== 'message' &&
                                    column.id !== 'expander' && column.id !== 'recipient' && 'cursor-pointer'}>
                                        {column.render('Header')}
                                        {column.id !== 'selection' && column.id !== 'chainLinkId' && column.id !== 'id' && column.id !== 'message' &&
                                            column.id !== 'alertId' && column.id !== 'keyword' && column.id !== 'policiesStatus' && column.id !== 'expander' && column.id !== 'status' && column.id !== 'recipient' && column.id !== 'recipients' &&
                                            renderSortControl(column.id == 'senderSearch' ? 'sender' : column.id == 'date' ? 'timeSent' : column.id == 'alertSource' ? 'source' : column.id)}
                                    </span>
                                    {column.canFilter ? column.render('Filter') : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {!page.length || loading
                        ? <tr>
                            <td className='text-muted text-center' colSpan={12}>
                                {loading ? 'Fetching data...' : isTimeout ? 'Server Timed Out' : 'No data Found'}
                            </td>
                        </tr>
                        : page.map((row, i) => {
                            prepareRow(row);
                            const rowProps = row.getRowProps();

                            return (
                                <React.Fragment {...row.getRowProps()}>
                                    <tr className={`${row.isSelected ? 'selected-row' : ''}`}>
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                        })}
                                    </tr>
                                    {row.isExpanded &&
                                        renderRowSubComponent({ row, rowProps, visibleColumns })}
                                </React.Fragment>
                            );
                        })
                    }
                </tbody>
            </ReactstrapTable>
            {pagination &&
                <Row className='mt-5 align-items-center'>
                    <Col md={12} lg={3} className='mr-auto'>
                        <div className='pagination-pagesize'>
                            <span>Showing {totalNoOfRecords > 0 ? ((activePage + 1) * pageSize + 1) - pageSize : 0}-{(activePage + 1) * pageSize > totalNoOfRecords ? totalNoOfRecords : (activePage + 1) * pageSize} of {numberWithCommas(totalNoOfRecords)} items</span>
                            <Input type='select'
                                className='mt-2'
                                value={pageSize}
                                disabled={fetching}
                                onChange={e => {
                                    setPageSize(Number(e.target.value));
                                    setTableActivePage(0);
                                }}>
                                {[10, 25, 50, 100].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </Input>
                        </div>
                    </Col>
                    <Col md={12} lg={6}>
                        <div className='pagination d-flex justify-content-center'>
                            <span className={`cursor-pointer pagination-navigate
                                ${activePage === 0 || fetching ? 'text-muted' : ''}`}
                            onClick={() => {
                                gotoPage(0);
                                setTableActivePage(0);
                            }}>
                                First
                            </span>
                            <span className={`cursor-pointer pagination-navigate
                            ${activePage === 0 || fetching ? 'text-muted' : ''}`}
                            onClick={() => {
                                previousPage();
                                if (activePage !== 0 && !fetching) setTableActivePage(activePage - 1);
                            }}>
                                Prev
                            </span>
                            {Array.from(Array(tablePagination), (_, i) => {
                                const dynamicPageIndex = activePage > maxPage ? activePage - 2 + i : i + 1;

                                return i <= maxPage + 3 && dynamicPageIndex <= tablePagination && <span key={i}
                                    className={`cursor-pointer ${activePage + 1 === dynamicPageIndex ? 'active' : ''} ${fetching ? 'text-muted' : ''}`}
                                    onClick={() => {
                                        if (!fetching) setTableActivePage(dynamicPageIndex - 1);
                                        gotoPage(dynamicPageIndex - 1);
                                    }}>
                                    {dynamicPageIndex}
                                </span>;
                            })}
                            <span className={`cursor-pointer pagination-navigate
                            ${activePage + 1 === tablePagination || tablePagination === 0 || fetching ? 'text-muted' : ''}`}
                            onClick={() => {
                                if (activePage + 1 !== tablePagination && tablePagination > 0 && !fetching) setTableActivePage(activePage + 1);
                            }}>
                                Next
                            </span>
                            <span className={`cursor-pointer pagination-navigate
                            ${activePage + 1 === tablePagination || tablePagination === 0 || fetching ? 'text-muted' : ''}`}
                            onClick={() => {
                                gotoPage(pageCount - 1);
                                if (activePage + 1 !== tablePagination && tablePagination > 0 && !fetching) setTableActivePage(tablePagination - 1);
                            }}>
                                Last
                            </span>
                        </div>
                    </Col>
                    <Col md={12} lg={3} className='ml-auto'>
                        <div className='pagination-goto-page  d-flex align-items-center'>
                        Go to page:
                            <Input
                                type='number'
                                size='md'
                                min='0'
                                value={activePage + 1}
                                defaultValue={activePage + 1}
                                style={{ width: '80px' }}
                                disabled={fetching || (activePage + 1) === tablePagination}
                                className='ml-2'
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;

                                    setTableActivePage(page);
                                    gotoPage(page);
                                }} />
                        </div>
                    </Col>
                </Row>
            }
        </>
    );
}

/* Custom filter function */
function multiSelectFilter(rows, columnIds, filterValue) {
    // Filters only if filters are selected
    return filterValue.length === 0 ? rows : rows.filter((row) => filterValue.includes(String(row.original[columnIds])));
}

/* Subrows */
function SubRows({ row, rowProps, visibleColumns, data, loading, alertsList }) {
    const dispatch = useDispatch();
    const { toggle, selectedRows } = useSelector(({ isisTable }) => isisTable);
    const [checked, setChecked] = useState([]);
    const [parentRowSelected, setParentRowSelected] = useState(false);

    useEffect(() => {
        if (!toggle && row.isSelected && selectedRows.length > 0 && data.length > 0) {
            var filteredList = checked.length > 0
                ? data.map(r => { return checked.find(el => el === r.id) ? r : null; }).filter(function(element) {
                    return element !== null;
                })
                : data;

            setChecked([...filteredList.map(item => { return item.id; })]);
            setParentRowSelected(true);
        }

        if (parentRowSelected && !row.isSelected) {
            if (checked.length == data.length && parentRowSelected) {
                setChecked([]);
            }

            setParentRowSelected(false);
        }
    }, [selectedRows]);

    useEffect(() => {
        if (row.isSelected || toggle) {
            var rowData = row.original.alerts.data;

            setChecked([...rowData.map(item => { return item.id; })]);
            setParentRowSelected(true);
        }
    }, [row.isSelected, toggle]);

    useEffect(() => {
        if (checked.length != data.length && !parentRowSelected) {
            row.toggleRowSelected(false);
        }
    }, [checked]);

    const alertObj = {
        alerts: {
            data: [],
            totalCurrentElements: 0,
            totalNoOfRecords: 1,
            totalPages: 0
        }
    };

    const handleCheck = (event, data, row) => {
        // var updatedList = [...checked];
        // if (event.target.checked) {
        //     updatedList = [...checked, event.target.value];
        // } else {
        //     updatedList.splice(checked.indexOf(event.target.value), 1);
        // }
        // setChecked(updatedList);

        if (event.target.checked) {
            if (row.original.alerts.data.length == [data].length) {
                row.toggleRowSelected(event.target.checked);
            } else {
                var updatedList = JSON.parse(JSON.stringify(selectedRows)); // [...selectedRows];
                var nlist = [];
                var xlist = [];

                nlist = updatedList.map(r => { return r.alerts.data.find(el => el.commMessageId === data.commMessageId) ? r : null; }).filter(function(element) {
                    return element !== null;
                });

                xlist = updatedList.map(r => { return r.alerts.data.find(el => el.commMessageId != data.commMessageId) ? r : null; }).filter(function(element) {
                    return element !== null;
                });

                if (nlist.length > 0 && updatedList.length > 0) {
                    var newList = [];

                    nlist[0].alerts.data.push(data);
                    newList = [...xlist, ...nlist.map(row => { return row; })];

                    setChecked([...checked, data.id]);

                    if (row.original.alerts.data.length == nlist[0].alerts.data.length) {
                        newList.splice(newList.findIndex(item => item.alerts.data[0].id === data.id), 1);
                        dispatch(setIsRowSelected(newList.length, newList));
                        row.toggleRowSelected(true);
                    } else {
                        dispatch(setIsRowSelected(newList.length, newList));
                    }
                } else if (nlist.length == 0 || updatedList.length == 0) {
                    alertObj.alerts.data.push(data);
                    alertObj.alerts.totalNoOfRecords = row.original.alerts.totalNoOfRecords;
                    updatedList = [...updatedList, alertObj];
                    setChecked([...checked, data.id]);
                    dispatch(setIsRowSelected(updatedList.length, updatedList));
                }
            }
        } else {
            var updatedList = JSON.parse(JSON.stringify(selectedRows));

            var newList = [...checked];

            newList.splice(newList.indexOf(data.id), 1);

            setChecked(newList);
            setParentRowSelected(false);

            updatedList.map((row, index) => {
                if (row.alerts.data.find(el => el.id === data.id)) {
                    row.alerts.data.splice(row.alerts.data.findIndex(el => el.id === data.id), 1);
                }

                // if (row.alerts.data == []) {
                //     updatedList.splice(index);
                // }
            });
            var index = updatedList.findIndex(item => item.alerts.data.length === 0);

            if (index > -1) {
                updatedList.splice(index);
            }

            dispatch(setIsRowSelected(updatedList.length, updatedList));
        }
    };

    if (loading) {
        return (
            <tr>
                <td/>
                <td colSpan={visibleColumns.length - 1}>
                    Loading...
                </td>
            </tr>
        );
    }

    return (
        <>
            {data.map((x, i) => {
                return (
                    <tr
                        {...rowProps}
                        key={`${rowProps.key}-expanded-${i}`}>
                        {row.cells.map((cell) => {
                            // This is the row for the collapsable...
                            // the selection part deserves a look into
                            // maybe customize it's checkbox to cater individually selected alerts
                            if (cell.column.id == 'selection') {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {/* {JSON.stringify(checked.includes(x.id))}
                                        {JSON.stringify(checked)}
                                        {JSON.stringify(x.id)}
                                        {JSON.stringify(row.isSelected)} */}
                                        <input checked={row.isSelected ? row.isSelected : checked.includes(x.id)} id='row-checkbox' type='checkbox'
                                            onChange={e => handleCheck(e, x, row)} />
                                    </td>
                                );
                            } else if (cell.column.id == 'expander') {
                                // console.log(cell.column)
                                return (
                                    <td>
                                        <div className='d-flex flex-column'>
                                            {/* <Typography color='color-3' className='search-results__box-label' >
                                                {capitalize(x.keyword)}
                                            </Typography> */}
                                            {alertsList
                                                ? <Typography variant='size-16' color='color-3' className=' search-results__box-label' >
                                                    {alertsList.filter(alert => alert.value === x.keywordId)[0].label}
                                                    {/* {JSON.stringify(alertsList.filter(alert => alert.value === x.keywordId))}
                                                    {x.keywordId} */}
                                                </Typography>
                                                : <Typography variant='size-16' color='color-3' className=' search-results__box-label' >
                                                    No Alerts.
                                                </Typography>
                                            }
                                        </div>
                                    </td>
                                );
                            } else if (cell.column.id == 'status') {
                                return (
                                    <td>
                                        <Badge status={x.status} />
                                    </td>
                                );
                            } else if (cell.column.id == 'alertMessageSummary') {
                                const alertLevelMessage = (cell.row.original.alerts.data[0].message);
                                var beforeAlertLevelMessage = alertLevelMessage.substring(0, alertLevelMessage.indexOf(cell.row.original.alerts.data[0].keyword));
                                var afterAlertLevelMessage = alertLevelMessage.substring(alertLevelMessage.indexOf(cell.row.original.alerts.data[0].keyword), 75);

                                return (
                                    <td colSpan={visibleColumns.length - 1} >
                                        <div className='alert-summary-message-column d-flex align-items-center mb-3 highlighted-text' style={{ minWidth: '200px !important' }}>
                                            <p>{beforeAlertLevelMessage} {afterAlertLevelMessage}</p>
                                        </div>
                                    </td>
                                );
                            }
                        })}
                    </tr>
                );
            })}
        </>
    );
}

function SubRowAsync({ row, rowProps, visibleColumns }) {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    var alertData = JSON.parse(JSON.stringify(row.original.alerts.data)).sort((a, b) => a.id > b.id ? 1 : -1);
    const { alertsList } = useSelector(({ isisTable }) => isisTable);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            // setData(makeData(Math.floor(Math.random() * 5) + 1));
            setData(alertData);
            setLoading(false);
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <SubRows
            row={row}
            rowProps={rowProps}
            visibleColumns={visibleColumns}
            data={data}
            loading={loading}
            alertsList={alertsList}/>
    );
}

type Props = {
    loading?: boolean,
    isTimeout?: boolean,
    children?: string | React.Node,
    className?: string,
    tableData: Array,
    tableColumns: Array,
    tablePagination: number,
    totalNoOfRecords: number,
    activePage: number,
    selectableRows: boolean,
    isAsc: Boolean,
    globalFilter: boolean,
    pagination: boolean,
    sortable: boolean,
    hideHeader: boolean,
    isDisabled: boolean,
    fetching: boolean,
    viewDetails: Function,
    toggleSelection: Boolean
}

export default function ReactTable({
    loading,
    isTimeout,
    children,
    className = '',
    tableData,
    tableColumns,
    tablePagination,
    totalNoOfRecords,
    isAsc,
    activePage,
    selectableRows = false,
    globalFilter = false,
    pagination = false,
    sortable = false,
    hideHeader = false,
    isDisabled = false,
    fetching,
    viewDetails,
    toggleSelection
}: Props): React$Element<any> {
    const columns = useMemo(
        () => tableColumns.map(column => {
            const rootPath = window.location.pathname.split('/')[1];

            const highlight = ({ children, highlightIndex }) => (
                <strong className='highlighted-text'>{children}</strong>
            );

            const cellRender = (accessor, cell, row) => {
                if (accessor == 'id') {
                    return (
                        <div>
                            <span title={cell.value} className={'font-weight-bold color-link-text cursor-pointer'} onClick={() => viewDetails(cell.value, cell.cell.row.original.chainLinkId, cell.cell.row.original.keyword)}>
                                {cell.value}
                            </span>
                        </div>
                    );
                } else if (accessor == 'timeSent') {
                    const readableDate = moment(cell.value).utc().local().format('DD/MM/YYYY hh:mm A');

                    return (
                        <div>
                            <div>{readableDate}</div>
                        </div>
                    );
                } else if (accessor == 'date') {
                    const readableDate = moment(cell.cell.row.original.alerts.data[0].timeSent).utc().local().format('DD/MM/YYYY hh:mm A');

                    const keywords = [...new Set(cell.cell.row.original.alerts.data.map(item => item.keyword))];

                    const recipients = [...new Set(cell.cell.row.original.alerts.data[0].recipients
                        ? cell.cell.row.original.alerts.data[0].recipients.map(item => item)
                        : '')];
                    const strRecipients = recipients.join(', ');

                    return (
                        <div onClick={() => viewDetails(cell.cell.row.original.alerts.data[0].commMessageId, cell.cell.row.original.alerts.data[0].commChainLinkId, keywords, strRecipients)}
                            className='cursor-pointer'>
                            <div>{readableDate}</div>
                        </div>
                    );
                } else if (accessor == 'message') {
                    return (
                        <div className='table__text-cell d-flex flex-column'>
                            <Typography size={14} color='color-3' className='table__box-label pl-0' >
                                {cell.cell.row.original.subject == null ? 'No Subject' : cell.cell.row.original.subject}
                            </Typography>
                            <Highlighter className='table__box-label' highlightClassName='alertKeyword'
                                style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                searchWords={[cell.cell.row.original.keyword]}
                                highlightTag={highlight}
                                autoEscape={true}
                                textToHighlight={truncateText(cell.value, 40)}/>
                            {/* <Typography size={14} color='color-3' className='table__box-label' >
                                {truncateText(cell.value, 40)}
                            </Typography> */}
                        </div>
                    );
                } else if (accessor == 'source') {
                    return (
                        <div className='table__text-cell d-flex flex-column'>
                            {cell.value != null
                                ? <Typography size={14} color='color-3' className='table__box-label' >
                                    {sourceMaker(cell.value)}
                                </Typography>
                                : 'N/A'
                            }
                        </div>
                    );
                } else if (accessor == 'sender') {
                    const keywords = [...new Set(cell.cell.row.original.alerts.data.map(item => item.keyword))];

                    const recipients = [...new Set(cell.cell.row.original.alerts.data[0].recipients
                        ? cell.cell.row.original.alerts.data[0].recipients.map(item => item)
                        : '')];
                    const strRecipients = recipients.join(', ');

                    return (
                        <div onClick={() => viewDetails(cell.cell.row.original.alerts.data[0].commMessageId, cell.cell.row.original.alerts.data[0].commChainLinkId, keywords, strRecipients)}
                            className='d-flex flex-column text-wrap cursor-pointer'>
                            {cell.cell.row.original.alerts.data[0].sender != null
                                ? <Typography size={14} color='color-3' className='table__box-label' >
                                    {cell.cell.row.original.alerts.data[0].sender}
                                </Typography>
                                : 'N/A'
                            }
                        </div>
                    );
                } else if (accessor == 'senderSearch') {
                    return (
                        <div className='d-flex flex-column'>
                            {cell.cell.row.original.sender != null
                                ? <Typography size={14} color='color-3' className='table__box-label' >
                                    {cell.cell.row.original.sender}
                                </Typography>
                                : 'N/A'
                            }
                        </div>
                    );
                } else if (accessor == 'recipient') {
                    const recipients = [...new Set(cell.cell.row.original.alerts.data[0].recipients
                        ? cell.cell.row.original.alerts.data[0].recipients.map(item => item)
                        : '')];

                    const keywords = [...new Set(cell.cell.row.original.alerts.data.map(item => item.keyword))];

                    const strRecipients = recipients.join(', ');

                    return (
                        <div onClick={() => viewDetails(cell.cell.row.original.alerts.data[0].commMessageId, cell.cell.row.original.alerts.data[0].commChainLinkId, keywords, strRecipients)}
                            className='d-flex flex-column cursor-pointer'>
                            {recipients
                                ? <Typography size={14} color='color-3' className='table__box-label' >
                                    {truncateText(recipients.join(', '), 200)}
                                </Typography>
                                : 'N/A'
                            }
                        </div>
                    );
                } else if (accessor == 'recipients') {
                    const recipients = [...new Set(cell.cell.row.original.recipients.map(item => item))];

                    return (
                        <div className='d-flex flex-column' style={{ maxWidth: '200px' }}>
                            {recipients != null
                                ? <Typography size={14} color='color-3' className='table__box-label' >
                                    {truncateText(recipients.join(', '), 400)}
                                </Typography>
                                : 'N/A'
                            }
                        </div>
                    );
                } else if (accessor == 'alertSource') {
                    const keywords = [...new Set(cell.cell.row.original.alerts.data.map(item => item.keyword))];

                    const recipients = [...new Set(cell.cell.row.original.alerts.data[0].recipients
                        ? cell.cell.row.original.alerts.data[0].recipients.map(item => item)
                        : '')];
                    const strRecipients = recipients.join(', ');

                    return (
                        <div onClick={() => viewDetails(cell.cell.row.original.alerts.data[0].commMessageId, cell.cell.row.original.alerts.data[0].commChainLinkId, keywords, strRecipients)}
                            className='d-flex flex-column cursor-pointer'>
                            {cell.cell.row.original.alerts.data[0].source != null
                                ? <Typography size={14} color='color-3' className='table__box-label' >
                                    {sourceMaker(cell.cell.row.original.alerts.data[0].source)}
                                </Typography>
                                : 'N/A'
                            }
                        </div>
                    );
                } else if (accessor == 'expander') {
                    // Make an expander cell
                    // row.original.alerts.data
                    const keywords = [...new Set(cell.cell.row.original.alerts.data.map(item => item.keyword))];

                    const recipients = [...new Set(cell.cell.row.original.alerts.data[0].recipients
                        ? cell.cell.row.original.alerts.data[0].recipients.map(item => item)
                        : '')];
                    const strRecipients = recipients.join(', ');

                    console.log(cell.cell.row.getToggleRowExpandedProps());
                    // ' 🔼' : ' 🔽'

                    return (
                        <div className='d-flex justify-content-center align-items-center' style={{ maxWidth: '400px' }}>
                            <Typography weight={'bold'} variant={'size-16'} color='color-3'
                                {...cell.cell.row.getToggleRowExpandedProps()} className='table__arrow-square d-flex justify-content-center align-items-center'>

                                <FontAwesomeIcon icon='sort' size='sm' className='table__sort-icon' />
                            </Typography>
                            <div className='table__number-square d-flex justify-content-center align-items-center'>
                                <Typography weight={'bold'} variant={'size-16'} color='color-3'>
                                    {cell.cell.row.original.alerts.data.length}
                                </Typography>
                            </div>
                            {/* <Typography weight={'bold'} variant={'size-16'} color='color-3'
                                className='color-link-text cursor-pointer pl-3 table__box-label'
                                onClick={() => viewDetails(cell.cell.row.original.alerts.data[0].commMessageId, cell.cell.row.original.alerts.data[0].commChainLinkId, keywords, strRecipients)}>
                                {cell.cell.row.original.alerts.data[0].commMessageId}
                            </Typography> */}
                        </div>
                    );
                } else if (accessor == 'policiesStatus') {
                    const status = (cell.cell.row.original.status).toLowerCase();

                    return <Badge status={status} />;
                } else if (accessor == 'alertMessageSummary') {
                    const summaryMessage = (cell.cell.row.original.alerts.data[0].message);
                    const keywords = [...new Set(cell.cell.row.original.alerts.data.map(item => item.keyword))];

                    const recipients = [...new Set(cell.cell.row.original.alerts.data[0].recipients
                        ? cell.cell.row.original.alerts.data[0].recipients.map(item => item)
                        : '')];
                    const strRecipients = recipients.join(', ');

                    return (
                        <div onClick={() => viewDetails(cell.cell.row.original.alerts.data[0].commMessageId, cell.cell.row.original.alerts.data[0].commChainLinkId, keywords, strRecipients)}
                            className='alert-summary-message-column d-flex align-items-center mb-3 cursor-pointer' style={{ minWidth: '200px !important' }}>
                            <p >{truncateText(summaryMessage, 150)}</p>
                        </div>
                    );
                } else if (accessor == 'status') {
                    const alertsList = cell.cell.row.original.alerts.data;

                    const stats = getStatusCounter(alertsList);

                    return (
                        <>
                            {/* {JSON.stringify(stats.marketAbuse.open != 0 || stats.marketAbuse.resolved != 0 || stats.marketAbuse.archived != 0 || stats.marketAbuse.inReview != 0)} */}
                            { (stats.marketAbuse.open != 0 || stats.marketAbuse.resolved != 0 ||
                                stats.marketAbuse.archived != 0 || stats.marketAbuse.inReview != 0) &&
                                <div className='alert-status-column d-flex align-items-center mb-3' style={{ minWidth: '200px !important' }}>
                                    <Badge status={'title'} text={'Market Abuse'} isCustom='true'
                                        className='mr-2'/>
                                    {stats.marketAbuse.open != 0 &&
                                        <Badge status={'open'} text={stats.marketAbuse.open} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.marketAbuse.resolved != 0 &&
                                        <Badge status={'resolved'} text={stats.marketAbuse.resolved} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.marketAbuse.archived != 0 &&
                                        <Badge status={'archived'} text={stats.marketAbuse.archived} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.marketAbuse.inReview != 0 &&
                                        <Badge status={'in_review'} text={stats.marketAbuse.inReview} isCustom='true'/>
                                    }
                                </div>
                            }
                            { (stats.conduct.open > 0 || stats.conduct.resolved > 0 ||
                                stats.conduct.archived > 0 || stats.conduct.inReview > 0) &&
                                <div className='alert-status-column d-flex align-items-center mb-3' style={{ minWidth: '200px !important' }}>
                                    <Badge status={'title'} text={'Conduct'} isCustom='true'
                                        className='mr-2'/>
                                    {stats.conduct.open != 0 &&
                                        <Badge status={'open'} text={stats.conduct.open} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.conduct.resolved != 0 &&
                                        <Badge status={'resolved'} text={stats.conduct.resolved} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.conduct.archived != 0 &&
                                        <Badge status={'archived'} text={stats.conduct.archived} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.conduct.inReview != 0 &&
                                        <Badge status={'in_review'} text={stats.conduct.inReview} isCustom='true'/>
                                    }
                                </div>
                            }
                            { (stats.mislanguage.open > 0 || stats.mislanguage.resolved > 0 ||
                                stats.mislanguage.archived > 0 || stats.mislanguage.inReview > 0) &&
                                <div className='alert-status-column d-flex align-items-center mb-3' style={{ minWidth: '200px !important' }}>
                                    <Badge status={'title'} text={'Mislanguage'} isCustom='true'
                                        className='mr-2'/>
                                    {stats.mislanguage.open != 0 &&
                                        <Badge status={'open'} text={stats.mislanguage.open} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.mislanguage.resolved != 0 &&
                                        <Badge status={'resolved'} text={stats.mislanguage.resolved} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.mislanguage.archived != 0 &&
                                        <Badge status={'archived'} text={stats.mislanguage.archived} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.mislanguage.inReview != 0 &&
                                        <Badge status={'in_review'} text={stats.mislanguage.inReview} isCustom='true'/>
                                    }
                                </div>
                            }
                            { (stats.others.open > 0 || stats.others.resolved > 0 ||
                                stats.others.archived > 0 || stats.others.inReview > 0) &&
                                <div className='alert-status-column d-flex align-items-center' style={{ minWidth: '200px !important' }}>
                                    <Badge status={'title'} text={'Others'} isCustom='true'
                                        className='mr-2'/>
                                    {stats.others.open != 0 &&
                                        <Badge status={'open'} text={stats.others.open} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.others.resolved != 0 &&
                                        <Badge status={'resolved'} text={stats.others.resolved} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.others.archived != 0 &&
                                        <Badge status={'archived'} text={stats.others.archived} isCustom='true'
                                            className='mr-2'/>
                                    }
                                    {stats.others.inReview != 0 &&
                                        <Badge status={'in_review'} text={stats.others.inReview} isCustom='true'/>
                                    }
                                </div>
                            }
                        </>
                    );
                } else {
                    return (<span>{cell.value == null ? '' : cell.value}</span>);
                }
                // if (key == 'subject') {
                //     return (
                //         <div className='d-flex flex-column'>
                //             <Typography size={14} color='color-3' className='search-results__box-label' >
                //                 {item.subject == null ? 'No Subject' : item.subject}
                //             </Typography>
                //             <Typography size={14} color='color-3' className='search-results__box-label' >
                //                 {item.message}
                //             </Typography>
                //         </div>
                //     );
                // } else if (key == 'keyword') {
                //     return (
                //         <div className='d-flex flex-column'>
                //             {item.keyword != null
                //                 ? <>
                //                     <Typography size={14} color='color-3' className='search-results__box-label' >
                //                         {item.keyword}
                //                     </Typography>
                //                     <Typography size={14} color='color-3' className='search-results__box-label' >
                //                         {item.keywordId}
                //                     </Typography>
                //                 </>
                //                 : 'N/A'
                //             }
                //         </div>
                //     );
                // } else if (key == 'source') {
                //     return (
                //         <div className='d-flex flex-column'>
                //             {item.source != null
                //                 ? <Typography size={14} color='color-3' className='search-results__box-label' >
                //                     {item.source}
                //                 </Typography>
                //                 : 'N/A'
                //             }
                //         </div>
                //     );
                // } else if (key == 'timeSent') {
                //     const readableDate = moment(item[key]).utc().local().format('DD/MM/YYYY hh:mm A');

                //     return (
                //         <div>
                //             <div>{readableDate}</div>
                //         </div>
                //     );
                // } else if (key == 'status') {
                //     const status = (item[key]).toLowerCase();

                //     return <Badge status={status}/>;
                // } else if (key == 'id') {
                //     return (
                //         <div>
                //             <span className={'color-link-text cursor-pointer'} onClick={() => handleItemClick(item[key])}>
                //                 {truncateText(item[key], 20)}
                //             </span>
                //         </div>
                //     );
                // } else {
                //     return (
                //         <div>
                //             <div>{item[key]}</div>
                //         </div>
                //     );
                // }
            };

            return {
                Header: column.header,
                accessor: column.accessor,
                disableFilters: column.disableFilters,
                // SubCell: column.SubCell,
                Cell: (e, row) => cellRender(column.accessor, e, row),
                Filter: SelectColumnFilter,
                filter: multiSelectFilter,
                // Cell: (e, row) => <span>{e.value}</span>,
                // Cell: (e, row) => column.accessor === 'alertDate'
                //     ? <span>{moment(e.value).format('DD/MM/YY')}</span>
                //     : <span className={`${column.clickable
                //         ? 'color-link-text cursor-pointer'
                //         : ''}`} onClick={() => rootPath === 'alerts' && column.accessor === 'behaviourCode'
                //         ? viewDetails(e.cell.row.original)
                //         : rootPath === 'behaviours' && column.accessor === 'internalCode'
                //             ? viewDetails(e.cell.row)
                //             : column.accessor === 'name'
                //                 ? viewDetails(e.cell.row.original)
                //                 : rootPath === 'communication_alerts' && column.accessor === 'id'
                //                     ? viewDetails(e.cell.row.original)
                //                     : null}>{column.accessor === 'quantity'
                //             ? kFormatter(e.cell.row.original.quantity)
                //             : column.accessor === 'client'
                //                 ? e.cell.row.original.behaviourCode !== 'HIGH_ORDER_COUNT_MUFP' ? e.cell.row.original.client : 'MUFP Total'
                //                 : column.accessor === 'escalation'
                //                     ? <span className='font-weight-bold'>{getTextColor(e.value)}</span>
                //                     : column.accessor === 'status'
                //                         ? <Badge status={e.value} />
                //                         : column.accessor === 'parameterValues'
                //                             ? e.value.split(',').map(val => <div>{val.replace(':', ': ')}</div>)
                //                             : rootPath === 'communication_alerts' && column.accessor === 'id'
                //                                 ? truncateText(e.value, 10)
                //                                 : e.value}</span>,
                sortType: column.accessor === 'date'
                    ? (a, b, c, d) => {
                        a = new Date(a.values.date).getTime();
                        b = new Date(b.values.date).getTime();

                        return b > a ? -1 : 1;
                    }
                    : 'alphanumeric'
            };
        }),
        []
    );

    const renderSubRowComponent = React.useCallback(
        ({ row, rowProps, visibleColumns }) => (
            <SubRowAsync
                row={row}
                rowProps={rowProps}
                visibleColumns={visibleColumns}/>
        ), []
    );

    return (
        <div className={`w-100 ${className}`}>
            <IsisTable
                loading={loading}
                isTimeout={isTimeout}
                columns={columns}
                data={tableData}
                tablePagination={tablePagination}
                totalNoOfRecords={totalNoOfRecords}
                activePage={activePage}
                selectableRows={selectableRows}
                globalFilter={globalFilter}
                pagination={pagination}
                sortable={sortable}
                fetching={fetching}
                viewDetails={viewDetails}
                hideHeader={hideHeader}
                isDisabled={isDisabled}
                renderRowSubComponent={renderSubRowComponent}
                toggleSelection={toggleSelection}/>
        </div>
    );
}
