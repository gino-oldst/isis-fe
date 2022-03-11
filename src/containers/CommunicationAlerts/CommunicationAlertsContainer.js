// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import CommunicationAlertsScreen from './CommunicationAlertsScreen';
import type { Menu } from '../../types';
import { getBehaviours } from '../../api/behaviours';
import { getAlerts, downloadAlertsList, getColumnFilterValues } from '../../api/alerts';
import { getUsers } from '../../api/users';
import {
    DATE_TO_UTC
} from '../../utils/helpers';
import { setBehavioursData } from '../../redux/modules/behaviours';
import { setAlertsData, setAssignees, setColumnFilterValues } from '../../redux/modules/alerts';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function CommunicationAlertsContainer({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { isRowsSelected, selectedRows, appliedFilters } = useSelector(({ table }) => table);
    const { table, selected, dateRange } = useSelector(({ alerts }) => alerts);
    const behaviours = useSelector(({ behaviours }) => behaviours);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Alerts',
            path: '/alerts'
        }
    ];

    return <CommunicationAlertsScreen
        loading={loading}
        userId={userId}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}/>;
}
