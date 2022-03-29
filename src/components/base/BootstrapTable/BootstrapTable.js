// @flow
import React, { useState } from 'react';
import { Table as TableBootstrap } from 'react-bootstrap';
import { FaSortUp, FaSortDown, FaSort, FaSearch } from 'react-icons/fa';
import Typography from '../Typography/Typography';
// import Paginate from '../Paginate';

import './bootstrap-table.scss';

type Props = {
    withSearch?: boolean,

    /**
     * Required if withSearch is enabled
     */
    searchKeys?: Array<string>,
    isHover?: boolean,
    withPagination?: boolean,
    isStriped?: boolean,
    headers: Array<any>,
    list: Array<any>
}

export default function BootstrapTable({
    title, headers, list, withPagination, withSearch, searchKeys = [], isStriped = false, isHover = false
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

    console.log('xd');
    console.log(getSearchData(list));

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

    return (
        <div className='table'>
            <div className={`table__title${title ? '' : ' justify-content-end'}`}>
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
                            <input onChange={handleSearch} placeholder='Enter search keyword' className='table__search-input'/>
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
                        {headers.map(({ key, label }) =>
                            <th className='table__header' key={key}>
                                <div className='table__header-item'>
                                    {label}
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
                    {getPagedData().map((item: any, i: number) =>
                        <tr key={i} className='table__data-row'>
                            {headers.map(({ key }) =>
                                <td className='table__data' key={key}>
                                    {item.hasOwnProperty(`${key}Component`)
                                        ? item[`${key}Component`]
                                        : item[key]
                                    }</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </TableBootstrap>

            {withPagination && (
                <div>
                    {/* <Paginate
                        totalItems={list.length}
                        totalPerPage={totalPerPage}
                        currentPage={currentPage}
                        handleTotalPerPageChange={handleTotalPerPageChange}
                        handlePageChange={handlePageChange} /> */}
                </div>
            )}
        </div>
    );
}
