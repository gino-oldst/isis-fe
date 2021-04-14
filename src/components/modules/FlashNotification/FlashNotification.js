// @flow
import React, { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux'
;import { clearFlashMessage } from '../../../redux/modules/flashNotification';
import './flash-notification.scss';

type Props = {
    className?: string
}

// TODO: add queuing

export default function FlashNotification({ className = '' }: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { message, isError, duration } = useSelector(({ flashNotification }) => flashNotification);

    useEffect(() => {
        if (message) {
            setTimeout(() => {
                dispatch(clearFlashMessage());
            }, duration);
        }
    }, [message, duration]);

    return (
        <div className={`flash-notification${message ? ' is-visible' : ''}`} >
            <Alert variant={isError ? 'danger' : 'success'} className='flash-notification__alert animateOpen'>
                {message}
            </Alert>
        </div>
    );
}
