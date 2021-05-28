// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthorization } from '../../utils/Auth';
import { useHistory } from 'react-router-dom';
import AlertsScreen from './AlertsScreen';
import type { Menu } from '../../types';
import { getAlerts } from '../../api/alerts';

import { setAlertsData } from '../../redux/modules/alerts';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function
}

export default function AlertsContainer({
    sidebarMenu,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { isRowsSelected } = useSelector(({ table }) => table);
    const { table } = useSelector(({ alerts }) => alerts);
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
            const alerts = await getAlerts();

            dispatch(setAlertsData(alerts.data.data));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return <AlertsScreen
        loading={loading}
        breadcrumb={breadcrumb}
        tableColumns={table.columns}
        tableData={!table.isFiltered ? table.data : table.filtered}
        isRowsSelected={isRowsSelected}
        viewAlertDetails={viewAlertDetails}
        handleCloseModal={handleCloseModal}
        sidebarMenu={sidebarMenu} />;
}
