// @flow
import React, { useState, createRef } from 'react';
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
    Label
} from 'reactstrap';
import './alerts.scss';

import { setModalContent } from '../../redux/modules/modalEvent';

type Props = {
    breadcrumb: Array,
    tableColumns: Array,
    tableData: Array,
    viewAlertDetails: Function,
    isRowsSelected: Boolean,
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function
}

function AlertsScreen({
    breadcrumb,
    tableColumns,
    tableData,
    viewAlertDetails,
    isRowsSelected,
    sidebarMenu,
    handleCloseModal
}: Props): React$Element<any> {
    const dispatch = useDispatch();

    const showActionsModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionModal
                handleCloseModal={handleCloseModal} />
        }));
    };

    const datepickerOpen = createRef();
    const [dateRangeFilter, setDateRangeFilter] = useState(1);
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
                                    {!isRowsSelected
                                        ? (
                                            <>
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
                                                        className='alerts__filter-reset-button float-right mr-2'/>
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
                                                        className='alerts__filter-reset-button float-right mr-2'/>
                                                </CustomDropdown>
                                                <Button label={<>
                                                    <FontAwesomeIcon className='mr-2' icon='file-download' size='sm' />
                                                    <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                                </>}
                                                className='ml-4 d-flex align-items-center alerts__download-button'
                                                size='lg' />
                                            </>
                                        )
                                        : (
                                            <Button className='alerts__bulk-action-button' label={<Typography weight='light' className='my-1 mx-2'>Bulk Action</Typography>} onClick={showActionsModal}/>
                                        )}
                                </div>
                            </div>
                            {tableColumns === undefined || tableData === undefined
                                ? (
                                    <Spinner />
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
    handleCloseModal
}) => {
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
                        value: 'default'
                    }}
                    options={[
                        {
                            label: 'Base',
                            value: 'Base'
                        },
                        {
                            label: 'Manager',
                            value: 'Manager'
                        },
                        {
                            label: 'CO',
                            value: 'CO'
                        }
                    ]} />
            </FormGroup>
            <FormGroup className='mb-3'>
                <Label for='status'>Select Status</Label>
                <Select
                    name='status'
                    defaultValue={{
                        label: 'No Change',
                        value: 'default'
                    }}
                    options={[
                        {
                            label: <Badge status='Open' />,
                            value: <Badge status='Open'/>
                        },
                        {
                            label: <Badge status='In Review' />,
                            value: <Badge status='In Review'/>
                        },
                        {
                            label: <Badge status='Resolved' />,
                            value: <Badge status='Resolved'/>
                        },
                        {
                            label: <Badge status='Archived' />,
                            value: <Badge status='Archived'/>
                        }
                    ]} />
            </FormGroup>
            <FormGroup className='mb-3'>
                <Label for='assignee'>Select Assignee</Label>
                <Select
                    name='assignee'
                    defaultValue={{
                        label: 'No Change',
                        value: 'default'
                    }}
                    options={[
                        {
                            label: 'Person 1',
                            value: 'Person 1'
                        },
                        {
                            label: 'Person 2',
                            value: 'Person 2'
                        },
                        {
                            label: 'Person 3',
                            value: 'Person 3'
                        },
                        {
                            label: 'Person 4',
                            value: 'Person 4'
                        }
                    ]} />
            </FormGroup>
            <FormGroup className='mb-5'>
                <Label for='notes'>Notes</Label>
                <Input type='textarea' rows={5} name='notes'
                    placeholder='Leave blank if there is no change to apply' />
            </FormGroup>
            <div className='action-modal__buttons d-flex justify-content-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal}/>
                <Button label='Apply' variant='secondary' className='alerts__save-button px-4 py-2'
                    onClick={handleCloseModal} />
            </div>
        </div>
    );
};
