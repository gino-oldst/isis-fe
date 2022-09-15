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
    Alert
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';

import './policies.scss';

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
    viewPoliciesDetails: Function
}

function CommunicationPoliciesScreen({
    loading,
    breadcrumb,
    sidebarMenu,
    table,
    activePage,
    viewPoliciesDetails
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
                                <Typography color='color-3' className='policies__title'>Policies</Typography>
                                <Table className='policies__table'
                                    loading={loading}
                                    tableColumns={table.columns}
                                    tableData={table.data}
                                    tablePagination={table.totalPages}
                                    totalNoOfRecords={table.totalNoOfRecords}
                                    activePage={activePage}
                                    pagination={true}
                                    sortable={false}
                                    fetching={table.loading}/>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CommunicationPolicies: any = withLoading<React$Element<Props>>(CommunicationPoliciesScreen);

export default CommunicationPolicies;
