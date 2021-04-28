// @flow
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BehavioursScreen from './BehavioursScreen';
import type { Menu } from '../../types';
import { setSelectedBehaviour } from '../../redux/modules/behaviours';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function BehavioursContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const history = useHistory();
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

    const viewBehaviourDetails = async (path, identifier, behaviour) => {
        await dispatch(setSelectedBehaviour(identifier, behaviour));

        history.push(path);
    };

    return <BehavioursScreen
        breadcrumb={breadcrumb}
        tableColumns={table.columns}
        tableData={table.data}
        viewBehaviourDetails={viewBehaviourDetails}
        sidebarMenu={sidebarMenu} />;
}
