// @flow
import React from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
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
import './behaviour-detail.scss';

type Props = {
    sidebarMenu: Array<Menu>,
    tableColumns: Array,
    tableData: Array,
    selectedBehaviour: Object
}

function BehaviourDetailScreen({
    sidebarMenu,
    tableColumns,
    tableData,
    selectedBehaviour
}: Props): React$Element<any> {
    return (
        <div className='behaviour-detail'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={['Home', 'Behaviours', selectedBehaviour.identifier]} />
                <div className='behaviour-detail__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='behaviour-detail__header d-flex'>
                                <Typography color='color-3' className='behaviour-detail__title mr-auto'>{selectedBehaviour.behaviour}</Typography>
                                <div className='d-flex mt-2'>
                                    <Typography color='color-3' className='mr-3' variant='size-18'
                                        weight='light'>Active</Typography>
                                    <Toggle
                                        icons={false} />
                                </div>
                            </div>
                            <Typography color='color-3' variant='size-16' className='mb-4'>
                                {selectedBehaviour.identifier}
                            </Typography>
                            <Table className='behaviour-detail__table'
                                tableColumns={tableColumns}>
                                {tableData.map((value, idx1) => {
                                    const dataKeys = Object.keys(value);

                                    return (
                                        <tr key={`tr-${idx1}`}>
                                            {dataKeys.map((key, idx2) => {
                                                return (
                                                    <td key={`td-${idx2}`}>
                                                        {dataKeys[idx2].toLowerCase() === 'parameter' ||
                                                        dataKeys[idx2].toLowerCase() === 'threshold'
                                                            ? <span className='color-sidebar-2 cursor-pointer'>{value[dataKeys[idx2]]}</span>
                                                            : value[dataKeys[idx2]]
                                                        }
                                                    </td>
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

const BehaviourDetail: any = withLoading<React$Element<Props>>(BehaviourDetailScreen);

export default BehaviourDetail;
