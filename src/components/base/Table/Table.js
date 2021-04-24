// @flow
import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import Button from '../../base/Button/Button';
import Badge from '../../base/Badge/Badge';
import Typography from '../../base/Typography/Typography';
import Pagination from '../../base/Pagination/Pagination';
import DatePicker from '../../base/DatePicker/DatePicker';
import CustomDropdown from '../../base/CustomDropdown/CustomDropdown';
import { camelize, getTextColor } from '../../../utils/helpers';
import {
    Table as ReactstrapTable,
    DropdownItem,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import filterIcon from '../../../assets/images/ic_filter.svg';
import './table.scss';

import { useTable, useFilters, useGlobalFilter, usePagination, useAsyncDebounce } from 'react-table';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';

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
    const [radioFilter, setRadioFilter] = useState([]);
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

    const handleRadioFilterChange = (e, value) => {
        const isChecked = e.target.checked;

        isChecked
            ? setRadioFilter(value)
            : setRadioFilter('');
    };

    const handleSearch = value => {
        setSearchFilter(value);
    };

    const handleResetFilter = () => {
        setFilter([]);
        setSelectFilter([]);
        setRadioFilter('');
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
            {Header.toLowerCase() === 'quantity'
                ? (
                    <div className='table__quantity-filter-options'>
                        <FormGroup check={true}>
                            <Label check={true}>
                                <Input type='radio' name='radio'
                                    checked={radioFilter === 1} onChange={e => handleRadioFilterChange(e, 1)} />{' '}
                                Below 100K
                            </Label>
                        </FormGroup>
                        <FormGroup check={true}>
                            <Label check={true}>
                                <Input type='radio' name='radio'
                                    checked={radioFilter === 2} onChange={e => handleRadioFilterChange(e, 2)} />{' '}
                                100K - 500K
                            </Label>
                        </FormGroup>
                        <FormGroup check={true}>
                            <Label check={true}>
                                <Input type='radio' name='radio'
                                    checked={radioFilter === 3} onChange={e => handleRadioFilterChange(e, 3)} />{' '}
                                501K - 1M
                            </Label>
                        </FormGroup>
                        <FormGroup check={true}>
                            <Label check={true}>
                                <Input type='radio' name='radio'
                                    checked={radioFilter === 4} onChange={e => handleRadioFilterChange(e, 4)} />{' '}
                                Above 1M
                            </Label>
                        </FormGroup>
                    </div>
                )
                : Header.toLowerCase() === 'date'
                    ? (
                        <div className='table__date-filter-options'>
                            <FormGroup tag='fieldset'>
                                <FormGroup check={true} className='mb-1'>
                                    <Label check={true}>
                                        <Input type='radio' name='radio' />{' '}
                                    Today
                                    </Label>
                                </FormGroup>
                                <FormGroup check={true} className='mb-1'>
                                    <Label check={true}>
                                        <Input type='radio' name='radio' />{' '}
                                    Last 7 Days
                                    </Label>
                                </FormGroup>
                                <FormGroup check={true} className='mb-1'>
                                    <Label check={true}>
                                        <Input type='radio' name='radio' />{' '}
                                        <span className='mr-2'>Specific Date</span>
                                        <DatePicker width={55} format='dd MMM yyyy' className='table__date-filter-picker'
                                            inputVariant='outlined' />
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                        </div>
                    )
                    : (
                        <>
                            <DropdownItem header={true}>
                                <Input type='text' name='search' placeholder='Search...'
                                    bsSize='md' value={searchFilter} onChange={e => handleSearch(e.target.value)} />
                            </DropdownItem>
                            {choices.map((option, i) => (
                                <div key={i} className='table__filter-options overflow-auto'>
                                    <FormGroup key={i} check={true}>
                                        <Label check={true}>
                                            <Input type='checkbox' checked={selectFilter.includes(option.toString())} onChange={e => handleFilterChange(e, option.toString())}/>
                                            {option.toString()}
                                        </Label>
                                    </FormGroup>
                                </div>
                            ))}
                        </>
                    )
            }
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
                        <Input type='radio' name='radio'
                            checked={radioFilter === 1} onChange={e => handleRadioFilterChange(e, 1)} />{' '}
                        Below 100K
                    </Label>
                </FormGroup>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='radio' name='radio'
                            checked={radioFilter === 2} onChange={e => handleRadioFilterChange(e, 2)} />{' '}
                        100K - 500K
                    </Label>
                </FormGroup>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='radio' name='radio'
                            checked={radioFilter === 3} onChange={e => handleRadioFilterChange(e, 3)} />{' '}
                        501K - 1M
                    </Label>
                </FormGroup>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='radio' name='radio'
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

// Our table component
function Table({ columns, data }) {
    const filterTypes = useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
;

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
        pageOptions,
        page,
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        canPreviousPage,
        canNextPage
    } = useTable(
        {
            columns,
            data,
            defaultColumn, // Be sure to pass the defaultColumn option
            filterTypes
        },
        useFilters, // useFilters!
        useGlobalFilter, // useGlobalFilter!
        usePagination // usePagination!
    );

    const [currentPage, setCurrentPage] = useState(0);

    return (
        <>
            <ReactstrapTable responsive={true} {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    {/* Render the columns filter UI */}
                                    {column.canFilter ? column.render('Filter') : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);

                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </ReactstrapTable>
            <div className='pagination'>
                <span className={`cursor-pointer ${!canPreviousPage ? 'text-muted' : ''}`} onClick={() => previousPage()}>Prev</span>
                {/* {
                    Array.from(Array(parseInt(page.length / 10) + 1), (_, i) => {
                        return (
                            <span className={`cursor-pointer ${i === state.pageIndex ? 'active' : ''}`} onClick={() => {
                                gotoPage(i);
                                setCurrentPage(i);
                            }}>
                                {i + 1}
                            </span>
                        );
                    })
                } */}
                <span className={`cursor-pointer ${!canNextPage ? 'text-muted' : ''}`} onClick={() => nextPage()}>Next</span>
            </div>
            {/* <div>
                <pre>
                    <code>{JSON.stringify(state.filters, null, 2)}</code>
                </pre>
            </div> */}
        </>
    );
}

/* Custom filter function */
function multiSelectFilter(rows, columnIds, filterValue) {
    // Filters only if filters are selected
    return filterValue.length === 0 ? rows : rows.filter((row) => filterValue.includes(String(row.original[columnIds])));
}

// Define a custom filter filter function!
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
    viewAlertDetails: Function,
}

export default function ReactTable({
    children,
    className = '',
    tableData,
    tableColumns,
    viewAlertDetails
}: Props): React$Element<any> {
    const columns = useMemo(
        () => [
            {
                Header: 'Identifier',
                accessor: 'identifier',
                disableFilters: true,
                Cell: e => <span className='color-link-text cursor-pointer' onClick={() => viewAlertDetails(e.cell.row.original.detail, e.cell.row.original)}>{e.value}</span>
            },
            {
                Header: 'Alert Type',
                accessor: 'alertType',
                Filter: SelectColumnFilter,
                filter: multiSelectFilter
            },
            {
                Header: 'Date',
                accessor: d => moment(d.date).local().format('DD/MM/YY'),
                Filter: SelectColumnFilter,
                filter: multiSelectFilter
            },
            {
                Header: 'Broker',
                accessor: 'broker',
                Filter: SelectColumnFilter,
                filter: multiSelectFilter
            },
            {
                Header: 'Quantity',
                accessor: 'quantity',
                Filter: RadioColumnFilter,
                filter: filterGreaterThan
            },
            {
                Header: 'Client',
                accessor: 'client',
                Filter: SelectColumnFilter,
                filter: multiSelectFilter
            },
            {
                Header: 'Escalation',
                accessor: 'escalation',
                Filter: SelectColumnFilter,
                filter: multiSelectFilter,
                Cell: e => <span className='font-weight-bold'>{getTextColor(e.value)}</span>
            },
            {
                Header: 'Assigned',
                accessor: 'assigned',
                Filter: SelectColumnFilter,
                filter: multiSelectFilter
            },
            {
                Header: 'Status',
                accessor: 'status',
                Filter: SelectColumnFilter,
                filter: multiSelectFilter,
                Cell: e => <Badge status={e.value} />
            }
        ],
        []
    );

    return (
        <div className={`w-100 ${className}`}>
            <Table columns={columns} data={tableData} />
            {/* {paginated && <Pagination className='mt-3'
                totalPages={paginationData.totalPages}
                currentPage={paginationData.currentPage}
                paginationData={paginationData}
                setPaginationData={setPaginationData} />} */}
        </div>
    );
}

const DateSearch = () => {
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
                            <Input type='radio' name='radio' />{' '}
                            Today
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            Last 7 Days
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            <span className='mr-2'>Specific Date</span>
                            <DatePicker width={55} format='dd MMM yyyy' className='table__date-filter-picker'
                                inputVariant='outlined' />
                        </Label>
                    </FormGroup>
                </FormGroup>
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2'/>
        </CustomDropdown>
    );
};
