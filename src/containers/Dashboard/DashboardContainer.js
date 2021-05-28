// @flow
import React, { useState } from 'react';
import type { Menu } from '../../types';
import DashboardScreen from './DashboardScreen';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function DashboardContainer({
    history,
    sidebarMenu
}: Props): React$Element<any> {
    const [selectedDate, handleDateChange] = useState(new Date());

    return <DashboardScreen
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        sidebarMenu={sidebarMenu}/>;
}
