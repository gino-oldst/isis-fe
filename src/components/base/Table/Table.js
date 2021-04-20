// @flow
import React from 'react';
import Pagination from '../../base/Pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table as ReactTable } from 'reactstrap';
import './table.scss';

type Props = {
    children?: string | React.Node,
    className?: string,
    tableColumns: Array,
    tableData: Array,
    filterable: Boolean,
    paginated: Boolean
}

export default function Table({
    children,
    className = '',
    tableColumns,
    tableData,
    filterable = false,
    paginated = false
}: Props): React$Element<any> {
    return (
        <div className={`w-100 ${className}`}>
            <ReactTable responsive={true}>
                <thead>
                    <tr>
                        {tableColumns.map((column, idx) => {
                            return (
                                <th key={`th-${idx}`} className={`${filterable ? 'cursor-pointer' : ''}`}>
                                    {column}
                                    {filterable && <FontAwesomeIcon className='table__filter-icon' icon='filter' size='sm' />}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </ReactTable>
            {paginated && <Pagination className='mt-3' />}
        </div>
    );
}
