// @flow
import React, { useEffect, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination, useRowSelect, useAsyncDebounce } from 'react-table';
import { FaSortUp, FaSortDown, FaSort, FaSearch } from 'react-icons/fa';
import {
    Table as ReactstrapTable
} from 'reactstrap';
import './normal-table.scss';
import { matchSorter } from 'match-sorter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function Table({
    columns,
    data
}) {
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
        setGlobalFilter
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes
        },
        useFilters,
        useGlobalFilter,
        useSortBy
    );

    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    const firstPageRows = rows.slice(0, 20);

    return (
        <>
            <ReactstrapTable responsive={true} {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <FaSortDown size={15}/>
                                                : <FaSortUp size={15}/>
                                            : <FaSort size={15} color='#d1d1d1'/>}
                                    </span>
                                    {column.canFilter ? column.render('Filter') : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {firstPageRows.map(
                        (row, i) => {
                            prepareRow(row);

                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        );
                                    })}
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </ReactstrapTable>
            <br />
            <div>Showing the first 20 results of {rows.length} rows</div>
        </>
    );
}

type Props = {
    className?: string,
    tableData: Array
}

export default function NormalTable({
    className = '',
    tableData
}: Props): React$Element<any> {
    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id'
            },
            {
                Header: 'Date',
                accessor: 'date'
            },
            {
                Header: 'Source',
                accessor: 'source'
            },
            {
                Header: 'Sender',
                accessor: 'sender'
            },
            {
                Header: 'Receiver',
                accessor: 'receiver'
            }
        ],
        []
    );

    const data = React.useMemo(() => tableData);

    return (
        <div className={`w-100 ${className}`} >
            <Table columns={columns} data={data} />
        </div>
    );
}
