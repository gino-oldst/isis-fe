// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CommunicationSearchResultsScreen from './CommunicationSearchResultsScreen';
import type { Menu } from '../../types';
import dataSample from '../CommunicationAlerts/MOCK_DATA.json';
import filterSample from '../CommunicationAlerts/filters.json';
import moment from 'moment';

// To be removed once we move to with backend
import { getCommunicationSearchData, getEmails, getEmailsAll } from '../../api/communicationSearch';
import { setCommunicationSearchData, setColumnFilterValues, setSearchFilterValues } from '../../redux/modules/communicationSearch';
import { setActivePage } from '../../redux/modules/isisTable';
import { filter } from 'underscore';
import debounce from 'debounce-async';

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
    const { pageSize, activePage, appliedFilters, areRowsSelectedAll, sort, dateRange } = useSelector(({ isisTable }) => isisTable);
    const { table, selected, searchFilterValue } = useSelector(({ communicationSearch }) => communicationSearch);
    const { emails, profileData } = useSelector(({ authentication }) => authentication);
    const [filterSearchForm, setFilterSearchForm] = useState(filters.state);
    const [searchId, setSearchId] = useState('');
    const [keyword, setKeyword] = useState('');
    const [lastOptions, setLastOptions] = useState([]);
    const [filterDate, setFilterDate] = useState([
        {
            startDate: filterSearchForm.filterDateFrom ? new Date(filterSearchForm.filterDateFrom) : '',
            endDate: filterSearchForm.filterDateTo ? new Date(filterSearchForm.filterDateTo) : ''
        }
    ]);
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

    useEffect(() => {
        loadSearchData(
            activePage,
            pageSize,
            sort,
            filterSearchForm
        );
    }, []);

    useEffect((e) => {
        loadSearchData(
            activePage,
            pageSize,
            sort,
            filterSearchForm
        );
    }, [pageSize, activePage, sort]);

    // useEffect(() => {
    //     handleAppliedFiltersChange(appliedFilters, sort, dateRange);
    // }, [appliedFilters, sort, dateRange]);

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

    const [isTimeout, setIsTimeout] = useState(false);

    const loadSearchData = async (page, size, sort, appliedFilters) => {
        setLoading(true);

        try {
            // await loadColumnFilterValues();

            const search = await getCommunicationSearchData(page, size, sort, appliedFilters);

            const { data, searchIds, totalNoOfRecords, totalPages } = search.data;

            // console.log(data);

            // Map data and add the keyword to object as filterKeyword
            data.map(item => {
                item.keyword = appliedFilters.filterText;
            });

            history.push('/communication_search_results', filterSearchForm);

            dispatch(setCommunicationSearchData(data, searchIds, totalNoOfRecords, totalPages));
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

    const handleSenderChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op.value);
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
        var list = [];

        updatedList.map(op => {
            list.push(op.value);
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

    const [errorForm, setErrorForm] = useState({
        errorDate: '',
        errorSenders: '',
        errorRecipients: ''
    });

    const handleSearchClick = (event) => {
        // const id = event.target.filterId.value;
        // const keyword = event.target.filterText.value;

        // setFilterSearchForm({
        //     ...filterSearchForm,
        //     filterId: searchId,
        //     filterText: keyword
        // });
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
            dispatch(setActivePage(0));
            loadSearchData(
                activePage,
                pageSize,
                sort,
                filterSearchForm
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

    const handleItemClick = (id, chainLinkId, filterText) => {
        history.push({
            pathname: `/communication_search_message_details/${id}`,
            state: { id: id, chainLinkId: chainLinkId, filterText: filterText }
        });
    };

    const handleAppliedFiltersChange = (appliedFilters, sort, dateRange) => {
        var updatedList = [];

        appliedFilters.map(ev => {
            // console.log(ev, sort, dateRange);

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

        // console.log(emails);

        const dataCopy = {
            emails: emailList
        };

        dispatch(setColumnFilterValues(dataCopy));
    };

    return <CommunicationSearchResultsScreen
        loading={loading}
        sidebarMenu={sidebarMenu}
        handleUniqueID={handleUniqueID}
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
        isTimeout={isTimeout}/>;
}
