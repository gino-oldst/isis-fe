// @flow
import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { matchSorter } from 'match-sorter';
import Button from '../../base/Button/Button';
import Badge from '../../base/Badge/Badge';
import Typography from '../../base/Typography/Typography';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDropdown from '../../base/CustomDropdown/CustomDropdown';
import { kFormatter, getTextColor } from '../../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Table as ReactstrapTable,
    DropdownItem,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import filterIcon from '../../../assets/images/ic_filter.svg';
import './table.scss';

import { useTable, useRowSelect, useFilters, useGlobalFilter, usePagination, useSortBy, useAsyncDebounce } from 'react-table';
import { setIsRowSelected, setAppliedFilters } from '../../../redux/modules/table';

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
            onChange={e => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
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
    // Calculate the options for filtering
    // using the preFilteredRows
    const [selectFilter, setSelectFilter] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const options = useMemo(() => {
        const options = new Set();

        preFilteredRows.forEach(row => {
            options.add(row.values[id]);
        });

        return [...options.values()];
    }, [id, preFilteredRows]);

    useEffect(() => {
        setFilter(selectFilter);
    }, [selectFilter]);

    const handleFilterChange = (e, value) => {
        const isChecked = e.target.checked;

        isChecked
            ? setSelectFilter([
                ...selectFilter,
                value
            ])
            : setSelectFilter([...selectFilter.filter(val => val !== value)]);
    };

    const handleSearch = value => {
        setSearchFilter(value);
    };

    const handleResetFilter = () => {
        setFilter([]);
        setSelectFilter([]);
        setSearchFilter('');
    };

    // filtered column options
    const choices = options.filter(opt => opt.toString().toLowerCase().includes(searchFilter.toLowerCase()));

    // Render a multi-select box
    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <DropdownItem header={true}>
                <Input type='text' name='search' placeholder='Search...'
                    bsSize='md' value={searchFilter} onChange={e => handleSearch(e.target.value)} />
            </DropdownItem>
            <div className='table__filter-options overflow-auto'>
                {choices.map((option, i) => (
                    <FormGroup key={i} check={true}>
                        <Label check={true}>
                            <Input type='checkbox' checked={selectFilter.includes(option.toString())} onChange={e => handleFilterChange(e, option.toString())}/>
                            {option.toString()}
                        </Label>
                    </FormGroup>
                ))}
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2' onClick={() => handleResetFilter()}/>
        </CustomDropdown>
    );
}

// This is a custom filter UI for selecting
// a unique option from a list
function RadioColumnFilter({
    column: { setFilter }
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const [radioFilter, setRadioFilter] = useState(0);

    useEffect(() => {
        setFilter(radioFilter);
    }, [radioFilter]);

    const handleRadioFilterChange = (e, value) => {
        const isChecked = e.target.checked;

        isChecked
            ? setRadioFilter(value)
            : setRadioFilter(0);
    };

    const handleResetFilter = () => {
        setFilter(undefined);
        setRadioFilter(0);
    };

    // Render a multi-select box
    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <div className='table__quantity-filter-options'>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='radio' name='radio1'
                            checked={radioFilter === 1} onChange={e => handleRadioFilterChange(e, 1)} />{' '}
                        Below 100K
                    </Label>
                </FormGroup>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='radio' name='radio2'
                            checked={radioFilter === 2} onChange={e => handleRadioFilterChange(e, 2)} />{' '}
                        100K - 500K
                    </Label>
                </FormGroup>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='radio' name='radio3'
                            checked={radioFilter === 3} onChange={e => handleRadioFilterChange(e, 3)} />{' '}
                        501K - 1M
                    </Label>
                </FormGroup>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='radio' name='radio4'
                            checked={radioFilter === 4} onChange={e => handleRadioFilterChange(e, 4)} />{' '}
                        Above 1M
                    </Label>
                </FormGroup>
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2' onClick={() => handleResetFilter()}/>
        </CustomDropdown>
    );
}

function DateColumnFilter({
    column: { setFilter }
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const [dateFilter, setDateFilter] = useState(0);
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [selectedDate, setDateChange] = useState(3);
    const datepickerOpen = React.createRef();

    useEffect(() => {
        setFilter(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        setFilter(selectedDate);
    }, [selectedDate]);

    const handleDateFilterChange = (isChecked, value) => {
        isChecked
            ? setDateFilter(value)
            : setDateFilter(0);
    };

    const handleResetFilter = () => {
        setFilter(undefined);
        setDateFilter(3);
        setDateChange(3);
        setDefaultDate(new Date());
    };

    const handleDateChange = value => {
        setDateChange(value);
        setDefaultDate(value);
        setDateFilter(3);
    };

    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <div className='table__date-filter-options'>
                <FormGroup tag='fieldset'>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio'
                                checked={dateFilter === 1} onChange={e => handleDateFilterChange(e.target.checked, 1)}/>{' '}
                        Today
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio'
                                checked={dateFilter === 2} onChange={e => handleDateFilterChange(e.target.checked, 2)} />{' '}
                        Last 7 Days
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio'
                                checked={dateFilter === 3} onChange={e => {
                                    handleDateFilterChange(e.target.checked, 3);
                                }} onClick={() => datepickerOpen.current.setOpen(true)} />{' '}
                            <span className='mr-2'>Specific Date</span>
                        </Label>
                        <FontAwesomeIcon icon='calendar-alt' size='md' className='date-picker__icon' />
                        <DatePicker ref={datepickerOpen} selected={defaultDate}
                            className='table__date-picker'
                            dateFormat='dd MMM yyyy'
                            onChange={date => {
                                handleDateChange(date);
                            }} />
                    </FormGroup>
                </FormGroup>
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2' onClick={() => handleResetFilter()}/>
        </CustomDropdown>
    );
}

// For row selection
const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <input type='checkbox' ref={resolvedRef} {...rest} />
            </>
        );
    }
);

// Our table component
function Table({
    columns,
    data,
    selectableRows,
    globalFilter,
    pagination,
    sortable
}) {
    const filterTypes = useMemo(
        () => ({
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
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
        gotoPage,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage
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
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    )
                },
                ...columns
            ]);
        }
    );

    useEffect(() => {
        dispatch(setAppliedFilters(state.filters));
    }, [state.filters]);

    const dispatch = useDispatch();
    const maxPage = 3; // max page for pagination button
    const paginationLoopLength = (rows.length % state.pageSize) > 0 ? parseInt(rows.length / state.pageSize + 1) : rows.length / state.pageSize;
    // collect all applied filters from table

    const selectedRows = page.filter(row => row.isSelected === true).length;

    useEffect(() => {
        dispatch(setIsRowSelected(selectedRows > 0));
    }, [selectedRows]);

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
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {/* Render the columns filter UI */}
                                    <span {...column.getHeaderProps(sortable && column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        {sortable &&
                                            column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''
                                        }
                                    </span>
                                    {column.canFilter ? column.render('Filter') : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.length > 0
                        ? (
                            page.map((row, i) => {
                                prepareRow(row);

                                return (
                                    <tr {...row.getRowProps()} className={`${row.isSelected ? 'selected-row' : ''}`}>
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                        })}
                                    </tr>
                                );
                            })
                        )
                        : (
                            <tr>
                                <th className='text-muted'>
                                    No data available
                                </th>
                            </tr>
                        )}
                </tbody>
            </ReactstrapTable>
            {pagination &&
                <div className='pagination'>
                    <span className={`cursor-pointer ${!canPreviousPage ? 'text-muted' : ''}`} onClick={() => previousPage()}>Prev</span>
                    {Array.from(Array(paginationLoopLength), (_, i) => {
                        const dynamicPageIndex = state.pageIndex > maxPage ? state.pageIndex - 2 + i : i + 1;

                        return i <= maxPage && <span className={`cursor-pointer ${state.pageIndex + 1 === dynamicPageIndex ? 'active' : ''}`} onClick={() => gotoPage(dynamicPageIndex - 1)}>{dynamicPageIndex}</span>;
                    })}
                    <span className={`cursor-pointer ${!canNextPage ? 'text-muted' : ''}`} onClick={() => nextPage()}>Next</span>
                </div>
            }
        </>
    );
}

/* Custom filter function */
function multiSelectFilter(rows, columnIds, filterValue) {
    // Filters only if filters are selected
    return filterValue.length === 0 ? rows : rows.filter((row) => filterValue.includes(String(row.original[columnIds])));
}

// Quantity custom filter function!
function filterGreaterThan(rows, id, filterValue) {
    const result = rows.filter(row => {
        const rowValue = row.values[id];

        switch (filterValue) {
            case 1:
                return rowValue <= 100000;
            case 2:
                return rowValue > 100000 && rowValue <= 500000;
            case 3:
                return rowValue > 500001 && rowValue <= 1000000;
            case 4:
                return rowValue > 1000000;
            default:
                return rowValue;
        }
    });

    return result;
}

type Props = {
    children?: string | React.Node,
    className?: string,
    tableData: Array,
    tableColumns: Array,
    selectableRows: Boolean,
    globalFilter: Boolean,
    viewDetails: Function,
}

export default function ReactTable({
    children,
    className = '',
    tableData,
    tableColumns,
    selectableRows = false,
    globalFilter = false,
    pagination = false,
    sortable = false,
    viewDetails
}: Props): React$Element<any> {
    const columns = useMemo(
        () => tableColumns.map(column => {
            const rootPath = window.location.pathname.split('/')[1];

            return {
                Header: column.header,
                accessor: column.accessor,
                disableFilters: column.disableFilters,
                Filter: column.accessor !== 'quantity' ? SelectColumnFilter : RadioColumnFilter,
                filter: column.accessor !== 'quantity' ? multiSelectFilter : filterGreaterThan,
                Cell: e => column.accessor === 'date'
                    ? <span>{moment(e.value).format('DD/MM/YY')}</span>
                    : <span className={`${column.clickable
                        ? 'color-link-text cursor-pointer'
                        : ''}`} onClick={() => rootPath === 'alerts' && column.accessor === 'identifier'
                        ? viewDetails(e.cell.row.original.detail, e.cell.row.original)
                        : rootPath === 'behaviours' && column.accessor === 'internalCode'
                            ? viewDetails(e.cell.row)
                            : column.accessor === 'name'
                                ? viewDetails(e.row.values)
                                : null}>{column.accessor === 'quantity'
                            ? kFormatter(e.value)
                            : column.accessor === 'escalation'
                                ? <span className='font-weight-bold'>{getTextColor(e.value)}</span>
                                : column.accessor === 'status'
                                    ? <Badge status={e.value === 'IN_ACTIVE' ? 'INACTIVE' : e.value} />
                                    : e.value}</span>,
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

    return (
        <div className={`w-100 ${className}`}>
            <Table columns={columns} data={tableData}
                selectableRows={selectableRows}
                globalFilter={globalFilter}
                pagination={pagination}
                sortable={sortable} />
        </div>
    );
}
