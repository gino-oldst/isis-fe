// @flow
import React from 'react';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import Typography from '../../components/base/Typography/Typography';
import withLoading from '../../components/modules/withLoading/withLoading';
import type { Menu } from '../../types';
import './behaviours.scss';

type Props = {
    sidebarMenu: Array<Menu>
}

function BehavioursScreen({ sidebarMenu }: Props): React$Element<any> {
    return (
        <div className='behaviours'>
            <CollapsibleSidebar
                menu={sidebarMenu} />

            <div className='p-3'>
                <Typography variant='size-22'>
                    Behaviours
                </Typography>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique posuere ligula ac facilisis. Ut gravida est nec tincidunt imperdiet. Donec sed venenatis libero. Nam id accumsan lectus. Integer ut lacus dolor. Aliquam consequat risus porta, egestas urna non, posuere nisl. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam laoreet, ante non lacinia sagittis, nibh felis fringilla libero, sit amet fermentum sem nunc non magna. Proin commodo faucibus velit. Praesent volutpat orci in elit blandit, ut molestie nulla venenatis. Sed pharetra aliquam lobortis.
                </Typography>
            </div>
        </div>
    );
}

const Behaviours: any = withLoading<React$Element<Props>>(BehavioursScreen);

export default Behaviours;
