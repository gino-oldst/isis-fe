// @flow
import React from 'react';
import moment from 'moment';
import Badge from '../../components/base/Badge/Badge';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import DatePicker from '../../components/base/DatePicker/DatePicker';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTextColor } from '../../utils/helpers';
import type { Menu } from '../../types';
import {
    Card,
    CardBody,
    Spinner
} from 'reactstrap';
import './alerts.scss';

type Props = {
    tableColumns: Array,
    tableData: Array,
    viewAlertDetails: Function,
    sidebarMenu: Array<Menu>
}

function AlertsScreen({
    tableColumns,
    tableData,
    viewAlertDetails,
    sidebarMenu
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
                            {tableColumns === undefined || tableData === undefined
                                ? (
                                    <Spinner />
                                )
                                : (
                                    <Table className='alerts__table'
                                        tableColumns={tableColumns}
                                        tableData={tableData}
                                        filterable={true}
                                        paginated={true}>
                                        {tableData.map((value, idx1) => {
                                            const dataKeys = Object.keys(value);

                                            return (
                                                <tr key={`tr-${idx1}`}>
                                                    {dataKeys.map((key, idx2) => {
                                                        return dataKeys[idx2].toLowerCase() !== 'detail'
                                                            ? (
                                                                <td key={`td-${idx2}`}>
                                                                    {idx2 === 0
                                                                        ? <span className='color-sidebar-2 cursor-pointer' onClick={() => viewAlertDetails(value.detail, value)}>{value[dataKeys[idx2]]}</span>
                                                                        : dataKeys[idx2].toLowerCase() === 'date'
                                                                            ? moment(value[dataKeys[idx2]]).format('L')
                                                                            : dataKeys[idx2].toLowerCase() === 'escalation'
                                                                                ? <span className='font-weight-bold'>{getTextColor(value[dataKeys[idx2]])}</span>
                                                                                : dataKeys[idx2].toLowerCase() === 'status'
                                                                                    ? <Badge status={value[dataKeys[idx2]]} />
                                                                                    : value[dataKeys[idx2]]
                                                                    }
                                                                </td>
                                                            )
                                                            : (
                                                                null
                                                            );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </Table>
                                )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Alerts: any = withLoading<React$Element<Props>>(AlertsScreen);

export default Alerts;
