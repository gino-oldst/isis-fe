// @flow
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CommunicationSearchMessageDetailsScreen from './CommunicationSearchMessageDetailsScreen';
import type { Menu } from '../../types';
import { getCommunicationMessageDetail, getRecentMessages, addMessageActivity, getRecipients, getMessageThread } from '../../api/communicationSearch';

import messageSample from './messageData.json';
import { setFlashNotification } from '../../redux/modules/flashNotification';
import { uniq } from 'underscore';
import * as Scroll from 'react-scroll';

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
    const [count, setCount] = useState(0);
    const [messageButtonDisable, setMessageButtonDisable] = useState(false);
    const [loadMessageStatus, setLoadMessageStatus] = useState('message');
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
    }, []);

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

        console.log(updateArr);

        setMessageStorage(messageData);
    };

    const loadSearchData = async (commMessageId) => {
        setLoading(true);

        try {
            const search = await getCommunicationMessageDetail(commMessageId.id);

            setDetailData(search.data);

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

            const recipients = await getRecipients(search.data.chainLinkId);

            const extractedRecipients = extractRecipients(recipients.data);

            setRecipients(extractedRecipients);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const extractRecipients = (recipients) => {
        const unique = [...new Set(recipients.data.map(item => item.recipient))];

        return unique;
    };

    return <CommunicationSearchMessageDetailsScreen
        loading={loading}
        userId={userId}
        dataId={filters.state.id}
        filterText={filters.state.filterText}
        detailData={detailData}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        loadMessageStatus={loadMessageStatus}
        messages={messages}
        messageButtonDisable={messageButtonDisable}
        recipients={recipients}/>;
}
