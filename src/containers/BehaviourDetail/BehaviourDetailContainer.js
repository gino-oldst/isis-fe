// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import BehaviourDetailScreen from './BehaviourDetailScreen';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function
}

export default function BehaviourDetailContainer({
    sidebarMenu,
    handleCloseModal
}: Props): React$Element<any> {
    const { selected } = useSelector(({ behaviours }) => behaviours);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/dashboard'
        },
        {
            label: 'Behaviours',
            path: '/behaviours'
        },
        {
            label: selected.identifier,
            path: `/behaviour/${selected.identifier}`
        }
    ];

    return <BehaviourDetailScreen
        breadcrumb={breadcrumb}
        tableColumns={selected.columns}
        tableData={selected.data}
        selectedBehaviour={selected}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal} />;
}
