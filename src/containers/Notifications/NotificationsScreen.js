// @flow
import React from 'react';
import moment from 'moment';
import Typography from '../../components/base/Typography/Typography';
import Badge from '../../components/base/Badge/Badge';
import Tooltip from '../../components/base/Tooltip/Tooltip';
import bellIcon from '../../assets/images/ic_bell-solid-white.svg';
import { getUserId } from '../../utils/helpers';
import './notifications.scss';
import {
    UncontrolledDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateNotification } from '../../api/notifications';

type Props = {
    today: Array,
    yesterday: Array,
    isNotifMenuOpen: Boolean,
    toggleDropdown: Function,
    loadNotifications: Function
}

export default function NotificationsScreen({
    today,
    yesterday,
    toggleDropdown,
    isNotifMenuOpen,
    loadNotifications
}: Props): React$Element<any> {
    const handleReadNotif = async (notif, status) => {
        const payload = {
            id: notif.id,
            userId: getUserId(),
            alertId: notif.alertId,
            alertStatus: notif.alertStatus,
            behaviorId: notif.behaviorId,
            behaviorCode: notif.behaviorCode,
            behaviorDescription: notif.behaviorDescription,
            message: notif.message,
            status: status.toUpperCase() === 'READ' ? 'UNREAD' : 'READ'
        };

        const result = await updateNotification(payload);

        if (result.data.responseStatus === 'success') loadNotifications();
    };

    return (
        <UncontrolledDropdown isOpen={isNotifMenuOpen} toggle={e => {
            if (!e.target.outerHTML.includes('M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z')) toggleDropdown(!isNotifMenuOpen);
        }} nav={true}
        direction='down'
        className='d-flex align-self-center mr-4'>
            <div className='navbar__notifications'>
                <DropdownToggle nav={true} className='d-flex'>
                    <FontAwesomeIcon className='navbar__notification-bell' icon='bell' size='lg'
                        color='gray' name='sasa' />
                    {today.length + yesterday.length > 0 && <div class='navbar__notifications-number'>{today.length + yesterday.length}</div>}
                </DropdownToggle>
                <DropdownMenu right={true} className='mt-2 navbar__notifications-dropdown'>
                    <div className='navbar__notifications-title px-4 pt-2'>
                        <Typography color='color-3' weight='semi-bold' variant='size-16'
                            className='mb-2'>Notifications</Typography>
                        {today.length === 0 && yesterday.length === 0 &&
                            <Typography color='color-2' variant='size-14'
                                className='mt-4 mb-2'>No data to show.</Typography>}
                    </div>
                    <div className='navbar__notifications-today'>
                        {today.length > 0 &&
                            <>
                                <div className='navbar__notifications-today-title px-4 py-1'>
                                    <Typography color='color-3' weight='light' variant='size-10'>TODAY</Typography>
                                </div>
                                {today.map((tod, idx) => {
                                    return (
                                        <DropdownItem key={`today-${idx}`} className='px-4 py-4 d-flex align-items-center'>
                                            <div className='navbar__notifications__icon'>
                                                <img src={bellIcon} alt='Notification_Bell_Icon' className='notification_icon' />
                                            </div>
                                            <div className='navbar__notifications__details mr-auto'>
                                                <Typography color='color-3' variant='size-12' weight='semi-bold'
                                                    className='mb-2'>{tod.message}</Typography>
                                                <Typography color='color-3' variant='size-14' className='mb-2'>
                                                    <span className='mr-3'>{tod.behaviorCode} | {tod.behaviorDescription}</span>
                                                    <Badge status={tod.alertStatus} />
                                                </Typography>
                                                <Typography color='color-3' variant='size-12' className='text-muted'>{moment(tod.dateCreated).format('DD MMM yyyy, hh:mm a')}</Typography>
                                            </div>
                                            <div className={`mr-2 navbar__notifications__${tod.status.toLowerCase() === 'unread' ? 'unread' : 'read'}-icon`}>
                                                <FontAwesomeIcon className={`navbar__notification-${tod.status.toLowerCase() === 'unread' ? 'unread' : 'read'}`} icon='circle'
                                                    size='xs'
                                                    data-tip={true} data-for={tod.id} onClick={() => handleReadNotif(tod, tod.status.toLowerCase())} />
                                            </div>
                                            <Tooltip place='left' id={tod.id}>
                                                <Typography variant='size-10' weight='light' color='color-3'>{tod.status.toLowerCase() === 'unread' ? 'Mark as read' : 'Mark as unread'}</Typography>
                                            </Tooltip>
                                        </DropdownItem>
                                    );
                                })}
                            </>
                        }
                    </div>
                    <div className='navbar__notifications-past'>
                        {yesterday.length > 0 &&
                                <>
                                    <div className='navbar__notifications-past-title px-4 py-1'>
                                        <Typography color='color-3' weight='light' variant='size-10'>YESTERDAY AND EARLIER</Typography>
                                    </div>
                                    {yesterday.map((yes, idx) => {
                                        return (
                                            <DropdownItem key={`yesterdat-${idx}`} className='px-4 py-4 d-flex align-items-center'>
                                                <div className='navbar__notifications__icon'>
                                                    <img src={bellIcon} alt='Notification_Bell_Icon' className='notification_icon' />
                                                </div>
                                                <div className='navbar__notifications__details mr-auto'>
                                                    <Typography color='color-3' variant='size-12' weight='semi-bold'
                                                        className='mb-2'>{yes.message}</Typography>
                                                    <Typography color='color-3' variant='size-14' className='mb-2'>
                                                        <span className='mr-3'>{yes.behaviorCode} | {yes.behaviorDescription}</span>
                                                        <Badge status={yes.alertStatus} />
                                                    </Typography>
                                                    <Typography color='color-3' variant='size-12' className='text-muted'>{moment(yes.dateCreated).format('DD MMM yyyy, hh:mm a')}</Typography>
                                                </div>
                                                <div className={`mr-2 navbar__notifications__${yes.status.toLowerCase() === 'unread' ? 'unread' : 'read'}-icon`}>
                                                    <FontAwesomeIcon className={`navbar__notification-${yes.status.toLowerCase() === 'unread' ? 'unread' : 'read'}`} icon='circle'
                                                        size='xs'
                                                        data-tip={true} data-for={yes.id} onClick={() => handleReadNotif(yes, yes.status.toLowerCase())} />
                                                </div>
                                                <Tooltip place='left' id={yes.id}>
                                                    <Typography variant='size-10' weight='light' color='color-3'>{yes.status.toLowerCase() === 'unread' ? 'Mark as read' : 'Mark as unread'}</Typography>
                                                </Tooltip>
                                            </DropdownItem>
                                        );
                                    })}
                                </>
                        }
                    </div>
                </DropdownMenu>
            </div>
        </UncontrolledDropdown>
    );
}
