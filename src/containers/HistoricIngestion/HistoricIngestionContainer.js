// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import HistoricIngestionScreen from './HistoricIngestionScreen';
import type { Menu } from '../../types';
import dataSample from '../CommunicationAlerts/MOCK_DATA.json';
import filterSample from '../CommunicationAlerts/filters.json';
import moment from 'moment';
import { downloadCommSearchList, getCommunicationSearchData, getCommunicationSearchDataOpenSearch, getEmails, getEmailsAll } from '../../api/communicationSearch';
import { setCommunicationSearchData, setColumnFilterValues, setSearchFilterValues } from '../../redux/modules/communicationSearch';
import { setActivePage } from '../../redux/modules/isisTable';
import { filter } from 'underscore';
import debounce from 'debounce-async';
import { storageKey } from '../../config/constants';
import Storage from '../../utils/Storage';
import { setFlashNotification } from '../../redux/modules/flashNotification';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function,
    useMediaQuery: Function,
}

export default function HistoricIngestionContainer({
    sidebarMenu,
    handleCloseModal,
    useMediaQuery
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        fetch('data.json'
            , {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                console.log(response);

                return response.json();
            })
            .then(function(myJson) {
                console.log(myJson);
                setData(myJson);
            });
    };

    return <HistoricIngestionScreen />;
    // loading={loading}
    // downloading={downloading}
    // sidebarMenu={sidebarMenu}
    // handleUniqueID={handleUniqueID}
    // handleDownloadSearchData={handleDownloadSearchData}
    // handleKeyword={handleKeyword}
    // defaultSources={filterSearchForm.filterSource}
    // breadcrumb={breadcrumb}
    // table={table}
    // isCheckAll={isCheckAll}
    // activePage={activePage}
    // handleSource={handleSource}
    // loadSearchData={loadSearchData}
    // useMediaQuery={useMediaQuery}
    // handleCloseModal={handleCloseModal}
    // handleItemClick={handleItemClick}
    // setSearchId={setSearchId}
    // setKeyword={setKeyword}
    // filterKeyword={filterSearchForm.filterText}
    // filterId={filterSearchForm.filterId}
    // handleSearchClick={handleSearchClick}
    // loadOptions={loadOptions}
    // handleRecipientChange={handleRecipientChange}
    // handleSenderChange={handleSenderChange}
    // filterDate={filterDate}
    // setFilterDate={setFilterDate}
    // defaultRecipients={filterSearchForm.filterRecipients}
    // defaultSender={filterSearchForm.filterSenders}
    // errorForm={errorForm}
    // isTimeout={isTimeout}
    // isValidDateRange={isValidDateRange}
    // />;
}
