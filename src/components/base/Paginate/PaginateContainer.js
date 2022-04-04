// @flow
import React from 'react';
import Paginate from './Paginate';

type Props = {
    className?: string
}

export default function PaginateContainer({ className = '' }: Props): React$Element<any> {
    return (
        <Paginate className={className} />
    );
}
