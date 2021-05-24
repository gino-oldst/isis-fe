// @flow
import React from 'react';
import Table from '../../components/base/Table/Table';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import withLoading from '../../components/modules/withLoading/withLoading';
import type { Menu } from '../../types';
import {
    Card,
    CardBody,
    Spinner
} from 'reactstrap';
import './behaviours.scss';

type Props = {
    loading: Boolean,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    tableColumns: Array,
    tableData: Array,
    viewBehaviourDetails: Function
}

function BehavioursScreen({
    loading,
    breadcrumb,
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
                <Breadcrumbs links={breadcrumb} />
                <div className='behaviours__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <Typography color='color-3' className='behaviours__title'>Behaviours</Typography>
                            {loading
                                ? <Spinner animation='border' role='status' className='d-flex mx-auto my-5 text-center'>
                                    <span className='sr-only'>Loading...</span>
                                </Spinner>
                                : <Table className='behaviours__table'
                                    tableColumns={tableColumns}
                                    tableData={tableData}
                                    pagination={true}
                                    viewDetails={viewBehaviourDetails} />
                            }
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Behaviours: any = withLoading<React$Element<Props>>(BehavioursScreen);

export default Behaviours;
