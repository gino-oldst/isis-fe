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
    Card,
    CardBody,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Alert
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';

import './communication_search.scss';

import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
}

function CommunicationSearchScreen({
    loading,
    userId,
    breadcrumb,
    sidebarMenu
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);

    return (
        <div className='alerts'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='alerts__content'/>
            </div>
        </div>
    );
}

const CommunicationSearch: any = withLoading<React$Element<Props>>(CommunicationSearchScreen);

export default CommunicationSearch;

const ActionModal = ({
    userId,
    activeModal,
    loadAlerts,
    handleCloseModal,
    handleCloseResolveAlert,
    table,
    selectedRows,
    areRowsSelectedAll,
    activePage,
    pageSize,
    dateFrom,
    dateTo,
    assignees,
    appliedFilters,
    sort,
    alert,
    setAlert,
    setActiveModal,
    handleResolveReasonChange
}) => {
    const dispatch = useDispatch();
    const [submit, setSubmit] = useState(false);

    const showResolveAlert = () => {
        setActiveModal('resolve');
        dispatch(setModalContent({
            modalContent: <ResolveAlertModal handleCloseModal={handleCloseModal} handleCloseResolveAlert={handleCloseResolveAlert}
                alert={alert} setAlert={setAlert} handleResolveReasonChange={handleResolveReasonChange} />
        }));
    };

    const showError = errMsg => {
        dispatch(setModalContent({
            modalContent: <ErrorMsgModal
                errMsg={errMsg}
                handleCloseModal={handleCloseModal} />
        }));
    };

    const handleChange = (e, option) => {
        let name, value;

        if (option === undefined) {
            name = e.target.name;
            value = e.target.value;
        } else {
            name = option.name;
            value = option.name === 'assignedTo' ? e.id : e.name;

            if (option.name === 'assignedTo' && value === 0) value = 999999;
        }

        setAlert({
            ...alert,
            [name]: value,
            resolveReason: name === 'status' && value !== 'RESOLVED' ? null : alert.resolveReason
        });

        if (value === 'RESOLVED') showResolveAlert();
    };

    const handleBulkUpdate = async () => {
        setSubmit(true);

        const records = !areRowsSelectedAll ? selectedRows : table.alertIds;

        const payload = records.map(row => {
            return {
                alertId: row,
                currentUserId: userId,
                ...alert,
                assignedTo: alert.assignedTo === 999999 ? 0 : alert.assignedTo
            };
        });

        try {
            const result = await bulkUpdateAlert(payload);

            if (result.status === 200) {
                setTimeout(async () => {
                    if (result.data.length !== undefined && result.data.length > 0) {
                        showError(result.data[0].exceptionMessage);
                    } else {
                        await loadAlerts(activePage, pageSize,
                            `${dateFrom.split('T')[0]}T00:00:00Z`,
                            `${dateTo.split('T')[0]}T23:59:59Z`, appliedFilters, sort);
                        handleClose();
                    }
                }, 1000);
            }
        } catch (err) {
            await loadAlerts(activePage, pageSize,
                `${dateFrom.split('T')[0]}T00:00:00Z`,
                `${dateTo.split('T')[0]}T23:59:59Z`, appliedFilters, sort);
            handleClose();
        }
    };

    const handleClose = () => {
        handleCloseModal();
        setAlert({
            notes: null,
            status: null,
            assignedTo: null,
            escalation: null,
            resolveReason: null
        });
    };

    return (
        <div className='action-modal p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleClose} />
            <Typography variant='size-26' color='color-3'
                className='mb-4 playfair-font'>
                Bulk Action
            </Typography>
            <FormGroup className='mb-3'>
                <Label for='escalation'>Select Escalation</Label>
                <Select
                    name='escalation'
                    value={alert.escalation === null
                        ? {
                            label: 'No Change',
                            value: null
                        }
                        : {
                            name: alert.escalation,
                            label: alert.escalation,
                            value: alert.escalation
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
                    onChange={handleChange} />
            </FormGroup>
            <FormGroup className='mb-3'>
                <Label for='status'>Select Status</Label>
                <Select
                    name='status'
                    value={alert.status === null
                        ? {
                            label: 'No Change',
                            value: null
                        }
                        : {
                            name: alert.status,
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
                    }]}
                    onChange={handleChange} />
                {alert.resolveReason && <div>Reason: {alert.resolveReason}</div>}
            </FormGroup>
            <FormGroup className='mb-3'>
                <Label for='assignedTo'>Select Assignee</Label>
                <Select
                    name='assignedTo'
                    value={alert.assignedTo === null
                        ? {
                            label: 'No Change',
                            name: 'No Change',
                            value: 'No Change'
                        }
                        : assignees.map(assignee => {
                            if (assignee.id === alert.assignedTo) {
                                return {
                                    id: assignee.id,
                                    name: assignee.fullName,
                                    label: assignee.fullName,
                                    value: assignee.fullName
                                };
                            }
                        })}
                    options={[
                        ...assignees.map(assignee => {
                            return {
                                id: assignee.id,
                                name: assignee.fullName,
                                label: assignee.fullName,
                                value: assignee.fullName
                            };
                        })]}
                    onChange={handleChange} />
            </FormGroup>
            <FormGroup className='mb-5'>
                <Label for='notes'>Notes</Label>
                <Input type='textarea' rows={5} name='notes'
                    placeholder='Leave blank if there is no change to apply' value={alert.notes}
                    onChange={handleChange} />
            </FormGroup>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleClose} disabled={submit} />
                <Button label='Apply' isLoading={submit} variant='secondary'
                    className='alerts__save-button px-4 py-2'
                    onClick={handleBulkUpdate} disabled={submit} />
            </div>
        </div>
    );
};

const ErrorMsgModal = ({
    errMsg,
    handleCloseModal
}) => {
    return (
        <div className='alerts__error p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right mt-2' icon='times' size='lg'
                onClick={handleCloseModal} />
            <Typography variant='size-26' color='color-3'
                className='mb-5 playfair-font'>
                Error
            </Typography>
            <Alert color='danger' className='mb-5'>
                <Typography color='color-3' variant='size-16' className='playfair-font'>{errMsg}</Typography>
            </Alert>
            <div className='d-flex justify-content-center'>
                <Button label='OK' variant='light' className='ok-button px-4 mr-2 py-2'
                    onClick={() => {
                        handleCloseModal();
                    }} />
            </div>
        </div>
    );
};

const ResolveAlertModal = ({
    handleCloseModal,
    handleCloseResolveAlert,
    handleResolveReasonChange
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
                    rows={4} placeholder='Reason...' onChange={(e, option) => {
                        handleResolveReasonChange(e.target.value);
                    }}/>
            </FormGroup>
            <div className='resolve-alert__buttons d-flex justify-content-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseResolveAlert}/>
                <Button label={`${!submit ? 'Done' : 'Saving...'}`} variant='primary' className='alerts__save-button px-4 py-2'
                    disabled={submit} onClick={() => {
                        setSubmit(true);
                        handleCloseResolveAlert();
                    }} />
            </div>
        </div>
    );
};
