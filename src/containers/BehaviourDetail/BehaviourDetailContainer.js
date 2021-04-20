// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import BehaviourDetailScreen from './BehaviourDetailScreen';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function BehaviourDetailContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const { selected } = useSelector(({ behaviours }) => behaviours);

    return <BehaviourDetailScreen
        tableColumns={selected.columns}
        tableData={selected.data}
        selectedBehaviour={selected}
        sidebarMenu={sidebarMenu} />;
}
