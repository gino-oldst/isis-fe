// @flow
import React from 'react';
import { Badge as ReactBadge } from 'reactstrap';
import './badge.scss';

type Props = {
    className?: string,
    status: string
}

export default function Badge({
    className = '',
    status
}: Props): React$Element<any> {
    let color = '';

    switch (status.toLowerCase()) {
        case 'resolved':
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
        default:
            color = 'bg-badge-gray';
            break;
    }

    return (
        <ReactBadge
            className={`badge ${className + ' ' + color}`}>
            {status.toUpperCase()}
        </ReactBadge>
    );
}
