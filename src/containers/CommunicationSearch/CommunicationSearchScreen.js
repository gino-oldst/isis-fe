// @flow
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DropdownButton } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { MdInsertComment } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import {
    Card,
    CardBody, Col, DropdownItem, Form, FormGroup, Input, InputGroup,
    InputGroupAddon,
    InputGroupText, Label, Row
} from 'reactstrap';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import Button from '../../components/base/Button/Button';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import Typography from '../../components/base/Typography/Typography';
import withLoading from '../../components/modules/withLoading/withLoading';
import type { Menu } from '../../types';
import './communication_search.scss';

import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import AsyncSelect from 'react-select/async';
import { DATE_TO_SHORT_DATE } from '../../utils/helpers';

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
    errorForm: Array<Any>,
    filterSearchForm: Array<Any>,
    status:Array<Any>,
    source:Array<Any>
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
    errorForm,
    filterSearchForm,
    status,
    source
}: Props): React$Element<any> {
    const dispatch = useDispatch();

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
            startDate: new Date(today.setHours(0, 0, 0, 0)),
            endDate: new Date(today.setHours(23, 59, 0, 0)),
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

    const convertedStartDate = DATE_TO_SHORT_DATE(dateState[0].startDate);

    const convertedEndDate = DATE_TO_SHORT_DATE(dateState[0].endDate);

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
                                                                defaultValue={filterSearchForm.filterId} className='shadow-none isis-control' placeholder='Search Unique ID'/>
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
                                                                defaultValue={filterSearchForm.filterText} className='shadow-none isis-control' placeholder='Search a Keyword'/>
                                                        </InputGroup>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>Sender*</Label>
                                                        <AsyncSelect
                                                            isMulti={true}
                                                            value={filterSearchForm.filterSenders.length > 0
                                                                ? filterSearchForm.filterSenders.map(row => ({ label: row.label, value: row.value }))
                                                                : []}
                                                            noOptionsMessage={() => 'Enter a Sender'}
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
                                                        <Label>Recipient</Label>
                                                        <AsyncSelect
                                                            isMulti={true}
                                                            value={filterSearchForm.filterRecipients.length > 0
                                                                ? filterSearchForm.filterRecipients.map(row => ({ label: row.label, value: row.value }))
                                                                : []}
                                                            noOptionsMessage={() => 'Enter a Recipient'}
                                                            cacheOptions={true}
                                                            loadOptions={loadOptions}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                            name='filterRecipient'
                                                            className='filter-select'
                                                            onChange={(newTags) => handleRecipientChange(newTags)}
                                                            placeholder={'Select Recipient...'}/>
                                                        {/* {errorForm.errorRecipients !== '' &&
                                                            <Typography variant='size-14' className='form-text text-danger'>
                                                                {errorForm.errorRecipients}
                                                            </Typography>
                                                        } */}
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
                                                                            defaultValue={moment(dateState[0].startDate).format('HH:mm')}
                                                                            onChange={e => handleTime(e)}/>
                                                                    </div>
                                                                    <div className='rdrTime'>
                                                                        <Input type='time' name='timeEnd' placeholder='hh:mm'
                                                                            defaultValue={moment(dateState[0].endDate).format('HH:mm')}
                                                                            onChange={e => handleTime(e)}/>
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
                                                </div>
                                            </Col>
                                            <Col lg={3} className='offset-lg-1 '>
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
                                                <div className='communication-search__status-filters mb-4'>
                                                    <Typography color='color-3' className='mr-auto' weight='bold'
                                                        variant='size-16'>Source</Typography>
                                                    <CheckboxGroup onChange={handleSource}>
                                                        <FormGroup check={true} className='mb-1'>
                                                            <Label check={true} className='d-flex align-items-center'>
                                                                <AllCheckerCheckbox/>
                                                                <span className='box-label'>(Select All)</span>
                                                            </Label>
                                                        </FormGroup>
                                                        {source.map(sourc => (
                                                            <FormGroup check={true} className='mb-1 '>
                                                                <Label check={true} className='d-flex align-items-center'>
                                                                    <Checkbox checked={filterSearchForm.filterSource.find(obj => obj.value === sourc.value)} value={{ label: sourc.name, value: sourc.value }} disabled={sourc.disabled}/>
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
                                        <Row>
                                            <Col>
                                                <Button label='Search' variant='secondary' type='submit'
                                                    className='communication-search__save-button px-4 py-2'/>
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
