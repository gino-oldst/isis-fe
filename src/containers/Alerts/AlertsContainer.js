// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import AlertsScreen from './AlertsScreen';
import type { Menu } from '../../types';
import { getAlerts, downloadAlertsList } from '../../api/alerts';
import { getUsers } from '../../api/users';

import { setAlertsData, setAssignees } from '../../redux/modules/alerts';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function
}

export default function AlertsContainer({
    userId,
    sidebarMenu,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { isRowsSelected, selectedRows, filteredRows, appliedFilters } = useSelector(({ table }) => table);
    const { table, selected } = useSelector(({ alerts }) => alerts);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/dashboard'
        },
        {
            label: 'Alerts',
            path: '/alerts'
        }
    ];

    useEffect(() => {
        loadAlertsData();
    }, []);

    const viewAlertDetails = async (row) => {
        localStorage.setItem('selectedAlertId', row.id);

        history.push(`/alert/${row.behaviourCode}`);
    };

    const loadAlertsData = async () => {
        setLoading(true);

        try {
            await loadAlerts();
            await loadUsers();
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const loadAlerts = async () => {
        const alerts = await getAlerts();

        dispatch(setAlertsData(alerts.data.data));
    };

    const loadUsers = async () => {
        const users = await getUsers();
        const filteredUsers = users.data.data.filter(user => user.userRegistrationType === 'EMAIL');

        dispatch(setAssignees(filteredUsers));
    };

    const handleDownloadAlertsList = async (date) => {
        const payload = {
            alertIds: isRowsSelected > 0 ? selectedRows : filteredRows,
            dateRange: `${moment(date.start).format('L')} to ${moment(date.end).format('L')}`,
            filteredApplied: appliedFilters.filter(filter => (filter.id !== 'quantity' && filter.value.length > 0) || (filter.id === 'quantity' && filter.value > 0)).map(filter => `${filter.id}: [${filter.value}]`).join(', ')
        };

        await downloadAlertsList(payload);
    };

    return <AlertsScreen
        loading={loading}
        userId={userId}
        breadcrumb={breadcrumb}
        loadAlerts={loadAlerts}
        tableColumns={table.columns}
        tableData={!table.isFiltered ? table.data : table.filtered}
        isRowsSelected={isRowsSelected}
        selectedRows={selectedRows}
        assignees={selected.assignees}
        viewAlertDetails={viewAlertDetails}
        handleCloseModal={handleCloseModal}
        sidebarMenu={sidebarMenu}
        handleDownloadAlertsList={handleDownloadAlertsList} />;
}
