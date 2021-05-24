// @flow
import React, { useState, useEffect } from 'react';
import type { Menu } from '../../types';
import { checkAuthorization } from '../../utils/Auth';
import DashboardScreen from './DashboardScreen';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function DashboardContainer({
    history,
    sidebarMenu
}: Props): React$Element<any> {
    // check if user is logged in
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const auth = await checkAuthorization();

        if (!auth) history.push('/login');
    };

    const [selectedDate, handleDateChange] = useState(new Date());

    return <DashboardScreen
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        sidebarMenu={sidebarMenu}/>;
}
