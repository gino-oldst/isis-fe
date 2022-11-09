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
    getDateRangeLocal,
    isoToUTCLocal,
    truncateText,
    isDisclaimer,
    sourceMaker,
    isDebug,
    isMessageEvent
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
    Spinner,
    Form
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';

import './communication_alerts_detail.scss';
import { MESSAGE_TYPE } from '../../config/constants';
import { FaInfoCircle } from 'react-icons/fa';
import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';
import Highlighter from 'react-highlight-words';
import { Nav, OverlayTrigger, Popover, PopoverContent, Tab } from 'react-bootstrap';
import { Element, Link, scroller, Button as ScrollButton } from 'react-scroll';
import logo from '../../assets/logos/mariana_logo_sml.png';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';

type Props = {
    loading: Boolean,
    userId: String,
    appUser: Any,
    breadcrumb: Array,
    table: Any,
    activePage: Int,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    detailData: Array,
    dataId: Any,
    handleCloseModal: Function,
    onSubmit: Function,
    onSubmitSingle: Function,
    submit: Boolean,
    isChecked:Boolean,
    filterText: Array,
    messages: Array,
    handleGenerate: Function,
    handleSelectAll: Function,
    nextAlertData: Function,
    prevAlertData: Function,
    recipients: Array,
    alertsData: Array,
    alertList: Array,
    alertLoading: Boolean,
    onSubmitStatusChangeSingleWithReview: Function,
    activities: Array,
    activityLoading: Boolean,
    onSubmitComment: Function,
    predefinedReasons: Array,
    onSubmitEscalationChangeSingle: Function,
    onSubmitAssignUserSingle: Function
}

function CommunicationAlertsDetailScreen({
    loading,
    userId,
    appUser,
    table,
    activePage,
    breadcrumb,
    useMediaQuery,
    sidebarMenu,
    detailData,
    dataId,
    handleCloseModal,
    onSubmit,
    onSubmitSingle,
    submit,
    filterText,
    isChecked,
    messages,
    handleGenerate,
    handleSelectAll,
    nextAlertData,
    prevAlertData,
    recipients,
    alertsData,
    alertsList,
    alertLoading,
    onSubmitStatusChangeSingleWithReview,
    activities,
    activityLoading,
    onSubmitComment,
    predefinedReasons,
    onSubmitEscalationChangeSingle,
    onSubmitAssignUserSingle
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1199px)' });
    const isLaptopScreen = useMediaQuery({ query: '(max-width: 1450px)' });

    const renderAlertInfo = (text) => (
        <Popover id='popover-basic'>
            <PopoverContent>
                <Typography color='color-3' className='mr-auto' weight='bold'
                    style={{ fontSize: '14px', lineHeight: '20pt' }}>Reason for resolution</Typography>
                <Typography color='color-3' className='mr-auto' weight='regular'
                    style={{ fontSize: '14px' }} >{text}</Typography>
            </PopoverContent>
        </Popover>
    );

    const messageActivities = activities.filter(row => row.target === 'COMMUNICATION_MESSAGE');

    const alertActivities = activities.filter(row => row.target === 'ALERT');

    const showActionsUpdateModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionUpdateModal handleCloseModal={handleCloseModal}
                predefinedReasons={predefinedReasons}/>,
            size: 'lg'
        }));
    };

    const showSuccessUpdateModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessUpdateModal handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const showResolvedUpdateModal = (status, selectedAlert) => {
        dispatch(setModalContent({
            modalContent: <ResolvedUpdateModal status={status} selectedAlert={selectedAlert} handleCloseModal={handleCloseModal}
                predefinedReasons={predefinedReasons}/>,
            size: 'lg'
        }));
    };

    const handleDetailStatusChange = (e, selectedAlert) => {
        if (e.value == 'RESOLVED') {
            showResolvedUpdateModal(e.value, selectedAlert);
        } else {
            onSubmitSingle(e.value, '', selectedAlert);
        }
    };

    const handleDetailEscalationChange = (e, selectedAlert) => {
        onSubmitEscalationChangeSingle(e.value, '', selectedAlert);
    };

    const handleAppUserChange = (e, selectedAlert) => {
        onSubmitAssignUserSingle(e.value, selectedAlert);
    };

    const showActionsModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionModal handleCloseModal={handleCloseModal} />,
            size: 'xl'
        }));
    };

    const showSuccessModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessModal handleCloseModal={handleCloseModal} />,
            size: 'md'
        }));
    };

    useEffect(() => {
        // scroll to active message
        scroller.scrollTo(`${dataId}`, {
            duration: 500,
            smooth: true,
            containerId: 'containerElement'
            // offset: 50 // Scrolls to element + 50 pixels down the page
        });
    }, [loading]);

    const ActionModal = ({
        userId,
        activeModal,
        loadAlerts,
        handleCloseModal,
        predefinedReasons
    }) => {
        const dispatch = useDispatch();

        return (
            <div className='action-modal p-5'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseModal} />
                <Typography color='color-3' className='mr-auto' weight='regular'
                    style={{ fontSize: '16px', lineHeight: '24pt' }}>{detailData.source != null ? detailData.source : 'No Source'} {/* Email */}</Typography>
                <div className='d-flex flex-column'>
                    {/* <FormGroup check={true} className='mb-1'>
                            <Label check={true} className='d-flex align-items-center'>
                                <AllCheckerCheckbox/>
                                <span className='box-label'>(Select All)</span>
                            </Label>
                        </FormGroup> */}
                    <CheckboxGroup
                        onChange = {handleSelectAll} defaultChecked={isChecked}>
                        <FormGroup check={true} className='mb-1'>
                            <Label check={true} className='d-flex align-items-center'>
                                <AllCheckerCheckbox/>
                                <h4 className='box-label'>(Select All)</h4>
                            </Label>
                        </FormGroup>
                        <div id='containerElement' className='alerts-detail__message-thread pr-5 pt-1 pb-5 mb-4 mt-4'>
                            <div>
                                {messages.map(message => {
                                    return (!isDisclaimer(message.message)
                                        ? <>
                                            <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                {message.showSender &&
                                                    <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                        style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography>}
                                                {/* <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                    style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography> */}
                                                <div>
                                                    <Checkbox class='select-option' value = {message.id} style={{ position: 'relative', bottom: '-40px' }}/>
                                                    <div className='message-box' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                        <Highlighter highlightClassName='alertKeyword'
                                                            style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                            searchWords={filterText}
                                                            autoEscape={true}
                                                            textToHighlight={message.message}/>
                                                        {isDebug()
                                                            ? <Typography color='color-1' className='mr-3 text-right messageID' weight='regular'
                                                                style={{ backgroundColor: '121212', fontSize: '11px', lineHeight: '24pt' }}>ID: {message.id} </Typography>
                                                            : ''}
                                                    </div>
                                                </div>
                                            </Element>
                                        </>
                                        : <>
                                            <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                {message.showSender &&
                                                    <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                        style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography>}
                                                {/* <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                    style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography> */}
                                                <div className='message-box' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                    <Highlighter highlightClassName='alertKeyword'
                                                        style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                        searchWords={[]}
                                                        autoEscape={true}
                                                        textToHighlight={message.message}/>
                                                    {isDebug()
                                                        ? <Typography color='color-1' className='mr-3 text-right messageID' weight='regular'
                                                            style={{ backgroundColor: '121212', fontSize: '11px', lineHeight: '24pt' }}> ID: {message.id} </Typography>
                                                        : ''}
                                                </div>
                                            </Element>
                                        </>);
                                })}
                            </div>
                        </div>
                    </CheckboxGroup>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal} />
                    <Button label='Generate' variant='primary' className='alerts-detail__save-button px-4 py-2'
                        onClick={handleGenerate} />
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
                      Download Alert Message Thread Successfully
                    </Typography>
                    <Typography variant='size-16' color='color-3'
                        className='mb-4 playfair-font'>
                        You have successfully Download Alert Message Thread
                    </Typography>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Close' variant='primary' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal}/> {/* onClick={handleClose} disabled={submit} /> */}
                </div>
            </div>
        );
    };

    const ActionUpdateModal = ({
        userId,
        activeModal,
        loadAlerts,
        handleCloseModal
    }) => {
        const dispatch = useDispatch();
        const [selectedStatus, setSelectedStatus] = useState('');
        const [resolvedNote, setResolvedNote] = useState('');

        const [selectedReason, setSelectedReason] = useState('');
        const [currentNotes, setCurrentNotes] = useState(null);

        const handleAddPredefinedReason = () => {
            const reason = currentNotes ? currentNotes + '\n' + selectedReason : selectedReason;

            if (selectedReason != '') {
                handleChangeReason(reason);
            }
        };

        const handleChangeReason = (value) => {
            setCurrentNotes(value);
            setResolvedNote(value);
        };

        return (
            <div className='action-modal p-5'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseModal}/>
                <Typography variant='size-30' color='color-3'
                    className='mb-4 playfair-font text-center'>
                    Update all Status
                </Typography>
                <div className='alerts-detail__information mt-5 w-100 mb-4'>
                    <Row className='modal-body'>
                        <Col lg={6}>
                            <table className='table'>
                                {alertsData
                                    ? <>
                                        <thead>
                                            <tr>
                                                <th className='pb-2' style={{ borderTop: '0px !important' }}>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Alert</Typography>
                                                </th>
                                                <th className='pb-2' style={{ borderTop: '0px !important' }}>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Trigered Text</Typography>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alertsData.map(alert => {
                                                return (<>
                                                    <tr>
                                                        <td className='pb-2'>
                                                            <Typography color='color-3'>{alert.policyName}</Typography>
                                                        </td>
                                                        <td className='pb-2'>
                                                            <Typography color='color-3'>{alert.keyword}</Typography>
                                                        </td>
                                                    </tr>
                                                </>);
                                            })}
                                        </tbody>
                                    </>
                                    : <>
                                        <thead>
                                            <tr>
                                                <th className='pb-2 text-center'>
                                                    <Typography size={18} color='color-1' className='mr-3'
                                                        weight='semi-bold'>No Alerts</Typography>
                                                </th>
                                            </tr>
                                        </thead>
                                    </>
                                }
                            </table>
                        </Col>
                        <Col>
                            <FormGroup className='mb-3 mt-2'>
                                <Select
                                    name='status'
                                    isSearchable={false}
                                    onChange={selected => setSelectedStatus(selected.value)}
                                    options={[{
                                        name: 'OPEN',
                                        label: <Badge status='Open' />,
                                        value: 'OPEN'
                                    }, {
                                        name: 'IN_REVIEW',
                                        label: <Badge status='In Review' />,
                                        value: 'IN_REVIEW'
                                    }, {
                                        name: 'RESOLVED',
                                        label: <Badge status='Resolved' />,
                                        value: 'RESOLVED'
                                    }, {
                                        name: 'ARCHIVED',
                                        label: <Badge status='Archived' />,
                                        value: 'ARCHIVED'
                                    }]} />
                            </FormGroup>
                            {selectedStatus == 'RESOLVED' &&
                                <div>
                                    <FormGroup className='mb-2'>
                                        <Label for='predefinedReasonSelect'>Predefined Reasons</Label>
                                        <Input type='select' name='select' id='predefinedReasonSelect'
                                            onChange={(e) => setSelectedReason(e.target.value)}>
                                            <option disabled={true} value='' selected={true}>
                                                Select a predefined reason (optional)
                                            </option>
                                            {
                                                predefinedReasons.map(reason => {
                                                    return (<option value={reason.value}>{reason.value}</option>);
                                                })
                                            }
                                        </Input>
                                    </FormGroup>
                                    <div className='action-modal__buttons d-flex justify-content-center align-items-center m-2'>
                                        <Button label='Add' variant='primary' className='predefined-reason__add-button px-4 py-2'
                                            onClick={e => handleAddPredefinedReason()}/>
                                    </div>
                                    <FormGroup className='mb-5'>
                                        <Label for='notes'>Reasons for resolving</Label>
                                        <Input type='textarea' rows={5} name='notes'
                                            placeholder='Leave blank if there is no change to apply' defaultValue={currentNotes}
                                            value={currentNotes} onChange={e => handleChangeReason(e.target.value)} />
                                    </FormGroup>
                                </div>
                            }
                        </Col>
                    </Row>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                    <Button label='Apply' variant='primary' className='alerts-detail__save-button px-4 py-2'
                        onClick={e => onSubmit(selectedStatus, resolvedNote, alertsData)}/>
                    {/* <Button label='Apply' isLoading={submit} variant='secondary'
                        className='alerts-detail__save-button px-4 py-2'
                        onClick={handleBulkUpdate} disabled={submit} /> */}
                </div>
            </div>
        );
    };

    const SuccessUpdateModal = ({
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
                        You have successfully updated the alerts
                    </Typography>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Close' variant='primary' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal}/> {/* onClick={handleClose} disabled={submit} /> */}
                </div>
            </div>
        );
    };

    const ResolvedUpdateModal = ({
        userId,
        activeModal,
        status,
        selectedAlert,
        handleCloseModal,
        predefinedReasons
    }) => {
        const dispatch = useDispatch();
        const [resolvedNote, setResolvedNote] = useState('');
        const [selectedReason, setSelectedReason] = useState('');
        const [currentNotes, setCurrentNotes] = useState(selectedAlert.notes);

        const handleAddPredefinedReason = () => {
            const reason = currentNotes ? currentNotes + '\n' + selectedReason : selectedReason;

            if (selectedReason != '') {
                handleChangeReason(reason);
            }
        };

        const handleChangeReason = (value) => {
            setCurrentNotes(value);
            setResolvedNote(value);
        };

        return (
            <div className='action-modal p-5'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseModal}/>
                <Typography variant='size-30' color='color-3'
                    className='mb-4 playfair-font text-center'>
                    Reasons for resolving
                </Typography>
                <div className='alerts-detail__information mt-5 w-100 m2-4'>
                    <Row>
                        <Col>
                            <FormGroup className='mb-2'>
                                <Label for='predefinedReasonSelect'>Predefined Reasons</Label>
                                <Input type='select' name='select' id='predefinedReasonSelect'
                                    onChange={(e) => setSelectedReason(e.target.value)}>
                                    <option disabled={true} value='' selected={true}>
                                        Select a predefined reason (optional)
                                    </option>
                                    {
                                        predefinedReasons.map(reason => {
                                            return (<option value={reason.value}>{reason.value}</option>);
                                        })
                                    }
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className='action-modal__buttons d-flex justify-content-center align-items-center m-2'>
                        <Button label='Add' variant='primary' className='predefined-reason__add-button px-4 py-2'
                            onClick={e => handleAddPredefinedReason()}/>
                    </div>
                    <Row>
                        <Col>
                            <FormGroup className='mb-2'>
                                <Input type='textarea' rows={5} name='notes'
                                    placeholder='Leave blank if there is no change to apply' defaultValue={currentNotes}
                                    value={currentNotes}
                                    onChange={e => handleChangeReason(e.target.value)} />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                    <Button label='Apply' variant='primary' className='alerts-detail__save-button px-4 py-2'
                        onClick={e => onSubmitStatusChangeSingleWithReview(status, resolvedNote, selectedAlert)}/>
                    {/* <Button label='Apply' isLoading={submit} variant='secondary'
                        className='alerts-detail__save-button px-4 py-2'
                        onClick={handleBulkUpdate} disabled={submit} /> */}
                </div>
            </div>
        );
    };

    return (
        <div className='alerts-detail'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='alerts-detail__content'>
                        <Card className='px-5 py-4'>
                            <CardBody>
                                <div className='alerts-detail__header d-flex align-items-center'>
                                    <Typography color='color-3' className='alerts-detail__detail-heading mr-auto'
                                        weight='regular' style={{ fontSize: '40px !important', lineHeight: '24pt' }}>{dataId != '' ? dataId : 'N/A'}</Typography>
                                </div>
                                <div className='alerts-detail__information mt-2'>
                                    <Row>
                                        <Col>
                                            <Typography color='color-3' className='alerts-detail__title mb-0 mr-auto' weight='regular'
                                                style={{ fontSize: '32px', lineHeight: '24pt' }} >{detailData.subject != null ? detailData.subject : detailData.subject} {/* RE: Trading Message */}</Typography>
                                            <Typography color='color-3' className='mr-auto' weight='bold'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }}>{detailData.source != null ? sourceMaker(detailData.source) : 'No Source'} {/* Email */}</Typography>
                                            <Link className='btn btn-outline-primary ok-button px-2 mr-2 py-2' onClick={prevAlertData} smooth={true}
                                                disabled={loading} containerId='containerElement' duration={500}>
                                                Prev
                                            </Link>
                                            <Link className='btn btn-outline-primary ok-button px-2 mr-2 py-2' onClick={nextAlertData} smooth={true}
                                                disabled={loading} containerId='containerElement' duration={500}>
                                                Next
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row className='mt-5'>
                                        <Col lg={7} className='mb-4'>
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                                    style={{ fontSize: '24px', lineHeight: '24pt' }}>Alert</Typography>
                                                <Button weight='light' disabled={loading} className='ml-4 mr-4 alerts-detail__bulk-review'
                                                    disabled={loading} onClick={showActionsUpdateModal} label='Update all Status'/>
                                            </div>
                                            {alertLoading || loading
                                                ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                    <span className='sr-only'>Loading...</span>
                                                </Spinner>
                                                : <>
                                                    <table className='table'>
                                                        {alertsData.length > 0
                                                            ? <>
                                                                <thead>
                                                                    <tr>
                                                                        <th className='pb-2'>
                                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Alert</Typography>
                                                                        </th>
                                                                        <th className='pb-2'>
                                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Trigered Text</Typography>
                                                                        </th>
                                                                        <th className='pb-2'>
                                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Status</Typography>
                                                                        </th>
                                                                        <th className='pb-2'>
                                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Escalation</Typography>
                                                                        </th>
                                                                        <th className='pb-2'>
                                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Assign To</Typography>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {alertsData.map(alert => {
                                                                        return (<>
                                                                            <tr>
                                                                                <td className='pb-2'>
                                                                                    <Typography color='color-3'>{alert.policyName}</Typography>
                                                                                </td>
                                                                                <td className='pb-2'>
                                                                                    <Typography color='color-3'>{alert.keyword}</Typography>
                                                                                </td>
                                                                                <td style={{ width: '250px' }}>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <Select
                                                                                            name='status'
                                                                                            className='w-100 pr-2'
                                                                                            isDisabled={false}
                                                                                            isSearchable={false}
                                                                                            onChange={e => handleDetailStatusChange(e, alert)}
                                                                                            defaultValue={{
                                                                                                label: <Badge status={alert.status} />,
                                                                                                value: alert.status
                                                                                            }}
                                                                                            options={[{
                                                                                                name: 'OPEN',
                                                                                                label: <Badge status='Open' />,
                                                                                                value: 'OPEN'
                                                                                            }, {
                                                                                                name: 'IN_REVIEW',
                                                                                                label: <Badge status='In Review' />,
                                                                                                value: 'IN_REVIEW'
                                                                                            }, {
                                                                                                name: 'RESOLVED',
                                                                                                label: <Badge status='Resolved' />,
                                                                                                value: 'RESOLVED'
                                                                                            }, {
                                                                                                name: 'ARCHIVED',
                                                                                                label: <Badge status='Archived' />,
                                                                                                value: 'ARCHIVED'
                                                                                            }]} />
                                                                                        {alert.status == 'RESOLVED' &&
                                                                                            <div>
                                                                                                <OverlayTrigger style={{ cursor: 'pointer' }} placement='bottom-start' overlay={renderAlertInfo(alert.notes)}>
                                                                                                    <FaInfoCircle style={{ color: '#004C98', cursor: 'pointer' }} size={24}/>
                                                                                                </OverlayTrigger>
                                                                                            </div>
                                                                                        }
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ width: '250px' }}>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <Select
                                                                                            name='escalation'
                                                                                            className='w-100 pr-2'
                                                                                            isDisabled={false}
                                                                                            isSearchable={false}
                                                                                            onChange={e => handleDetailEscalationChange(e, alert)}
                                                                                            defaultValue={{
                                                                                                label: <Badge status={alert.escalation ? alert.escalation : 'Base'} />,
                                                                                                value: alert.escalation ? alert.escalation : 'BASE'
                                                                                            }}
                                                                                            options={[{
                                                                                                name: 'BASE',
                                                                                                label: <Badge status='Base' />,
                                                                                                value: 'BASE'
                                                                                            }, {
                                                                                                name: 'MANAGER',
                                                                                                label: <Badge status='Manager' />,
                                                                                                value: 'MANAGER'
                                                                                            }, {
                                                                                                name: 'CO',
                                                                                                label: <Badge status='CO' />,
                                                                                                value: 'CO'
                                                                                            }]} />
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ width: '250px' }}>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <Select
                                                                                            name='assign-user'
                                                                                            className='w-100 pr-2'
                                                                                            onChange={e => handleAppUserChange(e, alert)}
                                                                                            defaultValue={{
                                                                                                label: alert.assignedUserId
                                                                                                    ? Object.values(appUser).find(e => e.value === alert.assignedUserId).label
                                                                                                    : 'Select...',
                                                                                                value: alert.assignedUserId ? alert.assignedUserId : ''
                                                                                            }}
                                                                                            options={appUser} />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </>);
                                                                    })}
                                                                </tbody>
                                                            </>
                                                            : <>
                                                                <thead>
                                                                    <tr>
                                                                        <th className='pb-2 text-center'>
                                                                            <Typography size={18} color='color-1' className='mr-3'
                                                                                weight='semi-bold'>No Alerts</Typography>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                            </>
                                                        }
                                                    </table>
                                                </>
                                            }
                                        </Col>
                                        <Col className='offset-lg-1 mb-4 mt-4' lg={4} md={12}>
                                            <div style={{ border: '2px solid #D0D0D0', height: '100%', padding: '30px' }}>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Date & Time: </b>{ detailData.timeSent != null ? isoToUTCLocal(detailData.timeSent) : 'N/A' }</Typography>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Sender: </b>{ detailData.sender != null ? detailData.sender : 'N/A' }</Typography>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} >
                                                    <b>Recipient: </b>
                                                    {loading || recipients === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : recipients != null
                                                            ? recipients
                                                            : 'N/A'
                                                    }
                                                </Typography>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={7} className='mb-2'>
                                            <Row>
                                                <Col>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                        style={{ fontSize: '24px', lineHeight: '24pt' }}>Message</Typography>
                                                    <Typography color='color-3' className='mr-3 mb-4' weight='regular'
                                                        style={{ fontSize: '16px', lineHeight: '24pt' }}>Reported message is highlighted.</Typography>
                                                </Col>
                                                <Col className='text-left'>
                                                    <Link className='btn btn-outline-primary ok-button px-2 mr-2 py-2' to={dataId} smooth={true}
                                                        disabled={loading} containerId='containerElement' duration={500}>
                                                        Show Message
                                                    </Link>
                                                    <Link className='btn btn-outline-primary ok-button px-2 mr-2 py-2' onClick={showActionsModal} smooth={true}
                                                        disabled={loading} containerId='containerElement' duration={500}>
                                                        Download Page
                                                    </Link>
                                                </Col>
                                            </Row>
                                            <div className='d-flex flex-column' style={{ minWidth: '600px' }}>
                                                {/* <div className='alerts-detail__message-thread pr-5 pt-1 pb-5 mb-4 mt-4'>
                                                    <div>
                                                        {messages.map(message => {
                                                            return (<>
                                                                <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                    style={{ fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography>
                                                                <div className='message-box mb-4' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                                    <Highlighter highlightClassName='alertKeyword'
                                                                        style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                        searchWords={filterText}
                                                                        autoEscape={true}
                                                                        textToHighlight={message.message}/>
                                                                </div></>);
                                                        })}
                                                    </div>
                                                </div> */}
                                                {loading
                                                    ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                        <span className='sr-only'>Loading...</span>
                                                    </Spinner>
                                                    : <>
                                                        <div id='containerElement' className='alerts-detail__message-thread pr-5 pt-1 pb-5 mb-4 mt-4'>
                                                            <div>
                                                                {messages.map(message => {
                                                                    return (!isDisclaimer(message.message)
                                                                        ? <>
                                                                            <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                                                {isMessageEvent(message.message) || message.type === MESSAGE_TYPE.JOIN || message.type === MESSAGE_TYPE.LEAVE
                                                                                    ? <div className='message-box-event'>
                                                                                        <Typography color='color-2' className='mr-3 text-center' weight='regular'
                                                                                            style={{ backgroundColor: '121212', fontSize: '14px', lineHeight: '24pt' }}>{isoToUTCLocal(message.timeSent)} {message.type != null || message.source.toLowerCase() == 'bloomberg_chat' && `*** ${message.sender}` } {message.message} </Typography>
                                                                                    </div>
                                                                                    : <>
                                                                                        {/* <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                            style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography> */}
                                                                                        {message.showSender &&
                                                                                            <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                                style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> <span> {isoToUTCLocal(message.timeSent)}</span></Typography>}
                                                                                        <div className='message-box'>
                                                                                            <Highlighter highlightClassName='alertKeyword'
                                                                                                style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                                                searchWords={filterText}
                                                                                                autoEscape={true}
                                                                                                textToHighlight={message.message}/>
                                                                                            {isDebug()
                                                                                                ? <Typography color='color-1' className='mr-3 text-right messageID' weight='regular'
                                                                                                    style={{ backgroundColor: '121212', fontSize: '11px', lineHeight: '24pt' }}>ID: {message.id} </Typography>
                                                                                                : ''}
                                                                                        </div>
                                                                                    </>
                                                                                }
                                                                            </Element>
                                                                        </>
                                                                        : <>
                                                                            <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                                                {/* {message.showSender &&
                                                                                    <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                        style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b>{message.showSender} {isoToUTCLocal(message.timeSent)}</Typography>} */}
                                                                                {isMessageEvent(message.message) || message.type === MESSAGE_TYPE.JOIN || message.type === MESSAGE_TYPE.LEAVE
                                                                                    ? <div className='message-box-event'>
                                                                                        <Typography color='color-1' className='mr-3 text-center' weight='regular'
                                                                                            style={{ backgroundColor: '121212', fontSize: '14px', lineHeight: '24pt' }}>{isoToUTCLocal(message.timeSent)} {message.type != null || !message.source.toLowerCase() == 'bloomberg_chat' && `*** ${message.sender}` } {message.message} </Typography>
                                                                                    </div>
                                                                                    : <>
                                                                                        {/* <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                            style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography> */}
                                                                                        {message.showSender &&
                                                                                            <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                                style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography>}
                                                                                        <div className='message-box'>
                                                                                            <Highlighter highlightClassName='alertKeyword'
                                                                                                style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                                                searchWords={[]}
                                                                                                autoEscape={true}
                                                                                                textToHighlight={message.message}/>
                                                                                            {isDebug()
                                                                                                ? <Typography color='color-1' className='mr-3 text-right messageID' weight='regular'
                                                                                                    style={{ backgroundColor: '121212', fontSize: '11px', lineHeight: '24pt' }}> ID: {message.id} </Typography>
                                                                                                : ''}
                                                                                        </div>
                                                                                    </>
                                                                                }
                                                                            </Element>
                                                                        </>);
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                                {/* <Button label='Load previous 5 message' variant='outline-primary' className='ok-button px-4 mr-2 py-2' /> */}
                                                {/* <div className='alert__message-thread mb-4 mt-4'>
                                                    <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                        style={{ fontSize: '16px', lineHeight: '24pt' }}><b>Daniel Caplin</b> 17/12/21, 8:02 AM</Typography>
                                                    {[1, 2, 3, 4, 5].map(item => {
                                                        return (<div className='message-box mb-4' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                            <Highlighter highlightClassName='alertKeyword'
                                                                style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                searchWords={['flame']}
                                                                autoEscape={true}
                                                                textToHighlight='This stock is going up in flames.'/>
                                                        </div>);
                                                    })}
                                                </div> */}
                                                {/* <Button label='Load next 5 message' variant='outline-primary' className='ok-button px-4 mr-2 py-2' /> */}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4} className='mt-5 mb-4'>
                                            <Form onSubmit={onSubmitComment}>
                                                <fieldset disabled={loading}>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                        style={{ fontSize: '24px', lineHeight: '32pt' }}>Comment</Typography>
                                                    <Input type='textarea' name='alertComment' id='alertComment'
                                                        className='mb-2' disabled={loading} rows={4}
                                                        placeholder='Comment here...' name='user_comment'/>
                                                    <Button label='Add Comment' type='submit' disabled={loading}
                                                        variant='primary' className='ok-button px-4 mt-3 mr-2 py-2' />
                                                </fieldset>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} className='mt-5 mb-5 pt-30'>
                                            <Tab.Container id='left-tabs-example' defaultActiveKey='link-0'>
                                                <div className='alert-detail__activities'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                        style={{ fontSize: '24px', lineHeight: '32pt' }}>Activity</Typography>
                                                    <Nav className='navActivities mb-4' variant='pills' defaultActiveKey='/home'>
                                                        <Nav.Item>
                                                            <Nav.Link disabled={true}>Show</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link disabled={activityLoading || loading} eventKey='link-0'>ALL</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link disabled={activityLoading || loading} eventKey='link-1'>MESSAGE ACTIVITIES</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link disabled={activityLoading || loading} eventKey='link-2'>ALERT ACTIVITIES</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                    <div className='overflow-auto pr-2'>
                                                        {activityLoading || loading
                                                            ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                                <span className='sr-only'>Loading...</span>
                                                            </Spinner>
                                                            : <>
                                                                <Tab.Content>
                                                                    <Tab.Pane eventKey='link-0'>
                                                                        <div id='containerElement' className='alerts-detail__message-activity pr-5 pt-1 pb-5 mb-4 mt-4'>
                                                                            <div>
                                                                                { activities.map(activity => {
                                                                                    return (activity.type == 'SYSTEM_EVENT'
                                                                                        ? <>
                                                                                            <div key={1} className='alert-detail__activity-info d-flex align-items-start mb-4'>
                                                                                                {/* <span className='activity-icon'><span className='text-light'>J</span></span> */}
                                                                                                <img src={logo} alt='Mariana_UFP_logo' className='login__logo' />
                                                                                                <div className='d-block'>
                                                                                                    <Typography color='color-3' variant='size-16'>{activity.event}</Typography>
                                                                                                    <Typography color='color-3' variant='size-14' className='text-muted'>{moment(activity.dateCreated).utc().local().format('DD/MM/YYYY h:mm A')}</Typography>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                        : <>
                                                                                            <div key={2} className='alert-detail__activity-info d-flex align-items-center mb-4'>
                                                                                                <span className='activity-icon'><span className='text-light'>{activity.executorId.charAt(0)}</span></span>
                                                                                                <div className='d-block'>
                                                                                                    <Typography color='color-3' variant='size-16'>User {truncateText(activity.executorId, 8)}: {activity.event}</Typography>
                                                                                                    <Typography color='color-3' variant='size-14' className='text-muted'>{moment(activity.dateCreated).utc().local().format('DD/MM/YYYY h:mm A')}</Typography>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>);
                                                                                })}
                                                                                { activities.length === 0 &&
                                                                                    <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                                        <div className='d-block'>
                                                                                            <Typography color='color-3' variant='size-16'>No Activities</Typography>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Tab.Pane>
                                                                    <Tab.Pane eventKey='link-1'>
                                                                        <div id='containerElement' className='alerts-detail__message-activity pr-5 pt-1 pb-5 mb-4 mt-4'>
                                                                            <div>
                                                                                { messageActivities.map(activity => {
                                                                                    return (<>
                                                                                        <div key={2} className='alert-detail__activity-info d-flex align-items-center mb-4'>
                                                                                            <span className='activity-icon'><span className='text-light'>{activity.id.charAt(0)}</span></span>
                                                                                            <div className='d-block'>
                                                                                                <Typography color='color-3' variant='size-16'>User {truncateText(activity.id, 8)}: {activity.event}</Typography>
                                                                                                <Typography color='color-3' variant='size-14' className='text-muted'>{moment(activity.dateCreated).utc().local().format('DD/MM/YYYY h:mm A')}</Typography>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>);
                                                                                })}
                                                                                { messageActivities.length === 0 &&
                                                                                    <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                                        <div className='d-block text-muted text-center'>
                                                                                            <Typography color='color-3' variant='size-16'>No Activities</Typography>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Tab.Pane>
                                                                    <Tab.Pane eventKey='link-2'>
                                                                        <div id='containerElement' className='alerts-detail__message-activity pr-5 pt-1 pb-5 mb-4 mt-4'>
                                                                            <div>
                                                                                { alertActivities.map(activity => {
                                                                                    return (<>
                                                                                        <div key={1} className='alert-detail__activity-info d-flex align-items-start mb-4'>
                                                                                            {/* <span className='activity-icon'><span className='text-light'>J</span></span> */}
                                                                                            <img src={logo} alt='Mariana_UFP_logo' className='login__logo' />
                                                                                            <div className='d-block'>
                                                                                                <Typography color='color-3' variant='size-16'>{activity.event}</Typography>
                                                                                                <Typography color='color-3' variant='size-14' className='text-muted'>{moment(activity.dateCreated).utc().local().format('DD/MM/YYYY h:mm A')}</Typography>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>);
                                                                                })}
                                                                                { alertActivities.length === 0 &&
                                                                                    <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                                        <div className='d-block text-muted text-center'>
                                                                                            <Typography color='color-3' variant='size-16'>No Activities</Typography>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Tab.Pane>
                                                                </Tab.Content>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </Tab.Container>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CommunicationAlertsDetail: any = withLoading<React$Element<Props>>(CommunicationAlertsDetailScreen);

export default CommunicationAlertsDetail;
