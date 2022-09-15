import React from 'react';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import Typography from '../Typography/Typography';
import Button from '../../base/Button/Button';
import './paginate.scss';

type Props = {
    className?: string,
    totalPerPage: number,
    totalItems: number,
    currentPage: number,
    handleTotalPerPageChange: (e: Object) => void,
    handlePageChange: (value: number) => void
}

export default function Paginate({
    className = '', totalPerPage, totalItems, currentPage, handleTotalPerPageChange, handlePageChange
}: Props): JSX.Element {
    return (
        <div className={`pagination ${className}`} >
            <div className='pagination__row-count'>
                <Typography size={14}>Rows per page</Typography>
                <select onChange={handleTotalPerPageChange} value={totalPerPage} className='pagination__row-count__select'>
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                </select>
            </div>

            <Typography size={14} color='base' className='pagination__showing-count'>
                Showing {(currentPage * totalPerPage + 1) - totalPerPage}-{currentPage * totalPerPage > totalItems ? totalItems : currentPage * totalPerPage} of {totalItems}
            </Typography>

            <div className='pagination__controls'>
                <Button
                    iconLeft={BsChevronLeft}
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    label={<><Typography weight='semi-bold' variant='size-14'>Previous Page</Typography></>}
                    size='sm'
                    className='pagination__controls-prev d-flex align-items-center mr-3'/>
                <Button
                    iconRight={BsChevronRight}
                    disabled={!((currentPage * totalPerPage) < totalItems)}
                    onClick={() => handlePageChange(currentPage + 1)}
                    label={<><Typography weight='semi-bold' variant='size-14'>Next Page</Typography></>}
                    size='sm'
                    className='pagination__controls-next d-flex align-items-center'/>
            </div>
        </div>
    );
}
