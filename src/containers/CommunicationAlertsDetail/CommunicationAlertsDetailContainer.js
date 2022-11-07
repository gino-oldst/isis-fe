// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import CommunicationAlertsDetailScreen from './CommunicationAlertsDetailScreen';
import type { Menu } from '../../types';
import { getBehaviours } from '../../api/behaviours';
import { getAlerts, downloadAlertsList, getColumnFilterValues } from '../../api/alerts';
import { getUsers } from '../../api/users';
import {
    DATE_TO_UTC
} from '../../utils/helpers';
import { getCommunicationSearchData, getCommunicationMessageDetail, getMessageThread, getRecipients } from '../../api/communicationSearch';
import { getActivityList, getKeywords, getMessageAlerts, postComment, updateAlert, retrievePredefinedReasons, getAppUser, getCommunicationAlertData } from '../../api/communicationAlerts';
import Typography from '../../components/base/Typography/Typography';
import { setModalContent } from '../../redux/modules/modalEvent';
import Button from '../../components/base/Button/Button';
import { setFlashNotification } from '../../redux/modules/flashNotification';
import { setMessageAlerts, setAlertsListDetail } from '../../redux/modules/communicationAlerts';
import HtmlToRtfBrowser from 'html-to-rtf-browser';
import { storageKey } from '../../config/constants';
import Storage from '../../utils/Storage';
import StorageIDB from '../../utils/StorageIDB';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function CommunicationAlertsDetail({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const filters = useLocation();
    const [loading, setLoading] = useState(true);
    const [alertLoading, setAlertLoading] = useState(false);
    const { isRowsSelected, selectedRows, appliedFilters, isTablePageSelect } = useSelector(({ table }) => table);
    const { messageAlerts, alertsList, data } = useSelector(({ communicationAlerts }) => communicationAlerts);
    const [isChecked, setIsChecked] = useState(true);
    const { profileData } = useSelector(({ authentication }) => authentication);
    const [isTimeout, setIsTimeout] = useState(false);
    const [detailData, setDetailData] = useState([]);
    // Para sa current record selected
    const [currData, setCurrData] = useState([]);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Alerts',
            path: '/communication_alerts'
        },
        {
            label: filters.state.id,
            path: `communication_alerts_detail/${filters.state.id}`,
            disabled: true
        }
    ];

    useEffect(() => {
        loadSearchData(filters.state);
        loadAlerts(filters.state.id);
        loadActivity(filters.state.id);
    }, [filters]);

    useEffect(() => {
        loadAlerts(currData.id);
        loadActivity(currData.id);
        loadSearchData(currData.state);
    }, [currData]);

    useEffect(() => {
        loadPredefinedReasons();
        loadAppUsers();
        loadCommAlertsData();
    }, []);

    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [appUser, setAppUser] = useState([]);
    const [predefinedReasons, setPredefinedReasons] = useState([]);

    const [constAlertData, setConstAlertData] = useState([]);
    const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const loadAlerts = async (id) => {
        setAlertLoading(true);

        try {
            const alertsData = await getMessageAlerts(id);

            // dispatch(setMessageAlerts(alertsData.data));
            const sortedData = JSON.parse(JSON.stringify(alertsData.data.data)).sort((a, b) => a.id > b.id ? 1 : -1);

            setAlerts(sortedData);
        } catch (e) {
            console.error(e);
        }

        setAlertLoading(false);
    };

    const onPrevAndNext = (page, size) => {
        // Logic for next and Prev
        // let size = 100;

        //  scroll through yung current data.

        //  if you have the data

        // selectedData = constAlertData[index]
        // setCurrData(selectedData);

        // if (index > size && totalPages){
        //     loadCommAlertsData(page, size);
        //     index = 0
        // }
    };

    const loadCommAlertsData = async (page, size, sort) => {
        setLoading(true);

        const alertSearchParams = JSON.parse(await StorageIDB.getItem(storageKey.alertSearchParams));

        var filterAlert = alertSearchParams.alert;
        var filterStatus = alertSearchParams.status;
        var filterSources = alertSearchParams.source;
        var filterSender = alertSearchParams.senders.map(row => { return row; });
        var filterRecipient = alertSearchParams.recipients.map(row => { return row; });
        var filterDateFrom = alertSearchParams.dateFrom;
        var filterDateTo = alertSearchParams.dateTo;
        var isPageChange = alertSearchParams.activePage;
        var insidePage = alertSearchParams.activePage;
        var updateInMsg = false;
        var updateInSort = false;
        var filterEscalations = alertSearchParams.escalation ? alertSearchParams.escalation : [];

        // if (alertSearchParams) {
        //     isPageChange = alertSearchParams.activePage !== page;
        //     insidePage = isTablePageSelect ? page : alertSearchParams.activePage || 0;

        //     if (isRequery) {
        //         insidePage = 0;
        //     }

        //     filterAlert = alert.length === 0 && !isRequery ? alertSearchParams.alert : alert;
        //     filterStatus = status.length === 0 && !isRequery ? alertSearchParams.status : status;
        //     filterSources = sources.length === 0 && !isRequery ? alertSearchParams.source : sources;
        //     filterDateFrom = dFrom === '' && !isRequery ? alertSearchParams.dateFrom : dFrom;
        //     filterDateTo = dTo === '' && !isRequery ? alertSearchParams.dateTo : dTo;
        //     filterEscalations = escalations.length === 0 && !isRequery ? alertSearchParams.escalation : escalations;

        //     const slist = alertSearchParams.senders.length > 0 ? [...alertSearchParams.senders.map(row => { return row; })] : [];
        //     const rlist = alertSearchParams.recipients.length > 0 ? [...alertSearchParams.recipients.map(row => { return row; })] : [];

        //     filterSender = senders.length === 0 && !isRequery ? slist : senders;
        //     filterRecipient = recipients.length === 0 && !isRequery ? rlist : recipients;
        // }

        try {
            let alerts = [];

            alerts = await getCommunicationAlertData(insidePage, size, sort, filterAlert, filterStatus, filterDateFrom, filterDateTo, filterSources, filterSender, filterRecipient, filterEscalations);

            const { data, totalNoOfRecords, totalPages } = alerts.data;

            console.log(data);

            // Keep the recent requested data
            setConstAlertData(data);
            setTotalNoOfRecords(totalNoOfRecords);
            setTotalPages(totalPages);
        } catch (e) {
            console.log(e);

            if (e.status == 500 || e.status == 502 || e.status == 503 || e.status == 504 || e.status == 408 || e.status == 404 || e.status == 400) {
                setIsTimeout(true);
            }
        }
    };

    const loadAppUsers = async () => {
        try {
            const appUserData = await getAppUser();

            setAppUser(appUserData);
        } catch (e) {
            console.error(e);
        }
    };

    const loadPredefinedReasons = async () => {
        try {
            const predefinedReasonsData = await retrievePredefinedReasons({ delete: false });

            setPredefinedReasons(predefinedReasonsData.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    // const [selectedActivityType, setSelectedActivityType] = useState('');
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(false);

    const loadActivity = async (id) => {
        setActivityLoading(true);

        try {
            const activities = await getActivityList(id);

            // dispatch(setMessageAlerts(alertsData.data));
            const sortedData = activities.data.data.sort(function(left, right) {
                return moment.utc(right.dateCreated).diff(moment.utc(left.dateCreated));
            });

            setActivities(sortedData);
        } catch (e) {
            console.error(e);
        }

        setActivityLoading(false);
    };

    const loadSearchData = async (commMessageId) => {
        setLoading(true);

        try {
            const search = await getCommunicationMessageDetail(commMessageId.id);

            setDetailData(filters);

            const messages = await getMessageThread(commMessageId.chainLinkId, search.data.timeSent);
            const { data, totalNoOfRecords, totalPages } = messages.data;

            for (let i = 0; i < data.length; i++) {
                var tempData = data[i];

                if (i == 0) {
                    data[i].showSender = true;
                } else {
                    var prevTempData = data[i - 1];

                    if (tempData.sender == prevTempData.sender) {
                        data[i].showSender = false;
                    } else {
                        data[i].showSender = true;
                    }
                }
            }

            setMessages(data);

            if (Object.keys(alertsList).length === 0) {
                const keywords = await getKeywords();

                dispatch(setAlertsListDetail(keywords));
            }

            // history.push('/communication_alerts_detail', alerts);

            // const recipients = await getRecipients(search.data.chainLinkId);
            // const extractedRecipients = extractRecipients(recipients.data);

            setRecipients(commMessageId.recipients);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const [submit, setSubmit] = useState(false);

    const onSubmitStatusChange = async (status, note, selectedRows) => {
        setAlertLoading(true);

        try {
            const promises = selectedRows.map(row => {
                const data = {
                    id: row.id,
                    policyId: row.policyId,
                    status: status,
                    notes: note
                };

                const request = updateAlert(data);

                return request;
            });

            const statusChange = await Promise.all(promises);

            setAlerts(statusChange.map(ev => ev.data));

            loadActivity(filters.state.id);

            showSuccessModal('You have successfully bulk reviewed the alerts');
        } catch (e) {
            console.error(e);
        }

        Storage.removeItem(storageKey.tempUpdatedInDetails);
        Storage.setItem(storageKey.tempUpdatedInDetails, true);

        setAlertLoading(false);
    };

    const onSubmitStatusChangeSingle = async (status, note, row) => {
        try {
            const data = {
                id: row.id,
                policyId: row.policyId,
                status: status,
                notes: note
            };

            const request = await updateAlert(data);

            loadAlerts(filters.state.id);

            loadActivity(filters.state.id);

            dispatch(setFlashNotification({
                message: 'Alert Status Update Success.',
                isError: false
            }));

            Storage.removeItem(storageKey.tempUpdatedInDetails);
            Storage.setItem(storageKey.tempUpdatedInDetails, true);
        } catch (e) {
            console.error(e);
        }
    };

    const onSubmitEscalationChangeSingle = async (escalation, note, row) => {
        try {
            const data = {
                id: row.id,
                escalation: escalation,
                executorId: profileData.userId
            };

            const request = await updateAlert(data);

            loadAlerts(filters.state.id);

            loadActivity(filters.state.id);

            dispatch(setFlashNotification({
                message: 'Alert Escalation Update Success.',
                isError: false
            }));

            Storage.removeItem(storageKey.tempUpdatedInDetails);
            Storage.setItem(storageKey.tempUpdatedInDetails, true);
        } catch (e) {
            console.error(e);
        }
    };

    const onSubmitAssignUserSingle = async (user, row) => {
        try {
            const data = {
                id: row.id,
                assignedUserId: user,
                executorId: profileData.userId
            };

            const request = await updateAlert(data);

            loadAlerts(filters.state.id);

            loadActivity(filters.state.id);

            dispatch(setFlashNotification({
                message: 'Assinging for a user to review the alert Update Success.',
                isError: false
            }));

            Storage.removeItem(storageKey.tempUpdatedInDetails);
            Storage.setItem(storageKey.tempUpdatedInDetails, true);
        } catch (e) {
            console.error(e);
        }
    };

    const onSubmitStatusChangeSingleWithReview = async (status, note, row) => {
        try {
            const data = {
                id: row.id,
                policyId: row.policyId,
                status: status,
                notes: note
            };

            const request = await updateAlert(data);

            loadAlerts(filters.state.id);

            loadActivity(filters.state.id);

            dispatch(setFlashNotification({
                message: 'Adding of Resolution Success.',
                isError: false
            }));

            Storage.removeItem(storageKey.tempUpdatedInDetails);
            Storage.setItem(storageKey.tempUpdatedInDetails, true);

            handleCloseModal();
        } catch (e) {
            console.error(e);
        }
    };

    const onSubmitComment = async (event) => {
        event.preventDefault();

        try {
            const requestBody = {
                messageId: filters.state.id,
                executorId: profileData.userId,
                event: event.target.alertComment.value,
                type: 'USER_EVENT',
                target: 'COMMUNICATION_MESSAGE'
            };

            const request = await postComment(requestBody);

            loadActivity(filters.state.id);

            dispatch(setFlashNotification({
                message: 'Update Success.',
                isError: false
            }));
        } catch (e) {
            console.error(e);
        }
    };

    const showSuccessModal = (message) => {
        dispatch(setModalContent({
            modalContent: <SuccessModal message={message} handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const extractRecipients = (recipients) => {
        const unique = [...new Set(recipients.data.map(item => item.recipient))];

        return unique;
    };

    const handleSelectAll = (event) => {
        event.map(ev => {
            setDownloadFlag(ev);
        });
    };

    const setDownloadFlag = (event) => {
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].id === event.value) {
                if (event.checked) {
                    messages[i].forDownload = true;
                } else {
                    messages[i].forDownload = false;
                }

                break;
            }
        }
    };

    const handleGenerate = () => {
        const htmlToRtf = new HtmlToRtfBrowser();
        let html = '';

        for (let i = 0; i < messages.length; i++) {
            if (i == 0) {
                html = html + `<p>Start Time:${messages[0].timeSent} </p>
                <p>Room ID: ${messages[0].chainLinkId} </p> <p>----------------------------------------------------------------------------</p>`;
            }

            if (messages[i].forDownload) {
                html = html + `
                <p>${messages[i].sender}&nbsp;&nbsp;${messages[i].timeSent}<br/>${messages[i].message}</p><br/>`;
            }
        }

        const rtf = htmlToRtf.convertHtmlToRtf(html);

        // from here on, works only on browser
        const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
        const link = window.URL.createObjectURL(blob);

        window.location = link;

        dispatch(setFlashNotification({
            message: 'Download Success.',
            isError: false
        }));
    };

    return <CommunicationAlertsDetailScreen
        loading={loading}
        userId={userId}
        appUser={appUser}
        dataId={filters.state.id}
        filterText={filters.state.filterText}
        detailData={detailData}
        alertsData={alerts}
        alertsList={alertsList}
        alertLoading={alertLoading}
        messages={messages}
        handleSelectAll={handleSelectAll}
        handleGenerate={handleGenerate}
        recipients={recipients}
        useMediaQuery={useMediaQuery}
        onPrevAndNext={onPrevAndNext}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal}
        onSubmit={onSubmitStatusChange}
        onSubmitSingle={onSubmitStatusChangeSingle}
        onSubmitStatusChangeSingleWithReview={onSubmitStatusChangeSingleWithReview}
        submit={submit}
        isChecked={isChecked}
        activities={activities}
        activityLoading={activityLoading}
        onSubmitComment={onSubmitComment}
        predefinedReasons={predefinedReasons}
        onSubmitEscalationChangeSingle = {onSubmitEscalationChangeSingle}
        onSubmitAssignUserSingle={onSubmitAssignUserSingle}/>;
}

const SuccessModal = ({
    handleCloseModal,
    message
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
                    {message}
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
