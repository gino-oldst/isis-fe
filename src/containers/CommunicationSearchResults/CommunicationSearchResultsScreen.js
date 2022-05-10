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
    numberWithCommas
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
    filterId: String
}

function CommunicationSearchResultsScreen({
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
    handleSearchClick
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);

    const showActionsModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionModal handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showSuccessModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessModal handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const ActionModal = ({
        userId,
        activeModal,
        loadAlerts,
        handleCloseModal
    }) => {
        const dispatch = useDispatch();

        return (
            <div className='action-modal p-4'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseModal}/>
                <Typography variant='size-26' color='color-3'
                    className='mb-4 playfair-font'>
                    Bulk Action
                </Typography>
                <div className='alerts__information mt-5 w-100 mb-4' style={{ height: '200px', overflowX: 'hidden', overflowY: 'auto' }}>
                    <Row>
                        <Col lg={12}>
                            {/* <Table className='alerts__table table-striped'
                                loading={loading}
                                tableColumns={table.columns}
                                tableData={table.data}
                                defaultPageSize={1}
                                tablePagination={table.totalPages}
                                totalNoOfRecords={table.totalNoOfRecords}
                                selectableRows={true}
                                hideHeader={true}
                                activePage={activePage}
                                fetching={table.loading}/> */}
                        </Col>
                    </Row>
                </div>
                <FormGroup className='mb-3'>
                    <Label for='status'>Select Status</Label>
                    <Select
                        name='status'
                        // value={alert.status === null
                        //     ? {
                        //         label: 'No Change',
                        //         value: null
                        //     }
                        //     : {
                        //         name: alert.status,
                        //         label: <Badge status={alert.status} />,
                        //         value: <Badge status={alert.status}/>
                        //     }}
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
                        }]} />
                    {/* onChange={handleChange} />
                    {alert.resolveReason && <div>Reason: {alert.resolveReason}</div>} */}
                </FormGroup>
                <FormGroup className='mb-5'>
                    <Label for='notes'>Notes</Label>
                    <Input type='textarea' rows={5} name='notes'
                        placeholder='Leave blank if there is no change to apply' value={alert.notes} /> {/* onChange={handleChange} /> */}
                </FormGroup>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                    <Button label='Apply' variant='primary' className='alerts__save-button px-4 py-2'
                        onClick={showSuccessModal}/>
                    {/* <Button label='Apply' isLoading={submit} variant='secondary'
                        className='alerts__save-button px-4 py-2'
                        onClick={handleBulkUpdate} disabled={submit} /> */}
                </div>
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
                                    {/* <Button weight='light' className='ml-4 mr-4 search-results__bulk-review' label='Bulk Review'
                                        onClick={showActionsModal}/> */}
                                </div>
                                <div className='search-results__search-bar d-flex align-items-center pb-0'>
                                    <Form onSubmit={handleSearchClick}>
                                        <fieldset className='d-flex' disabled={loading}>
                                            <FormGroup>
                                                <InputGroup>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <FaSearch size={18} color='#004C98'/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input name='filterId' type='text' defaultValue={filterId}
                                                        className='shadow-none' placeholder='Search unique ID'/>
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup className='px-4'>
                                                <InputGroup>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <MdInsertComment size={18} color='#004C98'/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input name='filterText' type='text' defaultValue={filterKeyword}
                                                        className='shadow-none' placeholder='Search a Keyword'/>
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <Button label='Search' variant='primary' type='submit'
                                                    className='alerts__save-button px-4 py-2'/>
                                            </FormGroup>
                                        </fieldset>
                                    </Form>
                                </div>
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
                                                selectableRows={true}
                                                activePage={activePage}
                                                pagination={true}
                                                sortable={true}
                                                fetching={table.loading}
                                                viewDetails={handleItemClick}
                                                filterKeyword={filterKeyword}/>
                                            {/* <BootstrapTable className='search-results__table'
                                                isHover={true}
                                                withSearch={true}
                                                withPagination={true}
                                                headers={[
                                                    { key: 'id', label: 'ID #' },
                                                    { key: 'subject', label: 'Subject & Message' },
                                                    { key: 'source', label: 'Source' },
                                                    // { key: 'keyword', label: 'Alert' },
                                                    // { key: 'status', label: 'Status' },
                                                    { key: 'timeSent', label: 'Date & Time' }
                                                ]}
                                                list={table}
                                                searchKeys={['chainLinkId', 'message']}
                                                placeHolder='Enter search for Id and Keyword'
                                                handleSelectAll={handleSelectAll}
                                                handleItemCheck={handleItemCheck}
                                                handleItemClick={handleItemClick}
                                                isCheckAll={isCheckAll}
                                                isLoading={loading}
                                                loadSearchData={loadSearchData}/> */}
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
