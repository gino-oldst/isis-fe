// @flow
import React, { useState, useEffect, createRef } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/base/IsisTable/IsisTable';
import Button from '../../components/base/Button/Button';
import Select from '../../components/base/Select/Select';
import Badge from '../../components/base/Badge/Badge';
import DatePicker from '../../components/base/DatePicker/DatePicker';
import ReactDatePicker from 'react-datepicker';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomDropdown from '../../components/base/CustomDropdown/CustomDropdown';
import filterIcon from '../../assets/images/ic_filter.svg';
import type { Menu } from '../../types';
import {
    setDateRangeLocal,
    getDateRangeLocal
} from '../../utils/helpers';
import {
    Row,
    Col,
    Card,
    CardBody,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Alert,
    Form
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';

import './policies-details.scss';

import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading } from '../../redux/modules/policies';
import { useMediaQuery } from 'react-responsive';

type Props = {
    loading: Boolean,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    table: Any,
    activePage: Int,
    viewPoliciesDetails: Function,
    showPolicyCreateModal: Function,
    showPolicyEditModal: Function,
    showPolicyDeleteModal: Function,
    categoryName: String,
    type: String
}

function CommunicationPoliciesDetailScreen({
    loading,
    breadcrumb,
    sidebarMenu,
    table,
    activePage,
    viewPoliciesDetails,
    showPolicyCreateModal,
    showPolicyEditModal,
    showPolicyDeleteModal,
    categoryName,
    type
}: Props): React$Element<any> {
    return (
        <div className='policies'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='policies__content'>
                        <Card className='px-4 py-2'>
                            <CardBody>
                                <div className='alerts__header mb-4'>
                                    <Row className='w-100 mr-0'>
                                        <Col lg={6}>
                                            <Typography color='color-3' className='policies__title pl-0'>Category View</Typography>
                                        </Col>
                                    </Row>
                                    <Row className='w-100 mt-4 mr-0'>
                                        <Col lg={6}>
                                            <div className='mb-3'>
                                                <Typography color='color-2' variant='size-16' className='pl-0'>Category Name</Typography>
                                                <Typography color='color-3' variant='size-26' className='pl-0'>{categoryName}</Typography>
                                            </div>
                                            <div>
                                                <Typography color='color-2' variant='size-16' className='pl-0'>Type</Typography>
                                                <Typography color='color-3' variant='size-26' className='pl-0'>{type}</Typography>
                                            </div>
                                        </Col>
                                        <Col lg={6} className='d-flex align-items-start justify-content-end mb-3 pr-0'>
                                            <Button weight='light' className='mr-2' label='Edit Category'
                                                onClick={showPolicyEditModal}/>
                                        </Col>
                                    </Row>
                                </div>
                                <Table className='policies__table'
                                    loading={loading}
                                    tableColumns={table.columns}
                                    tableData={table.data}
                                    tablePagination={table.totalPages}
                                    totalNoOfRecords={table.totalNoOfRecords}
                                    activePage={activePage}
                                    pagination={true}
                                    sortable={false}
                                    fetching={table.loading}
                                    viewDeleteModal={showPolicyDeleteModal}
                                    viewEditModal={showPolicyEditModal}/>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CommunicationPoliciesDetail: any = withLoading<React$Element<Props>>(CommunicationPoliciesDetailScreen);

export default CommunicationPoliciesDetail;
