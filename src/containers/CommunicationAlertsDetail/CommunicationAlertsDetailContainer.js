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
import { getCommunicationSearchData, getCommunicationMessageDetail, getMessageThread, getRecipients, getMessageThreadOpenSearch, getCommunicationMessageDetailOpenSearch, getPreviousAndNextMessagesOpenSearch } from '../../api/communicationSearch';
import { getActivityList, getKeywords, getMessageAlerts, postComment, updateAlert, retrievePredefinedReasons, getAppUser, getCommunicationAlertData } from '../../api/communicationAlerts';
import Typography from '../../components/base/Typography/Typography';
import { setModalContent } from '../../redux/modules/modalEvent';
import Button from '../../components/base/Button/Button';
import { setFlashNotification } from '../../redux/modules/flashNotification';
import { setMessageAlerts, setAlertsListDetail, setPrevNextData } from '../../redux/modules/communicationAlerts';
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

    const { isRowsSelected, selectedRows, appliedFilters, isTablePageSelect } = useSelector(({ table }) => table);
    const { messageAlerts, alertsList, data, prevNextData } = useSelector(({ communicationAlerts }) => communicationAlerts);

    const filters = useLocation();
    const [loading, setLoading] = useState(true);
    const [alertLoading, setAlertLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const { profileData } = useSelector(({ authentication }) => authentication);
    const [isTimeout, setIsTimeout] = useState(false);
    const [detailData, setDetailData] = useState([]);
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

    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState('');
    const [sender, setSender] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [appUser, setAppUser] = useState([]);
    const [predefinedReasons, setPredefinedReasons] = useState([]);
    const [searchWords, setSearchWords] = useState([]);

    const [constAlertData, setConstAlertData] = useState([]);
    const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [counter, setCounter] = useState(0);
    const [pageCounter, setpageCounter] = useState(0);
    const [itemSize, setItemSize] = useState(0);

    useEffect(() => {
        loadAppUsers();
        loadSearchData(filters.state);
        loadAlerts(filters.state.id);
        loadActivity(filters.state.id);
        loadCommAlertsData(filters.state.activePage, filters.state.size);
    }, [filters]);

    useEffect(() => {
        loadPredefinedReasons();
    }, []);

    const loadAlerts = async (id) => {
        setAlertLoading(true);

        try {
            const alertsData = await getMessageAlerts(id);

            // dispatch(setMessageAlerts(alertsData.data));
            const sortedData = JSON.parse(JSON.stringify(alertsData.data.data)).sort((a, b) => a.id > b.id ? 1 : -1);
            const sort = {
                column: ''
            };

            setAlerts(sortedData);
            setSearchWords([...new Set(sortedData.map(item => item.keyword))]);
        } catch (e) {
            console.error(e);
        }

        setAlertLoading(false);
    };

    const nextAlertData = async() => {
        /**
         * Logic for Next
         *
         * Declare variables:
         * _counter -> keeps track of the current index in the list of alerts returned per page
         * _pageCounter -> Keeps track on what page we currently at in the returened paginated data
         * nextData -> holder for the next alert we get
         *
         * */
        var _counter = counter;
        var _pageCounter = pageCounter;
        var nextData = [];

        if (counter >= filters.state.size - 1) {
            _counter = 0; // Set counter to zero

            // if new page request loadCommAlertsData() and get the next page.
            if (pageCounter <= totalPages) {
                _pageCounter += 1; // Increment page

                // Request for a new page and get the fresh page
                await loadCommAlertsData(_pageCounter, 10).then((data) => {
                    // extract the next alert inside the nexpage returned from loadCommAlertsData()
                    nextData = data[_counter].alerts.data;
                });
            }
        /**
         * else if the counter has not exceeded the size index of our current page
         * size index = size-1
         * Sample: size = 10 then size_index = 10-1 is 9
         */
        } else {
            _counter += 1; // Increase counter count
            nextData = prevNextData.currData[_counter].alerts.data; // extract the next alert accordingly
        }

        /**
         * Push the data from nextData that are needed in moving to the next data
         */
        const recipients = [...new Set(nextData[0].recipients ? nextData[0].recipients.map(item => item) : '')];

        history.push({
            pathname: `/communication_alerts_detail/${nextData[0].commMessageId}`,
            state: {
                id: nextData[0].commMessageId,
                chainLinkId: nextData[0].commChainLinkId,
                filterText: [...new Set(nextData.map(item => item.keyword))], // Map the keywords if multiple alerts and return a list
                recipients: recipients.join(', '), // Map the recipients and list
                sender: nextData[0].sender,
                timeSent: nextData[0].timeSent,
                source: nextData[0].source,
                size: filters.state.size,
                counter: _counter,
                activePage: _pageCounter,
                index: _counter
            }

        });
    };

    const prevAlertData = async() => {
        var _counter = counter;
        var _pageCounter = pageCounter;
        var prevData = [];

        if (counter == 0) {
            _counter = 9; // Set counter to 10

            // if new page request loadCommAlertsData() and get the next page.
            if (pageCounter > 0) {
                _pageCounter -= 1; // decrement page

                // Request for a new page and get the fresh page
                await loadCommAlertsData(_pageCounter, 10).then((data) => {
                    // extract the next alert inside the nexpage returned from loadCommAlertsData()
                    prevData = data[_counter].alerts.data;
                });
            }
        /**
         * else if the counter has not exceeded the size index of our current page
         * size index = size-1
         * Sample: size = 10 then size_index = 10-1 is 9
         */
        } else {
            _counter -= 1; // decrease counter count
            prevData = prevNextData.currData[_counter].alerts.data; // extract the prev alert accordingly
        }

        /**
         * Push the data from nextData that are needed in moving to the next data
         */
        const recipients = [...new Set(prevData[0].recipients ? prevData[0].recipients.map(item => item) : '')];

        history.push({
            pathname: `/communication_alerts_detail/${prevData[0].commMessageId}`,
            state: {
                id: prevData[0].commMessageId,
                chainLinkId: prevData[0].commChainLinkId,
                filterText: [...new Set(prevData.map(item => item.keyword))], // Map the keywords if multiple alerts and return a list
                recipients: recipients.join(', '), // Map the recipients and list
                size: filters.state.size,
                sender: prevData[0].sender,
                source: prevData[0].source,
                timeSent: prevData[0].timeSent,
                counter: _counter,
                activePage: _pageCounter,
                index: _counter
            }
        });
    };

    const loadCommAlertsData = async (page = 0, size = 10, sort) => {
        const alertSearchParams = JSON.parse(await StorageIDB.getItem(storageKey.alertSearchParams));

        var filterAlert = alertSearchParams.alert;
        var filterStatus = alertSearchParams.status;
        var filterSources = alertSearchParams.source;
        var filterSender = alertSearchParams.senders.map(row => { return row; });
        var filterRecipient = alertSearchParams.recipients.map(row => { return row; });
        var filterDateFrom = alertSearchParams.dateFrom;
        var filterDateTo = alertSearchParams.dateTo;
        var updateInMsg = false;
        var updateInSort = false;
        var filterEscalations = alertSearchParams.escalation ? alertSearchParams.escalation : [];

        var insidePage = page;

        setCounter(filters.state.index ? filters.state.index : 0);

        try {
            let alerts = [];

            alerts = await getCommunicationAlertData(insidePage, size, sort, filterAlert, filterStatus, filterDateFrom, filterDateTo, filterSources, filterSender, filterRecipient, filterEscalations);

            const { data, totalNoOfRecords, totalPages } = alerts.data;

            dispatch(setPrevNextData({
                currData: data,
                currTotalPages: totalPages,
                currIndex: filters.state.index,
                currPage: insidePage
            }));

            setConstAlertData(data);
            setTotalNoOfRecords(totalNoOfRecords);
            setTotalPages(totalPages);
            setpageCounter(insidePage);
            setItemSize(data.length);

            return data;
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

    const [loadingPrevious, setLoadingPrevious] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);

    const handleClickedMsgThreadPrevious = async (event) => {
        setLoadingPrevious(true);
        // on prev
        // get top record of the array
        var topMessage = messages[0];

        // use its default time as lte
        var newPrevMessages = await getPreviousAndNextMessagesOpenSearch(topMessage.id, topMessage.chainLinkId, topMessage.timeSent);

        // Process Sender headers
        for (let i = 0; i < newPrevMessages.length; i++) {
            var tempData = newPrevMessages[i];

            if (i == 0) {
                newPrevMessages[i].showSender = true;
            } else {
                var prevTempData = newPrevMessages[i - 1];

                if (tempData.sender == prevTempData.sender) {
                    newPrevMessages[i].showSender = false;
                } else {
                    newPrevMessages[i].showSender = true;
                }
            }
        }

        // prepend the results to the existing array
        // Get messages array from current state
        const localMessages = [...messages];

        // Prepends the newPerson to the start of people array
        localMessages.unshift(...newPrevMessages);

        // Return the updated state to your component for re-render
        setMessages(localMessages);
        setLoadingPrevious(false);
    };

    const handleClickedMsgThreadNext = async (event) => {
        setLoadingNext(true);
        // get bottom record of the array
        var bottomMessage = messages[messages.length - 1];

        // use its default time as lte
        var newPrevMessages = await getPreviousAndNextMessagesOpenSearch(bottomMessage.id, bottomMessage.chainLinkId, bottomMessage.timeSent, true);

        // Process Sender headers
        for (let i = 0; i < newPrevMessages.length; i++) {
            var tempData = newPrevMessages[i];

            if (i == 0) {
                newPrevMessages[i].showSender = true;
            } else {
                var prevTempData = newPrevMessages[i - 1];

                if (tempData.sender == prevTempData.sender) {
                    newPrevMessages[i].showSender = false;
                } else {
                    newPrevMessages[i].showSender = true;
                }
            }
        }

        // append the results to the existing array
        // Get messages array from current state
        const localMessages = [...messages];

        // Prepends the newPerson to the start of people array
        localMessages.push(...newPrevMessages);

        // Return the updated state to your component for re-render
        setMessages(localMessages);
        setLoadingNext(false);
    };

    const [showPrevAndNext, setShowPrevAndNext] = useState(false);

    const loadSearchData = async (messageData) => {
        setLoading(true);

        try {
            if (Object.keys(alertsList).length === 0) {
                const keywords = await getKeywords();

                dispatch(setAlertsListDetail(keywords));
            }

            if (messageData.recipients) {
                setRecipients(messageData.recipients);
            } else {
                const recipients = [...new Set(alerts[0].recipients
                    ? alerts[0].recipients.map(item => item)
                    : '')];

                setRecipients(recipients.join(', '));
            }

            const search = await getCommunicationMessageDetailOpenSearch(messageData.id);

            setDetailData(messageData);

            var messages = await getMessageThreadOpenSearch(messageData.chainLinkId, messageData.timeSent);

            // Fix for too many messages and the alerted messages gets cut down
            if (messages.totalNoOfRecords > messages.data.length) {
                messages = await getMessageThreadOpenSearch(messageData.chainLinkId, messageData.timeSent, true);
                setShowPrevAndNext(true);
            } else {
                setShowPrevAndNext(false);
            }

            const { data, totalNoOfRecords, totalPages } = messages;

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
                    notes: note,
                    assignedUserId: row.assignedUserId
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
                notes: note,
                assignedUserId: row.assignedUserId
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
                executorId: profileData.userId,
                assignedUserId: row.assignedUserId
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
                notes: note,
                assignedUserId: row.assignedUserId
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
            modalContent: <SuccessModal message={message} handleCloseModal={handleCloseModal} />,
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
        console.log(event);
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
        filterText={searchWords}
        detailData={detailData}
        alertsData={alerts}
        alertsList={alertsList}
        alertLoading={alertLoading}
        messages={messages}
        handleSelectAll={handleSelectAll}
        handleGenerate={handleGenerate}
        handleClickedMsgThreadNext={handleClickedMsgThreadNext}
        handleClickedMsgThreadPrevious={handleClickedMsgThreadPrevious}
        showPrevAndNext={showPrevAndNext}
        loadingNext={loadingNext}
        loadingPrevious={loadingPrevious}
        recipients={recipients}
        sender= {sender}
        useMediaQuery={useMediaQuery}
        nextAlertData={nextAlertData}
        prevAlertData={prevAlertData}
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
        onSubmitAssignUserSingle={onSubmitAssignUserSingle}
        totalPages={totalPages}
        counter={counter}
        pageCounter={pageCounter}
        itemSize={itemSize}/>;
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
