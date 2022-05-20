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
    truncateText
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
    Spinner
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';

import './communication_alerts_detail.scss';
import { FaInfoCircle } from 'react-icons/fa';
import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';
import Highlighter from 'react-highlight-words';
import { Nav, OverlayTrigger, Popover, PopoverContent, Tab } from 'react-bootstrap';
import { Element, Link, scroller, Button as ScrollButton } from 'react-scroll';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    table: Any,
    activePage: Int,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    detailData: Array,
    dataId: Any,
    handleCloseModal: Function,
    filterText: Array,
    messages: Array,
    recipients: Array,
    alertsData: Array
}

function CommunicationAlertsDetailScreen({
    loading,
    userId,
    table,
    activePage,
    breadcrumb,
    useMediaQuery,
    sidebarMenu,
    detailData,
    dataId,
    handleCloseModal,
    filterText,
    messages,
    recipients,
    alertsData
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1199px)' });
    const isLaptopScreen = useMediaQuery({ query: '(max-width: 1450px)' });
    const { alertsList } = useSelector(({ isisTable }) => isisTable);

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
            <div className='action-modal p-5'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseModal}/>
                <Typography variant='size-30' color='color-3'
                    className='mb-4 playfair-font text-center'>
                    Update all Status
                </Typography>
                <div className='alerts-detail__information mt-5 w-100 mb-4' style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                    <Row>
                        <Col lg={6}>
                            <table className='table'>
                                {alertsData.data != null
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
                                            {alertsData.data.map(alert => {
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
                            <FormGroup className='mb-3'>
                                <Select
                                    name='status'
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
                            </FormGroup>
                            <FormGroup className='mb-5'>
                                <Label for='notes'>Reasons for resolving</Label>
                                <Input type='textarea' rows={5} name='notes'
                                    placeholder='Leave blank if there is no change to apply' value={alert.notes} /> {/* onChange={handleChange} /> */}
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                    <Button label='Apply' variant='primary' className='alerts-detail__save-button px-4 py-2'
                        onClick={showSuccessModal}/>
                    {/* <Button label='Apply' isLoading={submit} variant='secondary'
                        className='alerts-detail__save-button px-4 py-2'
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
                        className='alerts-detail__save-button px-4 py-2'
                        onClick={handleBulkUpdate} disabled={submit} /> */}
                </div>
            </div>
        );
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

    return (
        <div className='alerts-detail'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='alerts-detail__content pb-5'>
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
                                            style={{ fontSize: '32px', lineHeight: '24pt' }} >{detailData.subject != null ? detailData.subject : 'No Subject'} {/* RE: Trading Message */}</Typography>
                                        <Typography color='color-3' className='mr-auto' weight='bold'
                                            style={{ fontSize: '16px', lineHeight: '24pt' }}>{detailData.source != null ? detailData.source : 'No Source'} {/* Email */}</Typography>
                                    </Col>
                                </Row>
                                <Row className='mt-5'>
                                    <Col lg={7} className='mb-4'>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                                style={{ fontSize: '24px', lineHeight: '24pt' }}>Alert</Typography>
                                            <Button weight='light' disabled={loading} className='ml-4 mr-4 alerts-detail__bulk-review'
                                                disabled={true} onClick={showActionsModal} label='Update all Status'/>
                                        </div>
                                        {loading
                                            ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                <span className='sr-only'>Loading...</span>
                                            </Spinner>
                                            : <>
                                                <table className='table'>
                                                    {alertsData
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
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {alertsData.data.map(alert => {
                                                                    return (<>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertsList.filter(x => x.value === alert.keywordId)[0].label}</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alert.keyword}</Typography>
                                                                            </td>
                                                                            <td style={{ width: '250px' }}>
                                                                                <div className='d-flex align-items-center'>
                                                                                    <Select
                                                                                        name='status'
                                                                                        className='w-100 pr-2'
                                                                                        isDisabled={true}
                                                                                        defaultValue={{
                                                                                            label: <Badge status={alert.status} />,
                                                                                            value: <Badge status={alert.status}/>
                                                                                        }}
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
                                                                                    {alert.status == 'RESOLVED' &&
                                                                                        <div>
                                                                                            <OverlayTrigger style={{ cursor: 'pointer' }} placement='bottom-start' overlay={renderAlertInfo('Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Donec sollicitudin molestie malesuada. Cras ultricies ligula sed magna dictum porta. Donec sollicitudin molestie malesuada. Cras ultricies ligula sed magna dictum porta.')}>
                                                                                                <FaInfoCircle style={{ color: '#004C98', cursor: 'pointer' }} size={24}/>
                                                                                            </OverlayTrigger>
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                                {/* onChange={handleChange} /> */}
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
                                                        ? truncateText(recipients.join(', '), 400)
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
                                            <Col className='text-right'>
                                                <Link className='btn btn-outline-primary ok-button px-2 mr-2 py-2' to={dataId} smooth={true}
                                                    disabled={loading} containerId='containerElement' duration={500}>
                                                    Show reported message
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
                                                                return (<>
                                                                    <Element name={message.id} className={`element mb-4 ${message.id == dataId && 'active-message'}`}>
                                                                        <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                            style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography>
                                                                        <div className='message-box' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                                            <Highlighter highlightClassName='alertKeyword'
                                                                                style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                                searchWords={filterText}
                                                                                autoEscape={true}
                                                                                textToHighlight={message.message}/>
                                                                        </div>
                                                                    </Element></>);
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
                                        <Typography color='color-3' className='mr-3' weight='semi-bold'
                                            style={{ fontSize: '24px', lineHeight: '32pt' }}>Comment</Typography>
                                        <Input type='textarea' name='alertComment' id='alertComment'
                                            className='mb-2' disabled={true} rows={4}
                                            placeholder='Comment here...' />
                                        <Button label='Add Comment' disabled={true} variant='primary'
                                            className='ok-button px-4 mt-3 mr-2 py-2' />
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
                                                        <Nav.Link disabled={true} eventKey='link-0'>ALL</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link disabled={true} eventKey='link-1'>MESSAGE ACTIVITIES</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link disabled={true} eventKey='link-2'>ALERT ACTIVITIES</Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                                {/* <div className='overflow-auto pr-2'>
                                                    <Tab.Content>
                                                        <Tab.Pane eventKey='link-0'>
                                                            <div key={1} className='alert-detail__activity-info d-flex align-items-center mb-4'>
                                                                <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                <div className='d-block'>
                                                                    <Typography color='color-3' variant='size-16'>James Allan added a comment.</Typography>
                                                                    <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:12 AM</Typography>
                                                                    <Typography color='color-3 mt-2' variant='size-14' >Donec rutrum congue leo eget malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. </Typography>
                                                                </div>
                                                            </div>
                                                            <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                <div className='d-block'>
                                                                    <Typography color='color-3' variant='size-16'>James Allan viewed the alert.</Typography>
                                                                    <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:02 AM</Typography>
                                                                </div>
                                                            </div>
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey='link-1'>
                                                            <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                <div className='d-block'>
                                                                    <Typography color='color-3' variant='size-16'>James Allan viewed the alert.</Typography>
                                                                    <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:02 AM</Typography>
                                                                </div>
                                                            </div>
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey='link-2'>
                                                            <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                <div className='d-block'>
                                                                    <Typography color='color-3' variant='size-16'>James Allan viewed the alert.</Typography>
                                                                    <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:02 AM</Typography>
                                                                </div>
                                                            </div>
                                                        </Tab.Pane>
                                                    </Tab.Content>
                                                </div> */}
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
    );
}

const CommunicationAlertsDetail: any = withLoading<React$Element<Props>>(CommunicationAlertsDetailScreen);

export default CommunicationAlertsDetail;
