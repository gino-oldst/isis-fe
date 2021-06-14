// @flow
import React, { useState, useEffect, createRef } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
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
    Card,
    CardBody,
    Spinner,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Alert
} from 'reactstrap';
import './alerts.scss';

import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { filterAlertsData } from '../../redux/modules/alerts';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    loadAlerts: Function,
    tableColumns: Array,
    tableData: Array,
    viewAlertDetails: Function,
    assignees: Array,
    isRowsSelected: Boolean,
    selectedRows: Array,
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function,
    handleDownloadAlertsList: Function
}

function AlertsScreen({
    loading,
    userId,
    breadcrumb,
    loadAlerts,
    tableColumns,
    tableData,
    viewAlertDetails,
    assignees,
    isRowsSelected,
    selectedRows,
    sidebarMenu,
    handleCloseModal,
    handleDownloadAlertsList
}: Props): React$Element<any> {
    const dispatch = useDispatch();

    const showActionsModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionModal
                userId={userId}
                loadAlerts={loadAlerts}
                selectedRows={selectedRows}
                handleCloseModal={handleCloseModal}
                assignees={assignees} />
        }));
    };

    const datepickerOpen = createRef();
    const [dateRangeFilter, setDateRangeFilter] = useState(0);
    const [dateRangeFilterValues, setDateRangeFilterValues] = useState({
        start: new Date(),
        end: new Date()
    });
    const [dateRangeValues, setDateRangeValues] = useState({
        start: new Date(),
        end: new Date()
    });

    const handleDateFilterChange = value => {
        setDateRangeFilter(value);
        const now = new Date();

        if (value === 1) {
            setDateRangeValues({
                ...dateRangeValues,
                start: now
            });
        } else if (value === 2) {
            setDateRangeValues({
                start: moment().subtract(7, 'days')._d,
                end: now
            });
        }
    };

    const handleDateChange = (type, activeFilter, value) => {
        setDateRangeFilter(activeFilter);
        setDateRangeFilterValues({
            ...dateRangeFilterValues,
            [type]: value
        });

        setDateRangeValues({
            ...dateRangeValues,
            [type]: value
        });
    };

    useEffect(() => {
        dispatch(filterAlertsData(dateRangeFilter, dateRangeValues));
    }, [dateRangeFilter, dateRangeValues]);

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
                                <Typography color='color-3' className='alerts__title mr-auto'>Alerts</Typography>
                                <div className='alerts__date-picker d-flex align-items-center justify-content-end mb-4'>
                                    <CustomDropdown tag='span'
                                        toggle={<DatePicker width='70' inputVariant='outlined' keyboard={true}
                                            value={dateRangeValues.start} />}>
                                        <DropdownItem header={true} className='text-center'>
                                            <img src={filterIcon} alt='talbe-filter-icon' />
                                        </DropdownItem>
                                        <DropdownItem divider={true} />
                                        <div className='alerts__date-filter-options'>
                                            <FormGroup tag='fieldset'>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio1' checked={dateRangeFilter === 1}
                                                            onChange={() => handleDateFilterChange(1)} />{' '}
                                                Today
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio2' checked={dateRangeFilter === 2}
                                                            onChange={() => handleDateFilterChange(2)} />{' '}
                                                Last 7 Days
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio3' checked={dateRangeFilter === 3}
                                                            onChange={() => handleDateFilterChange(3)}
                                                            onClick={() => datepickerOpen.current.setOpen(true)} />{' '}
                                                        <span className='mr-2'>Specific Date</span>
                                                    </Label>
                                                    <FontAwesomeIcon icon='calendar-alt' size='md' className='date-picker__icon' />
                                                    <ReactDatePicker ref={datepickerOpen}
                                                        selected={dateRangeValues.start}
                                                        className='table__date-picker'
                                                        dateFormat='dd MMM yyyy'
                                                        onChange={date => {
                                                            handleDateChange('start', 3, date);
                                                        }} />
                                                    {/* <DatePicker width={55} value={dateRangeValues.start} className='alerts__date-filter-picker'
                                                        inputVariant='outlined' onChange={e => handleDateChange('start', e)} /> */}
                                                </FormGroup>
                                            </FormGroup>
                                        </div>
                                        <DropdownItem divider={true} />
                                        <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                                            className='alerts__filter-reset-button float-right mr-2' onClick={() => handleDateFilterChange(0)} />
                                    </CustomDropdown>
                                    <Typography color='color-3' variant='size-16' className='mx-4'>to</Typography>
                                    <CustomDropdown tag='span'
                                        toggle={<DatePicker width='70' inputVariant='outlined' keyboard={true}
                                            value={dateRangeValues.end} />}>
                                        <DropdownItem header={true} className='text-center'>
                                            <img src={filterIcon} alt='talbe-filter-icon' />
                                        </DropdownItem>
                                        <DropdownItem divider={true} />
                                        <div className='alerts__date-filter-options'>
                                            <FormGroup tag='fieldset'>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio4' checked={dateRangeFilter === 1} />{' '}
                                                Today
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio5' checked={dateRangeFilter === 2} />{' '}
                                                Last 7 Days
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio6' checked={dateRangeFilter === 3}
                                                            onChange={() => handleDateFilterChange(3)}
                                                            onClick={() => datepickerOpen.current.setOpen(true)} />{' '}
                                                        <span className='mr-2'>Specific Date</span>
                                                    </Label>
                                                    <FontAwesomeIcon icon='calendar-alt' size='md' className='date-picker__icon' />
                                                    <ReactDatePicker ref={datepickerOpen}
                                                        selected={dateRangeValues.end}
                                                        className='table__date-picker'
                                                        dateFormat='dd MMM yyyy'
                                                        minDate={dateRangeValues.start}
                                                        onChange={date => {
                                                            handleDateChange('end', 3, date);
                                                        }} />
                                                    {/* <DatePicker width={55} value={dateRangeValues.end} className='alerts__date-filter-picker'
                                                        inputVariant='outlined' onChange={e => handleDateChange('end', e)} /> */}
                                                </FormGroup>
                                            </FormGroup>
                                        </div>
                                        <DropdownItem divider={true} />
                                        <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                                            className='alerts__filter-reset-button float-right mr-2' onClick={() => handleDateFilterChange(0)} />
                                    </CustomDropdown>
                                    <Button label={<>
                                        <FontAwesomeIcon className='mr-2' icon='file-download' size='sm' />
                                        <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                    </>}
                                    className='ml-4 d-flex align-items-center alerts__download-button'
                                    onClick={() => handleDownloadAlertsList(dateRangeValues)} />
                                    {isRowsSelected > 0 && <Button className='ml-3 alerts__download-button' label={<Typography weight='light' className='my-1 mx-2'>Bulk Action</Typography>} onClick={showActionsModal}/>}
                                </div>
                            </div>
                            {loading || tableColumns === undefined || tableData === undefined
                                ? (
                                    <Spinner animation='border' role='status' className='d-flex mx-auto my-5 text-center'>
                                        <span className='sr-only'>Loading...</span>
                                    </Spinner>
                                )
                                : (
                                    <Table className='alerts__table'
                                        tableData={tableData}
                                        tableColumns={tableColumns}
                                        selectableRows={true}
                                        globalFilter={false}
                                        pagination={true}
                                        sortable={true}
                                        viewDetails={viewAlertDetails} />
                                )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Alerts: any = withLoading<React$Element<Props>>(AlertsScreen);

export default Alerts;

const ActionModal = ({
    userId,
    loadAlerts,
    handleCloseModal,
    selectedRows,
    assignees
}) => {
    const dispatch = useDispatch();
    const [submit, setSubmit] = useState(false);
    const [alert, setAlert] = useState({
        notes: null,
        status: null,
        assignedTo: null,
        escalation: null
    });

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
        }

        setAlert({
            ...alert,
            [name]: value
        });
    };

    const handleBulkUpdate = async () => {
        setSubmit(true);

        const payload = selectedRows.map(row => {
            return {
                alertId: row,
                currentUserId: 2,
                ...alert
            };
        });

        const result = await bulkUpdateAlert(payload);

        if (result.status === 200) {
            setTimeout(async () => {
                if (result.data.length !== undefined && result.data.length > 0) {
                    showError(result.data[0].exceptionMessage);
                } else {
                    await loadAlerts();
                    handleCloseModal();
                }
            }, 1000);
        }
    };

    return (
        <div className='action-modal p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal} />
            <Typography variant='size-26' color='color-3'
                className='mb-4 playfair-font'>
                Bulk Action
            </Typography>
            <FormGroup className='mb-3'>
                <Label for='escalation'>Select Escalation</Label>
                <Select
                    name='escalation'
                    defaultValue={{
                        label: 'No Change',
                        value: null
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
            </FormGroup>
            <FormGroup className='mb-3'>
                <Label for='status'>Select Status</Label>
                <Select
                    name='status'
                    defaultValue={{
                        label: 'No Change',
                        value: null
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
            </FormGroup>
            <FormGroup className='mb-3'>
                <Label for='assignedTo'>Select Assignee</Label>
                <Select
                    name='assignedTo'
                    defaultValue={{
                        label: 'No Change',
                        value: null
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
            </FormGroup>
            <FormGroup className='mb-5'>
                <Label for='notes'>Notes</Label>
                <Input type='textarea' rows={5} name='notes'
                    placeholder='Leave blank if there is no change to apply'
                    onChange={handleChange} />
            </FormGroup>
            <div className='action-modal__buttons d-flex justify-content-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} disabled={submit} />
                <Button label='Apply' variant='secondary' className='alerts__save-button px-4 py-2'
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
                Something went wrong
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
