// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CommunicationSearchResultsScreen from './CommunicationSearchResultsScreen';
import type { Menu } from '../../types';
import dataSample from '../CommunicationAlerts/MOCK_DATA.json';
import filterSample from '../CommunicationAlerts/filters.json';

// To be removed once we move to with backend
import { getCommunicationSearchData, getEmails, getEmailsAll } from '../../api/communicationSearch';
import { setCommunicationSearchData, setColumnFilterValues, setSearchFilterValues } from '../../redux/modules/communicationSearch';
import { setActivePage } from '../../redux/modules/isisTable';
import { filter } from 'underscore';

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
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [currPage, setCurrPage] = useState(false);
    const { pageSize, activePage, appliedFilters, areRowsSelectedAll, sort } = useSelector(({ isisTable }) => isisTable);
    const { table, selected, dateRange, searchFilterValue } = useSelector(({ communicationSearch }) => communicationSearch);
    const { emails, profileData } = useSelector(({ authentication }) => authentication);

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

    const filters = useLocation();
    const [filterSearchForm, setFilterSearchForm] = useState(filters.state);

    // const [table, setTable] = useState([]);

    const loadSearchData = async (page, size, appliedFilters, sort, pushToHistory) => {
        setLoading(true);

        try {
            await loadColumnFilterValues();

            const search = await getCommunicationSearchData(page, size, sort, appliedFilters);

            const { data, searchIds, totalNoOfRecords, totalPages } = search.data;

            console.log(data);

            // Map data and add the keyword to object as filterKeyword
            data.map(item => {
                item.keyword = appliedFilters.filterText;
            });

            if (pushToHistory) {
                history.push('/communication_search_results', filterSearchForm);
            }

            dispatch(setCommunicationSearchData(data, searchIds, totalNoOfRecords, totalPages));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    useEffect((e) => {
        loadSearchData(
            activePage,
            pageSize,
            filterSearchForm,
            sort,
            true
        );
    }, [pageSize, activePage, filterSearchForm, sort]);

    useEffect(() => {
        handleAppliedFiltersChange(appliedFilters);
    }, [appliedFilters]);

    const [searchId, setSearchId] = useState('');
    const [keyword, setKeyword] = useState('');

    const handleSearchClick = (event) => {
        const id = event.target.filterId.value;
        const keyword = event.target.filterText.value;

        setFilterSearchForm({
            ...filterSearchForm,
            filterId: searchId,
            filterText: keyword
        });
        setSearchId(id);
        setKeyword(keyword);
        dispatch(setActivePage(0));
        event.preventDefault();
        // dispatch(setSearchFilterValues(filterSearchForm));
    };

    const handleAppliedFiltersChange = (appliedFilters) => {
        var updatedList = [];

        appliedFilters.map(ev => {
            switch (ev.id.toLowerCase()) {
                case 'source':
                    console.log(ev);
                    break;

                default:
                    break;
            }
        });

        // switch (appliedFilters.id) {
        //     case value:

        //         break;

        //     default:
        //         break;
        // }
        // appliedFilters.map(ev => {
        //     console.log(ev);
        // });

        // setFilterSearchForm({
        //     ...filterSearchForm,
        //     filterSource: updatedList
        // });
    };

    const loadColumnFilterValues = async () => {
        // const emails = await getEmails();

        // const { data } = emails.data;

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
        // const emailList = data.map((account) => ({
        //     value: account.email,
        //     label: `${account.email} (${account.firstName} ${account.lastName})`
        // }));
        console.log(emails, profileData);

        const dataCopy = {
            emails: emails
        };

        dispatch(setColumnFilterValues(dataCopy));
    };

    const handleItemClick = (id, chainLinkId, filterText) => {
        history.push({
            pathname: `/communication_search_message_details/${id}`,
            state: { id: id, chainLinkId: chainLinkId, filterText: filterText }
        });
        // window.location.href = `/communication_alerts/${row.id}`;
    };

    // const loadSearchData = async (page, size, sort) => {
    //     setLoading(true);

    //     try {
    //         const search = await getCommunicationSearchData(page, size, sort, filters.state);

    //         const { data, totalCurrentElements, totalPages, totalNoOfRecords } = search.data;

    //         const newData = data.map((item) => {
    //             return { ...item, selected: false };
    //         });

    //         setTable(newData);
    //         console.log(newData);
    //     } catch (e) {
    //         console.error(e);
    //     }

    //     setLoading(false);
    // };

    // const handleSelectAll = (e) => {
    //     var updatedList = table;
    //     var isCheckAllTemp = isCheckAll;

    //     isCheckAllTemp = e.target.checked;
    //     setIsCheckAll(isCheckAllTemp);

    //     updatedList.map(row => {
    //         row.selected = e.target.checked;
    //     });
    //     setTable(updatedList);
    // };

    // const handleItemCheck = (e, item) => {
    //     var updatedList = table;
    //     var isCheckAllTemp = isCheckAll;

    //     updatedList.map(row => {
    //         if (row.id == item.id) {
    //             row.selected = e.target.checked;
    //         }

    //         return row;
    //     });
    //     setTable(updatedList);
    //     // Control master checkbox state
    //     const totalItems = table.length;
    //     const totalCheckedItems = updatedList.filter((e) => e.selected).length;

    //     isCheckAllTemp = (totalItems === totalCheckedItems);
    //     setIsCheckAll(isCheckAllTemp);
    //     setTable(updatedList);
    // };

    return <CommunicationSearchResultsScreen
        loading={loading}
        sidebarMenu={sidebarMenu}
        breadcrumb={breadcrumb}
        table={table}
        isCheckAll={isCheckAll}
        activePage={activePage}
        // handleSelectAll={handleSelectAll}
        // handleItemCheck={handleItemCheck}
        loadSearchData={loadSearchData}
        useMediaQuery={useMediaQuery}
        handleCloseModal={handleCloseModal}
        handleItemClick={handleItemClick}
        setSearchId={setSearchId}
        setKeyword={setKeyword}
        filterKeyword={filterSearchForm.filterText}
        filterId={filterSearchForm.filterId}
        handleSearchClick={handleSearchClick}/>;
}
