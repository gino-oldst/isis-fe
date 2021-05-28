// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertDetailScreen from './AlertDetailScreen';

import { getAlert } from '../../api/alerts';
import { getUsers } from '../../api/users';
import { setSelectedAlert, setAssignees } from '../../redux/modules/alerts';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function
}

export default function AlertDetailContainer({
    match,
    sidebarMenu,
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
    }, []);

    const loadAlertDetails = async () => {
        setLoading(true);
        const alertId = localStorage.getItem('selectedAlertId');

        try {
            const alerts = await getAlert(alertId);
            const users = await getUsers();
            const filteredUsers = users.data.data.filter(user => user.userRegistrationType === 'EMAIL');

            dispatch(setSelectedAlert(alerts.data));
            dispatch(setAssignees(filteredUsers));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return <AlertDetailScreen
        loading={loading}
        setLoading={setLoading}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal}
        selectedAlert={selected.data}
        assignees={selected.assignees} />;
}
