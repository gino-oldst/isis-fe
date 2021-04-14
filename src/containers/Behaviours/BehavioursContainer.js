// @flow
import React from 'react';
import BehavioursScreen from './BehavioursScreen';
import type { Menu } from '../../types';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function BehavioursContainer({
    sidebarMenu
}: Props): React$Element<any> {
    return <BehavioursScreen
        sidebarMenu={sidebarMenu} />;
}
