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
    InputGroupText,
    FormFeedback,
    FormText
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
import AsyncSelect from 'react-select/async';

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
    filterRecipient: Array<any>,
    loadOptions: Function,
    errorForm: Array<Any>
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
    filterRecipient,
    loadOptions,
    errorForm
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

    const convertedStartDate = moment(dateState[0].startDate).utc().local().format('MMM. DD, YYYY hh:mm A'); // for adding time in format hh:mm A

    const convertedEndDate = moment(dateState[0].endDate).utc().local().format('MMM. DD, YYYY hh:mm A'); // for adding time in format hh:mm A

    const handleDates = (dates) => {
        var copyDates = dateState[0];

        Object.keys(copyDates).map((e, i) => {
            if (e == 'startDate') {
                var hours = parseInt(copyDates[e].getHours());
                var minutes = parseInt(copyDates[e].getMinutes());

                dates[0].startDate.setHours(hours, minutes, 0, 0);
            } else if (e == 'endDate') {
                var hours = parseInt(copyDates[e].getHours());
                var minutes = parseInt(copyDates[e].getMinutes());

                dates[0].endDate.setHours(hours, minutes, 0, 0);
            }
        });

        setDateState(dates);
        setFilterDate(dates);
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
        { id: 1, value: 'EMAIL', name: 'Email', isChecked: false, disabled: true },
        { id: 2, value: 'REUTERS', name: 'Reuters', isChecked: false, disabled: false },
        { id: 3, value: 'BLOOMBERG_CHAT', name: 'Bloomberg Chat', isChecked: false, disabled: false },
        { id: 4, value: 'BLOOMBERG_EMAIL', name: 'Bloomberg Email', isChecked: false, disabled: false }
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
        <div className='communication-search'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='communication-search__content'>
                        <Card className='px-4 py-2'>
                            <CardBody>
                                <Typography color='color-3' className='communication-search__title mr-auto'>Search Message</Typography>
                                <div className='d-flex align-item-center'>
                                    <Form className='w-100' onSubmit={onSubmit}>
                                        <Row>
                                            <Col lg={8}>
                                                <div className='communication-search__input-fields'>
                                                    <FormGroup>
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
                                                    </FormGroup>
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
                                                        <Label>Sender*</Label>
                                                        {/* <ReactTagInput
                                                            tags={filterSender}
                                                            placeholder='Select Sender'
                                                            removeOnBackspace={true}
                                                            onChange={(newTags) => handleSenderChange(newTags)}
                                                            validator={(value) => validateEmail(value)}/> */}
                                                        <AsyncSelect
                                                            isMulti={true}
                                                            cacheOptions={true}
                                                            loadOptions={loadOptions}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                            name='filterSender'
                                                            className='filter-select'
                                                            onChange={(newTags) => handleSenderChange(newTags)}
                                                            placeholder={'Select Sender...'}/>
                                                        {errorForm.errorSenders !== '' &&
                                                            <Typography variant='size-14' className='form-text text-danger'>
                                                                {errorForm.errorSenders}
                                                            </Typography>
                                                        }
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>Recipient*</Label>
                                                        <AsyncSelect
                                                            isMulti={true}
                                                            cacheOptions={true}
                                                            loadOptions={loadOptions}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                            name='filterRecipient'
                                                            className='filter-select'
                                                            onChange={(newTags) => handleRecipientChange(newTags)}
                                                            placeholder={'Select Recipient...'}/>
                                                        {errorForm.errorRecipients !== '' &&
                                                            <Typography variant='size-14' className='form-text text-danger'>
                                                                {errorForm.errorRecipients}
                                                            </Typography>
                                                        }
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>Date/Time Range*</Label>
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
                                                                            required={true} formNoValidate={true} onChange={e => handleTime(e)}/>
                                                                    </div>
                                                                    <div className='rdrTime'>
                                                                        <Input type='time' name='timeEnd' placeholder='hh:mm'
                                                                            required={true} formNoValidate={true} onChange={e => handleTime(e)}/>
                                                                    </div>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownButton>
                                                        {errorForm.errorDate !== '' &&
                                                            <Typography variant='size-14' className='form-text text-danger'>
                                                                {errorForm.errorDate}
                                                            </Typography>
                                                        }
                                                    </FormGroup>
                                                    <Button label='Search' variant='secondary' type='submit'
                                                        className='communication-search__save-button px-4 py-2'/>
                                                </div>
                                            </Col>
                                            <Col lg={3} className='offset-1'>
                                                {/* <div className='communication-search__status-filters'>
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
                                                <div className='communication-search__status-filters'>
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
                                                                    <Checkbox value={{ label: sourc.name, value: sourc.value }} disabled={sourc.disabled}/>
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
