// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import CommunicationSearchScreen from './CommunicationSearchScreen';
import type { Menu } from '../../types';
import {
    DATE_TO_UTC
} from '../../utils/helpers';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function
}

export default function CommunicationSearchContainer({
    userId,
    sidebarMenu,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search',
            path: '/communication_search'
        }
    ];

    const [filterDate, setFilterDate] = useState([
        {
            startDate: '',
            endDate: ''
        }
    ]);

    useEffect(() => {
        const dateFrom = filterDate[0].startDate != '' ? moment(filterDate[0].startDate).utc().local().format('YYYY-MM-DD') : '';
        const dateTo = filterDate[0].endDate != '' ? moment(filterDate[0].endDate).utc().local().format('YYYY-MM-DD') : '';

        setFilterSearchForm({
            ...filterSearchForm,
            filterDateFrom: dateFrom,
            filterDateTo: dateTo
        });
    }, [filterDate]);

    const [filterSearchForm, setFilterSearchForm] = useState({
        filterId: '',
        filterText: '',
        filterDateFrom: '',
        filterDateTo: '',
        filterSenders: [],
        filterRecipients: [],
        filterStatus: [],
        filterSource: []
    });

    const [filterSender, setFilterSender] = useState([]);
    const [filterRecipient, setFilterRecipient] = useState([]);

    const handleSenderChange = (updatedList) => {
        // var updatedList = [];

        // options.map(op => {
        //     if (!updatedList.indexOf(op.value) > -1) {
        //         updatedList.push(op.value);
        //     }
        // });
        setFilterSender(updatedList);
        setFilterSearchForm({
            ...filterSearchForm,
            filterSenders: updatedList
        });
    };

    const handleRecipientChange = (updatedList) => {
        // var updatedList = [];

        // options.map(op => {
        //     if (!updatedList.indexOf(op.value) > -1) {
        //         updatedList.push(op.value);
        //     }
        // });
        setFilterRecipient(updatedList);
        setFilterSearchForm({
            ...filterSearchForm,
            filterRecipients: updatedList
        });
    };

    const handleStatus = (event) => {
        var updatedList = [];

        event.map(ev => {
            if (ev.checked) {
                updatedList.push(ev.value);
            }
        });

        setFilterSearchForm({
            ...filterSearchForm,
            filterStatus: updatedList
        });
    };

    const handleSource = (event) => {
        var updatedList = [];

        event.map(ev => {
            if (ev.checked) {
                updatedList.push(ev.value);
            }
        });

        setFilterSearchForm({
            ...filterSearchForm,
            filterSource: updatedList
        });
    };

    const onSubmit = async e => {
        e.preventDefault();
        history.push('/communication_search_results', filterSearchForm);
    };

    const onChange = e => {
        const { name, value } = e.target;

        setFilterSearchForm({
            ...filterSearchForm,
            [name]: value
        });
    };

    return <CommunicationSearchScreen
        loading={loading}
        userId={userId}
        onSubmit={onSubmit}
        onChange={onChange}
        handleRecipientChange={handleRecipientChange}
        handleSenderChange={handleSenderChange}
        filterSender={filterSender}
        filterRecipient={filterRecipient}
        sidebarMenu={sidebarMenu}
        breadcrumb={breadcrumb}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        handleSource={handleSource}
        handleStatus={handleStatus}/>;
}
