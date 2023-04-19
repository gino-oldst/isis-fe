// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CommunicationSearchResultsScreen from './CommunicationSearchResultsScreen';
import type { Menu } from '../../types';
import dataSample from '../CommunicationAlerts/MOCK_DATA.json';
import filterSample from '../CommunicationAlerts/filters.json';
import moment from 'moment';
import { downloadCommSearchList, getCommunicationSearchData, getCommunicationSearchDataOpenSearch, getEmails, getEmailsAll } from '../../api/communicationSearch';
import { getData, getUnexpiredData, downloadBloombergHistoricData, downloadAllHistoricData, downloadReutersHistoricData } from '../../api/historicIngestion';
import { setCommunicationSearchData, setColumnFilterValues, setSearchFilterValues } from '../../redux/modules/communicationSearch';
import { setActivePage } from '../../redux/modules/isisTable';
import { filter } from 'underscore';
import debounce from 'debounce-async';
import { storageKey } from '../../config/constants';
import Storage from '../../utils/Storage';
import { setFlashNotification } from '../../redux/modules/flashNotification';

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
    const filters = useLocation();
    const [loading, setLoading] = useState(true);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [currPage, setCurrPage] = useState(false);
    const { pageSize, activePage, appliedFilters, areRowsSelectedAll, sort, dateRange, isTablePageSelect } = useSelector(({ isisTable }) => isisTable);
    const { table, selected, searchFilterValue } = useSelector(({ communicationSearch }) => communicationSearch);
    const { emails, profileData } = useSelector(({ authentication }) => authentication);
    const [searchId, setSearchId] = useState('');
    const [keyword, setKeyword] = useState('');
    const [lastOptions, setLastOptions] = useState([]);
    const [tableResultStore, setTableResultStore] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [threeMonths, setThreeMonths] = useState('');
    const [viewModal, setViewModal] = useState(false);
    const [historicData, setHistoricData] = useState('');
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search Message',
            path: 'communication_search'
        },
        {
            label: 'Search Results',
            path: 'communication_search_results'
        }
    ];
    const [filterDate, setFilterDate] = useState([
        {
            startDate: '',
            endDate: ''
        }
    ]);

    const [errorForm, setErrorForm] = useState({
        errorDate: '',
        errorSenders: '',
        errorRecipients: ''
    });

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

    useEffect((e) => {
        setTimeout(() => {
            loadSearchData(
                activePage,
                pageSize,
                sort,
                filterSearchForm,
                false
            );
            setThreeMonths(new Date(moment().subtract(3, 'months')));
        }, 150);
    }, [pageSize, activePage, sort]);

    useEffect(() => {
        setTimeout(() => {
            loadSearchValuesFromStorage();
        }, 100);
    }, []);

    const loadSearchValuesFromStorage = async () => {
        const searchParams = JSON.parse(Storage.getItem(storageKey.searchParams));

        if (searchParams) {
            const values = searchParams.filterSearchForm;

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
                    filterSource: values.filterSource
                };
            });

            const newDate = {
                startDate: values.filterDateFrom ? new Date(values.filterDateFrom) : '',
                endDate: values.filterDateTo ? new Date(values.filterDateTo) : ''
            };

            setFilterDate([newDate]);
        }
    };

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

    useEffect(() => {
        loadHistoricData();
    }, []);

    const loadHistoricData = async () => {
        await getUnexpiredData().then((result) => {
            setHistoricData(result.data);
        });
    };

    const [isTimeout, setIsTimeout] = useState(false);

    const loadSearchData = async (page, size, sort, appliedFilters, isRequery) => {
        setLoading(true);

        const searchParams = JSON.parse(Storage.getItem(storageKey.searchParams));

        const values = searchParams.filterSearchForm;
        const newFilters = {
            filterId: '',
            filterText: '',
            filterDateFrom: '',
            filterDateTo: '',
            filterSenders: [],
            filterRecipients: [],
            filterSource: []
        };
        let isPageChange = 0;
        let insidePage = 0;

        newFilters.filterId = appliedFilters.filterId === '' ? values.filterId : appliedFilters.filterId;
        newFilters.filterText = appliedFilters.filterText === '' ? values.filterText : appliedFilters.filterText;
        newFilters.filterSource = appliedFilters.filterSource.length === 0 ? values.filterSource : appliedFilters.filterSource;
        newFilters.filterSenders = appliedFilters.filterSenders.length === 0 ? values.filterSenders : appliedFilters.filterSenders;
        newFilters.filterRecipients = appliedFilters.filterRecipients.length === 0 ? values.filterRecipients : appliedFilters.filterRecipients;
        newFilters.filterDateFrom = appliedFilters.filterDateFrom === '' ? values.filterDateFrom : appliedFilters.filterDateFrom;
        newFilters.filterDateTo = appliedFilters.filterDateTo === '' ? values.filterDateTo : appliedFilters.filterDateTo;

        isPageChange = searchParams.activePage !== page;
        insidePage = isTablePageSelect ? page : searchParams.activePage || 0;

        if (isRequery) {
            insidePage = 0;
        }

        try {
            const openSearchData = await getCommunicationSearchDataOpenSearch(page, size, sort, newFilters);

            const { data, searchIds, totalNoOfRecords, totalPages } = openSearchData;

            // const search = searchParams.data != null && !isRequery
            //     ? !isTablePageSelect
            //         ? searchParams
            //         : await getCommunicationSearchData(insidePage, size, sort, newFilters)
            //     : await getCommunicationSearchData(page, size, sort, newFilters);
            // const { data, searchIds, totalNoOfRecords, totalPages } = search.data;

            // Map data and add the keyword to object as filterKeyword
            data.map(item => {
                item.keyword = newFilters.filterText;
            });

            // history.push('/communication_search_results', filterSearchForm);

            dispatch(setCommunicationSearchData(data, searchIds, totalNoOfRecords, totalPages));
            dispatch(setActivePage(insidePage));

            // setFilterSearchForm({
            //     ...filterSearchForm,
            //     ...newFilters
            // });

            Storage.removeItem(storageKey.searchParams);
            Storage.setItem(storageKey.searchParams, JSON.stringify({
                filterSearchForm: newFilters,
                // data: search.data,
                data: openSearchData,
                activePage: insidePage
            }));
        } catch (e) {
            if (e.status == 500 || e.status == 502 || e.status == 503 || e.status == 504 || e.status == 408 || e.status == 404 || e.status == 400) {
                setIsTimeout(true);

                // reset the table
                const resetData = [];
                const resetSearchIds = [];
                const resetTotalNoOfRecords = 0;
                const resetTotalPages = 0;

                dispatch(setCommunicationSearchData(resetData, resetSearchIds, resetTotalNoOfRecords, resetTotalPages));
            }
        }

        setLoading(false);
    };

    const handleSource = (items) => {
        setFilterSearchForm({
            ...filterSearchForm,
            filterSource: items
        });
    };

    const [senderStore, setSenderStore] = useState([]);
    const [recipientStore, setRecipientStore] = useState([]);

    const handleSenderChange = (updatedList) => {
        const list = [];

        updatedList.map(op => {
            list.push({ label: op.label, value: op.value });
        });

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
        const list = [];

        updatedList.map(op => {
            list.push({ label: op.label, value: op.value });
        });

        setFilterSearchForm({
            ...filterSearchForm,
            filterRecipients: list
        });
        setErrorForm({
            ...errorForm,
            errorRecipients: ''
        });
    };

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

    const handleUniqueID = (e) => {
        const searchId = e.target.value;

        setSearchId(searchId);
        setFilterSearchForm({
            ...filterSearchForm,
            filterId: searchId
        });
    };

    const handleKeyword = (e) => {
        const keyword = e.target.value;

        setKeyword(keyword);
        setFilterSearchForm({
            ...filterSearchForm,
            filterText: keyword
        });
    };

    const handleSearchClick = (event) => {
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

        if (!isValidDateRange(filterSearchForm.filterDateFrom, filterSearchForm.filterDateTo)) {
            formValid = false;
            setViewModal(true);
            console.log('invalid range');
        }

        if (moment(filterSearchForm.filterDateFrom).format('YYYY-MM-DD') === moment(filterSearchForm.filterDateTo).format('YYYY-MM-DD') &&
            moment(filterSearchForm.filterDateFrom).format('HH:mm') > moment(filterSearchForm.filterDateTo).format('HH:mm')) {
            initialError.errorDate = 'Date From Overlaps Date To';
            formValid = false;
        }

        if (formValid) {
            Storage.removeItem(storageKey.searchParams);
            Storage.setItem(storageKey.searchParams, JSON.stringify({
                filterSearchForm: filterSearchForm,
                data: tableResultStore
            }));
            dispatch(setActivePage(0));
            loadSearchData(
                activePage,
                pageSize,
                sort,
                filterSearchForm,
                true
            );
        } else {
            setErrorForm({
                ...errorForm,
                errorDate: initialError.errorDate,
                errorSenders: initialError.errorSenders,
                errorRecipients: initialError.errorRecipients
            });
        }

        event.preventDefault();
    };

    const handleItemClick = (id, chainLinkId, filterText, sender, recipients, timeSent, source, size) => {
        history.push({
            pathname: `/communication_search_message_details/${id}`,
            state: { id: id, chainLinkId: chainLinkId, filterText: filterText, recipients: recipients, timeSent: timeSent, sender: sender, source: source, size: size }
        });
    };

    const handleAppliedFiltersChange = (appliedFilters, sort, dateRange) => {
        const updatedList = [];

        appliedFilters.map(ev => {
            switch (ev.id.toLowerCase()) {
                case 'source':
                    // console.log(ev);
                    break;

                default:
                    break;
            }
        });

        setFilterSearchForm({
            ...filterSearchForm,
            filterDateFrom: dateRange.start,
            filterDateTo: dateRange.end
        });

        loadSearchData(
            activePage,
            pageSize,
            filterSearchForm,
            true
        );
    };

    const loadColumnFilterValues = async () => {
        const emails = await getEmails();

        const { data } = emails.data;
        const emailList = data.map((account) => ({
            value: account.email,
            label: `${account.email} (${account.firstName} ${account.lastName})`
        }));

        const dataCopy = {
            emails: emailList
        };

        dispatch(setColumnFilterValues(dataCopy));
    };

    const handleDownloadSearchData = () => {
        try {
            setDownloading(true);
            downloadCommSearchList(filterSearchForm).then(([response]) => {
                setDownloading(false);

                if (response.status !== 200) {
                    dispatch(setFlashNotification({
                        message: 'Error occured while downloading',
                        isError: true
                    }));
                }
            });
        } catch (error) {
            console.error(error);
        }
        // await downloadCommSearchList(filterSearchForm);
    };

    const getDaysArray = function(start, end) {
        const arr = [];

        for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
        }

        return arr;
    };

    const isValidDateRange = (dateFrom, dateTo) => {
        if (moment(dateFrom) < threeMonths && moment(dateTo) < threeMonths) {
            const dateList = getDaysArray(moment(dateFrom), moment(dateTo));

            console.log(dateList);

            const dataDates = new Array();

            for (let i = 0; i < historicData.length; i++) {
                dataDates.push(historicData[i].dataDate);
            }

            for (let i = 0; i < dateList.length; i++) {
                for (let j = 0; j < dataDates.length; j++) {
                    if (dateList[i] === dataDates[j]) {
                        break;
                    }

                    if (j === dataDates.length - 1) {
                        console.log(dateList[i]);

                        return false;
                    }
                }
            }

            return true;
        }

        return true;
    };

    const redirectToPage = () => {
        history.push({
            pathname: '/historic_ingestion'
        });
    };

    const downloadAllData = async () => {
        await downloadAllHistoricData(filterSearchForm.filterDateFrom, filterSearchForm.filterDateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
    };

    const downloadBloombergData = async () => {
        await downloadBloombergHistoricData(filterSearchForm.dateFrom, filterSearchForm.dateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
    };

    const downloadReutersData = async () => {
        await downloadReutersHistoricData(filterSearchForm.dateFrom, filterSearchForm.dateTo, JSON.parse(Storage.getItem(storageKey.user)).username);
    };

    return <CommunicationSearchResultsScreen
        loading={loading}
        downloading={downloading}
        sidebarMenu={sidebarMenu}
        handleUniqueID={handleUniqueID}
        handleDownloadSearchData={handleDownloadSearchData}
        handleKeyword={handleKeyword}
        defaultSources={filterSearchForm.filterSource}
        breadcrumb={breadcrumb}
        table={table}
        isCheckAll={isCheckAll}
        activePage={activePage}
        handleSource={handleSource}
        loadSearchData={loadSearchData}
        useMediaQuery={useMediaQuery}
        handleCloseModal={handleCloseModal}
        handleItemClick={handleItemClick}
        setSearchId={setSearchId}
        setKeyword={setKeyword}
        filterKeyword={filterSearchForm.filterText}
        filterId={filterSearchForm.filterId}
        handleSearchClick={handleSearchClick}
        loadOptions={loadOptions}
        handleRecipientChange={handleRecipientChange}
        handleSenderChange={handleSenderChange}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        defaultRecipients={filterSearchForm.filterRecipients}
        defaultSender={filterSearchForm.filterSenders}
        errorForm={errorForm}
        isTimeout={isTimeout}
        isValidDateRange={isValidDateRange}
        viewModal={viewModal}
        setViewModal={setViewModal}
        downloadAllHistoricData={downloadAllData}
        downloadBloombergHistoricData={downloadBloombergData}
        downloadReutersHistoricData={downloadReutersData}
        redirectToPage={redirectToPage}/>;
}
