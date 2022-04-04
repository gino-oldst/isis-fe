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
    isoToUTCLocal
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

import './communication-search-message-details.scss';

import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';
import Highlighter from 'react-highlight-words';
import { Nav, OverlayTrigger, Popover, PopoverContent, Tab } from 'react-bootstrap';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    detailData: Array,
    dataId: Any,
    handleMessagePrevious: Function,
    handleMessageNext: Function,
    handleBackMessage: Function,
    loadMessageStatus: String,
    messages: Array
}

function CommunicationSearchMessageDetailsScreen({
    loading,
    userId,
    breadcrumb,
    useMediaQuery,
    sidebarMenu,
    detailData,
    dataId,
    handleMessagePrevious,
    handleMessageNext,
    handleBackMessage,
    loadMessageStatus,
    messages
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1199px)' });
    const isLaptopScreen = useMediaQuery({ query: '(max-width: 1450px)' });

    const renderAlertInfo = (text) => (
        <Popover id='popover-basic'>
            <PopoverContent>
                {text}
            </PopoverContent>
        </Popover>
    );

    return (
        <div className='communication-search-message-details'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
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
                                        <Typography color='color-3' className='mr-auto' weight='regular'
                                            style={{ fontSize: '24px', lineHeight: '24pt' }} >{detailData.subject != null ? detailData.subject : 'No Subject'} {/* RE: Trading Message */}</Typography>
                                        <Typography color='color-3' className='mr-auto' weight='regular'
                                            style={{ fontSize: '16px', lineHeight: '24pt' }}>{detailData.source != null ? detailData.source : 'No Source'} {/* Email */}</Typography>
                                    </Col>
                                </Row>
                                <Row className='mt-5'>
                                    <Col lg={7}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                                style={{ fontSize: '24px', lineHeight: '24pt' }}>Alert</Typography>
                                            <Button weight='light' disabled={detailData.alerts ? 'true' : 'false'} className='ml-4 mr-4 alerts__bulk-review'
                                                label='Update all Status'/>
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

                                                                    <OverlayTrigger placement='bottom-start' overlay={renderAlertInfo('OverlayTrigger Text')}>
                                                                        <FaInfoCircle style={{ color: '#004C98', marginLeft: '10px' }} size={24}/>
                                                                    </OverlayTrigger>
                                                                </div>
                                                                {/* onChange={handleChange} /> */}
                                                            </td>
                                                        </tr>
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
                                    <Col className='offset-lg-2' lg={3} md={12}>
                                        <div style={{ border: '2px solid #D0D0D0', height: '100%', padding: '30px' }}>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Date & Time: </b>{detailData.timeSent != null ? isoToUTCLocal(detailData.timeSent) : 'N/A'} {/* 17/12/20 5:34 PM */}</Typography>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Sender: </b>{detailData.sender != null ? detailData.sender : 'N/A'} {/* daniel.caplin@marianacap.com */}</Typography>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Receiver: </b>{detailData.receiver != null ? detailData.receiver : 'N/A'} {/* simon@mcgfutures.com */}</Typography>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={12} md={12}
                                        className='mb-2'>
                                        <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                            style={{ fontSize: '24px', lineHeight: '24pt' }}>Messege</Typography>
                                        <div className='d-flex flex-column'>
                                            {loadMessageStatus == 'next'
                                                ? <Button label='Load message Alerted' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                    onClick={handleBackMessage}/>
                                                : <Button label='Load 5 previous message' disabled={loadMessageStatus == 'prev'} variant='outline-primary'
                                                    onClick={handleMessagePrevious} className='ok-button px-4 mr-2 py-2' />
                                            }
                                            <div className='communication-search-message-details__message-thread mb-4 mt-4'>
                                                <div>
                                                    {messages.map(message => {
                                                        return (<>
                                                            <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                style={{ fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography>
                                                            <div className='message-box mb-4' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                                <Highlighter highlightClassName='alertKeyword'
                                                                    style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                    searchWords={['flame']}
                                                                    autoEscape={true}
                                                                    textToHighlight={message.message}/>
                                                            </div></>);
                                                    })}
                                                </div>
                                            </div>
                                            {loadMessageStatus == 'prev'
                                                ? <Button label='Load message Alerted' variant='outline-primary' className='ok-button px-4 mr-2 py-2'
                                                    onClick={handleBackMessage}/>
                                                : <Button label='Load next 5 message' disabled={loadMessageStatus == 'next'} variant='outline-primary'
                                                    onClick={handleMessageNext} className='ok-button px-4 mr-2 py-2'/>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} className='mt-5 mb-4'>
                                        <Typography color='color-3' className='mr-3' weight='semi-bold'
                                            style={{ fontSize: '24px', lineHeight: '32pt' }}>Comment</Typography>
                                        <Input type='textarea' name='alertComment' id='alertComment'
                                            className='mb-2' rows={4} placeholder='Comment here...' />
                                        <Button label='Add Comment' variant='primary' className='ok-button px-4 mt-3 mr-2 py-2' />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6} className='mt-5 mb-4'>
                                        <Tab.Container id='left-tabs-example' defaultActiveKey='link-0'>
                                            <div className='alert-detail__activities'>
                                                <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                    style={{ fontSize: '24px', lineHeight: '32pt' }}>Activity</Typography>
                                                <Nav className='navActivities mb-4' variant='pills' defaultActiveKey='/home'>
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
                                                </Nav>
                                                <div className='overflow-auto pr-2' style={{ height: '400px' }}>
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
    );
}

const CommunicationSearchMessageDetails: any = withLoading<React$Element<Props>>(CommunicationSearchMessageDetailsScreen);

export default CommunicationSearchMessageDetails;
