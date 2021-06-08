// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Menu } from '../../types';
import DashboardScreen from './DashboardScreen';
import {
    DATE_TO_UTC,
    REMOVE_UTC_CHAR
} from '../../utils/helpers';
import { getDashboardData } from '../../api/dashboard';
import { setDashboardData } from '../../redux/modules/dashboard';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function DashboardContainer({
    history,
    sidebarMenu
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { data } = useSelector(({ dashboard }) => dashboard);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    useEffect(() => {
        loadDashboardData(`${DATE_TO_UTC(fromDate).split('T')[0]} 00:00:00`, `${DATE_TO_UTC(toDate).split('T')[0]} 23:59:00`);
    }, []);

    const loadDashboardData = async (dateFrom, dateTo) => {
        setLoading(true);

        const dashboard = await getDashboardData(dateFrom, dateTo);

        console.log(dashboard.data);

        dispatch(setDashboardData(dashboard.data));

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
        loading={loading}
        fromDate={fromDate}
        toDate={toDate}
        handleDateChange={handleDateChange}
        sidebarMenu={sidebarMenu}
        dashboardData={data} />;
}
