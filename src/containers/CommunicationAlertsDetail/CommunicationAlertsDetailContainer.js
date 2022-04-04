// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import CommunicationAlertsDetailScreen from './CommunicationAlertsDetailScreen';
import type { Menu } from '../../types';
import { getBehaviours } from '../../api/behaviours';
import { getAlerts, downloadAlertsList, getColumnFilterValues } from '../../api/alerts';
import { getUsers } from '../../api/users';
import {
    DATE_TO_UTC
} from '../../utils/helpers';
import { setBehavioursData } from '../../redux/modules/behaviours';
import { setAlertsData, setAssignees, setColumnFilterValues } from '../../redux/modules/alerts';
import { getCommunicationSearchData, getCommunicationMessageDetail } from '../../api/communicationSearch';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function CommunicationAlertsDetail({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        console.log(location.state);
    }, [location]);

    const [loading, setLoading] = useState(true);
    const { isRowsSelected, selectedRows, appliedFilters } = useSelector(({ table }) => table);
    // const { table, selected, dateRange } = useSelector(({ alerts }) => alerts);
    // const behaviours = useSelector(({ behaviours }) => behaviours);
    const [detailData, setDetailData] = useState([]);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search Message',
            path: '/alerts'
        }
    ];

    const filters = useLocation();

    useEffect(() => {
        console.log(filters.state.id);
        loadSearchData(filters.state);
    }, [filters]);

    const loadSearchData = async (commMessageId) => {
        setLoading(true);

        try {
            const search = await getCommunicationMessageDetail(commMessageId.id);

            // const { data, totalCurrentElements, totalPages, totalNoOfRecords } = search.data;

            // const newData = data.map((item) => {
            //     return { ...item, selected: false };
            // });
            setDetailData(search);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return <CommunicationAlertsDetailScreen
        loading={loading}
        userId={userId}
        dataId={filters.state.id}
        detailData={detailData}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}/>;
}
