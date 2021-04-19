// @flow
import React from 'react';
import moment from 'moment';
import Badge from '../../base/Badge/Badge';
import Pagination from '../../base/Pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTextColor } from '../../../utils/helpers';
import { Table as ReactTable } from 'reactstrap';
import './table.scss';

type Props = {
    className?: string,
    tableData: Array,
    tableColumns: Array,
    filterable: Boolean
}

export default function Table({
    className = '',
    tableData,
    tableColumns,
    filterable = false
}: Props): React$Element<any> {
    return (
        <div className={`w-100 ${className}`}>
            <ReactTable responsive={true}>
                <thead>
                    <tr>
                        {tableColumns.map(column => {
                            return (
                                <th className={`${filterable ? 'cursor-pointer' : ''}`}>
                                    {column}
                                    {filterable && <FontAwesomeIcon className='table__filter-icon' icon='filter' size='sm' />}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((value, idx1) => {
                        const dataKeys = Object.keys(value);

                        return (
                            <tr>
                                {dataKeys.map((key, idx2) => {
                                    return (
                                        <td>
                                            {idx2 === 0
                                                ? <span className='color-sidebar-2 cursor-pointer'>{value[dataKeys[idx2]]}</span>
                                                : dataKeys[idx2].toLowerCase() === 'date'
                                                    ? moment(value[dataKeys[idx2]]).format('L')
                                                    : dataKeys[idx2].toLowerCase() === 'escalation'
                                                        ? <span className='font-weight-bold'>{getTextColor(value[dataKeys[idx2]])}</span>
                                                        : dataKeys[idx2].toLowerCase() === 'status'
                                                            ? <Badge status={value[dataKeys[idx2]]} />
                                                            : value[dataKeys[idx2]]
                                            }
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </ReactTable>
            <Pagination className='mt-3' />
        </div>
    );
}
