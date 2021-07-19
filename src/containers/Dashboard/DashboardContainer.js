// @flow
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import type { Menu } from '../../types';
import DashboardScreen from './DashboardScreen';
import {
    DATE_TO_UTC
} from '../../utils/helpers';
import { getDashboardData, downloadDashboardData } from '../../api/dashboard';
import { setDashboardData, setDashboardDateRange } from '../../redux/modules/dashboard';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function DashboardContainer({
    history,
    sidebarMenu
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { data, dateRange } = useSelector(({ dashboard }) => dashboard);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDashboardData(
            `${DATE_TO_UTC(dateRange.from).split('T')[0]} 00:00:00`,
            `${DATE_TO_UTC(dateRange.to).split('T')[0]} 23:59:59`
        );
    }, [dateRange.from, dateRange.to]);

    const loadDashboardData = async (dateFrom, dateTo) => {
        setLoading(true);

        const dashboard = await getDashboardData(dateFrom, dateTo);

        dispatch(setDashboardData(dashboard.data));

        setLoading(false);
    };

    const handleDateChange = async (type, date) => {
        if (type === 'from') {
            if (moment(date).isAfter(moment(dateRange.to))) {
                alert('FROM cannot be greater than TO');
            } else {
                dispatch(setDashboardDateRange('from', moment(date)));
            }
        } else {
            if (moment(date).isBefore(moment(dateRange.from))) {
                alert('TO cannot be less than FROM');
            } else {
                dispatch(setDashboardDateRange('to', moment(date)));
            }
        }
    };

    const handleDashboardDownload = async () => {
        await downloadDashboardData(
            `${DATE_TO_UTC(dateRange.from).split('T')[0]} 00:00:00`,
            `${DATE_TO_UTC(dateRange.to).split('T')[0]} 23:59:00`
        );
    };

    return <DashboardScreen
        loading={loading}
        fromDate={dateRange.from}
        toDate={dateRange.to}
        handleDateChange={handleDateChange}
        handleDashboardDownload={handleDashboardDownload}
        sidebarMenu={sidebarMenu}
        dashboardData={data} />;
}
