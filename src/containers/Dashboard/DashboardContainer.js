// @flow
import React from 'react';
import type { Menu } from '../../types';

import DashboardScreen from './DashboardScreen';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function DashboardContainer({
    sidebarMenu
}: Props): React$Element<any> {
    return <DashboardScreen
        sidebarMenu={sidebarMenu}/>;
}
