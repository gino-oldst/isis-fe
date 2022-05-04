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
import { FaInfoCircle } from 'react-icons/fa';
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

import './communication-search-message-details.scss';

import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';
import Highlighter from 'react-highlight-words';
import { Nav, OverlayTrigger, Popover, PopoverContent, Tab } from 'react-bootstrap';
import { Element, Link, scroller, Button as ScrollButton } from 'react-scroll';
import { load } from 'dotenv';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    detailData: Array,
    dataId: Any,
    handleMessageBeforeIncrement: Function,
    handleMessageBeforeDecrement: Function,
    handleMessageAfterIncrement: Function,
    handleMessageAfterDecrement: Function,
    handleBackMessage: Function,
    handlePreviousMessage: Function,
    handleNextMessage: Function,
    loadMessageStatus: String,
    messages: Array,
    recipients: Array,
    filterText: String,
    messageButtonDisable: Any
}

function CommunicationSearchMessageDetailsScreen({
    loading,
    userId,
    breadcrumb,
    useMediaQuery,
    sidebarMenu,
    detailData,
    dataId,
    handleMessageBeforeIncrement,
    handleMessageBeforeDecrement,
    handleMessageAfterIncrement,
    handleMessageAfterDecrement,
    handleBackMessage,
    handlePreviousMessage,
    handleNextMessage,
    loadMessageStatus,
    messages,
    recipients,
    filterText,
    messageButtonDisable
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

    const renderRecipientPopover = (text) => (
        <Popover id='popover-basic'>
            <PopoverContent>
                <Typography color='color-3' className='mr-auto' weight='bold'
                    style={{ fontSize: '14px', lineHeight: '20pt' }}>Recipients</Typography>
                <Typography color='color-3' className='mr-auto' weight='regular'
                    style={{ fontSize: '14px' }} >{text}</Typography>
            </PopoverContent>
        </Popover>
    );

    useEffect(() => {
        // scroll to active message
        scroller.scrollTo('0e6dbaac-2e0b-4c15-a26e-2543325ee453', {
            duration: 500,
            smooth: true,
            containerId: 'containerElement'
            // offset: 50 // Scrolls to element + 50 pixels down the page
        });
    }, [loading]);

    return (
        <div className='communication-search-message-details'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='communication-search-message-details__content'>
                        <Card className='px-5 py-4'>
                            <CardBody>
                                <div className='communication-search-message-details__header d-flex align-items-center'>
                                    <Typography color='color-3' className='alerts__title mr-auto'
                                        weight='regular' style={{ fontSize: '28px', lineHeight: '24pt' }}>{dataId != '' ? dataId : 'N/A'}</Typography>
                                </div>
                                <div className='communication-search-message-details__information mt-2'>
                                    <Row>
                                        <Col>
                                            <Typography color='color-3' className='alerts__title mr-auto' weight='regular'
                                                style={{ fontSize: '24px', lineHeight: '24pt' }} >{detailData.subject != null ? detailData.subject : 'No Subject'} {/* RE: Trading Message */}</Typography>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }}>{detailData.source != null ? detailData.source : 'No Source'} {/* Email */}</Typography>
                                        </Col>
                                    </Row>
                                    <Row className='mt-5'>
                                        <Col lg={7}>
                                            <div className='mb-4'>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                                        style={{ fontSize: '24px', lineHeight: '24pt' }}>Alert</Typography>
                                                    {/* <Button weight='light' disabled={detailData.alerts ? 'true' : 'false'} className='ml-4 mr-4 alerts__bulk-review'
                                                        label='Update all Status'/> */}
                                                </div>
                                                <table className='table' style={{ minWidth: '300px !important' }}>
                                                    {/* detailData.alerts.length > 0 */}
                                                    {detailData.alerts != null
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
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>Alert 4</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>Flame</Typography>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center w-100'>
                                                                            <Select
                                                                                className='status-select'
                                                                                name='status'
                                                                                // defaultValue={{
                                                                                //     label: <Badge status={selectedAlert.status} />,
                                                                                //     value: <Badge status={selectedAlert.status}/>
                                                                                // }}
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

                                                                            <OverlayTrigger placement='bottom-start' overlay={renderAlertInfo('Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Donec sollicitudin molestie malesuada. Cras ultricies ligula sed magna dictum porta. Donec sollicitudin molestie malesuada. Cras ultricies ligula sed magna dictum porta.')}>
                                                                                <FaInfoCircle style={{ color: '#004C98', marginLeft: '10px' }} size={24}/>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                        {/* onChange={handleChange} /> */}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </>
                                                        : <>
                                                            <Typography size={18} color='color-3' className='mr-3'
                                                                weight='regular'>No Alerts</Typography>
                                                        </>
                                                    }
                                                </table>
                                            </div>
                                            <div className='pt-30 pb-30 communication-search-message-details__messages'>
                                                <Row>
                                                    <Col>
                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                            style={{ fontSize: '24px', lineHeight: '24pt' }}>Message</Typography>
                                                        <Typography color='color-3' className='mr-3 mb-4' weight='regular'
                                                            style={{ fontSize: '16px', lineHeight: '24pt' }}>Reported message is highlighted.</Typography>
                                                    </Col>
                                                    <Col>
                                                        <Link className='btn btn-outline-primary ok-button px-2 mr-2 py-2' to={dataId} smooth={true}
                                                            containerId='containerElement' duration={500}>
                                                            Show reported message
                                                        </Link>
                                                    </Col>
                                                </Row>
                                                {/* || recipients === undefined */}
                                                {loading
                                                    ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                        <span className='sr-only'>Loading...</span>
                                                    </Spinner>
                                                    : <>
                                                        <div className='d-flex flex-column'>
                                                            {/* {loadMessageStatus == 'before'
                                                                ? <Button label='Load message Alerted' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                                    onClick={handleBackMessage}/>
                                                                : <Button label='Load next message' disabled={loadMessageStatus == 'after'} variant='outline-primary'
                                                                    onClick={handleNextMessage} className='ok-button px-4 mr-2 py-2'/>
                                                            } */}
                                                            {/* {loadMessageStatus == 'before' &&
                                                                <Button disabled={messageButtonDisable} label='Load previous message' variant='outline-primary'
                                                                    className='ok-button px-4 mr-2 py-2' onClick={handleMessageBeforeIncrement}/>
                                                            }
                                                            {loadMessageStatus == 'after' &&
                                                                <Button label='Load previous message' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                                    onClick={handleMessageAfterDecrement}/>
                                                            }
                                                            {loadMessageStatus == 'message' &&
                                                                <Button label='Load previous message' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                                    onClick={handleMessageBeforeIncrement}/>
                                                            } */}
                                                            <div id='containerElement' className='communication-search-message-details__message-thread pr-5 pt-1 pb-5 mb-4 mt-4'>
                                                                <div>
                                                                    {messages.map(message => {
                                                                        return (<>
                                                                            <Element name={message.id} className={`element mb-4 ${message.id == dataId && 'active-message'}`}>
                                                                                <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                    style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography>
                                                                                <div className='message-box' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                                                    <Highlighter highlightClassName='alertKeyword'
                                                                                        style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                                        searchWords={[filterText]}
                                                                                        autoEscape={true}
                                                                                        textToHighlight={message.message}/>
                                                                                </div>
                                                                            </Element></>);
                                                                    })}
                                                                </div>
                                                            </div>
                                                            {/* {loadMessageStatus == 'before' &&
                                                                <Button label='Load next message' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                                    onClick={handleMessageBeforeDecrement}/>
                                                            }
                                                            {loadMessageStatus == 'after' &&
                                                                <Button disabled={messageButtonDisable} label='Load next message' variant='outline-primary'
                                                                    className='ok-button px-4 mr-2 py-2' onClick={handleMessageAfterIncrement}/>
                                                            }
                                                            {loadMessageStatus == 'message' &&
                                                                <Button label='Load next message' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                                    onClick={handleMessageAfterIncrement}/>
                                                            } */}
                                                            {/* {loadMessageStatus == 'after'
                                                                ? <Button label='Load message Alerted' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                                    onClick={handleBackMessage}/>
                                                                : <Button label='Load next message' disabled={loadMessageStatus == 'before'} variant='outline-primary'
                                                                    onClick={handleNextMessage} className='ok-button px-4 mr-2 py-2'/>
                                                            } */}
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </Col>
                                        <Col className='offset-lg-1' lg={4} md={12}>
                                            <div style={{ border: '2px solid #D0D0D0', padding: '30px' }}>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Date & Time: </b>{detailData.timeSent != null ? isoToUTCLocal(detailData.timeSent) : 'N/A'} {/* 17/12/20 5:34 PM */}</Typography>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Sender: </b>{detailData.sender != null ? detailData.sender : 'N/A'} {/* daniel.caplin@marianacap.com */}</Typography>
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
                                    {/* <Row>
                                        <Col lg={4} className='mt-5 mb-4'>
                                            <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                style={{ fontSize: '24px', lineHeight: '32pt' }}>Comment</Typography>
                                            <Input type='textarea' name='alertComment' id='alertComment'
                                                className='mb-2' rows={4} placeholder='Comment here...' />
                                            <Button label='Add Comment' variant='primary' className='ok-button px-4 mt-3 mr-2 py-2' />
                                        </Col>
                                    </Row> */}
                                    <Row>
                                        <Col lg={6} className='mt-5 mb-4 pt-30'>
                                            <Tab.Container id='left-tabs-example' defaultActiveKey='link-0'>
                                                <div className='alert-detail__activities'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                        style={{ fontSize: '24px', lineHeight: '32pt' }}>Activity</Typography>
                                                    {/* <Nav className='navActivities mb-4' variant='pills' defaultActiveKey='/home'>
                                                        <Nav.Item>
                                                            <Nav.Link disabled={true}>Show</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey='link-0'>ALL</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey='link-1'>MESSAGE ACTIVITIES</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey='link-2'>ALERT ACTIVITIES</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav> */}
                                                    <div className='overflow-auto pr-2'>
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
                                                        {/* <Tab.Content>
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
                                                        </Tab.Content> */}
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

const CommunicationSearchMessageDetails: any = withLoading<React$Element<Props>>(CommunicationSearchMessageDetailsScreen);

export default CommunicationSearchMessageDetails;
