// @flow
import React from 'react';
import Table from '../../components/base/Table/Table';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import type { Menu } from '../../types';
import {
    Card,
    CardBody
} from 'reactstrap';
import './alerts.scss';

type Props = {
    sidebarMenu: Array<Menu>
}

function AlertsScreen({ sidebarMenu }: Props): React$Element<any> {
    return (
        <div className='alerts'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='alerts__content w-100 overflow-auto'>
                <Breadcrumbs links={['Home', 'Alerts']} />
                <div className='px-4 py-2'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <Typography color='color-3' className='alerts__title'>Alerts</Typography>
                            <Table className='alerts__table' />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Alerts: any = withLoading<React$Element<Props>>(AlertsScreen);

export default Alerts;
