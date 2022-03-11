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

export default function HighlightKeywords({ className = '' }: Props): React$Element<any> {
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
        // Load Prev
        
        // Actual Messeges with Highlight
        <div>
            <Highlighter
                activeClassName={styles.Active}
                activeIndex={activeIndex}
                caseSensitive={caseSensitive}
                highlightClassName={styles.Highlight}
                highlightStyle={{ fontWeight: 'normal' }}
                sanitize={latinize}
                searchWords={searchWords}
                textToHighlight={textToHighlight}
            />
        </div>
        
        // Load Next
    );
}
