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
import './historic-ingestion.scss';
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

function HistoricIngestionScreen({
    breadcrumb,
    loading,
    sidebarMenu,
    table,
    history,
    data,
    setViewModal,
    viewModal,
    handleCloseModal,
    purgeHistoricData,
    activePage
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);

    const showActionsModal = (data) => {
        dispatch(setModalContent({
            modalContent: <ActionModal
                userId={profileData.userId}
                handleCloseModal={handleCloseModal}
                setViewModal={setViewModal}
                data={data}
                purgeHistoricData={purgeHistoricData} />,
            size: 'md'
        }));
    };

    return (
        <div className='historic-ingestion'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='historic-ingestion__content'>
                        <Card className='px-4 py-2'>
                            <CardBody>
                                <div className='historic-ingestion__header d-flex align-items-center justify-content-between'>
                                    <Typography color='color-3' className='historic-ingestion__title'>Historic Data Ingested</Typography>
                                </div>
                                {/* About 10,000+ results. Please expand your search criteria to get better results. */}
                                <div className='historic-ingestion__information mt-5'>
                                    <Row>
                                        <Col lg={12} className='overflow-auto'>
                                            <IsisTable className='historic-ingestion__table table-striped'
                                                loading={loading}
                                                tableColumns={table.columns}
                                                tableData={table.data}
                                                tablePagination={table.totalPages}
                                                totalNoOfRecords={table.totalNoOfRecords}
                                                selectableRows={false}
                                                pagination={true}
                                                viewDeleteModal={showActionsModal}
                                                fetching={table.loading}
                                                activePage={activePage}
                                                sortable={false}/>
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

const HistoricIngestionSearch: any = withLoading<React$Element<Props>>(HistoricIngestionScreen);

export default HistoricIngestionSearch;

const ActionModal = ({
    userId,
    handleCloseModal,
    setViewModal,
    data,
    purgeHistoricData
}) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        handleCloseModal();
        setViewModal(false);
    };

    return (
        <div className='action-modal p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleClose} />
            <div className='row action-modal__content mt-5 mb-4 d-flex justify-content-center align-items-center'>
                <Typography variant='size-35' color='color-3'
                    className='mb-4 playfair-font'> Delete Data? </Typography>
                <Typography color='color-3' variant='size-16' className='mb-3 playfair-font text-center'>
                Once deleted, this data may need to be re-imported to be viewed again in the search tab. Do you wish to continue?
                </Typography>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={() => {
                        handleClose();
                    }}/>
                <Button label='Delete Data' variant='primary' className='search__download-button px-4 py-2'
                    onClick={() => {
                        purgeHistoricData(data);
                        handleClose();
                    }} />
            </div>
        </div>
    );
};
