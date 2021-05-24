// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkAuthorization } from '../../utils/Auth';
import BehavioursScreen from './BehavioursScreen';
import type { Menu } from '../../types';
import { setBehavioursData, setSelectedBehaviour } from '../../redux/modules/behaviours';
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
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const auth = await checkAuthorization();

        if (!auth) history.push('/login');
        else loadBehavioursData();
    };

    const loadBehavioursData = () => {
        setLoading(true);

        const behaviours = getBehaviours();

        behaviours
            .then(res => {
                dispatch(setBehavioursData(res.data.data));
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const viewBehaviourDetails = async row => {
        await dispatch(setSelectedBehaviour(row.original));

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
