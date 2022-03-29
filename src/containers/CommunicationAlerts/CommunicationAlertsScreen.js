// @flow
import React, { useState, useEffect, createRef } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/base/Table/Table';
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

import './communication_alerts.scss';

import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';
import BootstrapTable from '../../components/base/BootstrapTable/BootstrapTable';
import NormalTable from '../../components/base/NormalTable/NormalTable';
import dataSample from './MOCK_DATA.json';
import BaseTable from '../../components/base/BaseTable/BaseTable';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    table: Any,
    activePage: Int,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function,
    viewCommunicationAlertDetails: Function
}

function CommunicationAlertsScreen({
    loading,
    userId,
    breadcrumb,
    table,
    activePage,
    useMediaQuery,
    sidebarMenu,
    handleCloseModal,
    viewCommunicationAlertDetails
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1199px)' });
    const isLaptopScreen = useMediaQuery({ query: '(max-width: 1450px)' });

    const showActionsModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionModal handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showSuccessModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessModal handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const ActionModal = ({
        userId,
        activeModal,
        loadAlerts,
        handleCloseModal
    }) => {
        const dispatch = useDispatch();

        return (
            <div className='action-modal p-4'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseModal}/>
                <Typography variant='size-26' color='color-3'
                    className='mb-4 playfair-font'>
                    Bulk Action
                </Typography>
                <div className='alerts__information mt-5 w-100 mb-4' style={{ height: '200px', overflowX: 'hidden', overflowY: 'auto' }}>
                    <Row>
                        <Col lg={12}>
                            <Table className='alerts__table table-striped'
                                loading={loading}
                                tableColumns={table.columns}
                                tableData={table.data}
                                defaultPageSize={1}
                                tablePagination={table.totalPages}
                                totalNoOfRecords={table.totalNoOfRecords}
                                selectableRows={true}
                                hideHeader={true}
                                activePage={activePage}
                                fetching={table.loading}/>
                        </Col>
                    </Row>
                </div>
                <FormGroup className='mb-3'>
                    <Label for='status'>Select Status</Label>
                    <Select
                        name='status'
                        // value={alert.status === null
                        //     ? {
                        //         label: 'No Change',
                        //         value: null
                        //     }
                        //     : {
                        //         name: alert.status,
                        //         label: <Badge status={alert.status} />,
                        //         value: <Badge status={alert.status}/>
                        //     }}
                        options={[{
                            name: 'OPEN',
                            label: <Badge status='Open' />,
                            value: <Badge status='Open'/>
                        }, {
                            name: 'IN_REVIEW',
                            label: <Badge status='In Review' />,
                            value: <Badge status='In Review'/>
                        }, {
                            name: 'RESOLVED',
                            label: <Badge status='Resolved' />,
                            value: <Badge status='Resolved'/>
                        }, {
                            name: 'ARCHIVED',
                            label: <Badge status='Archived' />,
                            value: <Badge status='Archived'/>
                        }]} />
                    {/* onChange={handleChange} />
                    {alert.resolveReason && <div>Reason: {alert.resolveReason}</div>} */}
                </FormGroup>
                <FormGroup className='mb-5'>
                    <Label for='notes'>Notes</Label>
                    <Input type='textarea' rows={5} name='notes'
                        placeholder='Leave blank if there is no change to apply' value={alert.notes} /> {/* onChange={handleChange} /> */}
                </FormGroup>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                    <Button label='Apply' variant='primary' className='alerts__save-button px-4 py-2'
                        onClick={showSuccessModal}/>
                    {/* <Button label='Apply' isLoading={submit} variant='secondary'
                        className='alerts__save-button px-4 py-2'
                        onClick={handleBulkUpdate} disabled={submit} /> */}
                </div>
            </div>
        );
    };

    const SuccessModal = ({
        userId,
        activeModal,
        loadAlerts,
        handleCloseModal
    }) => {
        const dispatch = useDispatch();

        return (
            <div className='action-modal p-4'>
                <div className='row action-modal__content mt-5 mb-5 d-flex justify-content-center align-items-center'>
                    <Typography variant='size-26' color='color-3'
                        className='playfair-font'>
                        Alert Status Updated
                    </Typography>
                    <Typography variant='size-16' color='color-3'
                        className='mb-4 playfair-font'>
                        You have successfully bulk reviewed the alerts
                    </Typography>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Close' variant='primary' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal}/> {/* onClick={handleClose} disabled={submit} /> */}
                    {/* <Button label='Apply' isLoading={submit} variant='secondary'
                        className='alerts__save-button px-4 py-2'
                        onClick={handleBulkUpdate} disabled={submit} /> */}
                </div>
            </div>
        );
    };

    return (
        <div className='alerts'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='alerts__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='alerts__header d-flex align-items-center justify-content-between'>
                                <Typography color='color-3' className='alerts__title'>Communication Alerts</Typography>
                                <Button weight='light' className='ml-4 mr-4 alerts__bulk-review' label='Bulk Review'
                                    onClick={showActionsModal}/>
                            </div>
                            <div className='alerts__information mt-5'>
                                <Row>
                                    <Col lg={12}>
                                        <Table className='alerts__table table-striped'
                                            loading={loading}
                                            tableColumns={table.columns}
                                            tableData={table.data}
                                            tablePagination={table.totalPages}
                                            totalNoOfRecords={table.totalNoOfRecords}
                                            selectableRows={true}
                                            activePage={activePage}
                                            pagination={true}
                                            sortable={true}
                                            fetching={table.loading}
                                            viewDetails={viewCommunicationAlertDetails}/>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const CommunicationAlerts: any = withLoading<React$Element<Props>>(CommunicationAlertsScreen);

export default CommunicationAlerts;
