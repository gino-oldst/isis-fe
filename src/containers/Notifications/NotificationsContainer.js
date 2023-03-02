// @flow
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import onClickOutside from 'react-onclickoutside';
import NotificationsScreen from './NotificationsScreen';
import { getNotifications, updateNotification } from '../../api/notifications';
import { setNotifications } from '../../redux/modules/notifications';
import { setLoggingOut } from '../../redux/modules/authentication';
import { useHistory } from 'react-router-dom';

// Get message information from API call
import { getCommunicationMessageDetailOpenSearchNotification } from '../../api/communicationSearch';

function NotificationsContainer(): React$Element<any> {
    const dispatch = useDispatch();
    const history = useHistory();
    const { data } = useSelector(({ notifications }) => notifications);
    const { profileData: { userId } } = useSelector(({ authentication }) => authentication);
    const [isNotifMenuOpen, setNotifMenuOpen] = useState(false);

    const toggleDropdown = (menuOpen) => setNotifMenuOpen(menuOpen);

    NotificationsContainer.handleClickOutside = () => setNotifMenuOpen(false);

    useEffect(() => {
        loadNotifications();

        const intervalId = setInterval(() => loadNotifications(), 30000);

        return () => clearInterval(intervalId);
    }, []);

    const loadNotifications = async () => {
        try {
            const notifications = await getNotifications();

            dispatch(setNotifications(userId, notifications.data.data));
        } catch (e) {
            if (e.status === 403) {
                localStorage.clear();
                dispatch(setLoggingOut());
                window.location.href = '/login';
            }
        }
    };

    const handleReadNotif = async (notif, status) => {
        const payload = {
            id: notif.id,
            // userId: userId,
            // alertId: notif.alertId,
            // alertStatus: notif.alertStatus,
            // behaviorId: notif.behaviorId,
            // behaviorCode: notif.behaviorCode,
            // behaviorDescription: notif.behaviorDescription,
            // message: notif.message,
            seen: !status
        };

        const result = await updateNotification(payload);

        viewCommunicationAlertDetails(notif.alertId);

        if (result.data.responseStatus === 'success') loadNotifications();
    };

    const viewCommunicationAlertDetails = async (id) => {
        const communicationMessageDetails = await getCommunicationMessageDetailOpenSearchNotification(id);

        const message = communicationMessageDetails.data._source;

        history.push({
            pathname: `/communication_alerts_detail/${id}`,
            state: { id: id, chainLinkId: message.chain_id, filterText: message.content, recipients: message.recipients, sender: message.sender, timeSent: message.time_sent, source: message.source }
        });
    };

    return <NotificationsScreen
        today={data.today}
        yesterday={data.yesterday}
        toggleDropdown={toggleDropdown}
        isNotifMenuOpen={isNotifMenuOpen}
        loadNotifications={loadNotifications}
        handleReadNotif={handleReadNotif}/>;
}

const clickOutsideConfig = {
    handleClickOutside: () => NotificationsContainer.handleClickOutside
};

export default onClickOutside(NotificationsContainer, clickOutsideConfig);
