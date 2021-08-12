// @flow
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestrictedListScreen from './RestrictedListScreen';

import { getRestrictedList } from '../../api/restrictedList';
import { setRestrictedListData } from '../../redux/modules/restrictedList';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function RestrictedListContainer({
    match,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { table } = useSelector(({ restrictedList }) => restrictedList);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/dashboard'
        },
        {
            label: 'Restricted List',
            path: '/restricted_list'
        }
    ];

    const loadRestrictedList = async (page, size, appliedFilters, sort) => {
        setLoading(true);

        try {
            const restrictedList = await getRestrictedList(page, size, appliedFilters, sort);
            const { data, totalNoOfRecords, totalPages } = restrictedList.data;

            dispatch(setRestrictedListData(data, totalNoOfRecords, totalPages));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return <RestrictedListScreen
        loading={loading}
        setLoading={setLoading}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        useMediaQuery={useMediaQuery}
        handleCloseModal={handleCloseModal}
        tableColumns={table.columns}
        tableData={!table.isFiltered ? table.data : table.filtered}
        loadRestrictedList={loadRestrictedList} />;
}
