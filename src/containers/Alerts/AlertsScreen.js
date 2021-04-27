// @flow
import React, { useState } from 'react';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import DatePicker from '../../components/base/DatePicker/DatePicker';
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

type Props = {
    tableColumns: Array,
    tableData: Array,
    filters: Array,
    setFilters: Function,
    viewAlertDetails: Function,
    sidebarMenu: Array<Menu>
}

function AlertsScreen({
    tableColumns,
    tableData,
    filters,
    setFilters,
    viewAlertDetails,
    sidebarMenu
}: Props): React$Element<any> {
    return (
        <div className='alerts'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={['Home', 'Alerts']} />
                <div className='alerts__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='alerts__header d-flex align-items-center'>
                                <Typography color='color-3' className='alerts__title mr-auto'>Alerts</Typography>
                                <div className='alerts__date-picker d-flex align-items-center justify-content-end mb-4'>
                                    <CustomDropdown tag='span'
                                        toggle={<input type='date' />}>
                                        <DropdownItem header={true} className='text-center'>
                                            <img src={filterIcon} alt='talbe-filter-icon' />
                                        </DropdownItem>
                                        <DropdownItem divider={true} />
                                        <div className='alerts__date-filter-options'>
                                            <FormGroup tag='fieldset'>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio' />{' '}
                                                    Today
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio' />{' '}
                                                    Last 7 Days
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio' />{' '}
                                                        <span className='mr-2'>Specific Date</span>
                                                    </Label>
                                                    <DatePicker width={55} format='dd MMM yyyy' className='alerts__date-filter-picker'
                                                        inputVariant='outlined' />
                                                </FormGroup>
                                            </FormGroup>
                                        </div>
                                        <DropdownItem divider={true} />
                                        <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                                            className='alerts__filter-reset-button float-right mr-2'/>
                                    </CustomDropdown>
                                    <Typography color='color-3' variant='size-16' className='mx-4'>to</Typography>
                                    <CustomDropdown tag='span'
                                        toggle={<input type='date' />}>
                                        <DropdownItem header={true} className='text-center'>
                                            <img src={filterIcon} alt='talbe-filter-icon' />
                                        </DropdownItem>
                                        <DropdownItem divider={true} />
                                        <div className='alerts__date-filter-options'>
                                            <FormGroup tag='fieldset'>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio' />{' '}
                                                    Today
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio' />{' '}
                                                    Last 7 Days
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check={true} className='mb-1'>
                                                    <Label check={true}>
                                                        <Input type='radio' name='radio' />{' '}
                                                        <span className='mr-2'>Specific Date</span>
                                                    </Label>
                                                    <DatePicker width={55} format='dd MMM yyyy' className='alerts__date-filter-picker'
                                                        inputVariant='outlined' />
                                                </FormGroup>
                                            </FormGroup>
                                        </div>
                                        <DropdownItem divider={true} />
                                        <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                                            className='alerts__filter-reset-button float-right mr-2'/>
                                    </CustomDropdown>
                                    <Button label={<>
                                        <FontAwesomeIcon className='mr-3' icon='file-download' size='sm' />
                                        <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                    </>}
                                    className='ml-4 d-flex align-items-center alerts__download-button'
                                    size='lg' />
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
                                        globalFilter={true}
                                        pagination={true}
                                        sortable={true}
                                        filters={filters}
                                        setFilters={setFilters}
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
