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
                                                                ? <span className='color-sidebar-2 cursor-pointer' onClick={() => viewBehaviourDetails(value.detail, value.identifier, value.behaviourName)}>{value[dataKeys[idx2]]}</span>
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
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Behaviours: any = withLoading<React$Element<Props>>(BehavioursScreen);

export default Behaviours;
