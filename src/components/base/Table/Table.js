// @flow
import React, { useState } from 'react';
import moment from 'moment';
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import Button from '../Button/Button';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import Typography from '../Typography/Typography';
import { Table as ReactTable, FormGroup, Label, Input } from 'reactstrap';
import { matchSorter } from 'match-sorter';
import { makeData } from '../../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table.scss';

type Props = {
    className?: string
}

export default function Table({ className = '' }: Props): React$Element<any> {
    const [dummy, setDummy] = useState({
        dummy: [
            {
                alertType: 'Insider Trading',
                assigned: 'Mark Thomson',
                broker: 'Peter Davidson',
                client: 'Client 1',
                date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 4, 7).getTime())),
                escalation: 'Base',
                identifier: 'MUA312',
                quantity: 89,
                status: 'Resolved',
                subRows: undefined,
                ticker: 'BP'
            },
            {
                alertType: 'Marking the Close',
                assigned: 'Mark Jonas',
                broker: 'Peter Jonas',
                client: 'Client 2',
                date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 4, 20).getTime())),
                escalation: 'Manager',
                identifier: 'MUA311',
                quantity: 25,
                status: 'Open',
                subRows: undefined,
                ticker: 'SDR'
            },
            {
                alertType: 'Marking the Close',
                assigned: 'Mark Jonas',
                broker: 'Peter Jonas',
                client: 'Client 2',
                date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 4, 20).getTime())),
                escalation: 'Manager',
                identifier: 'MUA311',
                quantity: 25,
                status: 'Open',
                subRows: undefined,
                ticker: 'SDR'
            },
            {
                alertType: 'Marking the Close',
                assigned: 'Mark Jonas',
                broker: 'Peter Jonas',
                client: 'Client 2',
                date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 4, 20).getTime())),
                escalation: 'Manager',
                identifier: 'MUA311',
                quantity: 25,
                status: 'Open',
                subRows: undefined,
                ticker: 'SDR'
            },
            {
                alertType: 'Marking the Close',
                assigned: 'Mark Jonas',
                broker: 'Peter Jonas',
                client: 'Client 2',
                date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 4, 20).getTime())),
                escalation: 'Manager',
                identifier: 'MUA311',
                quantity: 25,
                status: 'Open',
                subRows: undefined,
                ticker: 'SDR'
            }
        ],
        filtered: []
    })
;

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

    // Define a default UI for filtering
    function onFilteredChangeCustom(value, accessor) {
        setDummy({
            ...dummy,
            filtered: [{
                id: accessor,
                value
            }]
        });
    }

    // This is a custom filter UI for selecting
    // a unique option from a list
    function SelectColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id }
    }) {
    // Calculate the options for filtering
    // using the preFilteredRows
        const options = React.useMemo(() => {
            const options = new Set();

            preFilteredRows.forEach(row => {
                options.add(row.values[id]);
            });

            return [...options.values()];
        }, [id, preFilteredRows]);

        // Render a multi-select box
        return (
            <select
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined);
                }}>
                <option value=''>All</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    }

    // This is a custom filter UI that uses a
    // slider to set the filter value between a column's
    // min and max values
    function SliderColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id }
    }) {
    // Calculate the min and max
    // using the preFilteredRows
        const [min, max] = React.useMemo(() => {
            let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
            let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;

            preFilteredRows.forEach(row => {
                min = Math.min(row.values[id], min);
                max = Math.max(row.values[id], max);
            })
            ;

            return [min, max];
        }, [id, preFilteredRows]);

        return (
            <>
                <input
                    type='range'
                    min={min}
                    max={max}
                    value={filterValue || min}
                    onChange={e => {
                        setFilter(parseInt(e.target.value, 10));
                    }}/>
                <button onClick={() => setFilter(undefined)}>Off</button>
            </>
        );
    }

    // This is a custom UI for our 'between' or number range
    // filter. It uses two number boxes and filters rows to
    // ones that have values between the two
    function NumberRangeColumnFilter({
        column: { filterValue = [], preFilteredRows, setFilter, id }
    }) {
        const [min, max] = React.useMemo(() => {
            let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
            let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;

            preFilteredRows.forEach(row => {
                min = Math.min(row.values[id], min);
                max = Math.max(row.values[id], max);
            });

            return [min, max];
        }, [id, preFilteredRows]);

        return (
            <div
                style={{
                    display: 'flex'
                }}>
                <input
                    value={filterValue[0] || ''}
                    type='number'
                    onChange={e => {
                        const val = e.target.value;

                        setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
                    }}
                    placeholder={`Min (${min})`}
                    style={{
                        width: '70px',
                        marginRight: '0.5rem'
                    }}/>
                to
                <input
                    value={filterValue[1] || ''}
                    type='number'
                    onChange={e => {
                        const val = e.target.value;

                        setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
                    }}
                    placeholder={`Max (${max})`}
                    style={{
                        width: '70px',
                        marginLeft: '0.5rem'
                    }}/>
            </div>
        );
    }

    function fuzzyTextFilterFn(rows, id, filterValue) {
        return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
    }

    // Let the table remove the filter if the string is empty
    fuzzyTextFilterFn.autoRemove = val => !val;

    // Our table component
    function Table({ columns, data }) {
        const filterTypes = React.useMemo(
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

        const defaultColumn = React.useMemo(() => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter
        }), []);

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
                defaultColumn, // Be sure to pass the defaultColumn option
                filterTypes
            },
            useFilters, // useFilters!
            useGlobalFilter // useGlobalFilter!
        );

        // We don't want to render all of the rows for this example, so cap
        // it for this use case
        const firstPageRows = rows.slice(0, 10);

        return (
            <>
                <ReactTable {...getTableProps()} filterable='true' filtered={dummy.filtered}
                    className='react-table'>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} className='react-table__table-head-rows'>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render('Header').toLowerCase() !== 'identifier'
                                            ? <CustomDropdown tag='span' direction='down' toggle={<Typography variant='size-16' color='color-3' weight='bold'
                                                className='text-decoration-none cursor-pointer d-flex align-items-center'>
                                                {column.render('Header')}
                                                {column.render('Header').toLowerCase() !== 'Identifier'
                                                    ? <FontAwesomeIcon className='ml-2' icon='filter' size='xs'
                                                        color='black' />
                                                    : null
                                                }
                                            </Typography>}>
                                                <div className='react-table__column-dropdown-filter'>
                                                    <div className='react-table__column-dropdown-header'>
                                                        <FontAwesomeIcon icon='filter' color='black' size='sm' />
                                                    </div>
                                                    <div className='react-table__column-dropdown-options'>
                                                        {column.render('Header').toLowerCase() === 'date'
                                                            ? <>
                                                                <FormGroup check={true}>
                                                                    <Label check={true}>
                                                                        <Input type='radio' name='radio1'
                                                                            onChange={entry => {
                                                                                onFilteredChangeCustom(
                                                                                    moment().format('L'),
                                                                                    'Today'
                                                                                );
                                                                            }} />{' '}
                                                                        Today
                                                                    </Label>
                                                                </FormGroup>
                                                                <FormGroup check={true}>
                                                                    <Label check={true}>
                                                                        <Input type='radio' name='radio2'
                                                                            onChange={entry => {
                                                                                onFilteredChangeCustom(
                                                                                    moment().utc().subtract(7, 'd').format('L'),
                                                                                    'Last 7 Days'
                                                                                );
                                                                            }} />{' '}
                                                                        Last 7 Days
                                                                    </Label>
                                                                </FormGroup>
                                                                <FormGroup check={true}>
                                                                    <Label check={true}>
                                                                        <Input type='radio' name='radio3'
                                                                            onChange={entry => {
                                                                                onFilteredChangeCustom(
                                                                                    'specific',
                                                                                    'Specific Date'
                                                                                );
                                                                            }} />{' '}
                                                                        Specific Date
                                                                    </Label>
                                                                </FormGroup>
                                                            </>
                                                            : null
                                                        }
                                                    </div>
                                                    <div className='react-table__column-dropdown-footer'>
                                                        <Button label='Reset' color='primary' />
                                                    </div>
                                                </div>
                                            </CustomDropdown>
                                            : <Typography variant='size-16' color='color-3' weight='bold'
                                                className='text-decoration-none'>
                                                {column.render('Header')}
                                            </Typography>
                                        }
                                        {/* Render the columns filter UI */}
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        {/* <tr>
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
                        </tr> */}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {firstPageRows.map((row, i) => {
                            prepareRow(row);

                            return (
                                <tr {...row.getRowProps()} className='react-table__table-body-rows'>
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </ReactTable>
            </>
        );
    }

    // Define a custom filter filter function!
    function filterGreaterThan(rows, id, filterValue) {
        return rows.filter(row => {
            const rowValue = row.values[id];

            return rowValue >= filterValue;
        });
    }

    // This is an autoRemove method on the filter function that
    // when given the new filter value and returns true, the filter
    // will be automatically removed. Normally this is just an undefined
    // check, but here, we want to remove the filter if it's not a number
    filterGreaterThan.autoRemove = val => typeof val !== 'number';

    function dateFilter(rows, id, filterValue) {
        return rows.filter(row => {
            const rowValue = row.values[id];

            if (filterValue.toLowerCase() === 'last 7 days') {
                return moment(rowValue).isBetween(moment.utc().subtract(7, 'd').format('L'));
            } else if (filterValue.toLowerCase() === 'today') {
                return rowValue === moment().format('L');
            } else {
                return rowValue;
            }
        });
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Identifier',
                accessor: 'identifier'
            },
            {
                Header: 'Alert Type',
                accessor: 'alertType',
                // Use our custom `fuzzyText` filter on this column
                filter: 'fuzzyText'
            },
            {
                Header: 'Date',
                accessor: d => {
                    return moment(d.date).format('L');
                }
            },
            {
                Header: 'Broker',
                accessor: 'broker'
            },
            {
                Header: 'Ticker',
                accessor: 'ticker'
            },
            {
                Header: 'Quantity',
                accessor: 'quantity'
            },
            {
                Header: 'Client',
                accessor: 'client'
            },
            {
                Header: 'Escalation',
                accessor: 'escalation'
            },
            {
                Header: 'Assigned',
                accessor: 'assigned'
            },
            {
                Header: 'Status',
                accessor: 'status'
            }
        ]
    );

    const filtered = () => {
        if (dummy.filtered.length > 0) {
            return dummy.dummy.filter(dum => {
                if (dummy.filtered[0].id.toLowerCase() === 'today') {
                    if (moment(dum.date).format('L') === moment().format('L')) {
                        return dum;
                    }
                } else if (dummy.filtered[0].id.toLowerCase() === 'last 7 days') {
                    if (moment.utc(dum.date).isBetween(moment.utc().subtract(7, 'd').format('L'))) {
                        return dum;
                    }
                } else {
                    return dum;
                }
            });
        } else {
            return dummy.dummy;
        }
    };

    // const data = React.useMemo(() => makeData(20), []);
    return (
        <div className={`table-responsive w-100 ${className}`} >
            <Table columns={columns} data={filtered()}/>
        </div>
    );
}
