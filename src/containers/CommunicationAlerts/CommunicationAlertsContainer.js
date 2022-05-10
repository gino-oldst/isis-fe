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
import { getCommunicationAlertData, getKeywords } from '../../api/communicationAlerts';
import { getEmails, getEmailsAll } from '../../api/communicationSearch';

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
    // const { isRowsSelected, selectedRows, appliedFilters } = useSelector(({ table }) => table);
    const { pageSize, activePage, appliedFilters, selectedRows, areRowsSelectedAll, sort } = useSelector(({ table }) => table);
    const { table, selected, dateRange } = useSelector(({ communicationAlerts }) => communicationAlerts);

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
            const alerts = await getCommunicationAlertData(activePage, pageSize, sort);
            const { data, totalNoOfRecords, totalPages } = alerts.data;
            // const policies = dataSample;

            await loadColumnFilterValues();
            // const { data, alertIds, totalNoOfRecords, totalPages } = policies.data;

            dispatch(setCommunicationAlertsData(data, totalNoOfRecords, totalPages));

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
        const emails = await getEmails();
        const keywords = await getKeywords();

        const { data } = emails.data;

        // const { data } = filterSample;

        // console.log(JSON.stringify(filterSample));
        // console.log(JSON.stringify(data));
        // let dataCopy = data;

        // const keys = Object.keys(data);

        // keys.forEach(key => {
        //     dataCopy = {
        //         ...data,
        //         [key]: data[key].sort()
        //     };
        // });
        const emailList = data.map((account) => ({
            value: account.email,
            label: `${account.email} (${account.firstName} ${account.lastName})`
        }));

        const dataCopy = {
            emails: emailList,
            keywords: keywords
        };

        console.log(dataCopy);

        dispatch(setColumnFilterValues(dataCopy));
    };

    const tableIsFiltered = () => {
        return !!appliedFilters.filter(filter => filter.value.length > 0).length;
    };

    const viewCommunicationAlertDetails = async (id, chainLinkId, filterText) => {
        // history.push({
        //     pathname: `/communication_alerts_detail/${id}`,
        //     state: { id: id }
        // });
        history.push({
            pathname: `/communication_alerts_detail/${id}`,
            state: { id: id, chainLinkId: chainLinkId, filterText: filterText }
        });
        // window.location.href = `/communication_alerts_detail/${id}`;
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
        selectedRows={selectedRows}
        viewCommunicationAlertDetails={viewCommunicationAlertDetails}/>;
}
