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
    const [fromDate, setFromDate] = useState(`${DATE_TO_UTC(moment()).split('T')[0]} 00:00:00`);
    const [toDate, setToDate] = useState(`${DATE_TO_UTC(moment()).split('T')[0]} 23:59:00`);

    useEffect(() => {
        loadDashboardData(
            `${DATE_TO_UTC(fromDate).split('T')[0]} 00:00:00`,
            `${DATE_TO_UTC(toDate).split('T')[0]} 23:59:00`
        );
    }, [toDate, fromDate]);

    const loadDashboardData = async (dateFrom, dateTo) => {
        setLoading(true);

        const dashboard = await getDashboardData(dateFrom, dateTo);

        dispatch(setDashboardData(dashboard.data));

        setLoading(false);
    };

    const handleDateChange = async (type, date) => {
        if (type === 'from') {
            if (moment(date).isAfter(moment(toDate))) {
                alert('FROM cannot be greater than TO');
            } else {
                setFromDate(`${DATE_TO_UTC(date).split('T')[0]} 00:00:00`);
            }
        } else {
            if (moment(date).isBefore(moment(fromDate))) {
                alert('TO cannot be less than FROM');
            } else {
                setToDate(`${DATE_TO_UTC(date).split('T')[0]} 23:59:00`);
            }
        }
    };

    const handleDashboardDownload = async () => {
        await downloadDashboardData(
            `${DATE_TO_UTC(fromDate).split('T')[0]} 00:00:00`,
            `${DATE_TO_UTC(toDate).split('T')[0]} 23:59:00`
        );
    };

    return <DashboardScreen
        loading={loading}
        fromDate={fromDate}
        toDate={toDate}
        handleDateChange={handleDateChange}
        handleDashboardDownload={handleDashboardDownload}
        sidebarMenu={sidebarMenu}
        dashboardData={data} />;
}
