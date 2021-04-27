// @flow
import React, { useState } from 'react';
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
    const [filters, setFilters] = useState([]);
    const [data, setData] = useState({
        table: {
            columns: [
                {
                    header: 'Identifier',
                    accessor: 'identifier',
                    disableFilters: false,
                    clickable: true
                },
                {
                    header: 'Alert Type',
                    accessor: 'alertType',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Date',
                    accessor: 'date',
                    disableFilters: true,
                    clickable: false
                },
                {
                    header: 'Broker',
                    accessor: 'broker',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Ticker',
                    accessor: 'ticker',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Book',
                    accessor: 'book',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Quantity',
                    accessor: 'quantity',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Client',
                    accessor: 'client',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Escalation',
                    accessor: 'escalation',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Assigned',
                    accessor: 'assigned',
                    disableFilters: false,
                    clickable: false
                },
                {
                    header: 'Status',
                    accessor: 'status',
                    disableFilters: false,
                    clickable: false
                }
            ],
            data: [
                {
                    id: 1,
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 12,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Open',
                    detail: '/alert/MUA312'
                },
                {
                    id: 2,
                    identifier: 'MUA313',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 2',
                    quantity: 11,
                    client: 'Client 1',
                    escalation: 'CO',
                    assigned: 'Mark Thomson',
                    status: 'In Review',
                    detail: '/alert/MUA312'
                },
                {
                    id: 3,
                    identifier: 'MUA314',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 2',
                    quantity: 1500000,
                    client: 'Client 1',
                    escalation: 'CO',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    id: 4,
                    identifier: 'MUA315',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 2',
                    quantity: 93,
                    client: 'Client 1',
                    escalation: 'Manager',
                    assigned: 'Mark Thomson',
                    status: 'In Review',
                    detail: '/alert/MUA312'
                },
                {
                    id: 5,
                    identifier: 'MUA316',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Jeff Smith',
                    ticker: 'OCDO',
                    book: 'Book 3',
                    quantity: 458000,
                    client: 'Client 1',
                    escalation: 'Manager',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    id: 6,
                    identifier: 'MUA317',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Paul Herbert',
                    ticker: 'BP',
                    book: 'Book 4',
                    quantity: 223560,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Archived',
                    detail: '/alert/MUA312'
                },
                {
                    id: 7,
                    identifier: 'MUA318',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'OCDO',
                    book: 'Book 4',
                    quantity: 21,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Gergana Tsoneva',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    id: 8,
                    identifier: 'MUA319',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'SDR',
                    book: 'Book 5',
                    quantity: 789233,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Gergana Tsoneva',
                    status: 'Archived',
                    detail: '/alert/MUA312'
                },
                {
                    id: 9,
                    identifier: 'MUA320',
                    alertType: 'Marking the Close',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BNZL',
                    book: 'Book 6',
                    quantity: 1044,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Darren Hibbitt',
                    status: 'Open',
                    detail: '/alert/MUA312'
                },
                {
                    id: 10,
                    identifier: 'MUA321',
                    alertType: 'High Volume',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 7',
                    quantity: 985000,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Darren Hibbitt',
                    status: 'Open',
                    detail: '/alert/MUA312'
                },
                {
                    id: 11,
                    identifier: 'MUA322',
                    alertType: 'Flash Execution',
                    date: new Date(),
                    broker: 'Peter Davidson',
                    ticker: 'BNZL',
                    book: 'Book 7',
                    quantity: 122,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Darren Hibbitt',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    id: 12,
                    identifier: 'MUA323',
                    alertType: 'Flash Order',
                    date: new Date(2021, 3, 20, 10, 33, 30, 0),
                    broker: 'Peter Davidson',
                    ticker: 'WPP',
                    book: 'Book 8',
                    quantity: 102,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Resolved',
                    detail: '/alert/MUA312'
                },
                {
                    id: 13,
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 1000502,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Open',
                    detail: '/alert/MUA312'
                },
                {
                    id: 14,
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 12,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Open',
                    detail: '/alert/MUA312'
                },
                {
                    id: 15,
                    identifier: 'MUA312',
                    alertType: 'Insider Trading',
                    date: new Date(2021, 3, 18, 18, 33, 30, 0),
                    broker: 'Peter Davidson',
                    ticker: 'BP',
                    book: 'Book 1',
                    quantity: 12,
                    client: 'Client 1',
                    escalation: 'Base',
                    assigned: 'Mark Thomson',
                    status: 'Open',
                    detail: '/alert/MUA312'
                }
            ]
        },
        selected: {
            data: {},
            activity: []
        }
    }); // table dummy data

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

    return <AlertsScreen
        tableColumns={data.table.columns}
        tableData={data.table.data}
        filters={filters}
        setFilters={setFilters}
        viewAlertDetails={viewAlertDetails}
        sidebarMenu={sidebarMenu} />;
}
