// @flow
import React from 'react';
import AlertsScreen from './AlertsScreen';
import type { Menu } from '../../types';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function AlertsContainer({
    sidebarMenu
}: Props): React$Element<any> {
    return <AlertsScreen
        sidebarMenu={sidebarMenu} />;
}
