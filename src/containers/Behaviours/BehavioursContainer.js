// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import BehavioursScreen from './BehavioursScreen';
import type { Menu } from '../../types';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function BehavioursContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const { table } = useSelector(({ behaviours }) => behaviours);

    return <BehavioursScreen
        tableColumns={table.columns}
        tableData={table.data}
        sidebarMenu={sidebarMenu} />;
}
