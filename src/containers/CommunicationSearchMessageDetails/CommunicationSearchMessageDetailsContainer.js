// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CommunicationSearchMessageDetailsScreen from './CommunicationSearchMessageDetailsScreen';
import type { Menu } from '../../types';
import { getCommunicationMessageDetail, getRecentMessages, addMessageActivity } from '../../api/communicationSearch';

import messageSample from './messageData.json';
import { setFlashNotification } from '../../redux/modules/flashNotification';

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
    const [messages, setMessages] = useState([]);
    const [messageStorage, setMessageStorage] = useState([]);
    const [loadMessageStatus, setLoadMessageStatus] = useState('message');
    const breadcrumb = [
        {
            label: 'Home',
            path: '/alerts'
        },
        {
            label: 'Search',
            path: '/communication_search'
        }
    ];

    const filters = useLocation();

    useEffect(() => {
        console.log(filters.state.id);
        console.log('userID: ', userId);
        // setMessages(messageSample);
        // console.log(messages);
        // loadMessage(messageSample);
        loadSearchData(filters.state);
    }, [filters]);

    // todo - Move this func to Highligh Component also improve upon
    const handleMessagePrevious = () => {
        setLoadMessageStatus('prev');
        setMessages(messageStorage.before);
    };

    const handleMessageNext = (selection) => {
        setLoadMessageStatus('next');
        setMessages(messageStorage.after);
    };

    const handleBackMessage = (selection) => {
        setLoadMessageStatus('message');
        const updateArr = [];

        updateArr.push(messageStorage.message);
        setMessages(updateArr);
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

                console.log(response);

                if (Object.keys(response).length === 0) {
                    dispatch(setFlashNotification({
                        message: 'Cannot add comment.',
                        isError: false
                    }));
                } else {
                    const { data } = response;

                    console.log(response);

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
        // this load the default message
        // without the before and after threads inside an array

        const updateArr = [];

        updateArr.push(messageData.message);
        setMessages(updateArr);

        setMessageStorage(messageData);
    };

    const loadSearchData = async (commMessageId) => {
        setLoading(true);

        try {
            const search = await getCommunicationMessageDetail(commMessageId.id);
            const messages = await getRecentMessages(commMessageId.id, 5);

            console.log(messages.data);
            loadMessage(messages.data);
            setDetailData(search.data);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return <CommunicationSearchMessageDetailsScreen
        loading={loading}
        userId={userId}
        dataId={filters.state.id}
        detailData={detailData}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleMessagePrevious={handleMessagePrevious}
        handleMessageNext={handleMessageNext}
        handleBackMessage={handleBackMessage}
        loadMessageStatus={loadMessageStatus}
        messages={messages}/>;
}
