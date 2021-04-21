// @flow
import React from 'react';
import Button from '../../base/Button/Button';
import Typography from '../../base/Typography/Typography';
import Pagination from '../../base/Pagination/Pagination';
import DatePicker from '../../base/DatePicker/DatePicker';
import CustomDropdown from '../../base/CustomDropdown/CustomDropdown';
import {
    Table as ReactTable,
    DropdownItem,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import filterIcon from '../../../assets/images/ic_filter.svg';
import './table.scss';

type Props = {
    children?: string | React.Node,
    className?: string,
    filterOptions: Object,
    setFilterOptions: Function,
    tableColumns: Array,
    paginationData: Object,
    setPaginationData: Function,
    filterable: Boolean,
    paginated: Boolean
}

export default function Table({
    children,
    className = '',
    filterOptions,
    setFilterOptions,
    tableColumns,
    paginationData,
    setPaginationData,
    filterable = false,
    paginated = false
}: Props): React$Element<any> {
    return (
        <div className={`w-100 ${className}`}>
            <ReactTable responsive={true}>
                <thead>
                    <tr>
                        {tableColumns.map((column, idx) => {
                            const columnName = column.toLowerCase().replace(' ', '');

                            return (
                                <th key={`th-${idx}`}>
                                    {column}
                                    {filterable && columnName !== 'identifier'
                                        ? columnName === 'date'
                                            ? <DateSearch />
                                            : columnName === 'quantity'
                                                ? <QuantitySearch columnName={columnName} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
                                                : <CheckboxSearch columnName={columnName} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
                                        : null
                                    }
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </ReactTable>
            {paginated && <Pagination className='mt-3'
                totalPages={paginationData.totalPages}
                currentPage={paginationData.currentPage}
                paginationData={paginationData}
                setPaginationData={setPaginationData} />}
        </div>
    );
}

const CheckboxSearch = ({
    columnName,
    filterOptions,
    setFilterOptions
}) => {
    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <DropdownItem header={true}>
                <Input type='text' name='search' placeholder='Search...'
                    bsSize='md' />
            </DropdownItem>
            <div className='table__filter-options overflow-auto'>
                <FormGroup check={true}>
                    <Label check={true}>
                        <Input type='checkbox' />{' '}
                        (Select All)
                    </Label>
                </FormGroup>
                {Object.keys(filterOptions).length > 0 && filterOptions[columnName].map((option, idx) => {
                    return (
                        option !== '' && option !== undefined &&
                            <FormGroup key={idx} check={true}>
                                <Label check={true}>
                                    <Input type='checkbox' />{' '}
                                    {option}
                                </Label>
                            </FormGroup>
                    );
                })}
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2'/>
        </CustomDropdown>
    );
};

const QuantitySearch = () => {
    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <div className='table__quantity-filter-options'>
                <FormGroup tag='fieldset'>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            Below 100K
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            100K - 500K
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            501K - 1M
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            Above 1M
                        </Label>
                    </FormGroup>
                </FormGroup>
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2'/>
        </CustomDropdown>
    );
};

const DateSearch = () => {
    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <div className='table__date-filter-options'>
                <FormGroup tag='fieldset'>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            Today
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            Last 7 Days
                        </Label>
                    </FormGroup>
                    <FormGroup check={true} className='mb-1'>
                        <Label check={true}>
                            <Input type='radio' name='radio' />{' '}
                            <span className='mr-2'>Specific Date</span>
                            <DatePicker width={55} format='dd MMM yyyy' className='table__date-filter-picker'
                                inputVariant='outlined' />
                        </Label>
                    </FormGroup>
                </FormGroup>
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2'/>
        </CustomDropdown>
    );
};
