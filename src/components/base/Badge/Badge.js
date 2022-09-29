// @flow
import React from 'react';
import { Badge as ReactBadge } from 'reactstrap';
import './badge.scss';

type Props = {
    className?: string,
    status: string,
    text: string
}

export default function Badge({
    className = '',
    status,
    text
}: Props): React$Element<any> {
    let color = '';

    console.log(text);

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
        <ReactBadge
            className={`badge ${className + ' ' + color}`}>
            {text.toString() || status.toUpperCase()}
        </ReactBadge>
    );
}
