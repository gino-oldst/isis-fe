// @flow
import React from 'react';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import DatePicker from '../../components/base/DatePicker/DatePicker';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Menu } from '../../types';
import {
    Card,
    CardBody
} from 'reactstrap';
import './behaviours.scss';

type Props = {
    sidebarMenu: Array<Menu>,
    tableColumns: Array,
    tableData: Array
}

function BehavioursScreen({
    sidebarMenu,
    tableColumns,
    tableData
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
                                tableData={tableData} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Behaviours: any = withLoading<React$Element<Props>>(BehavioursScreen);

export default Behaviours;
