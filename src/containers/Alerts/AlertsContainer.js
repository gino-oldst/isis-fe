// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import AlertsScreen from './AlertsScreen';
import type { Menu } from '../../types';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function AlertsContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const { table } = useSelector(({ alerts }) => alerts);

    return <AlertsScreen
        tableColumns={table.columns}
        tableData={table.data}
        sidebarMenu={sidebarMenu} />;
}
