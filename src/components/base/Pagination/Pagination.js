// @flow
import React from 'react';
import Pagination from 'react-bootstrap-4-pagination';
import './pagination.scss';

type Props = {
    className?: string,
    size: string,
    totalPages: Integer,
    currentPage: Integer,
    paginationData: Object,
    setPaginationData: Function
}

export default function ReactPagination({
    className = '',
    size = 'sm',
    totalPages,
    currentPage,
    paginationData,
    setPaginationData
}: Props): React$Element<any> {
    return (
        <Pagination className={`pagination ${className}`}
            size={size}
            prevNext={true}
            prevText='Prev'
            nextText='Next'
            circle={true}
            totalPages={totalPages}
            currentPage={currentPage}
            showMax={4}
            activeColor='#004a93'
            activeBgColor='#ffffff'
            activeBorderColor='#004a93'
            onClick={page => setPaginationData({
                ...paginationData,
                currentPage: page
            })} />
    );
}
