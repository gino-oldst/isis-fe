// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CommunicationSearchResultsScreen from './CommunicationSearchResultsScreen';
import type { Menu } from '../../types';
import { setCommunicationAlertsData, setColumnFilterValues } from '../../redux/modules/communicationAlerts';

// To be removed once we move to with backend
import dataSample from '../CommunicationAlerts/MOCK_DATA.json';
import filterSample from '../CommunicationAlerts/filters.json';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function,
    useMediaQuery: Function,
}

export default function CommunicationSearchResultsContainer({
    sidebarMenu,
    handleCloseModal,
    useMediaQuery
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { pageSize, activePage, appliedFilters, areRowsSelectedAll, sort } = useSelector(({ table }) => table);
    const { table, selected, dateRange } = useSelector(({ communicationAlerts }) => communicationAlerts);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search',
            path: 'communication_search'
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

    return <CommunicationSearchResultsScreen
        loading={loading}
        sidebarMenu={sidebarMenu}
        breadcrumb={breadcrumb}
        table={table}
        activePage={activePage}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal}
        viewCommunicationAlertDetails={viewCommunicationAlertDetails}/>;
}
