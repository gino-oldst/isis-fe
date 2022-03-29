// @flow
import React, { useState, useEffect, createRef } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import Select, { components } from 'react-select';
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
    Form,
    Input,
    Label,
    Alert,
    Row,
    Col
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';
import './communication_search.scss';
import { setModalContent } from '../../redux/modules/modalEvent';
import { DropdownButton, OverlayTrigger, Popover } from 'react-bootstrap';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    filterDate:Array<any>,
    setFilterDate: Function,
    filterMessage: String,
    onSubmit: Function,
    onChange: Function,
    handleSenderChange: Function,
    handleRecipientChange: Function
}

function CommunicationSearchScreen({
    loading,
    userId,
    breadcrumb,
    sidebarMenu,
    filterDate,
    setFilterDate,
    filterMessage,
    onSubmit,
    onChange,
    handleSenderChange,
    handleRecipientChange
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);

    const options = [
        { value: 'alex@mcgfutures.com', label: 'alex@mcgfutures.com' },
        { value: 'chevillon@nyenburgh.com', label: 'chevillon@nyenburgh.com' },
        { value: 'daniel.caplin@marianacap.com', label: 'daniel.caplin@marianacap.com' }
    ];

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const [dateOptions, setDateOptions] = useState({
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const [dateState, setDateState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const convertedStartDate = dateState[0].startDate.toLocaleDateString([], dateOptions);

    const convertedEndDate = dateState[0].endDate.toLocaleDateString([], dateOptions);

    const handleDates = (dates) => {
        setDateState(dates);
        setFilterDate(dates);
    };

    const popoverClickRootClose = (
        <Popover id='popover-trigger-click-root-close' title='Choose dates...' style={{ maxWidth: '1000px' }}>
            <DateRangePicker
                onChange={item => handleDates([item.selection])}
                inputRanges={[]}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={dateState}
                value={filterDate.startDate === '' ? null : filterDate}
                direction='horizontal'/>
        </Popover>
    );

    const logout = () => {
        window.location.href = '/communication_search_results';
    };

    // const handleStatus = e => {
    //     console.log(e);
    // };
    const [status, setStatus] = useState([
        { id: 1, value: 'open', name: 'Open', isChecked: false },
        { id: 2, value: 'inReview', name: 'In Review', isChecked: false },
        { id: 3, value: 'resolved', name: 'Resolved', isChecked: false },
        { id: 4, value: 'archived', name: 'Archived', isChecked: false },
        { id: 5, value: 'notAvailable', name: 'Not Available', isChecked: false }
    ]);

    const [source, setSource] = useState([
        { id: 1, value: 'email', isChecked: false },
        { id: 2, value: 'reuters', isChecked: false },
        { id: 3, value: 'bloomberg', isChecked: false }
    ]);

    const [checkedStatus, setCheckedStatus] = useState([]);
    const [checkedSource, setCheckedSource] = useState([]);

    // Add/Remove checked item from list
    const handleStatus = (event) => {
        var updatedList = [...checkedStatus];

        if (event.target.checked) {
            updatedList = [...checkedStatus, event.target.value];
        } else {
            updatedList.splice(checkedStatus.indexOf(event.target.value), 1);
        }

        setCheckedStatus(updatedList);
    };

    const handleSource = (event) => {
        var updatedList = [...checkedSource];

        if (event.target.checked) {
            updatedList = [...checkedSource, event.target.value];
        } else {
            updatedList.splice(checkedSource.indexOf(event.target.value), 1);
        }

        setCheckedSource(updatedList);
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
                            <Typography color='color-3' className='alerts__title mr-auto'>Search Message</Typography>
                            <div className='d-flex align-item-center'>
                                <Form className='w-100' onSubmit={onSubmit}>
                                    <Row>
                                        <Col lg={8}>
                                            <div className='alerts__input-fields'>
                                                <FormGroup>
                                                    <Label>Message / Alert ID</Label>
                                                    <Input type='text' name='filterId' placeholder='Search Unique ID'
                                                        onChange={onChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Subject / Message</Label>
                                                    <Input type='text' name='filterText' placeholder='Search a keyword'
                                                        onChange={onChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Sender</Label>
                                                    <Select
                                                        options={options}
                                                        isMulti={true}
                                                        name='filterSender'
                                                        placeholder={'Select Sender...'}
                                                        onChange={handleSenderChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Recipient</Label>
                                                    <Select
                                                        options={options}
                                                        isMulti={true}
                                                        name='filterRecipient'
                                                        placeholder={'Select Recipient...'}
                                                        onChange={handleRecipientChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Date/Time Range</Label>
                                                    {/* <OverlayTrigger trigger='click' rootClose={true} placement='top-start'
                                                        overlay={popoverClickRootClose}>
                                                        <DropdownButton className='w-100' title='Date Range'/>
                                                    </OverlayTrigger> */}
                                                    <DropdownButton variant='outline-light' id='dropdown-basic-button'
                                                        title={filterDate[0].startDate === '' ? 'Select Date' : convertedStartDate + ' - ' + convertedEndDate}>
                                                        <DropdownItem>
                                                            <DateRangePicker
                                                                onChange={item => handleDates([item.selection])}
                                                                inputRanges={[]}
                                                                showSelectionPreview={true}
                                                                moveRangeOnFirstSelection={false}
                                                                months={2}
                                                                ranges={dateState}
                                                                value={filterDate.startDate === '' ? null : filterDate}
                                                                direction='horizontal'/>
                                                        </DropdownItem>
                                                    </DropdownButton>
                                                </FormGroup>
                                                <Button label='Search' variant='secondary'
                                                    onClick={logout} className='alerts__save-button px-4 py-2'/>
                                            </div>
                                        </Col>
                                        <Col lg={3} className='offset-1'>
                                            <div className='alerts__status-filters'>
                                                {JSON.stringify(checkedStatus)}
                                                <Typography color='color-3' className='mr-auto' weight='bold'
                                                    variant='size-16'>Status</Typography>
                                                <FormGroup tag='fieldset'>
                                                    <CheckboxGroup onChange={console.log}>
                                                        <FormGroup check={true} className='mb-1'>
                                                            <Label check={true}>
                                                                <AllCheckerCheckbox/>
                                                                <span className='box-label'>(Select All)</span>
                                                            </Label>
                                                        </FormGroup>
                                                        {status.map(stat => (
                                                            <FormGroup check={true} className='mb-1'>
                                                                <Label check={true}>
                                                                    <Checkbox value={stat.value} />
                                                                    <span className='box-label'>{stat.name}</span>
                                                                </Label>
                                                            </FormGroup>
                                                        ))}
                                                    </CheckboxGroup>
                                                    {/* <FormGroup check={true} className='mb-1'>
                                                        <Label check={true}>
                                                            <Input type='checkbox' name='filterStatus' value='open'
                                                                onChange={e => handleStatus(e)}/>
                                                            <span className='box-label'>Open</span>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check={true} className='mb-1'>
                                                        <Label check={true}>
                                                            <Input type='checkbox' name='filterStatus' value='inReview'
                                                                onChange={e => handleStatus(e)}/>
                                                            <span className='box-label'>In Review</span>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check={true} className='mb-1'>
                                                        <Label check={true}>
                                                            <Input type='checkbox' name='filterStatus' value='resolved'
                                                                onChange={e => handleStatus(e)}/>
                                                            <span className='box-label'>Resolved</span>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check={true} className='mb-1'>
                                                        <Label check={true}>
                                                            <Input type='checkbox' name='filterStatus' value='archived'
                                                                onChange={e => handleStatus(e)}/>
                                                            <span className='box-label'>Archived</span>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check={true} className='mb-1'>
                                                        <Label check={true}>
                                                            <Input type='checkbox' name='filterStatus' value='notAvailable'
                                                                onChange={e => handleStatus(e)}/>
                                                            <span className='box-label'>N/A</span>
                                                        </Label>
                                                    </FormGroup> */}
                                                </FormGroup>
                                            </div>
                                            <div className='alerts__status-filters'>
                                                {JSON.stringify(checkedSource)}
                                                <Typography color='color-3' className='mr-auto' weight='bold'
                                                    variant='size-16'>Source</Typography>
                                                <FormGroup tag='fieldset'>
                                                    <FormGroup check={true} className='mb-1'>
                                                        <Label check={true} className='d-flex align-items-center'>
                                                            <Input type='checkbox' name='filterSouce' value='selectAll'
                                                                onChange={e => handleSource(e)}/>
                                                            <span className='box-label' >(Select All)</span>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check={true} className='mb-1'>
                                                        <Label check={true}>
                                                            <Input type='checkbox' name='filterSouce' value='reuters'
                                                                onChange={e => handleSource(e)}/>
                                                            <span className='box-label'>Reuters</span>
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check={true} className='mb-1'>
                                                        <Label check={true}>
                                                            <Input type='checkbox' name='filterSouce' value='bloomberg'
                                                                onChange={e => handleSource(e)}/>
                                                            <span className='box-label'>Bloomberg</span>
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>
                                                {/* <Button label={<>
                                                    <FontAwesomeIcon className='mr-1' icon='file-download' size='sm' />
                                                    <Typography weight='light' className='my-1 mx-2'>Download</Typography>
                                                </>} */}
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const CommunicationSearch: any = withLoading<React$Element<Props>>(CommunicationSearchScreen);

export default CommunicationSearch;
