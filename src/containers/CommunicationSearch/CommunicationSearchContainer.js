// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import CommunicationSearchScreen from './CommunicationSearchScreen';
import type { Menu } from '../../types';
import {
    DATE_TO_UTC
} from '../../utils/helpers';
import debounce from 'debounce-async';

import { setCommunicationSearchData, setSearchFilterValues } from '../../redux/modules/communicationSearch';
import { getEmails } from '../../api/communicationSearch';

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
    const { table, selected, searchFilterValue } = useSelector(({ communicationSearch }) => communicationSearch);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search Message',
            path: '/communication_search'
        }
    ];

    const [filterDate, setFilterDate] = useState([
        {
            startDate: '',
            endDate: ''
        }
    ]);

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

    const [errorForm, setErrorForm] = useState({
        errorDate: '',
        errorSenders: '',
        errorRecipients: ''
    });

    useEffect(() => {
        // const dateFrom = filterDate[0].startDate != '' ? moment(filterDate[0].startDate).utc().local().format('YYYY-MM-DD hh:mm A') : ''; // for adding time in format hh:mm A
        // const dateTo = filterDate[0].endDate != '' ? moment(filterDate[0].endDate).utc().local().format('YYYY-MM-DD hh:mm A') : ''; // for adding time in format hh:mm A

        const dateFrom = filterDate[0].startDate != '' ? moment(filterDate[0].startDate).utc().local().format('YYYY-MM-DDTHH:mm:ss') : '';
        const dateTo = filterDate[0].endDate != '' ? moment(filterDate[0].endDate).utc().local().format('YYYY-MM-DDTHH:mm:ss') : '';

        setFilterSearchForm({
            ...filterSearchForm,
            filterDateFrom: dateFrom,
            filterDateTo: dateTo
        });

        setErrorForm({
            ...errorForm,
            errorDate: ''
        });
    }, [filterDate]);

    const handleSenderChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op.value);
        });

        setFilterSender(list);
        setFilterSearchForm({
            ...filterSearchForm,
            filterSenders: list
        });
        setErrorForm({
            ...errorForm,
            errorSenders: ''
        });
    };

    const handleRecipientChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op.value);
        });

        setFilterRecipient(list);
        setFilterSearchForm({
            ...filterSearchForm,
            filterRecipients: list
        });
        setErrorForm({
            ...errorForm,
            errorRecipients: ''
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
        var formValid = true;
        const initialError = {
            errorDate: '',
            errorSenders: '',
            errorRecipients: ''
        };

        // Check here
        if (filterSearchForm.filterSenders.length == 0) {
            initialError.errorSenders = 'Please add Senders';
            formValid = false;
        }

        if (filterSearchForm.filterRecipients.length == 0) {
            initialError.errorRecipients = 'Please add Recipients';
            formValid = false;
        }

        if (filterSearchForm.filterDateFrom == '' && filterSearchForm.filterDateTo == '') {
            initialError.errorDate = 'Please add Date/Time Range';
            formValid = false;
        }

        if (formValid) {
            history.push('/communication_search_results', filterSearchForm);
        } else {
            setErrorForm({
                ...errorForm,
                errorDate: initialError.errorDate,
                errorSenders: initialError.errorSenders,
                errorRecipients: initialError.errorRecipients
            });
        }
    };

    const onChange = e => {
        const { name, value } = e.target;

        setFilterSearchForm({
            ...filterSearchForm,
            [name]: value
        });
    };

    // Emails for Sender Recipient Implementation
    const [lastOptions, setLastOptions] = useState([]);

    const loadOptions = useMemo(() => {
        return debounce(async (inputValue) => {
            const { data } = await getEmails(inputValue, inputValue, inputValue);
            const accounts = data.data;

            const options = accounts.map((account) => ({
                value: account.email,
                label: `${account.email} (${account.firstName} ${account.lastName})`
            }));

            setLastOptions(options);

            return options;
        }, 300);
    }, [setLastOptions]);

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
        handleStatus={handleStatus}
        loadOptions={loadOptions}
        errorForm={errorForm}/>;
}
