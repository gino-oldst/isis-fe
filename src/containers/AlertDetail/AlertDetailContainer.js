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

    return <AlertDetailScreen
        sidebarMenu={sidebarMenu}
        selectedAlert={selected.data}/>;
}
