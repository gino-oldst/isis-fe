// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import CommunicationAlertsScreen from './CommunicationAlertsScreen';
import type { Menu } from '../../types';
import { getBehaviours } from '../../api/behaviours';
import { getAlerts, downloadAlertsList, getColumnFilterValues } from '../../api/alerts';
import { getUsers } from '../../api/users';
import {
    DATE_TO_UTC
} from '../../utils/helpers';
import { setCommunicationAlertsData, setColumnFilterValues } from '../../redux/modules/communicationAlerts';
import debounce from 'debounce-async';

// To be removed once we move to with backend
import { downloadCommAlertsList, getCommunicationAlertData, getKeywords, updateAlert } from '../../api/communicationAlerts';
import { getEmails, getEmailsAll } from '../../api/communicationSearch';
import { set } from 'date-fns';
import Typography from '../../components/base/Typography/Typography';
import Button from '../../components/base/Button/Button';
import { setModalContent } from '../../redux/modules/modalEvent';
import { setAlertsList, setIsRowSelected, setToggle, setActivePage } from '../../redux/modules/isisTable';
import Storage from '../../utils/Storage';
import StorageIDB from '../../utils/StorageIDB';
import { storageKey } from '../../config/constants';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function CommunicationAlertsContainer({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { pageSize, activePage, appliedFilters, selectedRows, areRowsSelectedAll, sort, dateRange, toggle } = useSelector(({ isisTable }) => isisTable);
    const { table, selected } = useSelector(({ communicationAlerts }) => communicationAlerts);
    const [keywords, setKeywords] = useState([]);
    const [senders, setSenders] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [source, setSource] = useState([]);
    const [alert, setAlert] = useState([]);
    const [status, setStatus] = useState([]);
    const [submit, setSubmit] = useState(false);

    const [senderStore, setSenderStore] = useState([]);
    const [recipientStore, setRecipientStore] = useState([]);
    const [tableResultStore, setTableResultStore] = useState([]);

    const [isTimeout, setIsTimeout] = useState(false);

    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Communication Alerts',
            path: '/communication_alerts'
        }
    ];

    const [filterDate, setFilterDate] = useState([
        {
            startDate: '',
            endDate: ''
        }
    ]);

    useEffect(() => {
        setTimeout(() => {
            loadSearchValuesFromStorage();
            loadColumnFilterValues();
        }, 100);
    }, []);

    useEffect(() => {
        const dateFrom = filterDate[0].startDate != '' ? moment(filterDate[0].startDate).utc().local().format('YYYY-MM-DDTHH:mm:ss') : '';
        const dateTo = filterDate[0].endDate != '' ? moment(filterDate[0].endDate).utc().local().format('YYYY-MM-DDTHH:mm:ss') : '';

        setDateFrom(dateFrom);
        setDateTo(dateTo);

        setErrorForm({
            ...errorForm,
            errorDate: ''
        });
    }, [filterDate]);

    useEffect(() => {
        setTimeout(() => {
            loadCommAlertsData(
                activePage,
                pageSize,
                sort,
                alert,
                status,
                dateFrom,
                dateTo,
                source,
                senders,
                recipients,
                false
            );
        }, 100);
    }, [pageSize, activePage, sort, submit]);

    const loadCommAlertsData = async (page, size, sort, alert, status, dFrom, dTo, sources, senders, recipients, isRequery) => {
        setLoading(true);

        const alertSearchParams = JSON.parse(await StorageIDB.getItem(storageKey.alertSearchParams));

        var filterAlert = [];
        var filterStatus = [];
        var filterSources = [];
        var filterSender = [];
        var filterRecipient = [];
        var filterDateFrom = '';
        var filterDateTo = '';
        var isPageChange = 0;

        if (alertSearchParams) {
            isPageChange = alertSearchParams.activePage !== page;
            page = alertSearchParams.activePage !== 0 ? page : alertSearchParams.activePage;

            console.log(page);

            filterAlert = alert.length === 0 && !isRequery ? alertSearchParams.alert : alert;
            filterStatus = status.length === 0 && !isRequery ? alertSearchParams.status : status;
            filterSources = sources.length === 0 && !isRequery ? alertSearchParams.source : sources;
            filterDateFrom = dFrom === '' && !isRequery ? alertSearchParams.dateFrom : dFrom;
            filterDateTo = dTo === '' && !isRequery ? alertSearchParams.dateTo : dTo;

            const slist = alertSearchParams.senders.length > 0 ? [...alertSearchParams.senders.map(row => { return row; })] : [];
            const rlist = alertSearchParams.recipients.length > 0 ? [...alertSearchParams.recipients.map(row => { return row; })] : [];

            filterSender = senders.length === 0 && !isRequery ? slist : senders;
            filterRecipient = recipients.length === 0 && !isRequery ? rlist : recipients;
        }

        try {
            const alerts = alertSearchParams != null && !isRequery
                ? !isPageChange
                    ? alertSearchParams
                    : await getCommunicationAlertData(page, size, sort, filterAlert, filterStatus, filterDateFrom, filterDateTo, filterSources, filterSender, filterRecipient)
                : await getCommunicationAlertData(page, size, sort, filterAlert, filterStatus, filterDateFrom, filterDateTo, filterSources, filterSender, filterRecipient);
            const { data, totalNoOfRecords, totalPages } = alerts.data;

            dispatch(setCommunicationAlertsData(data, totalNoOfRecords, totalPages));
            dispatch(setIsRowSelected(0, []));
            dispatch(setActivePage(page));
            setTableResultStore(alerts.data);

            StorageIDB.setItem(storageKey.alertSearchParams, JSON.stringify({
                alert: filterAlert,
                status: filterStatus,
                dateFrom: filterDateFrom,
                dateTo: filterDateTo,
                source: filterSources,
                senders: filterSender,
                recipients: filterRecipient,
                data: alerts.data,
                activePage: page
            }));
        } catch (e) {
            console.log(e);

            if (e.status == 500 || e.status == 502 || e.status == 503 || e.status == 504 || e.status == 408 || e.status == 404 || e.status == 400) {
                setIsTimeout(true);
            }
        }

        setLoading(false);
    };

    const loadColumnFilterValues = async () => {
        const keywords = await getKeywords();

        var sortedKeywords = keywords.sort((a, b) => a.label.match(/\d+/) - b.label.match(/\d+/));

        dispatch(setAlertsList(keywords));
        setKeywords(keywords);
    };

    const loadSearchValuesFromStorage = async () => {
        const alertSearchParams = JSON.parse(await StorageIDB.getItem(storageKey.alertSearchParams));

        if (alertSearchParams) {
            setAlert(alertSearchParams.alert);
            setSource(alertSearchParams.source);
            setStatus(alertSearchParams.status);

            var slist = [];
            var rlist = [];

            alertSearchParams.senders.map(sender => {
                slist.push({ label: sender.label, value: sender.value });
            });

            alertSearchParams.recipients.map(recipient => {
                rlist.push({ label: recipient.label, value: recipient.value });
            });

            setSenders(slist);
            setSenderStore(alertSearchParams.senders);

            setRecipients(rlist);
            setRecipientStore(alertSearchParams.recipients);

            var newDate = {
                startDate: alertSearchParams.dateFrom ? new Date(alertSearchParams.dateFrom) : '',
                endDate: alertSearchParams.dateTo ? new Date(alertSearchParams.dateTo) : ''
            };

            setFilterDate([newDate]);
        }
    };

    const tableIsFiltered = () => {
        return !!appliedFilters.filter(filter => filter.value.length > 0).length;
    };

    const viewCommunicationAlertDetails = async (id, chainLinkId, filterText, recipients) => {
        history.push({
            pathname: `/communication_alerts_detail/${id}`,
            state: { id: id, chainLinkId: chainLinkId, filterText: filterText, recipients }
        });
    };

    const showSuccessModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessModal handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const [toggleCheck, setToggleCheck] = useState(false);

    const onSubmitStatusChange = async (status, note, selectedRows) => {
        try {
            const promises = selectedRows.map(row => {
                row.alerts.data.map(alert => {
                    const data = {
                        id: alert.id,
                        policyId: alert.policyId,
                        status: status,
                        notes: note
                    };

                    return updateAlert(data).then(function(results) {
                        return results;
                    });
                });
            });

            Promise.all(promises).then(function(values) {
                setTimeout(() => {
                    onSearchClick();

                    showSuccessModal();

                    dispatch(setToggle(!toggle));
                    dispatch(setIsRowSelected(0, []));
                }, 1000);
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleCloseBulkUpdate = () => {
        var stat = !toggle;

        dispatch(setToggle(stat));
        dispatch(setIsRowSelected(0, []));
        onSearchClick();

        handleCloseModal();
    };

    const handleCloseSuccessModal = () => {
        var stat = !toggle;

        dispatch(setToggle(stat));
        dispatch(setIsRowSelected(0, []));
        onSearchClick();

        handleCloseModal();
    };

    const handleSource = (event) => {
        setSource(event);
    };

    const handleAlert = (event) => {
        setAlert(event);
    };

    const handleStatus = (items) => {
        setStatus(items);
    };

    const handleSenderChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op);
        });

        setSenders(list);
        setSenderStore(updatedList);
    };

    const handleRecipientChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op);
        });

        setRecipients(list);
        setRecipientStore(updatedList);
    };

    const [lastOptions, setLastOptions] = useState([]);

    const loadOptions = useMemo(() => {
        return debounce(async (inputValue) => {
            const { data } = await getEmails(inputValue, inputValue, inputValue);
            const accounts = data.data;

            const options = accounts.map((account) => ({
                value: account.email,
                label: `${account.email} (${account.firstName} ${account.lastName})`
            }));

            setLastOptions(options);

            return options;
        }, 300);
    }, [setLastOptions]);

    const [errorForm, setErrorForm] = useState({
        errorDate: ''
    });

    const onSearchClick = () => {
        var formValid = true;
        const initialError = {
            errorDate: ''
        };

        if (moment(dateFrom).format('YYYY-MM-DD') === moment(dateTo).format('YYYY-MM-DD') &&
            moment(dateFrom).format('HH:mm') > moment(dateTo).format('HH:mm')) {
            initialError.errorDate = 'Date From Overlaps Date To';
            formValid = false;
        }

        if (formValid) {
            // Storage.removeItem(storageKey.alertSearchParams);
            // Storage.setItem(storageKey.alertSearchParams, JSON.stringify({
            //     alert: alert,
            //     status: status,
            //     dateFrom: dateFrom,
            //     dateTo: dateTo,
            //     source: source,
            //     senders: senderStore,
            //     recipients: recipientStore,
            //     data: tableResultStore
            // }));
            loadCommAlertsData(
                activePage,
                pageSize,
                sort,
                alert,
                status,
                dateFrom,
                dateTo,
                source,
                senders,
                recipients,
                true
            );
            StorageIDB.setItem(storageKey.alertSearchParams, JSON.stringify({
                alert: alert,
                status: status,
                dateFrom: dateFrom,
                dateTo: dateTo,
                source: source,
                senders: senderStore,
                recipients: recipientStore,
                data: tableResultStore
            }));
        } else {
            setErrorForm({
                ...errorForm,
                errorDate: initialError.errorDate
            });
        }
    };

    const handleDownloadAlertData = async () => {
        try {
            await downloadCommAlertsList(
                alert,
                status,
                dateFrom,
                dateTo,
                source,
                senders,
                recipients
            );
        } catch (error) {
            console.log(error);
        }
    };

    return <CommunicationAlertsScreen
        loading={loading}
        isTimeout={isTimeout}
        onSearchClick={onSearchClick}
        userId={userId}
        table={table}
        activePage={activePage}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal}
        selectedRows={selectedRows}
        submit={submit}
        onSubmit={onSubmitStatusChange}
        viewCommunicationAlertDetails={viewCommunicationAlertDetails}
        keywords={keywords}
        filterDate={filterDate}
        handleRecipientChange={handleRecipientChange}
        handleSenderChange={handleSenderChange}
        handleSource={handleSource}
        handleAlert={handleAlert}
        handleStatus={handleStatus}
        handleDownloadAlertData={handleDownloadAlertData}
        loadOptions={loadOptions}
        setFilterDate={setFilterDate}
        defaultSource={source}
        defaultStatus={status}
        defaultAlert={alert}
        defaultRecipients={recipientStore}
        defaultSenders={senderStore}
        handleCloseBulkUpdate={handleCloseBulkUpdate}
        toggleCheck={toggleCheck}
        errorForm={errorForm}
        handleCloseSuccessModal={handleCloseSuccessModal}/>;
}

const SuccessModal = ({
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
                    onClick={handleCloseModal}/>
            </div>
        </div>
    );
};
