// @flow
import React from 'react';
import Pagination from 'react-bootstrap-4-pagination';
import './pagination.scss';

type Props = {
    className?: string
}

export default function ReactPagination({ className = '' }: Props): React$Element<any> {
    return (
        <Pagination className={`pagination ${className}`}
            size='sm'
            prevNext={true}
            circle={true}
            totalPages={10}
            currentPage={1}
            showMax={4}
            activeColor='#004a93'
            activeBgColor='#ffffff'
            activeBorderColor='#004a93' />
    );
}
