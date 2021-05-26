// @flow
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import validator from 'validator';
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
    FormFeedback,
    Input,
    Label,
    Spinner
} from 'reactstrap';
import './alert-detail.scss';

import { updateAlert } from '../../api/alerts';
import { replaceAlertDetails } from '../../redux/modules/alerts';

type Props = {
    loading: Boolean,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    selectedAlert: Object,
    assignees: Array
}

function AlertDetailScreen({
    loading,
    breadcrumb,
    sidebarMenu,
    selectedAlert,
    assignees
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const [submit, setSubmit] = useState(false);
    const [alert, setAlert] = useState({
        notes: '',
        status: '',
        assignedUser: '',
        escalation: '',
        errors: {}
    });

    const handleUpdateAlert = async () => {
        if (handleValidation()) {
            setSubmit(true);
            const userId = localStorage.getItem('userId');

            const payload = {
                id: selectedAlert.id,
                ruleId: selectedAlert.ruleId,
                currentUserId: userId,
                behaviourId: selectedAlert.behaviourId,
                behaviourCode: selectedAlert.behaviourCode,
                broker: selectedAlert.broker,
                book: selectedAlert.book,
                ticker: selectedAlert.ticker,
                quantity: selectedAlert.quantity,
                client: selectedAlert.client,
                orderType: selectedAlert.orderType,
                details: selectedAlert.details,
                behaviourDescription: selectedAlert.behaviourDescription,
                assignedUser: alert.assignedUser === '' ? selectedAlert.assignedUser : alert.assignedUser,
                escalation: alert.escalation === '' ? selectedAlert.escalation : alert.escalation,
                status: alert.status === '' ? selectedAlert.status : alert.status,
                notes: alert.notes === '' ? selectedAlert.notes : alert.notes
            };

            const result = await updateAlert(payload);

            if (result.data.responseStatus === 'success') {
                setTimeout(() => {
                    dispatch(replaceAlertDetails(result.data));
                    setSubmit(false);
                }, 1000);
            }
        }
    };

    const handleChange = (e, option) => {
        let name, value;

        if (option === undefined) {
            name = e.target.name;
            value = e.target.value;
        } else {
            name = option.name;
            value = e.name;
        }

        if (alert.errors[name] !== undefined) alert.errors[name] = false; // remove error msg for a specific input

        setAlert({
            ...alert,
            [name]: value
        });
    };

    const handleValidation = () => {
        const errors = {};
        let formIsValid = true;

        if (validator.isEmpty(alert.notes)) {
            formIsValid = false;
            errors.notes = true;
            errors.notesErrMsg = 'Notes is required';
        }

        setAlert({
            ...alert,
            errors
        });

        return formIsValid;
    };

    return (
        <div className='alert-detail'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='alert-detail__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='alert-detail__header d-flex align-items-start'>
                                <Typography color='color-3' className='alert-detail__title mr-auto'>{selectedAlert.behaviourCode}</Typography>
                                <Button label={<>
                                    <FontAwesomeIcon className='mr-3' icon='file-download' size='sm' />
                                    <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                </>}
                                className='ml-4 d-flex align-items-center alert-detail__download-button px-4'
                                size='lg' />
                            </div>
                            <Row className='mt-4'>
                                <Col sm={12} md={8}>
                                    <div className='alert-detail__information'>
                                        {loading || Object.keys(selectedAlert).length === 0
                                            ? <Spinner animation='border' role='status' className='d-flex mx-auto my-5 text-center'>
                                                <span className='sr-only'>Loading...</span>
                                            </Spinner>
                                            : <>
                                                <Row>
                                                    <Col lg={12} xl={5}>
                                                        <div className='d-flex align-items-center mb-2'>
                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Alert Type</Typography>
                                                            <Typography color='color-3'>{selectedAlert.behaviourDescription}</Typography>
                                                        </div>
                                                        <div className='d-flex align-items-center mb-2'>
                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Date & Time</Typography>
                                                            <Typography color='color-3'>{moment(selectedAlert.dateCreated).format('DD/MM/YY ss:mm A')}</Typography>
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
                                                            <Typography color='color-3'>{selectedAlert.orderType}</Typography>
                                                        </div>
                                                        <div className='d-flex align-items-center mb-2'>
                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Reason for Flag</Typography>
                                                            <Typography color='color-3'>{selectedAlert.reasonForFlag}</Typography>
                                                        </div>
                                                        <div className='d-flex align-items-center mb-2'>
                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Details</Typography>
                                                            <Typography color='color-3'>{selectedAlert.resolveReason}</Typography>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row className='mt-4'>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for='note'><Typography color='color-3' variant='size-16' weight='bold'>Notes</Typography></Label>
                                                            <Input type='textarea' name='notes' id='notes'
                                                                rows={4} defaultValue={selectedAlert.notes} placeholder='Write notes...'
                                                                onChange={handleChange} invalid={alert.errors.notes} />
                                                            <FormFeedback className={`${alert.errors.notes ? 'd-block' : 'd-none'}`}>
                                                                {alert.errors.notesErrMsg}
                                                            </FormFeedback>
                                                            <Button label={<>
                                                                <Typography weight='light' className='my-1 mx-2'>{!submit ? 'Save' : 'Saving...'}</Typography>
                                                            </>} className='alert-detail__save-bote-button float-right px-4 mt-3'
                                                            size='lg' onClick={handleUpdateAlert} disabled={submit} />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    </div>
                                </Col>
                                <Col lg={12} xl={4} className='mt-4 mt-xl-0'>
                                    <div className='alert-detail__assignees'>
                                        <Card>
                                            <CardBody>
                                                <FormGroup row={true} className='mb-3'>
                                                    <Label for='status' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Status</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        {loading || Object.keys(selectedAlert).length === 0
                                                            ? <Spinner animation='border' role='status' className='d-flex my-auto text-center'>
                                                                <span className='sr-only'>Loading...</span>
                                                            </Spinner>
                                                            : <Select
                                                                name='status'
                                                                defaultValue={{
                                                                    label: <Badge status={selectedAlert.status} />,
                                                                    value: <Badge status={selectedAlert.status}/>
                                                                }}
                                                                options={[{
                                                                    name: 'Open',
                                                                    label: <Badge status='Open' />,
                                                                    value: <Badge status='Open'/>
                                                                }, {
                                                                    name: 'In Review',
                                                                    label: <Badge status='In Review' />,
                                                                    value: <Badge status='In Review'/>
                                                                }, {
                                                                    name: 'Resolved',
                                                                    label: <Badge status='Resolved' />,
                                                                    value: <Badge status='Resolved'/>
                                                                }, {
                                                                    name: 'Archived',
                                                                    label: <Badge status='Archived' />,
                                                                    value: <Badge status='Archived'/>
                                                                }]}
                                                                onChangeHandler={handleChange} />
                                                        }
                                                        <FormText color='muted'>
                                                            <strong className='text-dark'>Reason:</strong> Sed ut perspiciatis unde
                                                        </FormText>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row={true} className='mb-3'>
                                                    <Label for='assignee' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Assign to</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        {loading || Object.keys(selectedAlert).length === 0
                                                            ? <Spinner animation='border' role='status' className='d-flex my-auto text-center'>
                                                                <span className='sr-only'>Loading...</span>
                                                            </Spinner>
                                                            : <Select
                                                                name='assignedUser'
                                                                defaultValue={{
                                                                    label: 'Unassigned',
                                                                    value: 'Unassigned'
                                                                }}
                                                                options={[
                                                                    {
                                                                        name: 'Unassigned',
                                                                        label: 'Unassigned',
                                                                        value: 'Unassigned'
                                                                    },
                                                                    ...assignees.map(assignee => {
                                                                        return {
                                                                            name: assignee.fullName,
                                                                            label: assignee.fullName,
                                                                            value: assignee.fullName
                                                                        };
                                                                    })]}
                                                                onChangeHandler={handleChange} />
                                                        }
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row={true} className='mb-3'>
                                                    <Label for='escalation' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Escalation to</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        {loading || Object.keys(selectedAlert).length === 0
                                                            ? <Spinner animation='border' role='status' className='d-flex my-auto text-center'>
                                                                <span className='sr-only'>Loading...</span>
                                                            </Spinner>
                                                            : <Select
                                                                name='escalation'
                                                                defaultValue={{
                                                                    label: 'Unassigned',
                                                                    value: 'Unassigned'
                                                                }}
                                                                options={[{
                                                                    name: 'Unassigned',
                                                                    label: 'Unassigned',
                                                                    value: 'Unassigned'
                                                                }, {
                                                                    name: 'Base',
                                                                    label: 'Base',
                                                                    value: 'Base'
                                                                }, {
                                                                    name: 'Manager',
                                                                    label: 'Manager',
                                                                    value: 'Manager'
                                                                }, {
                                                                    name: 'CO',
                                                                    label: 'CO',
                                                                    value: 'CO'
                                                                }]}
                                                                onChangeHandler={handleChange} />
                                                        }
                                                    </Col>
                                                </FormGroup>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Col>
                                <Col sm={12} className='mt-4 mt-0-xl mb-2'>
                                    <div className='alert-detail__activities'>
                                        <Typography color='color-3' variant='size-26' className='playfair-font mb-4'>Activity</Typography>
                                        {loading || Object.keys(selectedAlert).length === 0
                                            ? <Spinner animation='border' role='status' className='my-auto text-center'>
                                                <span className='sr-only'>Loading...</span>
                                            </Spinner>
                                            : <>
                                                {selectedAlert.alertsActivity.data.length === 0 && <Typography color='color-2' variant='size-16' className='playfair-font mb-4'>No data to show.</Typography>}
                                                {selectedAlert.alertsActivity.data.map(activity => {
                                                    return (
                                                        <div key={activity.alertId} className='alert-detail__activity-info d-flex align-items-center mb-3'>
                                                            <span className='activity-icon'><span className='text-light'>J</span></span>
                                                            <div className='d-block'>
                                                                <Typography color='color-3' variant='size-16'>{activity.description}</Typography>
                                                                <Typography color='color-3' variant='size-12' className='text-muted'>21/12/20 3:12pm</Typography>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {/* <div className='alert-detail__activity-info d-flex align-items-center'>
                                                <span className='activity-icon'><span className='text-light'>J</span></span>
                                                <div className='d-block'>
                                                    <Typography color='color-3' variant='size-16'>James Allan changed the status from <strong>Open</strong> to <strong className='color-sidebar-2'>In Review</strong>.</Typography>
                                                    <Typography color='color-3' variant='size-12' className='text-muted'>20/12/20 3:23pm</Typography>
                                                </div>
                                            </div> */}
                                            </>
                                        }
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
