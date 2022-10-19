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
    sourceMaker,
    statusMaker,
    escalationMaker
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
    Form
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';
import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import { COMMUNICATION_ALERT_SOURCE_OPTIONS, COMMUNICATION_ALERT_STATUS_OPTIONS, COMMUNICATION_ALERT_ESCALATIONS_OPTIONS } from '../../config/constants';
import { DropdownButton, OverlayTrigger, Popover } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import './communication_alerts.scss';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    table: Any,
    activePage: Int,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function,
    viewCommunicationAlertDetails: Function,
    selectedRows: Array,
    submit: Boolean,
    onSubmit: Function,
    keywords: Array,
    filterDate: Array<any>,
    setFilterDate: Function,
    handleSenderChange: Function,
    handleRecipientChange: Function,
    loadOptions: Function,
    onSearchClick: Function,
    handleSource: Function,
    handleAlert: Function,
    handleCloseBulkUpdate: Function,
    isCheckedAll: Boolean,
    handleStatus: Function,
    defaultSource: Array<any>,
    defaultStatus: Array<any>,
    defaultAlert: Array<any>,
    defaultRecipients: Array<any>,
    defaultSenders: Array<any>,
    isTimeout: Boolean,
    toggleCheck: Boolean,
    errorForm: Array<Any>,
    handleDownloadAlertData: Function,
    handleCloseSuccessModal: Function,
    predefinedReasons: Array<any>,
    defaultEscalation: Array<any>,
    handleEscalation: Function,
}

function CommunicationAlertsScreen({
    loading,
    userId,
    breadcrumb,
    table,
    activePage,
    useMediaQuery,
    sidebarMenu,
    handleCloseModal,
    viewCommunicationAlertDetails,
    selectedRows,
    submit,
    onSubmit,
    keywords,
    filterDate,
    setFilterDate,
    handleRecipientChange,
    handleSenderChange,
    isCheckedAll,
    handleCloseBulkUpdate,
    loadOptions,
    onSearchClick,
    handleSource,
    handleAlert,
    handleStatus,
    defaultSource,
    defaultStatus,
    defaultAlert,
    defaultRecipients,
    defaultSenders,
    isTimeout,
    toggleCheck,
    errorForm,
    handleDownloadAlertData,
    handleCloseSuccessModal,
    predefinedReasons,
    defaultEscalation,
    handleEscalation
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);

    const showActionsModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionModal handleCloseBulkUpdate={handleCloseBulkUpdate} predefinedReasons={predefinedReasons}/>,
            size: 'xl'
        }));
    };

    const showSuccessModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessModal handleCloseModal={handleCloseSuccessModal}/>,
            size: 'md'
        }));
    };

    const ActionModal = ({
        userId,
        activeModal,
        loadAlerts,
        handleCloseBulkUpdate,
        predefinedReasons
    }) => {
        const dispatch = useDispatch();
        const [selectedStatus, setSelectedStatus] = useState('');
        const [resolvedNote, setResolvedNote] = useState('');
        const [selectedReason, setSelectedReason] = useState('');

        const handleAddPredefinedReason = () => {
            const reason = resolvedNote ? resolvedNote + '\n' + selectedReason : selectedReason;

            if (selectedReason != '') {
                handleChangeReason(reason);
            }
        };

        const handleChangeReason = (value) => {
            setResolvedNote(value);
        };

        return (
            <div className='action-modal p-4'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseBulkUpdate}/>
                <Typography variant='size-26' color='color-3'
                    className='mb-4 playfair-font'>
                    Bulk Action
                </Typography>
                <div className='alerts__information mt-5 w-100 mb-4' style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                    <Row>
                        <Col lg={12}>
                            <Table className='alerts__table table-striped'
                                loading={loading}
                                tableColumns={table.columns}
                                tableData={selectedRows}
                                defaultPageSize={1}
                                selectableRows={false}
                                hideHeader={true}
                                activePage={activePage}
                                viewDetails={viewCommunicationAlertDetails}
                                fetching={table.loading}
                                isDisabled={true}/>
                        </Col>
                    </Row>
                </div>
                <Form className='w-100'>
                    <FormGroup className='mb-3'>
                        <Label for='status'>Select Status</Label>
                        <Select
                            name='status'
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
                        {/*  />{alert.resolveReason && <div>Reason: {alert.resolveReason}</div>} */}
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
                                <Label for='notes'>Resolved Notes</Label>
                                <Input type='textarea' rows={5} name='notes'
                                    placeholder='Leave blank if there is no change to apply'
                                    defaultValue={resolvedNote}
                                    value={resolvedNote}
                                    onChange={e => handleChangeReason(e.target.value)} />
                            </FormGroup>

                        </div>
                    }
                    <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                        <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                            onClick={handleCloseBulkUpdate} disabled={submit}/>
                        <Button label='Apply' variant='primary' className='alerts__save-button px-4 py-2'
                            disabled={selectedRows.length === 0} onClick={e => onSubmit(selectedStatus, resolvedNote, selectedRows)}/>
                        {/* <Button label='Apply' isLoading={submit} variant='secondary'
                            className='alerts__save-button px-4 py-2'
                            onClick={handleBulkUpdate} disabled={submit} /> */}
                    </div>
                </Form>
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
                        className='alerts__save-button px-4 py-2'
                        onClick={handleBulkUpdate} disabled={submit} /> */}
                </div>
            </div>
        );
    };

    const [status, setStatus] = useState([
        { id: 1, value: 'open', name: 'Open', isChecked: false },
        { id: 2, value: 'inReview', name: 'In Review', isChecked: false },
        { id: 3, value: 'resolved', name: 'Resolved', isChecked: false },
        { id: 4, value: 'archived', name: 'Archived', isChecked: false },
        { id: 5, value: 'notAvailable', name: 'Not Available', isChecked: false }
    ]);

    // Date Related
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const [dateOptions, setDateOptions] = useState({
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const today = new Date();

    const [dateState, setDateState] = useState([
        {
            startDate: '',
            endDate: '',
            key: 'selection'
        }
    ]);

    useEffect(() => {
        var newDate = [{
            startDate: filterDate[0].startDate ? filterDate[0].startDate : new Date(today.setHours(0, 0, 0, 0)),
            endDate: filterDate[0].endDate ? filterDate[0].endDate : new Date(today.setHours(23, 59, 0, 0)),
            key: 'selection'
        }];

        setDateState(newDate);
    }, [filterDate]);

    const sourceOptions = [{ label: 'Select All', value: 'all' }, ...Object.keys(COMMUNICATION_ALERT_SOURCE_OPTIONS).map(row => ({
        label: row,
        value: row
    }))];

    const statusOptions = [{ label: 'Select All', value: 'all' }, ...Object.keys(COMMUNICATION_ALERT_STATUS_OPTIONS).map(row => ({
        label: row,
        value: row
    }))];

    const escalationOptions = [{ label: 'Select All', value: 'all' }, ...Object.keys(COMMUNICATION_ALERT_ESCALATIONS_OPTIONS).map(row => ({
        label: row,
        value: row
    }))];

    const [alertOptions, setAlertOptions] = useState([]);

    useEffect(() => {
        const updatedList = [{ label: 'Select All', value: 'all' }, ...keywords.map(row => ({
            label: row.label,
            value: row.value
        }))];

        setAlertOptions(updatedList);
    }, [keywords]);

    const convertedStartDate = moment(dateState[0].startDate).utc().local().format('MMM. DD, YYYY hh:mm A'); // for adding time in format hh:mm A

    const convertedEndDate = moment(dateState[0].endDate).utc().local().format('MMM. DD, YYYY hh:mm A'); // for adding time in format hh:mm A

    const onResetDate = () => {
        const clonedDateF = JSON.parse(JSON.stringify(dateState));
        const clonedDateS = JSON.parse(JSON.stringify(dateState));

        clonedDateF[0].startDate = '';
        clonedDateF[0].endDate = '';
        setFilterDate(clonedDateF);

        clonedDateS[0].startDate = new Date(today.setHours(0, 0, 0, 0));
        clonedDateS[0].endDate = new Date(today.setHours(23, 59, 0, 0));
        setDateState(clonedDateS);
    };

    const handleDates = (dates) => {
        var copyDates = dateState[0];

        const clonedDate = JSON.parse(JSON.stringify(dates));

        clonedDate[0].startDate = new Date(clonedDate[0].startDate);
        clonedDate[0].endDate = new Date(clonedDate[0].endDate);

        Object.keys(copyDates).map((e, i) => {
            if (e == 'startDate') {
                var hours = parseInt(copyDates[e].getHours());
                var minutes = parseInt(copyDates[e].getMinutes());

                clonedDate[0].startDate.setHours(hours, minutes, 0, 0);
            } else if (e == 'endDate') {
                var hours = parseInt(copyDates[e].getHours());
                var minutes = parseInt(copyDates[e].getMinutes());

                clonedDate[0].endDate.setHours(hours, minutes, 0, 0);
            }
        });

        setDateState(clonedDate);
        setFilterDate(clonedDate);
    };

    const handleTime = (event) => {
        var name = event.target.getAttribute('name');
        var timeParts = event.target.value.match(/(\d+):(\d+)/);

        const clonedDate = JSON.parse(JSON.stringify(dateState));

        clonedDate[0].startDate = new Date(clonedDate[0].startDate);
        clonedDate[0].endDate = new Date(clonedDate[0].endDate);

        if (name == 'timeStart' && timeParts) {
            var hours = parseInt(timeParts[1]);
            var minutes = parseInt(timeParts[2]);

            clonedDate[0].startDate.setHours(hours, minutes, 0, 0);
        } else if (name == 'timeEnd' && timeParts) {
            var hours = parseInt(timeParts[1]);
            var minutes = parseInt(timeParts[2]);

            clonedDate[0].endDate.setHours(hours, minutes, 0, 0);
        }

        setDateState(clonedDate);
        setFilterDate(clonedDate);
    };

    return (
        <div className='alerts'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='alerts__content'>
                        <Card className='px-4 py-2'>
                            <CardBody>
                                <div className='alerts__header mb-4'>
                                    <Row className='w-100 mr-0'>
                                        <Col lg={6}>
                                            <Typography color='color-3' className='alerts__title pl-0'>Communication Alerts</Typography>
                                        </Col>
                                        <Col lg={6} className='text-right pr-0'>
                                            <Button weight='light' className='alerts__bulk-review mr-2' label='Bulk Review'
                                                disabled={selectedRows.length === 0} onClick={showActionsModal}/>
                                            <Button weight='light' className='alerts__bulk-review' label='Download Data'
                                                disabled={loading} onClick={handleDownloadAlertData}/>
                                        </Col>
                                    </Row>
                                </div>
                                <Row className='pl-2'>
                                    <Col lg={12}>
                                        <Form>
                                            <fieldset disabled={loading}>
                                                <Row>
                                                    <Col>
                                                        <FormGroup className='mb-3'>
                                                            <Label for='alert'>Alert Type</Label>
                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                isMulti={true}
                                                                placeholder={'Search Alert Type'}
                                                                isSearchable={false}
                                                                className='status-select'
                                                                name='alert'
                                                                onChange= {selected => {
                                                                    selected.find(option => option.value === 'all')
                                                                        ? handleAlert(alertOptions.splice(1))
                                                                        : handleAlert(selected);
                                                                }}
                                                                value={defaultAlert.length > 0
                                                                    ? defaultAlert.map(row => ({ label: row.label, value: row.value }))
                                                                    : []}
                                                                options={alertOptions}/>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup className='mb-3'>
                                                            <Label for='status'>Status</Label>
                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                isMulti={true}
                                                                placeholder={'Search Status'}
                                                                isSearchable={false}
                                                                className='status-select'
                                                                name='status'
                                                                onChange={selected => {
                                                                    selected.find(option => option.value === 'all')
                                                                        ? handleStatus(statusOptions.splice(1))
                                                                        : handleStatus(selected);
                                                                }}
                                                                value={defaultStatus.length > 0
                                                                    ? defaultStatus.map(row => ({ label: statusMaker(row.label), value: row.value }))
                                                                    : []}
                                                                options={statusOptions.map(row => ({ label: statusMaker(row.label), value: row.value }))}/>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup className='mb-3'>
                                                            <Label for='dropdown-basic-button'>Date & Time</Label>
                                                            <DropdownButton variant='outline-light' id='dropdown-basic-button' alignRight={true}
                                                                title={filterDate[0].startDate === '' ? 'Select Date' : convertedStartDate + ' - ' + convertedEndDate}>
                                                                <DropdownItem>
                                                                    <DateRangePicker
                                                                        onChange={item => handleDates([item.selection])}
                                                                        showSelectionPreview={true}
                                                                        moveRangeOnFirstSelection={false}
                                                                        months={2}
                                                                        inputRanges={[]}
                                                                        ranges={dateState}
                                                                        showDateDisplay={false}
                                                                        value={filterDate.startDate === '' ? null : filterDate}
                                                                        direction='horizontal'/>
                                                                    <div className='d-flex time-wrapper'>
                                                                        <div className='rdrTime'>
                                                                            <Input type='time' name='timeStart' placeholder='hh:mm'
                                                                                defaultValue={moment(dateState[0].startDate).format('HH:mm')}
                                                                                onChange={e => handleTime(e)}/>
                                                                        </div>
                                                                        <div className='rdrTime'>
                                                                            <Input type='time' name='timeEnd' placeholder='hh:mm'
                                                                                defaultValue={moment(dateState[0].endDate).format('HH:mm')}
                                                                                onChange={e => handleTime(e)}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex flex-row-reverse pt-3'>
                                                                        <Button label='Reset' variant='outline-dark' type='button'
                                                                            onClick={onResetDate} className='btn-sm px-4 py-2'/>
                                                                    </div>
                                                                </DropdownItem>
                                                            </DropdownButton>
                                                            {errorForm.errorDate !== '' &&
                                                                <Typography variant='size-14' className='form-text text-danger'>
                                                                    {errorForm.errorDate}
                                                                </Typography>
                                                            }
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup className='mb-3'>
                                                            <Label for='source'>Source</Label>
                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                isMulti={true}
                                                                placeholder={'Search Source'}
                                                                isSearchable={false}
                                                                className='status-select'
                                                                name='source'
                                                                onChange={selected => {
                                                                    selected.find(option => option.value === 'all')
                                                                        ? handleSource(sourceOptions.splice(1))
                                                                        : handleSource(selected);
                                                                }}
                                                                value={defaultSource.length > 0
                                                                    ? defaultSource.map(row => ({ label: sourceMaker(row.label), value: row.value }))
                                                                    : []}
                                                                options={sourceOptions.map(row => ({ label: sourceMaker(row.label), value: row.value }))}/>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup className='mb-3'>
                                                            <Label for='filterSender'>Sender</Label>
                                                            <AsyncSelect
                                                                isMulti={true}
                                                                value={defaultSenders.length > 0
                                                                    ? defaultSenders.map(row => ({ label: row.label, value: row.value }))
                                                                    : []}
                                                                noOptionsMessage={() => 'Enter a Sender'}
                                                                cacheOptions={true}
                                                                loadOptions={loadOptions}
                                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                                name='filterSender'
                                                                className='filter-select'
                                                                onChange={(newTags) => handleSenderChange(newTags)}
                                                                placeholder={'Select Sender...'}/>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup className='mb-3'>
                                                            <Label for='filterRecipient'>Recipient</Label>
                                                            <AsyncSelect
                                                                isMulti={true}
                                                                value={defaultRecipients.length > 0
                                                                    ? defaultRecipients.map(row => ({ label: row.label, value: row.value }))
                                                                    : []}
                                                                noOptionsMessage={() => 'Enter a Recipient'}
                                                                cacheOptions={true}
                                                                loadOptions={loadOptions}
                                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                                name='filterRecipient'
                                                                className='filter-select'
                                                                onChange={(newTags) => handleRecipientChange(newTags)}
                                                                placeholder={'Select Recipient...'}/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup className='mb-3'>
                                                            <Label for='source'>Escalation</Label>
                                                            <Select
                                                                isMulti={true}
                                                                placeholder={'Search Escalation'}
                                                                isSearchable={false}
                                                                className='status-select'
                                                                name='escalation'
                                                                onChange={selected => {
                                                                    selected.find(option => option.value === 'all')
                                                                        ? handleEscalation(escalationOptions.splice(1))
                                                                        : handleEscalation(selected);
                                                                }}
                                                                value={defaultEscalation.length > 0
                                                                    ? defaultEscalation.map(row => ({ label: escalationMaker(row.label), value: row.value }))
                                                                    : []}
                                                                options={escalationOptions.map(row => ({ label: escalationMaker(row.label), value: row.value }))}/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Button label='Search' variant='primary' type='button'
                                                            onClick={onSearchClick} className='alerts__save-button px-4 py-2'/>
                                                    </Col>
                                                </Row>
                                            </fieldset>
                                        </Form>
                                    </Col>
                                </Row>
                                <div className='alerts__information mt-5'>
                                    <Row>
                                        {/* {JSON.stringify(selectedRows)} */}
                                        <Col lg={12} className='pb-4'>
                                            <Table className='alerts__table table-hover table-striped'
                                                loading={loading}
                                                isTimeout={isTimeout}
                                                tableColumns={table.columns}
                                                tableData={table.data}
                                                tablePagination={table.totalPages}
                                                totalNoOfRecords={table.totalNoOfRecords}
                                                selectableRows={true}
                                                activePage={activePage}
                                                pagination={true}
                                                sortable={true}
                                                fetching={table.loading}
                                                viewDetails={viewCommunicationAlertDetails}
                                                toggleSelection={toggleCheck}/>
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

const CommunicationAlerts: any = withLoading<React$Element<Props>>(CommunicationAlertsScreen);

export default CommunicationAlerts;
