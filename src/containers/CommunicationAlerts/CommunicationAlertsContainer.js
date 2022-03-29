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
import { setCommunicationAlertsData, setColumnFilterValues } from '../../redux/modules/communicationAlerts';

// To be removed once we move to with backend
import dataSample from './MOCK_DATA.json';
import filterSample from './filters.json';

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
    const { pageSize, activePage, appliedFilters, areRowsSelectedAll, sort } = useSelector(({ table }) => table);
    const { table, selected, dateRange } = useSelector(({ communicationAlerts }) => communicationAlerts);
    // const table = useSelector(({ communication_alerts }) => communication_alerts);

    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Communication Alerts',
            path: '/communication_alerts'
        }
    ];

    const loadCommAlertsData = async (page, size, appliedFilters, sort) => {
        setLoading(true);

        try {
            // const behaviours = await getBehaviours(activePage, pageSize, sort);
            // const { data, totalNoOfRecords, totalPages } = behaviours.data;
            const policies = dataSample;

            await loadColumnFilterValues();
            const { data, alertIds, totalNoOfRecords, totalPages } = policies.data;

            dispatch(setCommunicationAlertsData(data, alertIds, totalNoOfRecords, totalPages));

            console.log(data);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadCommAlertsData(
            activePage,
            pageSize,
            appliedFilters,
            sort
        );
    }, [pageSize, activePage, appliedFilters, sort]);

    const loadColumnFilterValues = async () => {
        // const { data } = await getColumnFilterValues();

        // console.log(JSON.stringify(data));
        const { data } = filterSample;

        // console.log(JSON.stringify(filterSample));
        // console.log(JSON.stringify(data));
        let dataCopy = data;

        const keys = Object.keys(data);

        keys.forEach(key => {
            dataCopy = {
                ...data,
                [key]: data[key].sort()
            };
        });

        dispatch(setColumnFilterValues(dataCopy));
    };

    const tableIsFiltered = () => {
        return !!appliedFilters.filter(filter => filter.value.length > 0).length;
    };

    const viewCommunicationAlertDetails = async (row) => {
        // history.push(`/communication_alerts/${row.id}`);
        window.location.href = `/communication_alerts/${row.id}`;
    };

    return <CommunicationAlertsScreen
        loading={loading}
        userId={userId}
        table={table}
        activePage={activePage}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal}
        viewCommunicationAlertDetails={viewCommunicationAlertDetails}/>;
}
