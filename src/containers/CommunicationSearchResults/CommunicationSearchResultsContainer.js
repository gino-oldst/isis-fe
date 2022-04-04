// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CommunicationSearchResultsScreen from './CommunicationSearchResultsScreen';
import type { Menu } from '../../types';
import dataSample from '../CommunicationAlerts/MOCK_DATA.json';
import filterSample from '../CommunicationAlerts/filters.json';

// To be removed once we move to with backend
import { getCommunicationSearchData } from '../../api/communicationSearch';
import { setCommunicationSearchData, setColumnFilterValues } from '../../redux/modules/communicationSearch';
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

    const { pageSize, activePage, appliedFilters, areRowsSelectedAll, sort } = useSelector(({ isisTable }) => isisTable);
    const { table, selected, dateRange } = useSelector(({ communicationSearch }) => communicationSearch);

    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search',
            path: 'communication_search'
        },
        {
            label: 'Search Results',
            path: 'communication_search_results'
        }
    ];

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

    const filters = useLocation();

    useEffect(() => {
        setFilterSearchForm(filters.state);
    }, [filters]);

    // const [table, setTable] = useState([]);

    const loadSearchData = async (page, size, appliedFilters, sort) => {
        setLoading(true);

        try {
            const search = await getCommunicationSearchData(page, size, sort, appliedFilters);

            await loadColumnFilterValues();

            const { data, alertIds, totalNoOfRecords, totalPages } = search.data;

            console.log(totalNoOfRecords, totalPages, pageSize, activePage);
            dispatch(setCommunicationSearchData(data, alertIds, totalNoOfRecords, totalPages));

            console.log(data);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    useEffect(() => {
        console.log(filterSearchForm);
        loadSearchData(
            activePage,
            pageSize,
            filterSearchForm,
            sort
        );
    }, [pageSize, activePage, filterSearchForm, sort]);

    useEffect(() => {
        // console.log(appliedFilters);
        handleAppliedFiltersChange(appliedFilters);
    }, [appliedFilters]);

    const handleAppliedFiltersChange = (appliedFilters) => {
        var updatedList = [];

        // appliedFilters.map(ev => {
        //     switch (ev.id.toLowerCase()) {
        //         case 'source':

        //             break;

        //         default:
        //             break;
        //     }
        // });

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
        // const { data } = await getColumnFilterValues();

        // console.log(JSON.stringify(data));
        const { data } = filterSample;

        // console.log(JSON.stringify(filterSample));
        // console.log(JSON.stringify(data));
        let dataCopy = data;

        const keys = Object.keys(data);

        keys.forEach(key => {
            dataCopy = {
                ...data,
                [key]: data[key].sort()
            };
        });

        dispatch(setColumnFilterValues(dataCopy));
    };

    const tableIsFiltered = () => {
        return !!appliedFilters.filter(filter => filter.value.length > 0).length;
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

    const handleItemClick = async (row) => {
        history.push({
            pathname: `/communication_search_message_details/${row}`,
            state: { id: row }
        });
        // window.location.href = `/communication_alerts/${row.id}`;
    };

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
        handleItemClick={handleItemClick}/>;
}
