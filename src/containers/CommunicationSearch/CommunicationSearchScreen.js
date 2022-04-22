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
    getDateRangeLocal,
    isValidEmail
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
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';
import { FaSearch } from 'react-icons/fa';
import { MdInsertComment } from 'react-icons/md';
import { useIsMount } from '../../hooks/useIsMount';
import './communication_search.scss';
import { setModalContent } from '../../redux/modules/modalEvent';
import { DropdownButton, OverlayTrigger, Popover } from 'react-bootstrap';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import ReactTagInput from '@pathofdev/react-tag-input';
import { setFlashNotification } from '../../redux/modules/flashNotification';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    filterDate: Array<any>,
    setFilterDate: Function,
    filterMessage: String,
    onSubmit: Function,
    onChange: Function,
    handleSenderChange: Function,
    handleRecipientChange: Function,
    handleSource: Function,
    handleStatus: Function,
    filterSender: Array<any>,
    filterRecipient: Array<any>
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
    handleRecipientChange,
    handleSource,
    handleStatus,
    filterSender,
    filterRecipient
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

    const convertedStartDate = moment(dateState[0].startDate).utc().local().format('MMM. DD, YYYY'); // for adding time in format hh:mm A

    const convertedEndDate = moment(dateState[0].endDate).utc().local().format('MMM. DD, YYYY'); // for adding time in format hh:mm A

    const handleDates = (dates) => {
        setDateState(dates);
        setFilterDate(dates);
    };

    const handleTime = (event) => {
        var name = event.target.getAttribute('name');
        var timeParts = event.target.value.match(/(\d+):(\d+)/);

        if (name == 'timeStart' && timeParts) {
            var hours = parseInt(timeParts[1]);
            var minutes = parseInt(timeParts[2]);

            setDateState({
                ...dateState,
                startDate: dateState[0].startDate.setHours(hours, minutes, 0, 0)
            });
        } else if (name == 'timeEnd' && timeParts) {
            var hours = parseInt(timeParts[1]);
            var minutes = parseInt(timeParts[2]);

            dateState[0].endDate.setHours(hours, minutes, 0, 0);
        }

        console.log(dateState);

        setDateState(dateState);
        setFilterDate(dateState);

        console.log('start:', dateState[0].startDate);
        console.log('end:', dateState[0].endDate);
    };

    const logout = () => {
        window.location.href = '/communication_search_results';
    };

    const [status, setStatus] = useState([
        { id: 1, value: 'open', name: 'Open', isChecked: false },
        { id: 2, value: 'inReview', name: 'In Review', isChecked: false },
        { id: 3, value: 'resolved', name: 'Resolved', isChecked: false },
        { id: 4, value: 'archived', name: 'Archived', isChecked: false },
        { id: 5, value: 'notAvailable', name: 'Not Available', isChecked: false }
    ]);

    const [source, setSource] = useState([
        { id: 1, value: 'email', name: 'Email', isChecked: false, disabled: true },
        { id: 2, value: 'reuters', name: 'Reuters', isChecked: false, disabled: false },
        { id: 3, value: 'bloomberg_chat', name: 'Bloomberg Chat', isChecked: false, disabled: false },
        { id: 4, value: 'bloomberg_email', name: 'Bloomberg Email', isChecked: false, disabled: false }
    ]);

    const [tags, setTags] = React.useState(['example tag']);

    const validateEmail = (value) => {
        const isEmail = isValidEmail(value);

        if (!isEmail) {
            dispatch(setFlashNotification({
                message: 'Please enter an e-mail address.',
                isError: true
            }));
        }

        // Return boolean to indicate validity
        return isEmail;
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
                                <Typography color='color-3' className='alerts__title mr-auto'>Search Message</Typography>
                                <div className='d-flex align-item-center'>
                                    <Form className='w-100' onSubmit={onSubmit}>
                                        <Row>
                                            <Col lg={8}>
                                                <div className='alerts__input-fields'>
                                                    {/* <FormGroup>
                                                        <Label>Message / Alert ID</Label>
                                                        <InputGroup>
                                                            <InputGroupAddon addonType='prepend'>
                                                                <InputGroupText>
                                                                    <FaSearch size={18} color='#004C98'/>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input name='filterId' type='text' onChange={onChange}
                                                                className='shadow-none isis-control' placeholder='Search Unique ID'/>
                                                        </InputGroup>
                                                    </FormGroup> */}
                                                    <FormGroup>
                                                        <Label>Subject / Message</Label>
                                                        <InputGroup>
                                                            <InputGroupAddon addonType='prepend'>
                                                                <InputGroupText>
                                                                    <MdInsertComment size={18} color='#004C98'/>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input name='filterText' type='text' onChange={onChange}
                                                                className='shadow-none isis-control' placeholder='Search a Keyword'/>
                                                        </InputGroup>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>Sender</Label>
                                                        <ReactTagInput
                                                            tags={filterSender}
                                                            placeholder='Select Sender'
                                                            removeOnBackspace={true}
                                                            onChange={(newTags) => handleSenderChange(newTags)}
                                                            validator={(value) => validateEmail(value)}/>
                                                        {/* <Select
                                                            options={options}
                                                            isMulti={true}
                                                            name='filterSender'
                                                            placeholder={'Select Sender...'}
                                                            onChange={handleSenderChange}/> */}
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>Recipient</Label>
                                                        <Input type='text' name='filterText' style={{ border: '1px' }}
                                                            placeholder='Select Recipient' disabled={true}/>
                                                        {/* <ReactTagInput
                                                            readOnly={true}
                                                            tags={filterRecipient}
                                                            placeholder='Select Recipient'
                                                            removeOnBackspace={true}
                                                            onChange={(newTags) => handleRecipientChange(newTags)}
                                                            validator={(value) => validateEmail(value)}/> */}
                                                        {/* <Select
                                                            options={options}
                                                            isMulti={true}
                                                            name='filterRecipient'
                                                            placeholder={'Select Recipient...'}
                                                            onChange={handleRecipientChange}/> */}
                                                    </FormGroup>
                                                    <FormGroup>
                                                        {/* {JSON.stringify(moment(dateState[0].startDate).utc().local().format('MMM. DD, YYYY hh:mm A'))}
                                                        {JSON.stringify(moment(dateState[0].endDate).utc().local().format('MMM. DD, YYYY hh:mm A'))}
                                                        {JSON.stringify(filterDate)} */}
                                                        <Label>Date/Time Range</Label>
                                                        <DropdownButton variant='outline-light' id='dropdown-basic-button' alignRight={true}
                                                            title={filterDate[0].startDate === '' ? 'Select Date' : convertedStartDate + ' - ' + convertedEndDate}>
                                                            <DropdownItem>
                                                                <DateRangePicker
                                                                    onChange={item => handleDates([item.selection])}
                                                                    inputRanges={[]}
                                                                    showSelectionPreview={true}
                                                                    moveRangeOnFirstSelection={false}
                                                                    months={2}
                                                                    ranges={dateState}
                                                                    showDateDisplay={false}
                                                                    value={filterDate.startDate === '' ? null : filterDate}
                                                                    direction='horizontal'/>
                                                                {/* <div className='d-flex time-wrapper'>
                                                                    <div className='rdrTime'>
                                                                        <Input type='time' name='timeStart' placeholder='hh:mm'
                                                                            required={true} formNoValidate={true} onChange={e => handleTime(e)}/>
                                                                    </div>
                                                                    <div className='rdrTime'>
                                                                        <Input type='time' name='timeEnd' placeholder='hh:mm'
                                                                            required={true} formNoValidate={true} onChange={e => handleTime(e)}/>
                                                                    </div>
                                                                </div> */}
                                                            </DropdownItem>
                                                        </DropdownButton>
                                                    </FormGroup>
                                                    <Button label='Search' variant='secondary' type='subnmit'
                                                        className='alerts__save-button px-4 py-2'/>
                                                </div>
                                            </Col>
                                            <Col lg={3} className='offset-1'>
                                                {/* <div className='alerts__status-filters'>
                                                    <Typography color='color-3' className='mr-auto' weight='bold'
                                                        variant='size-16'>Status</Typography>
                                                    <CheckboxGroup onChange={handleStatus} defaultDisabled={true}>
                                                        <FormGroup check={true} className='mb-1'>
                                                            <Label check={true} className='d-flex align-items-center'>
                                                                <AllCheckerCheckbox/>
                                                                <span className='box-label'>(Select All)</span>
                                                            </Label>
                                                        </FormGroup>
                                                        {status.map(stat => (
                                                            <FormGroup check={true} className='mb-1 '>
                                                                <Label check={true} className='d-flex align-items-center'>
                                                                    <Checkbox value={stat.value} />
                                                                    <span className='box-label'>{stat.name}</span>
                                                                </Label>
                                                            </FormGroup>
                                                        ))}
                                                    </CheckboxGroup>
                                                </div> */}
                                                <div className='alerts__status-filters'>
                                                    <Typography color='color-3' className='mr-auto' weight='bold'
                                                        variant='size-16'>Source</Typography>
                                                    <CheckboxGroup onChange={handleSource}>
                                                        <FormGroup check={true} className='mb-1'>
                                                            <Label check={true} className='d-flex align-items-center'>
                                                                <AllCheckerCheckbox disabled={true}/>
                                                                <span className='box-label'>(Select All)</span>
                                                            </Label>
                                                        </FormGroup>
                                                        {source.map(sourc => (
                                                            <FormGroup check={true} className='mb-1 '>
                                                                <Label check={true} className='d-flex align-items-center'>
                                                                    <Checkbox value={sourc.value} disabled={sourc.disabled}/>
                                                                    <span className='box-label'>{sourc.name}</span>
                                                                </Label>
                                                            </FormGroup>
                                                        ))}
                                                    </CheckboxGroup>
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
        </div>
    );
}

const CommunicationSearch: any = withLoading<React$Element<Props>>(CommunicationSearchScreen);

export default CommunicationSearch;
