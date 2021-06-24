// @flow
import React, { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        loadRestrictedList();
    }, []);

    const loadRestrictedList = async () => {
        setLoading(true);

        try {
            const restrictedList = await getRestrictedList();

            dispatch(setRestrictedListData(restrictedList.data.data));
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
        tableData={!table.isFiltered ? table.data : table.filtered} />;
}
