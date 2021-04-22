// @flow
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AlertsScreen from './AlertsScreen';
import type { Menu } from '../../types';

import { setSelectedAlert } from '../../redux/modules/alerts';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function AlertsContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const isFilteredBefore = useRef(1);
    const [filterString, setFilterString] = useState('');
    const [activeFilterColumn, setActiveFilterColumn] = useState('');
    const [data, setData] = useState({
        table: {
            columns: [
                'Identifier',
                'Alert Type',
                'Date',
                'Broker',
                'Ticker',
                'Book',
                'Quantity',
                'Client',
                'Escalation',
                'Assigned',
                'Status'
            ],
            data: [
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA313',
                    alertType: 'Marking the Close',
                    date: new Date(new Date(2021, 5, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 8, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 2',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'In Review',
                    detail: '/alert/MUA313'
                },
                {
                    identifier: 'MUA314',
                    alertType: 'High Volume',
                    date: new Date(new Date(2021, 6, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 2',
                    quantity: 89,
                    client: 'Client 3',
                    escalation: 'Manager',
                    assigned: 'Mark Thomson',
                    status: 'Archived',
                    detail: '/alert/MUA314'
                },
                {
                    identifier: 'MUA315',
                    alertType: 'Flash Execution',
                    date: new Date(new Date(2021, 7, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 2, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 2',
                    quantity: 89,
                    client: 'Client 4',
                    escalation: 'Manager',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA315'
                },
                {
                    identifier: 'MUA316',
                    alertType: 'Flash Order',
                    date: new Date(new Date(2021, 8, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 5, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 5',
                    escalation: 'CO',
                    assigned: 'Mark Thomson',
                    status: 'Open',
                    detail: '/alert/MUA316'
                }, {
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 6',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    identifier: 'MUA313',
                    alertType: 'Marking the Close',
                    date: new Date(new Date(2021, 5, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 8, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 3',
                    quantity: 89,
                    client: 'Client 7',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'In Review',
                    detail: '/alert/MUA313'
                },
                {
                    identifier: 'MUA314',
                    alertType: 'High Volume',
                    date: new Date(new Date(2021, 6, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 8',
                    escalation: 'Manager',
                    assigned: 'Mark Thomson',
                    status: 'Archived',
                    detail: '/alert/MUA314'
                },
                {
                    identifier: 'MUA315',
                    alertType: 'Flash Execution',
                    date: new Date(new Date(2021, 7, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 2, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 9',
                    escalation: 'Manager',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA315'
                },
                {
                    identifier: 'MUA316',
                    alertType: 'Flash Order',
                    date: new Date(new Date(2021, 8, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 5, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 10',
                    escalation: 'CO',
                    assigned: 'Mark Thomson',
                    status: 'Open',
                    detail: '/alert/MUA316'
                },
                {
                    identifier: 'MUA315',
                    alertType: 'Flash Execution',
                    date: new Date(new Date(2021, 7, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 2, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 11',
                    escalation: 'Manager',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA315'
                },
                {
                    identifier: 'MUA316',
                    alertType: 'Flash Order',
                    date: new Date(new Date(2021, 8, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 5, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 89,
                    client: 'Client 12',
                    escalation: 'CO',
                    assigned: 'Mark Thomson',
                    status: 'Open',
                    detail: '/alert/MUA316'
                }
            ]
        },
        selected: {
            data: {},
            activity: []
        }
    }); // table data
    const [filterOptions, setFilterOptions] = useState({
        alertType: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'Insider Trading',
                checked: false
            },
            {
                label: 'Marking the Close',
                checked: false
            },
            {
                label: 'High Volume',
                checked: false
            },
            {
                label: 'Flash Execution',
                checked: false
            },
            {
                label: 'Flash Order',
                checked: false
            }
        ],
        broker: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'Ysa Domingo',
                checked: false
            },
            {
                label: 'Miguel Ladisla',
                checked: false
            }
        ],
        ticker: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'BP',
                checked: false
            },
            {
                label: 'BO',
                checked: false
            }
        ],
        book: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'Book 1',
                checked: false
            },
            {
                label: 'Book 2',
                checked: false
            }
        ],
        quantity: [
            {
                label: 'Below 100K',
                checked: false
            },
            {
                label: '100K - 500K',
                checked: false
            },
            {
                label: '501K - 1M',
                checked: false
            },
            {
                label: 'Above 1M',
                checked: false
            }
        ],
        client: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'Client 1',
                checked: false
            },
            {
                label: 'Client 2',
                checked: false
            }
        ],
        escalation: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'Base',
                checked: false
            },
            {
                label: 'Manager',
                checked: false
            }
        ],
        assigned: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'Mark Thomson',
                checked: false
            },
            {
                label: 'Jonas Morgan',
                checked: false
            }
        ],
        status: [
            {
                label: 'Select All',
                checked: false
            },
            {
                label: 'Resolved',
                checked: false
            },
            {
                label: 'Archived',
                checked: false
            }
        ]
    }); // table column filters
    const [alerts, setAlerts] = useState({
        data: [],
        currentPage: 1,
        dataPerPage: 10,
        totalPages: 0
    }); // table pagination

    const viewAlertDetails = async (path, data) => {
        await dispatch(setSelectedAlert(data)); // redux version

        // setData({
        //     ...data,
        //     selected: {
        //         ...data.selected,
        //         data
        //     }
        // });

        history.push(path);
    };

    useEffect(() => {
        if (data.table.data !== undefined && data.table.data.length > 0) getTablePagination();
    }, []); // pagination init

    useEffect(() => {
        filterTableByColumn();
        isFilteredBefore.current = checkIfTableIsFiltered().length > 0;
    }, [filterOptions, alerts.currentPage]); // pagination click and column  filter select

    const getTablePagination = (
        tableData = data.table.data,
        tableCurrentPage = alerts.currentPage
    ) => {
        // Logic for displaying todos
        const indexOfLastData = alerts.currentPage * alerts.dataPerPage;
        const indexOfFirstData = indexOfLastData - alerts.dataPerPage;
        const currentData = tableData.slice(indexOfFirstData, indexOfLastData);

        setAlerts({
            ...alerts,
            data: currentData,
            currentPage: tableCurrentPage,
            totalPages: (tableData.length % alerts.dataPerPage) > 0 ? parseInt(tableData.length / alerts.dataPerPage) + 1 : parseInt(tableData.length / alerts.dataPerPage)
        });
    };

    const filterTableByColumn = () => {
        const filteredByColumnData = [];

        // option 1: static column filter options - wont show any if not applicable
        // option 2: remove column filter options based on what's already filtered to avoid unnecessary filtering of other columns

        if (activeFilterColumn !== '') {
            filterOptions[activeFilterColumn].filter(opt => {
                filteredByColumnData.push(...data.table.data.filter(dataOpt => opt.checked === true && dataOpt[activeFilterColumn].toLowerCase() === opt.label.toLowerCase()));
            }); // get all used column for filtering
        }

        filteredByColumnData.length > 0
            ? getTablePagination(filteredByColumnData, !isFilteredBefore.current ? 1 : alerts.currentPage) // set current page back to 1 when filtering column
            : getTablePagination();
    };

    const checkIfTableIsFiltered = () => {
        return Object.keys(filterOptions).filter(options => {
            return filterOptions[options].filter(option => option.checked === true).length > 0;
        });
    };

    return <AlertsScreen
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        filterString={filterString}
        setFilterString={setFilterString}
        setActiveFilterColumn={setActiveFilterColumn}
        tableColumns={data.table.columns}
        tableData={alerts.data}
        paginationData={alerts}
        setPaginationData={setAlerts}
        viewAlertDetails={viewAlertDetails}
        sidebarMenu={sidebarMenu} />;
}
