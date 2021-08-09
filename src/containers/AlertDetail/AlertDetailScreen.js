// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
    FormFeedback,
    Alert,
    Input,
    Label,
    Spinner
} from 'reactstrap';
import './alert-detail.scss';

import { updateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { replaceAlertDetails } from '../../redux/modules/alerts';

type Props = {
    loading: Boolean,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function,
    selectedAlert: Object,
    assignees: Array,
    alertSpecifics: Object,
    handleDownloadAlertsRecord: Function
}

function AlertDetailScreen({
    loading,
    breadcrumb,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal,
    selectedAlert,
    assignees,
    alertSpecifics,
    handleDownloadAlertsRecord
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1199px)' });
    const isLaptopScreen = useMediaQuery({ query: '(max-width: 1450px)' });
    const [submit, setSubmit] = useState(false);
    const [alert, setAlert] = useState({
        notes: '',
        status: '',
        assignedUser: '',
        escalation: '',
        resolveReason: '',
        errors: {}
    });

    useEffect(() => {
        if (alert.status === 'RESOLVED') showResolveAlert();
    }, [alert.status]);

    const showError = errMsg => {
        dispatch(setModalContent({
            modalContent: <ErrorMsgModal
                errMsg={errMsg}
                handleCloseModal={handleCloseModal} />
        }));
    };

    const showResolveAlert = () => {
        dispatch(setModalContent({
            modalContent: <ResolveAlertModal selectedAlert={selectedAlert} handleCloseModal={handleCloseModal}
                handleUpdateAlert={handleUpdateAlert} alert={alert} handleChange={handleChange} />
        }));
    };

    const handleChange = (e, option) => {
        let name, value;

        if (option === undefined) {
            name = e.target.name;
            value = e.target.value;
        } else {
            name = option.name;
            value = option.name === 'assignedUser' ? e.id : e.name;
        }

        if (alert.errors[name] !== undefined) alert.errors[name] = false; // remove error msg for a specific input

        setAlert({
            ...alert,
            [name]: value
        });
    };

    const handleUpdateAlert = async () => {
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
            assignedUserId: alert.assignedUser === '' ? null : alert.assignedUser,
            escalation: alert.escalation === '' ? selectedAlert.escalation : alert.escalation,
            status: alert.status === '' ? selectedAlert.status : alert.status,
            notes: alert.notes === '' ? selectedAlert.notes : alert.notes,
            resolveReason: alert.resolveReason === '' ? selectedAlert.resolveReason : alert.resolveReason,
            parameterValues: selectedAlert.parameterValues,
            dateCreated: selectedAlert.dateCreated,
            alertDate: selectedAlert.alertDate
        };

        const result = await updateAlert(payload);

        if (result.data.responseStatus === 'success') {
            setTimeout(() => {
                dispatch(replaceAlertDetails(result.data));
                setSubmit(false);
                handleCloseModal();
            }, 1000);
        } else {
            handleCloseModal();
            showError(result.data.exceptionMessage);
            setSubmit(false);
        }
    };

    // const handleValidation = () => {
    //     const errors = {};
    //     let formIsValid = true;

    //     if (validator.isEmpty(alert.resolveReason) || typeof alert.resolveReason === 'undefined') {
    //         formIsValid = false;
    //         errors.resolveReason = true;
    //         errors.resolveReasonErrMsg = 'Reason is required';
    //     }

    //     setAlert({
    //         ...alert,
    //         errors
    //     });

    //     return formIsValid;
    // };

    return (
        <div className='alert-detail'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='alert-detail__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='alert-detail__header d-sm-block d-md-flex align-items-start'>
                                <Typography color='color-3' className='alert-detail__title mr-auto'>{selectedAlert.behaviourCode}</Typography>
                                <Button label={<>
                                    <FontAwesomeIcon className='mr-3' icon='file-download' size='sm' />
                                    <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                </>}
                                className='ml-sm-0 ml-md-4 d-flex align-items-center alert-detail__download-button px-4'
                                size='lg' onClick={handleDownloadAlertsRecord} />
                            </div>
                            <Row className='mt-4'>
                                <Col sm={12} md={12} lg={12}
                                    xl={8}>
                                    <div className='alert-detail__information'>
                                        {loading || Object.keys(selectedAlert).length === 0
                                            ? <Spinner animation='border' role='status' className='d-flex mx-auto my-5 text-center'>
                                                <span className='sr-only'>Loading...</span>
                                            </Spinner>
                                            : <>
                                                <Row>
                                                    <Col lg={12} xl={!isLaptopScreen ? 6 : 12}>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Alert Type</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.behaviourDescription || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Date & Time</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{moment(selectedAlert.dateCreated).format('DD/MM/YY h:mm A') || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Broker</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.broker || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Ticker</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.ticker || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Quantity</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.quantity || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Client</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.client || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Order Type</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.orderType || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Reason for Flag</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.reasonForFlag || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Details</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.resolveReason || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'>Parameter Values</Typography>
                                                                    </td>
                                                                    <td className='pb-2'>
                                                                        <Typography color='color-3'>{selectedAlert.parameterValues || '—'}</Typography>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </Col>
                                                    <Col lg={12} xl={!isLaptopScreen ? 6 : 12}>
                                                        <table>
                                                            <tbody>
                                                                {typeof alertSpecifics !== 'undefined' &&
                                                                    selectedAlert.behaviourCode === 'FLASH' &&
                                                                    <>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Buy Time</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{moment(alertSpecifics.buyTime).format('DD/MM/YY h:mm A') || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Buy Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.buyVolume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Buy Price</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.buyPrice || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Buy Fill ID</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.buyFillId || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Sell Time</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{moment(alertSpecifics.sellTime).format('DD/MM/YY h:mm A') || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Sell Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.sellVolume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Sell Price</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.sellPrice || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Sell Fill ID</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.sellFillId || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                                {selectedAlert.behaviourCode === 'WASH_TRADES' &&
                                                                    <>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Ticker</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.ticker || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Buy Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.buyVolume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Sell Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.sellVolume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Buy Trade ID</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.buyTradeId || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Sell Trade ID</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.sellTradeId || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                                {selectedAlert.behaviourCode === 'RESTRICTED' &&
                                                                    <>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Ticker</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.ticker || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.volume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Direction</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.direction || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Trade ID</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.tradeId || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                                {(selectedAlert.behaviourCode === 'LARGE_ORDER' ||
                                                                selectedAlert.behaviourCode === 'LARGE_ORDER_MUFP') &&
                                                                    <>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Difference</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.difference || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.volume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Direction</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.direction || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Historic High Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.historicHighVolume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Trade ID</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.tradeId || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                                {(selectedAlert.behaviourCode === 'HIGH_VOLUME' ||
                                                                selectedAlert.behaviourCode === 'HIGH_VOLUME_MUFP' ||
                                                                selectedAlert.behaviourCode === 'HIGH_ORDER' ||
                                                                selectedAlert.behaviourCode === 'HIGH_ORDER_MUFP') &&
                                                                    <>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Total Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.totalVolume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Historic Average Volume</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.historicAverageVolume || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3' className='mr-3' weight='semi-bold'>Difference</Typography>
                                                                            </td>
                                                                            <td className='pb-2'>
                                                                                <Typography color='color-3'>{alertSpecifics.difference || '—'}</Typography>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </Col>
                                                </Row>
                                                <Row className='mt-4'>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for='note'><Typography color='color-3' variant='size-16' weight='bold'>Notes</Typography></Label>
                                                            <Input type='textarea' name='notes' id='notes'
                                                                rows={4} defaultValue={selectedAlert.notes.trim()} placeholder='Write notes...'
                                                                onChange={handleChange} invalid={alert.errors.notes} />
                                                            <FormFeedback className={`${alert.errors.notes ? 'd-block' : 'd-none'}`}>
                                                                {alert.errors.notesErrMsg}
                                                            </FormFeedback>
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
                                                            : <><Select
                                                                name='status'
                                                                defaultValue={{
                                                                    label: <Badge status={selectedAlert.status} />,
                                                                    value: <Badge status={selectedAlert.status}/>
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
                                                                }]}
                                                                onChangeHandler={handleChange} />
                                                            <FormText color='muted'>
                                                                {selectedAlert.status.toLowerCase() === 'resolved' &&
                                                                    <>
                                                                        <strong className='text-dark mr-1'>
                                                                            {selectedAlert.resolveReason !== '' && selectedAlert.resolveReason !== undefined ? 'Reason:' : ''}
                                                                        </strong>
                                                                        <span>
                                                                            {selectedAlert.resolveReason}
                                                                        </span>
                                                                    </>
                                                                }
                                                            </FormText>
                                                            </>
                                                        }
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row={true} className='mb-3'>
                                                    <Label for='assignee' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Assign</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        {loading || Object.keys(selectedAlert).length === 0
                                                            ? <Spinner animation='border' role='status' className='d-flex my-auto text-center'>
                                                                <span className='sr-only'>Loading...</span>
                                                            </Spinner>
                                                            : <Select
                                                                name='assignedUser'
                                                                defaultValue={{
                                                                    label: selectedAlert.assignedUser,
                                                                    value: selectedAlert.assignedUser
                                                                }}
                                                                options={[{
                                                                    id: null,
                                                                    name: 'Unassigned',
                                                                    label: 'Unassigned',
                                                                    value: 'Unassigned'
                                                                },
                                                                ...assignees.map(assignee => {
                                                                    return {
                                                                        id: assignee.id,
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
                                                    <Label for='escalation' lg={12} xl={4}><Typography color='color-3' variant='size-16' weight='bold'>Escalation</Typography></Label>
                                                    <Col lg={12} xl={8}>
                                                        {loading || Object.keys(selectedAlert).length === 0
                                                            ? <Spinner animation='border' role='status' className='d-flex my-auto text-center'>
                                                                <span className='sr-only'>Loading...</span>
                                                            </Spinner>
                                                            : <Select
                                                                name='escalation'
                                                                defaultValue={{
                                                                    label: selectedAlert.escalation,
                                                                    value: selectedAlert.escalation
                                                                }}
                                                                options={[{
                                                                    name: 'BASE',
                                                                    label: 'BASE',
                                                                    value: 'BASE'
                                                                }, {
                                                                    name: 'MANAGER',
                                                                    label: 'MANAGER',
                                                                    value: 'MANAGER'
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
                                    <Button label={<>
                                        <Typography weight='light' className='my-1 mx-2'>{!submit ? 'Save' : 'Saving...'}</Typography>
                                    </>} className={`alert-detail__save-bote-button ${!isTabletOrMobile && 'align-button-bottom'} float-right px-4 mt-3`}
                                    size='lg' onClick={handleUpdateAlert} disabled={submit} />
                                    {/* <Typography variant='size-14' className={`playfair-font mt-4 text-danger ${alert.errors.backendErr !== '' ? 'd-block' : 'd-none'}`}>{alert.errors.backendErr}</Typography> */}
                                </Col>
                                <Col sm={12} className='mt-4 mt-0-xl mb-2 '>
                                    <div className='alert-detail__activities'>
                                        <Typography color='color-3' variant='size-26' className='playfair-font mb-4'>Activity</Typography>
                                        {loading || Object.keys(selectedAlert).length === 0
                                            ? <Spinner animation='border' role='status' className='my-auto text-center'>
                                                <span className='sr-only'>Loading...</span>
                                            </Spinner>
                                            : <div className='overflow-auto pr-2' style={{ height: '400px' }}>
                                                {selectedAlert.alertsActivity.data.length === 0 && <Typography color='color-2' variant='size-16' className='playfair-font mb-4'>No data to show.</Typography>}
                                                {selectedAlert.alertsActivity.data.map(activity => {
                                                    return (
                                                        <div key={activity.id} className='alert-detail__activity-info d-flex align-items-center mb-3'>
                                                            <span className='activity-icon'><span className='text-light'>{activity.description.charAt(0).toUpperCase()}</span></span>
                                                            <div className='d-block'>
                                                                <Typography color='color-3' variant='size-16'>{activity.description}</Typography>
                                                                <Typography color='color-3' variant='size-12' className='text-muted'>{moment(activity.dateCreated).format('DD/MM/YY h:mm a')}</Typography>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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

const ErrorMsgModal = ({
    errMsg,
    handleCloseModal
}) => {
    return (
        <div className='alert-details__error p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right mt-2' icon='times' size='lg'
                onClick={handleCloseModal} />
            <Typography variant='size-26' color='color-3'
                className='mb-5 playfair-font'>
                Error
            </Typography>
            <Alert color='danger' className='mb-5'>
                <Typography color='color-3' variant='size-16' className='playfair-font'>{errMsg}</Typography>
            </Alert>
            <div className='behaviour-detail__edit-parameter-buttons d-flex justify-content-center'>
                <Button label='OK' variant='light' className='ok-button px-4 mr-2 py-2'
                    onClick={() => {
                        handleCloseModal();
                        window.location.reload();
                    }} />
            </div>
        </div>
    );
};

const ResolveAlertModal = ({
    selectedAlert,
    handleCloseModal,
    handleUpdateAlert,
    alert,
    handleChange
}) => {
    const [submit, setSubmit] = useState(false);

    return (
        <div className='alert-details__resolve-alert p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal} />
            <Typography variant='size-26' color='color-3'
                className='mb-4 playfair-font'>
                Resolving Alert
            </Typography>
            <FormGroup className='mb-4'>
                <Label for='resolveReason'>Reason of Resolving Alert</Label>
                <Input type='textarea' name='resolveReason' id='resolveReason'
                    rows={4} placeholder='Reason...' onChange={handleChange}
                    invalid={alert.errors.resolveReason} />
                <FormFeedback className={`${alert.errors.resolveReason ? 'd-block' : 'd-none'}`}>
                    {alert.errors.resolveReasonErrMsg}
                </FormFeedback>
            </FormGroup>
            <div className='resolve-alert__buttons d-flex justify-content-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal}/>
                <Button label={`${!submit ? 'Done' : 'Saving...'}`} variant='primary' className='alerts__save-button px-4 py-2'
                    disabled={submit} onClick={() => {
                        setSubmit(true);
                        handleUpdateAlert();
                    }} />
            </div>
        </div>
    );
};
