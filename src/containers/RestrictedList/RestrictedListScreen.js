// @flow
import React, { useState, useEffect, createRef } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
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
import './restricted-list.scss';

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
    handleDownloadAlertsList: Function,
    loadRestrictedList: Function
}

function RestrictedListScreen({
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
    handleDownloadAlertsList,
    loadRestrictedList
}: Props): React$Element<any> {
    const { pageSize, activePage } = useSelector(({ table }) => table);
    const { table } = useSelector(({ restrictedList }) => restrictedList);

    const datepickerOpen = createRef();
    const [dateRangeFilter, setDateRangeFilter] = useState(0);
    const [dateRangeFilterValues, setDateRangeFilterValues] = useState({
        start: moment().subtract(7, 'days')._d,
        end: new Date()
    });
    const [dateRangeValues, setDateRangeValues] = useState({
        start: moment().subtract(7, 'days')._d,
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

    // useEffect(() => {
    //     dispatch(filterRestrictedListData(dateRangeFilter, dateRangeValues));
    // }, [dateRangeFilter, dateRangeValues]);

    useEffect(() => {
        loadRestrictedList(
            activePage,
            pageSize,
            `${dateRangeValues.start.toISOString().split('T')[0]}T00:00:00Z`,
            `${dateRangeValues.end.toISOString().split('T')[0]}T23:59:59Z`
        );
    }, [dateRangeFilter, dateRangeValues, pageSize, activePage]);

    return (
        <div className='restricted-list'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='restricted-list__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='restricted-list__header d-flex align-items-center'>
                                <Typography color='color-3' className='restricted-list__title mr-auto'>Restricted List</Typography>
                                <div className='restricted-list__date-picker d-flex align-items-center justify-content-end mb-4'>
                                    <CustomDropdown tag='span'
                                        toggle={<DatePicker width='70' inputVariant='outlined' keyboard={true}
                                            value={dateRangeValues.start} />}>
                                        <DropdownItem header={true} className='text-center'>
                                            <img src={filterIcon} alt='talbe-filter-icon' />
                                        </DropdownItem>
                                        <DropdownItem divider={true} />
                                        <div className='restricted-list__date-filter-options'>
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
                                            className='restricted-list__filter-reset-button float-right mr-2' onClick={() => handleDateFilterChange(0)} />
                                    </CustomDropdown>
                                    <Typography color='color-3' variant='size-16' className='mx-4'>to</Typography>
                                    <CustomDropdown tag='span'
                                        toggle={<DatePicker width='70' inputVariant='outlined' keyboard={true}
                                            value={dateRangeValues.end} />}>
                                        <DropdownItem header={true} className='text-center'>
                                            <img src={filterIcon} alt='talbe-filter-icon' />
                                        </DropdownItem>
                                        <DropdownItem divider={true} />
                                        <div className='restricted-list__date-filter-options'>
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
                                                    {/* <DatePicker width={55} value={dateRangeValues.end} className='restricted-list__date-filter-picker'
                                                        inputVariant='outlined' onChange={e => handleDateChange('end', e)} /> */}
                                                </FormGroup>
                                            </FormGroup>
                                        </div>
                                        <DropdownItem divider={true} />
                                        <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                                            className='restricted-list__filter-reset-button float-right mr-2' onClick={() => handleDateFilterChange(0)} />
                                    </CustomDropdown>
                                </div>
                            </div>
                            {loading || tableColumns === undefined || tableData === undefined
                                ? (
                                    <Spinner animation='border' role='status' className='d-flex mx-auto my-5 text-center'>
                                        <span className='sr-only'>Loading...</span>
                                    </Spinner>
                                )
                                : (
                                    <Table className='restricted-list__table'
                                        tableData={tableData}
                                        tableColumns={tableColumns}
                                        tablePagination={table.totalPages}
                                        totalNoOfRecords={table.totalNoOfRecords}
                                        activePage={activePage}
                                        selectableRows={false}
                                        globalFilter={false}
                                        pagination={true}
                                        fetching={table.loading}
                                        sortable={true} />
                                )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const RestrictedList: any = withLoading<React$Element<Props>>(RestrictedListScreen);

export default RestrictedList;
