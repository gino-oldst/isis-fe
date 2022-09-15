// @flow
import moment from 'moment';
import React, { useState } from 'react';
import { Table as TableBootstrap } from 'react-bootstrap';
import { FaSortUp, FaSortDown, FaSort, FaSearch } from 'react-icons/fa';
import Typography from '../Typography/Typography';
import Badge from '../../base/Badge/Badge';
// import Paginate from '../Paginate';

import './bootstrap-table.scss';
import { truncateText } from '../../../utils/helpers';
import Paginate from '../Paginate/Paginate';
import ReactPagination from '../Pagination/Pagination';

type Props = {
    withSearch?: boolean,
    withSelection?: boolean,
    isLoading?: boolean,
    /**
     * Required if withSearch is enabled
     */
    searchKeys?: Array<string>,
    isHover?: boolean,
    withPagination?: boolean,
    isStriped?: boolean,
    headers: Array<any>,
    list: Array<any>,
    placeHolder: string,

    // Select
    isCheckAll?: boolean,
    handleSelectAll?: (e: any) => void,
    handleItemCheck?: (e: any) => void,
    handleItemClick?: (e: any) => void,
    loadSearchData?: (e: any) => void,
}

export default function BootstrapTable({
    title, handleItemClick, loadSearchData, headers, list, placeHolder, withPagination, withSearch, withSelection, searchKeys = [], isStriped = false, isLoading, isHover = false, isCheckAll = false, handleSelectAll, handleItemCheck
}: Props): React$Element<any> {
    const [sortBy, setSortBy] = useState('id');
    const [isAsc, setIsAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPerPage, setTotalPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');

    const getSearchData = (arr: Array<any>) => {
        if (searchValue) {
            const pattern = new RegExp(searchValue, 'i');

            return arr.filter(item =>
                searchKeys.some(key => pattern.test(item[key]))
            );
        }

        return arr;
    };

    const sortData = getSearchData(list).sort((a: any, b: any) => {
        if (isAsc) {
            if (a[sortBy] < b[sortBy]) return -1;
            else if (a[sortBy] > b[sortBy]) return 1;
        } else {
            if (a[sortBy] > b[sortBy]) return -1;
            else if (a[sortBy] < b[sortBy]) return 1;
        }

        return 0;
    });

    const getPagedData = () => {
        return sortData.slice((currentPage - 1) * totalPerPage, currentPage * totalPerPage);
    };

    const handleSort = (key: string) => {
        if (key === sortBy) {
            setIsAsc(!isAsc);
        } else {
            setSortBy(key);
            setIsAsc(true);
        }

        setCurrentPage(1);
    };

    const handleTotalPerPageChange = (e: any) => {
        setTotalPerPage(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (toPage: number) => {
        setCurrentPage(toPage);
    };

    const handleSearch = (e: any) => {
        setSearchValue(e.target.value.toLowerCase());
    };

    const cellRender = (key, item) => {
        if (key == 'subject') {
            return (
                <div className='d-flex flex-column'>
                    <Typography size={14} color='color-3' className='search-results__box-label' >
                        {item.subject == null ? 'No Subject' : item.subject}
                    </Typography>
                    <Typography size={14} color='color-3' className='search-results__box-label' >
                        {item.message}
                    </Typography>
                </div>
            );
        } else if (key == 'keyword') {
            return (
                <div className='d-flex flex-column'>
                    {item.keyword != null
                        ? <>
                            <Typography size={14} color='color-3' className='search-results__box-label' >
                                {item.keyword}
                            </Typography>
                            <Typography size={14} color='color-3' className='search-results__box-label' >
                                {item.keywordId}
                            </Typography>
                        </>
                        : 'N/A'
                    }
                </div>
            );
        } else if (key == 'source') {
            return (
                <div className='d-flex flex-column'>
                    {item.source != null
                        ? <Typography size={14} color='color-3' className='search-results__box-label' >
                            {item.source}
                        </Typography>
                        : 'N/A'
                    }
                </div>
            );
        } else if (key == 'timeSent') {
            const readableDate = moment(item[key]).utc().local().format('DD/MM/YYYY hh:mm A');

            return (
                <div>
                    <div>{readableDate}</div>
                </div>
            );
        } else if (key == 'status') {
            const status = (item[key]).toLowerCase();

            return <Badge status={status}/>;
        } else if (key == 'id') {
            return (
                <div>
                    <span className={'color-link-text cursor-pointer'} onClick={() => handleItemClick(item[key])}>
                        {truncateText(item[key], 20)}
                    </span>
                </div>
            );
        } else {
            return (
                <div>
                    <div>{item[key]}</div>
                </div>
            );
        }
    };

    return (
        <div className='table'>
            <div className={`table__title${title ? '' : ' justify-content-start'}`}>
                {title && (
                    <div>
                        <Typography size={26}>
                            {title}
                        </Typography>
                    </div>
                )}
                {withSearch && (
                    <div>
                        <div className='table__search'>
                            <FaSearch className='table__search-icon' size={20}/>
                            <input onChange={handleSearch} placeholder={placeHolder} className='table__search-input'/>
                        </div>
                        <div>
                            <Typography color='color-3 mt-2 mb-5' className='search-results__box-label' >
                                {list.length} Results
                            </Typography>
                        </div>
                    </div>
                )}
            </div>
            <TableBootstrap
                striped={isStriped}
                hover={isHover}
                responsive='sm'>
                <thead>
                    <tr>
                        {withSelection && (
                            <th>
                                <div className='table__header-item'>
                                    <input
                                        type='checkbox'
                                        className='form-check-input'
                                        id='mastercheck'
                                        checked={isCheckAll}
                                        onChange={(e) => handleSelectAll(e)}/>
                                </div>
                            </th>
                        )}
                        {headers.map(({ key, label }) =>
                            <th className='table__header' key={key}>
                                <div className='table__header-item'>
                                    <Typography size={14} color='base' weight='semi-bold'
                                        className='mr-1' key={key}>
                                        {label}
                                    </Typography>
                                    <div className='table__sort-icon' onClick={() => handleSort(key)}>
                                        {sortBy === key
                                            ? isAsc ? <FaSortUp size={15}/> : <FaSortDown size={15} />
                                            : <FaSort size={15} color='#d1d1d1'/>
                                        }
                                    </div>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {!list.length
                        ? <tr>
                            <td colSpan={headers.length}>
                                <Typography color='bluish-gray' className='text-center'>{isLoading ? 'Retrieving data...' : 'No Results Found'}</Typography>
                            </td>
                        </tr>
                        : getPagedData().map((item: any, i: number) =>
                            <tr key={i} className='table__data-row'>
                                {withSelection && (
                                    <td className='table__data' key={i}>
                                        <input
                                            type='checkbox'
                                            className='form-check-input'
                                            id='mastercheck'
                                            checked={item.selected}
                                            onChange={(e) => handleItemCheck(e, item)}/>
                                    </td>
                                )}
                                {headers.map(({ key }) =>
                                    <>
                                        <td className='table__data' key={key}>
                                            {cellRender(key, item)}</td>
                                    </>
                                )}
                            </tr>
                        )
                    }
                </tbody>
            </TableBootstrap>

            {withPagination && (
                <div>
                    <Paginate
                        className='d-flex justify-content-center'
                        totalItems={list.length}
                        totalPerPage={totalPerPage}
                        currentPage={currentPage}
                        handleTotalPerPageChange={handleTotalPerPageChange}
                        handlePageChange={handlePageChange} />
                    {/* <ReactPagination
                        className='pagination'
                        totalPages={list.length / 10}
                        currentPage={1}
                        paginationData={list}
                        setPaginationData={handlePageChange}/> */}
                </div>
            )}
        </div>
    );
}
