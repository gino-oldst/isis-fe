// @flow
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CommunicationSearchMessageDetailsScreen from './CommunicationSearchMessageDetailsScreen';
import type { Menu } from '../../types';
import { getCommunicationMessageDetail, getRecentMessages, addMessageActivity, getRecipients, getMessageThread, getMessageThreadOpenSearch, getCommunicationMessageDetailOpenSearch } from '../../api/communicationSearch';
import { getActivityList, getKeywords, getMessageAlerts, postComment, updateAlert, retrievePredefinedReasons } from '../../api/communicationAlerts';
import messageSample from './messageData.json';
import { setFlashNotification } from '../../redux/modules/flashNotification';
import { uniq } from 'underscore';
import * as Scroll from 'react-scroll';
import HtmlToRtfBrowser from 'html-to-rtf-browser';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function,
    useMediaQuery: Function,
    userId: Any
}

export default function CommunicationSearchMessageDetailsContainer({
    userId,
    sidebarMenu,
    handleCloseModal,
    useMediaQuery
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [detailData, setDetailData] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageStorage, setMessageStorage] = useState([]);
    const [alertLoading, setAlertLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [messageButtonDisable, setMessageButtonDisable] = useState(false);
    const [loadMessageStatus, setLoadMessageStatus] = useState('message');
    const [alerts, setAlerts] = useState([]);
    const filters = useLocation();
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search Message',
            path: '/communication_search'
        },
        {
            label: 'Search Results',
            path: '/communication_search_results'
        },
        {
            label: filters.state.id,
            path: `communication_search_message_details/${filters.state.id}`,
            disabled: true
        }
    ];

    useEffect(() => {
        loadSearchData(filters.state);
        loadAlerts(filters.state.id);
    }, [filters]);

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

    const handleAddComment = async (comment) => {
        const formData = {
            messageId: filters.state.id,
            executorId: userId,
            event: comment,
            type: 'USER_EVENT'
        };

        try {
            if (formData.event) {
                const response = await addMessageActivity(formData);

                if (Object.keys(response).length === 0) {
                    dispatch(setFlashNotification({
                        message: 'Cannot add comment.',
                        isError: false
                    }));
                } else {
                    const { data } = response;

                    dispatch(setFlashNotification({
                        message: 'Comment Successfully added.',
                        isError: false
                    }));
                }
            }
        } catch (error) {
            dispatch(setFlashNotification({
                message: 'Error in adding comment',
                isError: true
            }));
        }
    };

    const loadMessage = (messageData) => {
        const updateArr = [];

        messageData.before.map(item => {
            updateArr.push(item);
        });

        messageData.after.map(item => {
            updateArr.push(item);
        });

        updateArr.push(messageData.message);

        setMessages(updateArr);

        setMessageStorage(messageData);
    };

    const loadSearchData = async (messageData) => {
        setLoading(true);

        try {
            const search = await getCommunicationMessageDetailOpenSearch(messageData.id);

            setDetailData(messageData);

            const messages = await getMessageThreadOpenSearch(messageData.chainLinkId, messageData.timeSent);
            const { data, totalNoOfRecords, totalPages } = messages;

            console.log(messageData);

            for (let i = 0; i < data.length; i++) {
                var tempData = data[i];

                data[i].forDownload = false;

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

            if (messageData.recipients) {
                setRecipients(messageData.recipients);
            } else {
                const recipients = [...new Set(alerts[0].recipients
                    ? alerts[0].recipients.map(item => item)
                    : '')];

                setRecipients(recipients.join(', '));
            }

            // const recipients = await getRecipients(search.data.chainLinkId);

            // const extractedRecipients = extractRecipients(recipients.data);

            // setRecipients(extractedRecipients);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
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

    return <CommunicationSearchMessageDetailsScreen
        loading={loading}
        userId={userId}
        dataId={filters.state.id}
        filterText={filters.state.filterText}
        detailData={detailData}
        useMediaQuery={useMediaQuery}
        alertsData={alerts}
        breadcrumb={breadcrumb}
        handleCloseModal={handleCloseModal}
        sidebarMenu={sidebarMenu}
        loadMessageStatus={loadMessageStatus}
        messages={messages}
        messageButtonDisable={messageButtonDisable}
        handleSelectAll={handleSelectAll}
        isCheckAll={isCheckAll}
        handleGenerate={handleGenerate}
        isChecked={isChecked}
        recipients={recipients} />;
}
