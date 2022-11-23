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

import './profiles.scss';

import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading } from '../../redux/modules/profiles';
import { useMediaQuery } from 'react-responsive';
import { ImFileEmpty, ImFolderUpload, ImPlus, ImUpload, ImUpload2, ImUpload3 } from 'react-icons/im';

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
    viewCommunicationPolicyDetails: Function,
    onChange: Function,
    onSubmit: Function
}

function ProfilesScreen({
    loading,
    breadcrumb,
    sidebarMenu,
    table,
    activePage,
    viewPoliciesDetails,
    showPolicyCreateModal,
    showPolicyEditModal,
    showPolicyDeleteModal,
    viewCommunicationPolicyDetails,
    onChange,
    onSubmit
}: Props): React$Element<any> {
    const { form } = useSelector(({ policies }) => policies);

    return (
        <div className='profiles'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='profiles__content'>
                        <Card className='px-4 py-2'>
                            <CardBody>
                                <div className='alerts__header mb-4'>
                                    <Row className='w-100 mr-0'>
                                        <Col lg={6} md={6} sm={6}
                                            xs={6}>
                                            <Typography color='color-3' className='profiles__title pl-0'>Profiles</Typography>
                                        </Col>
                                    </Row>
                                    <Row className='w-100 mr-0'>
                                        <Col lg={6} md={6} sm={6}
                                            xs={6}>
                                            <Form>
                                                <Label>Search Profiles</Label>
                                                <FormGroup className='mb-3'>
                                                    <div className='d-flex'>
                                                        <Input name='filterId'
                                                            type='text'
                                                            onChange={onChange}
                                                            className='shadow-none isis-control'
                                                            placeholder='Search...'/>
                                                        <Button weight='light' type='button' className='alerts__bulk-review ml-2'
                                                            label='Search' onClick={onSubmit}/>
                                                    </div>
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                        <Col lg={6} md={6} sm={6}
                                            xs={6} className='d-flex align-items-end justify-content-end mb-3 pr-0'>
                                            <Button weight='light' className='alerts__bulk-review mr-2' label='Upload CSV'
                                                disabled={true} iconLeft={ImUpload2}/>
                                            <Button weight='light' className='alerts__bulk-review mr-2' label='New Profile'
                                                iconLeft={ImPlus}
                                                onClick={showPolicyCreateModal}/>
                                        </Col>
                                    </Row>
                                </div>
                                <Table className='profiles__table'
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
                                    viewEditModal={showPolicyEditModal}
                                    viewDetails={viewCommunicationPolicyDetails}/>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CommunicationPolicies: any = withLoading<React$Element<Props>>(ProfilesScreen);

export default CommunicationPolicies;
