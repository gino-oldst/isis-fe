// @flow
import React, { useState, useEffect } from 'react';
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

    // check if user is logged in
    useEffect(() => {
        loadBehavioursData();
    }, []);

    const loadBehavioursData = async () => {
        setLoading(true);

        try {
            const behaviours = await getBehaviours();

            dispatch(setBehavioursData(behaviours.data.data));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const viewBehaviourDetails = async row => {
        localStorage.setItem('selectedBehaviourCode', row.original.code);
        localStorage.setItem('selectedInternalCode', row.original.internalCode);

        history.push(`/behaviour/${row.original.internalCode}`);
    };

    return <BehavioursScreen
        loading={loading}
        breadcrumb={breadcrumb}
        tableColumns={table.columns}
        tableData={table.data}
        viewBehaviourDetails={viewBehaviourDetails}
        sidebarMenu={sidebarMenu} />;
}
