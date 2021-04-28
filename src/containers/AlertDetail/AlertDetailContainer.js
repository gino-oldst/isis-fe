// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import AlertDetailScreen from './AlertDetailScreen';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function AlertDetailContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const { selected } = useSelector(({ alerts }) => alerts);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/dashboard'
        },
        {
            label: 'Alerts',
            path: '/alerts'
        },
        {
            label: selected.data.identifier,
            path: `/alert/${selected.data.identifier}`
        }
    ];

    return <AlertDetailScreen
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        selectedAlert={selected.data}/>;
}
