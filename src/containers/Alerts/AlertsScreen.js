// @flow
import React from 'react';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import DatePicker from '../../components/base/DatePicker/DatePicker';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Menu } from '../../types';
import {
    Card,
    CardBody
} from 'reactstrap';
import './alerts.scss';

type Props = {
    sidebarMenu: Array<Menu>,
    tableData: Array,
    tableColumns: Array
}

function AlertsScreen({
    sidebarMenu,
    tableData,
    tableColumns
}: Props): React$Element<any> {
    return (
        <div className='alerts'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={['Home', 'Alerts']} />
                <div className='alerts__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='alerts__header d-flex align-items-center'>
                                <Typography color='color-3' className='alerts__title mr-auto'>Alerts</Typography>
                                <div className='alerts__date-picker d-flex align-items-center justify-content-end mb-4'>
                                    <DatePicker inputVariant='outlined' />
                                    <Typography color='color-3' variant='size-16' className='mx-4'>to</Typography>
                                    <DatePicker inputVariant='outlined' />
                                    <Button label={<>
                                        <FontAwesomeIcon className='mr-3' icon='file-download' size='sm' />
                                        <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                    </>}
                                    className='ml-4 d-flex align-items-center alerts__download-button'
                                    size='lg' />
                                </div>
                            </div>
                            <Table className='alerts__table'
                                tableColumns={tableColumns}
                                tableData={tableData}
                                filterable={true} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Alerts: any = withLoading<React$Element<Props>>(AlertsScreen);

export default Alerts;
