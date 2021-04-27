// @flow
import React from 'react';
import moment from 'moment';
import Badge from '../../components/base/Badge/Badge';
import Table from '../../components/base/Table/Table';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import withLoading from '../../components/modules/withLoading/withLoading';
import { getTextColor } from '../../utils/helpers';
import type { Menu } from '../../types';
import {
    Card,
    CardBody
} from 'reactstrap';
import './behaviours.scss';

type Props = {
    sidebarMenu: Array<Menu>,
    tableColumns: Array,
    tableData: Array,
    viewBehaviourDetails: Function
}

function BehavioursScreen({
    sidebarMenu,
    tableColumns,
    tableData,
    viewBehaviourDetails
}: Props): React$Element<any> {
    return (
        <div className='behaviours'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={['Home', 'Behaviours']} />
                <div className='behaviours__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <Typography color='color-3' className='behaviours__title'>Behaviours</Typography>
                            <Table className='behaviours__table'
                                tableColumns={tableColumns}
                                tableData={tableData}
                                pagination={true}
                                viewDetails={viewBehaviourDetails} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Behaviours: any = withLoading<React$Element<Props>>(BehavioursScreen);

export default Behaviours;
