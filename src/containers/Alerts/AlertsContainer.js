// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    const { table } = useSelector(({ alerts }) => alerts);
    const [filterString, setFilterString] = useState('');
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
                label: 'Select All',
                checked: false
            },
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
    });
    const [alerts, setAlerts] = useState({
        data: [],
        currentPage: 1,
        dataPerPage: 10,
        totalPages: 0
    });

    const viewAlertDetails = async (path, data) => {
        await dispatch(setSelectedAlert(data));

        history.push(path);
    };

    useEffect(() => {
        if (table.data !== undefined && table.data.length > 0) getTablePagination();
    }, []);

    useEffect(() => {
        getTablePagination();
    }, [alerts.currentPage]);

    const getTablePagination = () => {
        // Logic for displaying todos
        const indexOfLastData = alerts.currentPage * alerts.dataPerPage;
        const indexOfFirstData = indexOfLastData - alerts.dataPerPage;
        const currentData = table.data.slice(indexOfFirstData, indexOfLastData);

        setAlerts({
            ...alerts,
            data: currentData,
            totalPages: (table.data.length % alerts.dataPerPage) > 0 ? parseInt(table.data.length / alerts.dataPerPage) + 1 : parseInt(table.data.length / alerts.dataPerPage)
        });
    };

    return <AlertsScreen
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        filterString={filterString}
        setFilterString={setFilterString}
        tableColumns={table.columns}
        tableData={alerts.data}
        paginationData={alerts}
        setPaginationData={setAlerts}
        viewAlertDetails={viewAlertDetails}
        sidebarMenu={sidebarMenu} />;
}
