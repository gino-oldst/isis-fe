// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertDetailScreen from './AlertDetailScreen';

import { getUsers } from '../../api/users';
import { getAlert, downloadAlertsRecord } from '../../api/alerts';
import { getAlertSpecifics } from '../../api/alertSpecifics';
import { setAssignees, setSelectedAlert, setAlertSpecificsData } from '../../redux/modules/alerts';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function AlertDetailContainer({
    match,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { selected } = useSelector(({ alerts }) => alerts);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/dashboard'
        },
        {
            label: 'Alerts',
            path: '/alerts'
        },
        {
            label: match.params.id,
            path: `/alert/${match.params.id}`
        }
    ];

    useEffect(() => {
        loadAlertDetails();
        loadUsers();
        loadAlertSpecifics();
    }, []);

    const loadAlertDetails = async () => {
        setLoading(true);

        try {
            const alerts = await getAlert(match.params.id);

            dispatch(setSelectedAlert(alerts.data));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const loadUsers = async () => {
        const users = await getUsers();
        const filteredUsers = users.data.data.filter(user => user.userRegistrationType === 'EMAIL');

        dispatch(setAssignees(filteredUsers));
    };

    const loadAlertSpecifics = async () => {
        const alertId = localStorage.getItem('selectedAlertId');
        const alertSpecific = await getAlertSpecifics(alertId);

        if (alertSpecific.status === 200) dispatch(setAlertSpecificsData(alertSpecific.data));
    };

    const handleDownloadAlertsRecord = async () => {
        await downloadAlertsRecord(selected.data.id);
    };

    return <AlertDetailScreen
        loading={loading}
        setLoading={setLoading}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        useMediaQuery={useMediaQuery}
        handleCloseModal={handleCloseModal}
        selectedAlert={selected.data}
        assignees={selected.assignees}
        alertSpecifics={selected.alertSpecifics}
        handleDownloadAlertsRecord={handleDownloadAlertsRecord} />;
}
