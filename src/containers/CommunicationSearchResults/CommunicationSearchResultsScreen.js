// @flow
import React, { useState, useEffect, createRef } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
// import Table from '../../components/base/Table/Table';
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
    numberWithCommas,
    sourceMaker
} from '../../utils/helpers';
import {
    Card,
    CardBody,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Alert,
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Form
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { DropdownButton, OverlayTrigger, Popover } from 'react-bootstrap';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import './communication-search-results.scss';
import BootstrapTable from '../../components/base/BootstrapTable/BootstrapTable';
import IsisTable from '../../components/base/IsisTable/IsisTable';
import { FaSearch } from 'react-icons/fa';
import { MdInsertComment } from 'react-icons/md';
import AsyncSelect from 'react-select/async';
import { COMMUNICATION_ALERT_SOURCE_OPTIONS } from '../../config/constants';

type Props = {
    // TODO add props here
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    table: Any,
    activePage: Int,
    useMediaQuery: Function,
    handleCloseModal: Function,
    viewCommunicationAlertDetails: Function,
    isCheckAll: Boolean,
    handleSelectAll?: (e: any) => void,
    handleItemCheck?: (e: any) => void,
    handleItemClick?: (e: any) => void,
    loadSearchData?: (e: any) => void,
    isLoading?: boolean,
    setSearchId?: (e: any) => void,
    setKeyword?: (e: any) => void,
    handleSearchClick?: (e: any) => void,
    filterKeyword: String,
    filterId: String,
    loadOptions: Function,
    handleRecipientChange: Function,
    handleSenderChange: Function,
    filterDate: Array<any>,
    setFilterDate: Function,
    defaultRecipients: Array<any>,
    defaultSender:Array<any>,
    handleSource: Function,
    handleUniqueID: Function,
    handleKeyword: Function,
    defaultSources: Array<any>,
    errorForm: Array<Any>,
    isTimeout: Boolean,
    handleDownloadSearchData: Function,
    downloading: Boolean
}

function CommunicationSearchResultsScreen({
    defaultRecipients,
    defaultSender,
    defaultSources,
    loading,
    userId,
    breadcrumb,
    sidebarMenu,
    table,
    activePage,
    useMediaQuery,
    handleCloseModal,
    viewCommunicationAlertDetails,
    isCheckAll,
    handleSelectAll,
    handleItemCheck,
    handleItemClick,
    loadSearchData,
    isLoading,
    setSearchId,
    setKeyword,
    filterKeyword,
    filterId,
    handleSearchClick,
    loadOptions,
    handleRecipientChange,
    handleSenderChange,
    filterDate,
    setFilterDate,
    handleSource,
    handleUniqueID,
    handleKeyword,
    errorForm,
    isTimeout,
    handleDownloadSearchData,
    downloading
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);

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

    const sourceOptions = [{ label: 'Select All', value: 'all' }, ...Object.keys(COMMUNICATION_ALERT_SOURCE_OPTIONS).map(row => ({
        label: row,
        value: row
    }))];

    useEffect(() => {
        var newDate = [{
            startDate: filterDate[0].startDate ? filterDate[0].startDate : new Date(today.setHours(0, 0, 0, 0)),
            endDate: filterDate[0].endDate ? filterDate[0].endDate : new Date(today.setHours(23, 59, 0, 0)),
            key: 'selection'
        }];

        setDateState(newDate);
    }, [filterDate]);

    const convertedStartDate = moment(dateState[0].startDate).utc().local().format('MMM. DD, YYYY hh:mm A'); // for adding time in format hh:mm A

    const convertedEndDate = moment(dateState[0].endDate).utc().local().format('MMM. DD, YYYY hh:mm A'); // for adding time in format hh:mm A

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

    console.log(defaultSources);

    return (
        <div className='search-results'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='search-results__content'>
                        <Card className='px-4 py-2'>
                            <CardBody>
                                <div className='search-results__header d-flex align-items-center justify-content-between'>
                                    <Typography color='color-3' className='search-results__title'>Search Results</Typography>
                                    <Button weight='light' className='search-results__download' label='Download Data'
                                        isLoading={downloading} disabled={loading} onClick={handleDownloadSearchData}/>
                                </div>
                                <Row className='pl-2'>
                                    <Col lg={12}>
                                        <Form onSubmit={handleSearchClick}>
                                            <fieldset disabled={loading}>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for='filterId'>Unique ID</Label>
                                                            <InputGroup>
                                                                <InputGroupAddon addonType='prepend'>
                                                                    <InputGroupText>
                                                                        <FaSearch size={18} color='#004C98'/>
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input name='filterId' type='text' defaultValue={filterId}
                                                                    onChange={handleUniqueID} className='shadow-none isis-control' placeholder='Search unique ID'/>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for='filterText'>Keyword</Label>
                                                            <InputGroup>
                                                                <InputGroupAddon addonType='prepend'>
                                                                    <InputGroupText>
                                                                        <MdInsertComment size={18} color='#004C98'/>
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input name='filterText' type='text' defaultValue={filterKeyword}
                                                                    onChange={handleKeyword} className='shadow-none isis-control' placeholder='Search a Keyword'/>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for='filterText'>Source</Label>
                                                            <Select
                                                                isMulti={true}
                                                                placeholder={'Search Source'}
                                                                isSearchable={false}
                                                                isDisabled={loading}
                                                                className='status-select'
                                                                name='source'
                                                                onChange={selected => {
                                                                    selected.find(option => option.value === 'all')
                                                                        ? handleSource(sourceOptions.splice(1))
                                                                        : handleSource(selected);
                                                                }}
                                                                value={defaultSources.length > 0
                                                                    ? defaultSources.map(row => ({ label: sourceMaker(row.label), value: row.value }))
                                                                    : []}
                                                                options={sourceOptions.map(row => ({ label: sourceMaker(row.label), value: row.value }))}/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for='filterSender'>Sender</Label>
                                                            <AsyncSelect
                                                                isMulti={true}
                                                                value={defaultSender.length > 0
                                                                    ? defaultSender.map(row => ({ label: row.label, value: row.value }))
                                                                    : []}
                                                                cacheOptions={true}
                                                                loadOptions={loadOptions}
                                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                                name='filterSender'
                                                                className='filter-select'
                                                                onChange={(newTags) => handleSenderChange(newTags)}
                                                                placeholder={'Select Sender...'}
                                                                noOptionsMessage={() => 'Enter a Sender'}/>
                                                            {errorForm.errorSenders !== '' &&
                                                                <Typography variant='size-14' className='form-text text-danger'>
                                                                    {errorForm.errorSenders}
                                                                </Typography>
                                                            }
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for='filterRecipient'>Recipient</Label>
                                                            <AsyncSelect
                                                                isMulti={true}
                                                                value={defaultRecipients.length > 0
                                                                    ? defaultRecipients.map(row => ({ label: row.label, value: row.value }))
                                                                    : []}
                                                                cacheOptions={true}
                                                                loadOptions={loadOptions}
                                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                                name='filterRecipient'
                                                                className='filter-select'
                                                                onChange={(newTags) => handleRecipientChange(newTags)}
                                                                placeholder={'Select Recipient...'}
                                                                noOptionsMessage={() => 'Enter a Recipient'}/>
                                                            {/* {errorForm.errorRecipients !== '' &&
                                                                <Typography variant='size-14' className='form-text text-danger'>
                                                                    {errorForm.errorRecipients}
                                                                </Typography>
                                                            } */}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col>
                                                        <FormGroup>
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
                                                                                value={moment(dateState[0].startDate).format('HH:mm')} required={true} formNoValidate={true}
                                                                                onChange={e => handleTime(e)}/>
                                                                        </div>
                                                                        <div className='rdrTime'>
                                                                            <Input type='time' name='timeEnd' placeholder='hh:mm'
                                                                                value={moment(dateState[0].endDate).format('HH:mm')} required={true} formNoValidate={true}
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
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <Button label='Search' variant='primary' type='submit'
                                                                className='alerts__save-button px-4 py-2'/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </fieldset>
                                        </Form>
                                    </Col>
                                </Row>
                                <Typography color='color-3' className='search-results__box-label' >{table.totalNoOfRecords > 0 ? numberWithCommas(table.totalNoOfRecords) : '0'} Results</Typography>
                                <div className='search-results__information mt-5'>
                                    <Row>
                                        <Col lg={12} className='overflow-auto'>
                                            <IsisTable className='search-results__table table-striped'
                                                loading={loading}
                                                tableColumns={table.columns}
                                                tableData={table.data}
                                                tablePagination={table.totalPages}
                                                totalNoOfRecords={table.totalNoOfRecords}
                                                selectableRows={false}
                                                activePage={activePage}
                                                pagination={true}
                                                sortable={true}
                                                fetching={table.loading}
                                                viewDetails={handleItemClick}
                                                filterKeyword={filterKeyword}
                                                isTimeout={isTimeout}/>
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

const CommunicationResultsSearch: any = withLoading<React$Element<Props>>(CommunicationSearchResultsScreen);

export default CommunicationResultsSearch;
