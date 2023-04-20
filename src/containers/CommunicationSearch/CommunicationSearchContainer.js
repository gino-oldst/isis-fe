// @flow
import debounce from 'debounce-async';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import type { Menu } from '../../types';
import CommunicationSearchScreen from './CommunicationSearchScreen';

import { getEmails } from '../../api/communicationSearch';
import { getData, getUnexpiredData, downloadBloombergHistoricData, downloadAllHistoricData, downloadReutersHistoricData } from '../../api/historicIngestion';
import { storageKey } from '../../config/constants';
import Storage from '../../utils/Storage';
import { DATE_TO_UTC_LOCAL } from '../../utils/helpers';
import storage from 'redux-persist/lib/storage';

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
    const [historicData, setHistoricData] = useState('');
    const { table, selected, searchFilterValue } = useSelector(({ communicationSearch }) => communicationSearch);
    const [threeMonths, setThreeMonths] = useState(moment().subtract(3, 'months'));
    const [viewModal, setViewModal] = useState(false);
    const [sourceList, setSourceList] = useState([]);

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

    const [status, setStatus] = useState([
        { id: 1, value: 'open', name: 'Open', isChecked: false },
        { id: 2, value: 'inReview', name: 'In Review', isChecked: false },
        { id: 3, value: 'resolved', name: 'Resolved', isChecked: false },
        { id: 4, value: 'archived', name: 'Archived', isChecked: false },
        { id: 5, value: 'notAvailable', name: 'Not Available', isChecked: false }
    ]);

    const [source, setSource] = useState([
        // { id: 1, value: 'EMAIL', name: 'Email', isChecked: false, disabled: true },
        { id: 2, value: 'REUTERS', name: 'Reuters', isChecked: false, disabled: false },
        { id: 3, value: 'BLOOMBERG_CHAT', name: 'Bloomberg Chat', isChecked: false, disabled: false },
        { id: 4, value: 'BLOOMBERG_EMAIL', name: 'Bloomberg Email', isChecked: false, disabled: false }
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

    const [missingBloomberg, setMissingBloomberg] = useState(false);
    const [missingReuters, setMissingReuters] = useState(false);

    const getDaysArray = function(start, end) {
        const arr = [];

        for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
        }

        return arr;
    };

    useEffect(() => {
        const dateFrom = filterDate[0].startDate != '' ? DATE_TO_UTC_LOCAL(filterDate[0].startDate) : '';
        const dateTo = filterDate[0].endDate != '' ? DATE_TO_UTC_LOCAL(filterDate[0].endDate) : '';

        console.log(dateFrom);
        console.log(dateTo);

        setFilterSearchForm({
            ...filterSearchForm,
            filterDateFrom: dateFrom,
            filterDateTo: dateTo
        });

        // console.log(filterSearchForm);

        setErrorForm({
            ...errorForm,
            errorDate: ''
        });
    }, [filterDate]);

    useEffect(() => {
        setTimeout(() => {
            loadSearchValuesFromStorage();
        }, 100);
    }, []);

    useEffect(() => {
        loadHistoricData();
    }, []);

    const loadHistoricData = async () => {
        await getUnexpiredData().then((result) => {
            setHistoricData(result.data);
        });
    };

    const loadSearchValuesFromStorage = async () => {
        const searchParams = JSON.parse(Storage.getItem(storageKey.searchParams));

        if (searchParams) {
            const values = searchParams.filterSearchForm;

            setSourceList(values.filterSource);

            const newFilters = {
                filterId: values.filterId,
                filterText: values.filterText,
                filterDateFrom: '',
                filterDateTo: '',
                filterSenders: [],
                filterRecipients: [],
                filterSource: []
            };

            setFilterSearchForm(filterSearchForm => {
                return {
                    ...filterSearchForm,
                    filterId: values.filterId,
                    filterText: values.filterText,
                    filterSenders: values.filterSenders,
                    filterRecipients: values.filterRecipients,
                    filterSource: values.filterSource,
                    filterDateFrom: values.filterDateFrom,
                    filterDateTo: values.filterDateTo
                };
            });

            const newDate = {
                startDate: values.filterDateFrom ? new Date(values.filterDateFrom) : '',
                endDate: values.filterDateTo ? new Date(values.filterDateTo) : ''
            };

            setFilterDate([newDate]);
        }
    };

    const handleSenderChange = (updatedList) => {
        const list = [];

        updatedList.map(op => {
            list.push(op.value);
        });

        setFilterSender(list);
        setFilterSearchForm({
            ...filterSearchForm,
            filterSenders: updatedList
        });
        setErrorForm({
            ...errorForm,
            errorSenders: ''
        });
    };

    const handleRecipientChange = (updatedList) => {
        const list = [];

        updatedList.map(op => {
            list.push(op.value);
        });

        setFilterRecipient(list);
        setFilterSearchForm({
            ...filterSearchForm,
            filterRecipients: updatedList
        });
        setErrorForm({
            ...errorForm,
            errorRecipients: ''
        });
    };

    const handleStatus = (event) => {
        const updatedList = [];

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

    const compareArrays = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    const handleSource = (event) => {
        const updatedList = [];

        event.map(ev => {
            if (ev.checked) {
                updatedList.push(ev.value);
            }
        });

        if (!compareArrays(updatedList, sourceList)) {
            setSourceList(updatedList);
            setFilterSearchForm({
                ...filterSearchForm,
                filterSource: updatedList
            });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        let formValid = true;
        const initialError = {
            errorDate: '',
            errorSenders: '',
            errorRecipients: ''
        };

        // Check here
        // if (filterSearchForm.filterSenders.length == 0) {
        //     initialError.errorSenders = 'Please add Senders';
        //     formValid = false;
        // }

        // if (filterSearchForm.filterRecipients.length == 0) {
        //     initialError.errorRecipients = 'Please add Recipients';
        //     formValid = false;
        // }

        // if (filterSearchForm.filterDateFrom == '' && filterSearchForm.filterDateTo == '') {
        //     initialError.errorDate = 'Please add Date/Time Range';
        //     formValid = false;
        // }

        // moment(dateState[0].startDate).format('HH:mm')
        if (moment(filterSearchForm.filterDateFrom).format('YYYY-MM-DD') === moment(filterSearchForm.filterDateTo).format('YYYY-MM-DD') &&
            moment(filterSearchForm.filterDateFrom).format('HH:mm') > moment(filterSearchForm.filterDateTo).format('HH:mm')) {
            initialError.errorDate = 'Date From Overlaps Date To';
            formValid = false;
        }

        if (!isValidDateRange(filterSearchForm.filterDateFrom, filterSearchForm.filterDateTo)) {
            console.log(JSON.parse(Storage.getItem(storageKey.user)).username);
            formValid = false;
            setViewModal(true);
        }

        if (formValid) {
            Storage.removeItem(storageKey.searchParams);
            Storage.setItem(storageKey.searchParams, JSON.stringify({
                filterSearchForm: filterSearchForm
            }));
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

    const isValidDateRange = (dateFrom, dateTo) => {
        if (moment(dateFrom) < threeMonths && moment(dateTo) < threeMonths) {
            const dateList = getDaysArray(moment(dateFrom), moment(dateTo));

            console.log(dateList);
            const bloombergArray = [];
            const reutersArray = [];
            let validRange = true;

            // search all
            if (filterSearchForm.filterSource.length === 0 || filterSearchForm.filterSource.length === 3 ||
                (filterSearchForm.filterSource.length === 2 && filterSearchForm.filterSource[0].label === 'Reuters')) {
                for (let i = 0; i < historicData.length; i++) {
                    if (historicData[i].source === 'Bloomberg') {
                        bloombergArray.push(historicData[i].dataDate);
                    } else if (historicData[i].source === 'Reuters') {
                        reutersArray.push(historicData[i].dataDate);
                    }
                }

                for (let i = 0; i < dateList.length; i++) {
                    for (let j = 0; j < bloombergArray.length; j++) {
                        if (dateList[i] === bloombergArray[j]) {
                            break;
                        }

                        if (j === bloombergArray.length - 1) {
                            console.log(dateList[i]);

                            validRange = false;
                            setMissingBloomberg(true);
                        }
                    }

                    for (let j = 0; j < reutersArray.length; j++) {
                        if (dateList[i] === reutersArray[j]) {
                            break;
                        }

                        if (j === reutersArray.length - 1) {
                            console.log(dateList[i]);

                            validRange = false;
                            setMissingReuters(true);
                        }
                    }
                }

                return validRange;
            } else if (filterSearchForm.filterSource.length === 1 && filterSearchForm.filterSource[0].label === 'Reuters') {
                // search reuters ONLY
                for (let i = 0; i < historicData.length; i++) {
                    if (historicData[i].source === 'Reuters') {
                        reutersArray.push(historicData[i].dataDate);
                    }
                }

                for (let i = 0; i < dateList.length; i++) {
                    if (!validRange) break;

                    for (let j = 0; j < reutersArray.length; j++) {
                        if (dateList[i] === reutersArray[j]) {
                            break;
                        }

                        if (j === reutersArray.length - 1) {
                            console.log(dateList[i]);

                            validRange = false;
                            setMissingReuters(true);
                        }
                    }
                }

                return validRange;
            } else {
                // search bloomberg ONLY
                for (let i = 0; i < historicData.length; i++) {
                    if (historicData[i].source === 'Bloomberg') {
                        bloombergArray.push(historicData[i].dataDate);
                    }
                }

                for (let i = 0; i < dateList.length; i++) {
                    if (!validRange) break;

                    for (let j = 0; j < bloombergArray.length; j++) {
                        if (dateList[i] === bloombergArray[j]) {
                            break;
                        }

                        if (j === bloombergArray.length - 1) {
                            console.log(dateList[i]);

                            validRange = false;
                            setMissingBloomberg(true);
                        }
                    }
                }

                return validRange;
            }
        }

        return true;
    };

    const redirectToPage = () => {
        history.push({
            pathname: '/historic_ingestion'
        });
    };

    const downloadAllData = async () => {
        if (missingReuters && missingBloomberg) {
            await downloadAllHistoricData(filterSearchForm.filterDateFrom, filterSearchForm.filterDateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
        } else if (missingReuters) {
            await downloadReutersHistoricData(filterSearchForm.dateFrom, filterSearchForm.dateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
        } else {
            await downloadBloombergHistoricData(filterSearchForm.dateFrom, filterSearchForm.dateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
        }

        setMissingBloomberg(false);
        setMissingReuters(false);
    };

    const downloadBloombergData = async () => {
        await downloadBloombergHistoricData(filterSearchForm.dateFrom, filterSearchForm.dateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
    };

    const downloadReutersData = async () => {
        await downloadReutersHistoricData(filterSearchForm.dateFrom, filterSearchForm.dateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
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
        handleStatus={handleStatus}
        loadOptions={loadOptions}
        errorForm={errorForm}
        filterSearchForm={filterSearchForm}
        isValidDateRange={isValidDateRange}
        handleCloseModal={handleCloseModal}
        viewModal={viewModal}
        setViewModal={setViewModal}
        downloadAllHistoricData={downloadAllData}
        downloadBloombergHistoricData={downloadBloombergData}
        downloadReutersHistoricData={downloadReutersData}
        redirectToPage={redirectToPage}
        // status={status}
        source={source}/>;
}
