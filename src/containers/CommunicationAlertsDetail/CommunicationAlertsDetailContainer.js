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
import { getCommunicationSearchData, getCommunicationMessageDetail, getMessageThread, getRecipients } from '../../api/communicationSearch';
import { getMessageAlerts } from '../../api/communicationAlerts';

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
    const filters = useLocation();

    const [loading, setLoading] = useState(true);
    const { isRowsSelected, selectedRows, appliedFilters } = useSelector(({ table }) => table);
    // const { table, selected, dateRange } = useSelector(({ alerts }) => alerts);
    // const behaviours = useSelector(({ behaviours }) => behaviours);
    const [detailData, setDetailData] = useState([]);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Alerts',
            path: '/communication_alerts'
        },
        {
            label: filters.state.id,
            path: `communication_alerts_detail/${filters.state.id}`,
            disabled: true
        }
    ];

    useEffect(() => {
        loadSearchData(filters.state);
    }, [filters]);

    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const loadSearchData = async (commMessageId) => {
        setLoading(true);

        try {
            const search = await getCommunicationMessageDetail(commMessageId.id);

            setDetailData(search.data);

            const messages = await getMessageThread(commMessageId.chainLinkId);
            const { data, totalNoOfRecords, totalPages } = messages.data;

            setMessages(data);

            const alertsData = await getMessageAlerts(commMessageId.id);

            setAlerts(alertsData.data);

            const recipients = await getRecipients(search.data.chainLinkId);
            const extractedRecipients = extractRecipients(recipients.data);

            setRecipients(extractedRecipients);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const extractRecipients = (recipients) => {
        const unique = [...new Set(recipients.data.map(item => item.recipient))];

        return unique;
    };

    return <CommunicationAlertsDetailScreen
        loading={loading}
        userId={userId}
        dataId={filters.state.id}
        filterText={filters.state.filterText}
        detailData={detailData}
        alertsData={alerts}
        messages={messages}
        recipients={recipients}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal}/>;
}
