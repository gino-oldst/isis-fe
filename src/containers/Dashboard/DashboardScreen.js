// @flow
import React from 'react';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import type { Menu } from '../../types';
import './dashboard.scss';

type Props = {
    sidebarMenu: Array<Menu>
}

function DashboardScreen({ sidebarMenu }: Props): React$Element<any> {
    return (
        <div className='dashboard'>
            <CollapsibleSidebar
                menu={sidebarMenu} />

            <div className='p-3 w-100' />
        </div>
    );
}

const Dashboard: any = withLoading<React$Element<Props>>(DashboardScreen);

export default Dashboard;
