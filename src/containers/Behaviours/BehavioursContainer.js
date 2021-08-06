// @flow
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BehavioursScreen from './BehavioursScreen';
import type { Menu } from '../../types';
import { setBehavioursData } from '../../redux/modules/behaviours';
import { getBehaviours } from '../../api/behaviours';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function BehavioursContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { table } = useSelector(({ behaviours }) => behaviours);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/dashboard'
        },
        {
            label: 'Behaviours',
            path: '/behaviours'
        }
    ];

    const loadBehavioursData = async (activePage, pageSize, sort) => {
        try {
            const behaviours = await getBehaviours(activePage, pageSize, sort);
            const { data, totalNoOfRecords, totalPages } = behaviours.data;

            dispatch(setBehavioursData(data, totalNoOfRecords, totalPages));
        } catch (e) {
            console.error(e);
        }
    };

    const viewBehaviourDetails = async row => {
        localStorage.setItem('selectedBehaviourCode', row.original.code);

        history.push(`/behaviour/${row.original.internalCode}`);
    };

    return <BehavioursScreen
        loading={loading}
        breadcrumb={breadcrumb}
        tableColumns={table.columns}
        tableData={table.data}
        loadBehavioursData={loadBehavioursData}
        viewBehaviourDetails={viewBehaviourDetails}
        sidebarMenu={sidebarMenu} />;
}
