// @flow
import React, { useState, useEffect } from 'react';
import type { Menu } from '../../types';
import DashboardScreen from './DashboardScreen';
import { DATE_TO_UTC } from '../../utils/helpers';
import { getDashboardData } from '../../api/dashboard';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function DashboardContainer({
    history,
    sidebarMenu
}: Props): React$Element<any> {
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);

        const dashboard = await getDashboardData(`${DATE_TO_UTC(fromDate).split('T')[0]} 00:00:00`, `${DATE_TO_UTC(toDate).split('T')[0]} 23:59:00`);

        console.log(dashboard);

        setLoading(false);
    };

    const handleDateChange = async (type, from, to) => {
        if (type === 'from') {
            setFromDate(from);
        } else {
            setToDate(to);
        }

        console.log(fromDate);
        console.log(toDate);
        // await getDashboardData();
    };

    return <DashboardScreen
        fromDate={fromDate}
        toDate={toDate}
        handleDateChange={handleDateChange}
        sidebarMenu={sidebarMenu}/>;
}
