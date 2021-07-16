// @flow
import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { matchSorter } from 'match-sorter';
import Button from '../../base/Button/Button';
import Badge from '../../base/Badge/Badge';
import Typography from '../../base/Typography/Typography';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDropdown from '../../base/CustomDropdown/CustomDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { kFormatter, getTextColor } from '../../../utils/helpers';
import {
    Table as ReactstrapTable,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Row,
    Col
} from 'reactstrap';
import filterIcon from '../../../assets/images/ic_filter.svg';
import './table.scss';

import { useTable, useRowSelect, useFilters, useGlobalFilter, usePagination, useSortBy, useAsyncDebounce } from 'react-table';
import { setIsRowSelected, setTablePageSize, setActivePage, setAppliedFilters, setFilteredRows } from '../../../redux/modules/table';

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
                        <Input type='radio' name='radiotwo'
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
    tablePagination,
    totalNoOfRecords,
    activePage,
    selectableRows,
    globalFilter,
    pagination,
    sortable,
    fetching
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
        pageCount,
        gotoPage,
        previousPage,
        setPageSize,
        state: { pageSize }
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
        dispatch(setFilteredRows(page.map(p => p.original.id)));
    }, [state.filters]);

    const dispatch = useDispatch();
    const maxPage = 3; // max page for pagination button

    const selectedRows = rows.filter(row => row.isSelected === true);

    useEffect(() => {
        dispatch(setIsRowSelected(selectedRows.length, [...selectedRows.map(row => { return row.original.id; })]));
    }, [selectedRows.length]);

    // set pageSize to redux that triggers alerts list api call
    useEffect(() => {
        dispatch(setTablePageSize(pageSize));
    }, [pageSize]);

    const setTableActivePage = page => {
        dispatch(setActivePage(page));
    };

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
                                            : sortable && typeof column.render('Header') === 'string' && <FontAwesomeIcon icon='sort' size='sm' className='table__sort-icon' />
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
                <Row className='mt-5 align-items-center'>
                    <Col md={12} lg={3} className='mr-auto'>
                        <div className='pagination-pagesize'>
                            <span>Showing {rows.length} of {totalNoOfRecords} items</span>
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

                                return i <= maxPage && <span key={i}
                                    className={`cursor-pointer ${activePage + 1 === dynamicPageIndex ? 'active' : ''} ${fetching ? 'text-muted' : ''}`}
                                    onClick={() => {
                                        gotoPage(dynamicPageIndex - 1);
                                        if (!fetching) setTableActivePage(dynamicPageIndex - 1);
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
                                disabled={fetching}
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
    tablePagination,
    totalNoOfRecords,
    activePage,
    selectableRows = false,
    globalFilter = false,
    pagination = false,
    sortable = false,
    fetching,
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
                Cell: e => column.accessor === 'alertDate'
                    ? <span>{moment(e.value).format('DD/MM/YY')}</span>
                    : <span className={`${column.clickable
                        ? 'color-link-text cursor-pointer'
                        : ''}`} onClick={() => rootPath === 'alerts' && column.accessor === 'behaviourCode'
                        ? viewDetails(e.cell.row.original)
                        : rootPath === 'behaviours' && column.accessor === 'internalCode'
                            ? viewDetails(e.cell.row)
                            : column.accessor === 'name'
                                ? viewDetails(e.cell.row.original)
                                : null}>{column.accessor === 'quantity'
                            ? kFormatter(e.value)
                            : column.accessor === 'escalation'
                                ? <span className='font-weight-bold'>{getTextColor(e.value)}</span>
                                : column.accessor === 'status'
                                    ? <Badge status={e.value} />
                                    : column.accessor === 'parameterValues'
                                        ? e.value.split(',').map(val => <div>{val.replace(':', ': ')}</div>)
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
                tablePagination={tablePagination}
                totalNoOfRecords={totalNoOfRecords}
                activePage={activePage}
                selectableRows={selectableRows}
                globalFilter={globalFilter}
                pagination={pagination}
                sortable={sortable}
                fetching={fetching} />
        </div>
    );
}
