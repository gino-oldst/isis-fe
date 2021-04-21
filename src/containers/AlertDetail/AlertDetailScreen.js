// @flow
import React from 'react';
import moment from 'moment';
import Badge from '../../components/base/Badge/Badge';
import Button from '../../components/base/Button/Button';
import Select from '../../components/base/Select/Select';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Menu } from '../../types';
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    FormText,
    Input,
    Label
} from 'reactstrap';
import './alert-detail.scss';

type Props = {
    sidebarMenu: Array<Menu>,
    selectedAlert: Object
}

function AlertDetailScreen({
    sidebarMenu,
    selectedAlert
}: Props): React$Element<any> {
    return (
        <div className='alert-detail'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={['Home', 'Alerts', selectedAlert.identifier]} />
                <div className='alert-detail__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='alert-detail__header d-flex align-items-start'>
                                <Typography color='color-3' className='alert-detail__title mr-auto'>{selectedAlert.identifier}</Typography>
                                <Button label={<>
                                    <FontAwesomeIcon className='mr-3' icon='file-download' size='sm' />
                                    <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                </>}
                                className='ml-4 d-flex align-items-center alert-detail__download-button px-4'
                                size='lg' />
                            </div>
                            <Row>
                                <Col sm={12} md={8}>
                                    <div className='alert-detail__information'>
                                        <Row>
                                            <Col lg={12} xl={5}>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Alert Type</Typography>
                                                    <Typography color='color-3'>{selectedAlert.alertType}</Typography>
                                                </div>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Date & Time</Typography>
                                                    <Typography color='color-3'>{moment(selectedAlert.date).format('DD/MM/YY ss:mm a')}</Typography>
                                                </div>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Broker</Typography>
                                                    <Typography color='color-3'>{selectedAlert.broker}</Typography>
                                                </div>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Ticker</Typography>
                                                    <Typography color='color-3'>{selectedAlert.ticker}</Typography>
                                                </div>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Quantity</Typography>
                                                    <Typography color='color-3'>{selectedAlert.quantity}</Typography>
                                                </div>
                                            </Col>
                                            <Col lg={12} xl={7}>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Client</Typography>
                                                    <Typography color='color-3'>{selectedAlert.client}</Typography>
                                                </div>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Order Type</Typography>
                                                    <Typography color='color-3'>Buy</Typography>
                                                </div>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Reason for Flag</Typography>
                                                    <Typography color='color-3'>Returns exceeded threshold</Typography>
                                                </div>
                                                <div className='d-flex align-items-center mb-2'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'>Details</Typography>
                                                    <Typography color='color-3'>Returns afer 3 days: 56%</Typography>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='mt-4'>
                                            <Col>
                                                <FormGroup>
                                                    <Label for='note'><Typography color='color-3' variant='size-16' weight='bold'>Notes</Typography></Label>
                                                    <Input type='textarea' name='note' id='note'
                                                        rows={4} placeholder='Write notes...' />
                                                    <Button label={<>
                                                        <Typography weight='light' className='my-1 mx-2'>Save</Typography>
                                                    </>} className='alert-detail__save-bote-button float-right px-4 mt-3'
                                                    size='lg' />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={12} xl={4} className='mt-4 mt-xl-0'>
                                    <div className='alert-detail__assignees'>
                                        <Card>
                                            <CardBody>
                                                <FormGroup row={true} className='mb-3'>
                                                    <Label for='status' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Status</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        <Select
                                                            defaultValue={{
                                                                label: <Badge status='Resolved' />,
                                                                value: <Badge status='Resolved'/>
                                                            }}
                                                            options={[{
                                                                label: <Badge status='Open' />,
                                                                value: <Badge status='Open'/>
                                                            }, {
                                                                label: <Badge status='In Review' />,
                                                                value: <Badge status='In Review'/>
                                                            }, {
                                                                label: <Badge status='Resolved' />,
                                                                value: <Badge status='Resolved'/>
                                                            }, {
                                                                label: <Badge status='Archived' />,
                                                                value: <Badge status='Archived'/>
                                                            }]} />
                                                        <FormText color='muted'>
                                                            <strong className='text-dark'>Reason:</strong> Sed ut perspiciatis unde
                                                        </FormText>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row={true} className='mb-3'>
                                                    <Label for='assignee' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Assign to</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        <Select
                                                            defaultValue={{
                                                                label: 'Unassigned',
                                                                value: 'Unassigned'
                                                            }}
                                                            options={[{
                                                                label: 'Unassigned',
                                                                value: 'Unassigned'
                                                            }, {
                                                                label: 'Mark Thomson',
                                                                value: 'Mark Thomson'
                                                            }, {
                                                                label: 'Gergana Tsoneva',
                                                                value: 'Gergana Tsoneva'
                                                            }, {
                                                                label: 'Darren Hibbitt',
                                                                value: 'Darren Hibbitt'
                                                            }]} />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row={true} className='mb-3'>
                                                    <Label for='escalation' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Escalation to</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        <Select
                                                            options={[{
                                                                label: 'Mark Thomson',
                                                                value: 'Mark Thomson'
                                                            }, {
                                                                label: 'Gergana Tsoneva',
                                                                value: 'Gergana Tsoneva'
                                                            }, {
                                                                label: 'Darren Hibbitt',
                                                                value: 'Darren Hibbitt'
                                                            }]} />
                                                    </Col>
                                                </FormGroup>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Col>
                                <Col sm={12} className='mt-4 mt-0-xl mb-2'>
                                    <div className='alert-detail__activities'>
                                        <Typography color='color-3' variant='size-26' className='playfair-font mb-4'>Activity</Typography>
                                        <div className='alert-detail__activity-info d-flex align-items-center mb-3'>
                                            <span className='activity-icon'><span className='text-light'>J</span></span>
                                            <div className='d-block'>
                                                <Typography color='color-3' variant='size-16'>James Allan changed the status from <strong>In Review</strong> to <strong className='color-sidebar-2'>Resolved</strong>.</Typography>
                                                <Typography color='color-3' variant='size-12' className='text-muted'>21/12/20 3:12pm</Typography>
                                            </div>
                                        </div>
                                        <div className='alert-detail__activity-info d-flex align-items-center'>
                                            <span className='activity-icon'><span className='text-light'>J</span></span>
                                            <div className='d-block'>
                                                <Typography color='color-3' variant='size-16'>James Allan changed the status from <strong>Open</strong> to <strong className='color-sidebar-2'>In Review</strong>.</Typography>
                                                <Typography color='color-3' variant='size-12' className='text-muted'>20/12/20 3:23pm</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const AlertDetail: any = withLoading<React$Element<Props>>(AlertDetailScreen);

export default AlertDetail;
