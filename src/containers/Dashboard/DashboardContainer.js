// @flow
import React, { useEffect, useState } from 'react';
import { MdDashboard, MdStar, MdSettings } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setFlashNotification } from '../../redux/modules/flashNotification';

import DashboardScreen from './DashboardScreen';

export default function DashboardContainer(): React$Element<any> {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const dashboardMenu = [{
        label: 'Dashboard',
        onClick: () => {},
        icon: MdDashboard,
        key: 'dashboard'
    }, {
        label: 'Charts',
        onClick: () => {},
        icon: MdStar,
        key: 'charts'
    }, {
        label: 'Settings',
        icon: MdSettings,
        key: 'settings',
        subMenu: [{
            key: 'one',
            label: 'One'
        }, {
            key: 'two',
            label: 'Two'
        }, {
            key: 'three',
            label: 'Three'
        }]
    }];

    useEffect(() => {
        dispatch(setFlashNotification({
            message: 'LOGGED IN'
        }));

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    return <DashboardScreen
        isLoading={isLoading}
        dashboardMenu={dashboardMenu}/>;
}
