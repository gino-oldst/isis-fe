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
import Highlighter from 'react-highlight-words';
import { Nav } from 'react-bootstrap';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
}

function CommunicationAlertsDetailScreen({
    loading,
    userId,
    breadcrumb,
    useMediaQuery,
    sidebarMenu
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1199px)' });
    const isLaptopScreen = useMediaQuery({ query: '(max-width: 1450px)' });

    return (
        <div className='alerts'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='alerts__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='alerts__header d-flex align-items-center'>
                                <Typography color='color-3' className='alerts__title mr-auto' weight='regular'>4fd-8067-b-8067-b35baaa7f3a8</Typography>
                            </div>
                            <div className='alerts__information mt-2'>
                                <Row>
                                    <Col>
                                        <Typography color='color-3' className='mr-auto' weight='regular'
                                            style={{ fontSize: '32px', lineHeight: '24pt' }} >RE: Trading Message</Typography>
                                        <Typography color='color-3' className='mr-auto' weight='bold'
                                            style={{ fontSize: '16px', lineHeight: '24pt' }}>Email</Typography>
                                    </Col>
                                </Row>
                                <Row className='mt-5'>
                                    <Col lg={7}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                                style={{ fontSize: '24px', lineHeight: '24pt' }}>Alert</Typography>
                                            <Button weight='light' className='ml-4 mr-4 alerts__bulk-review' label='Update all Status'/>
                                        </div>
                                        <table className='table' style={{ minWidth: '300px !important' }}>
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
                                                        <Select
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
                                                        {/* onChange={handleChange} /> */}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Col>
                                    <Col className='offset-2' lg={3}>
                                        <div style={{ border: '2px solid #D0D0D0', height: '100%', padding: '30px' }}>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Date & Time:</b> 17/12/20 5:34 PM</Typography>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Sender</b> daniel.caplin@marianacap.com</Typography>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Receiver:</b> simon@mcgfutures.com</Typography>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} className='mb-2'>
                                        <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                            style={{ fontSize: '24px', lineHeight: '24pt' }}>Messege</Typography>
                                        <div className='d-flex flex-column'>
                                            <Button label='Load previous message' variant='outline-primary' className='ok-button px-4 mr-2 py-2' />
                                            <div className='alert__message-thread mb-4 mt-4'>
                                                <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }}><b>Daniel Caplin</b> 17/12/21, 8:02 AM</Typography>
                                                <div className='message-box' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                    <Highlighter highlightClassName='alertKeyword'
                                                        style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                        searchWords={['flame']}
                                                        autoEscape={true}
                                                        textToHighlight='This stock is going up in flames.'/>
                                                </div>
                                            </div>
                                            <Button label='Load next message' variant='outline-primary' className='ok-button px-4 mr-2 py-2' />
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
                                        <div className='alert-detail__activities'>
                                            <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                style={{ fontSize: '24px', lineHeight: '32pt' }}>Activity</Typography>
                                            <Nav className='navActivities mb-4' variant='pills' defaultActiveKey='/home'>
                                                <Nav.Item>
                                                    <Nav.Link disabled={true}>Show</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey='/home'>ALL</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey='link-1'>MESSAGE ACTIVITIES</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey='link-2'>ALERT ACTIVITIES</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            <div className='overflow-auto pr-2' style={{ height: '400px' }}>
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
                                            </div>
                                        </div>
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
