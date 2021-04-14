// @flow
import React from 'react';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import Typography from '../../components/base/Typography/Typography';
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

            <div className='p-3'>
                <Typography variant='size-22'>
                    Dashboard
                </Typography>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique posuere ligula ac facilisis. Ut gravida est nec tincidunt imperdiet. Donec sed venenatis libero. Nam id accumsan lectus. Integer ut lacus dolor. Aliquam consequat risus porta, egestas urna non, posuere nisl. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam laoreet, ante non lacinia sagittis, nibh felis fringilla libero, sit amet fermentum sem nunc non magna. Proin commodo faucibus velit. Praesent volutpat orci in elit blandit, ut molestie nulla venenatis. Sed pharetra aliquam lobortis.
                </Typography>
            </div>
        </div>
    );
}

const Dashboard: any = withLoading<React$Element<Props>>(DashboardScreen);

export default Dashboard;
