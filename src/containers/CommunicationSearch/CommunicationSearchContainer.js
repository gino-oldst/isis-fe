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
            label: 'Alerts',
            path: '/alerts'
        }
    ];

    // const [filterID, setID] = useState('');
    // const [filterMessage, setFilterMessage] = useState('');
    // const [filterSender, setFilterSender] = useState([]);
    // const [filterRecipient, setFilterRecipient] = useState([]);
    const [filterStatus, setFilterStatus] = useState([]);
    const [filterSource, setFilterSource] = useState([]);
    const [filterDate, setFilterDate] = useState([
        {
            startDate: '',
            endDate: ''
        }
    ]);
    const [filterSearchForm, setFilterSearchForm] = useState({
        filterId: '',
        filterText: '',
        filterStatus: [],
        filterSource: []
    });

    const [filterSender, setFilterSender] = useState([]);

    const handleSenderChange = (options) => {
        console.log(options);
        setFilterSender(options);
    };

    const [filterRecipient, setFilterRecipient] = useState([]);

    const handleRecipientChange = (options) => {
        setFilterRecipient(options);
    };

    const onSubmit = async e => {
        e.preventDefault();
        console.log('onSubmit');
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
        sidebarMenu={sidebarMenu}
        breadcrumb={breadcrumb}
        filterDate={filterDate}
        setFilterDate={setFilterDate}/>;
}
