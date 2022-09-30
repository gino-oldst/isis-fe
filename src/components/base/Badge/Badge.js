// @flow
import React from 'react';
import { Badge as ReactBadge, Tooltip } from 'reactstrap';
import './badge.scss';

type Props = {
    className?: string,
    status: string,
    text?: string,
    isCustom?: Boolean
}

export default function Badge({
    className = '',
    status,
    text,
    isCustom = false
}: Props): React$Element<any> {
    let color = '';
    const message = isCustom ? text : status.toUpperCase();

    switch (status.toLowerCase()) {
        case 'resolved':
            color = 'bg-badge-green text-dark';
            break;
        case 'enabled':
            color = 'bg-badge-green text-dark';
            break;
        case 'archived':
            color = 'bg-badge-gray';
            break;
        case 'in review':
            color = 'bg-badge-violet';
            break;
        case 'in_review':
            color = 'bg-badge-violet';
            break;
        case 'open':
            color = 'bg-badge-orange';
            break;
        case 'active':
            color = 'bg-badge-green text-dark';
            break;
        case 'inactive':
            color = 'bg-badge-gray';
            break;
        case 'title':
            color = 'bg-download-button';
            break;
        default:
            color = 'bg-badge-gray';
            break;
    }

    return (
        <>
            {status === 'title' || !isCustom &&
                <ReactBadge
                    className={`badge ${className + ' ' + color}`}>
                    {message}
                </ReactBadge>
            }
            {status === 'title' &&
                <ReactBadge
                    className={`badge ${className + ' ' + color}`}>
                    {message}
                </ReactBadge>
            }
            {status !== 'title' && isCustom &&
                <div data-toggle='tooltip' data-placement='top' title={`${status.toUpperCase()}`}>
                    <ReactBadge
                        className={`badge ${className + ' ' + color}`}>
                        {message}
                    </ReactBadge>
                </div>
            }
        </>
    );
}
