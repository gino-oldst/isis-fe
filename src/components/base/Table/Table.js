// @flow
import React, { useState } from 'react';
import Button from '../../base/Button/Button';
import Typography from '../../base/Typography/Typography';
import Pagination from '../../base/Pagination/Pagination';
import DatePicker from '../../base/DatePicker/DatePicker';
import CustomDropdown from '../../base/CustomDropdown/CustomDropdown';
import { camelize } from '../../../utils/helpers';
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
    filterString: String,
    setFilterString: Function,
    setActiveFilterColumn: Function,
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
    filterString,
    setFilterString,
    setActiveFilterColumn,
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
                                                ? <QuantitySearch columnName={column}
                                                    filterOptions={filterOptions}
                                                    setFilterOptions={setFilterOptions}
                                                    filterString={filterString}
                                                    setFilterString={setFilterString} />
                                                : <CheckboxSearch columnName={column}
                                                    filterOptions={filterOptions}
                                                    setFilterOptions={setFilterOptions}
                                                    filterString={filterString}
                                                    setFilterString={setFilterString}
                                                    setActiveFilterColumn={setActiveFilterColumn} />
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
    setFilterOptions,
    filterString,
    setFilterString,
    setActiveFilterColumn
}) => {
    const [searchString, setSearchString] = useState('');
    const searchedOptions = filterOptions[camelize(columnName)].filter(option => option.label.toLowerCase().includes(filterString.toLowerCase()));

    const selectFilterHandler = (column, label, isChecked) => {
        const filteredOptions = filterOptions[column].map(option => {
            if (label.toLowerCase() === 'select all') {
                option.checked = isChecked; // select all options
            } else {
                if (option.label.toLowerCase() === 'select all' && option.checked === true) option.checked = false; // for toggle
                if (option.label === label) option.checked = isChecked; // select single option
                if (filterOptions[column].filter(opt => opt.label.toLowerCase() !== 'select all' && opt.checked === false).length === 0) filterOptions[column][0].checked = isChecked; // uncheck select all if all are not checked
            }

            return option;
        });

        setFilterOptions({
            ...filterOptions,
            [column]: filteredOptions
        });

        setActiveFilterColumn(column);
    };

    const searchFilterHandler = value => {
        setSearchString(value);
        setFilterString(value.toLowerCase());
    };

    const resetFilterHandler = column => {
        setFilterString('');
        setSearchString('');

        const resetedOptions = filterOptions[column].map(option => {
            option.checked = false;

            return option;
        });

        setFilterOptions({
            ...filterOptions,
            [column]: resetedOptions
        });
    };

    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <DropdownItem header={true}>
                <Input type='text' name='search' placeholder='Search...'
                    bsSize='md' value={searchString} onChange={e => searchFilterHandler(e.target.value)} />
            </DropdownItem>
            <div className='table__filter-options overflow-auto'>
                {searchedOptions.map((option, idx) => {
                    return (
                        <FormGroup key={idx} check={true}>
                            <Label check={true}>
                                <Input type='checkbox' checked={option.checked} onChange={() => selectFilterHandler(camelize(columnName), option.label, !option.checked)} />{' '}
                                {option.label.toLowerCase() === 'select all' ? `(${option.label})` : option.label}
                            </Label>
                        </FormGroup>
                    );
                })}
            </div>
            <DropdownItem divider={true} />
            <Button label={<><Typography weight='light' variant='size-14'>Reset</Typography></>}
                className='table__filter-reset-button float-right mr-2'
                onClick={() => resetFilterHandler(camelize(columnName))}/>
        </CustomDropdown>
    );
};

const QuantitySearch = ({
    columnName,
    filterOptions,
    setFilterOptions,
    filterString,
    setFilterString
}) => {
    return (
        <CustomDropdown tag='span'
            toggle={<img className='table__filter-icon cursor-pointer' src={filterIcon} alt='talbe-filter-icon' />}>
            <DropdownItem header={true} className='text-center'>
                <img src={filterIcon} alt='talbe-filter-icon' />
            </DropdownItem>
            <DropdownItem divider={true} />
            <div className='table__quantity-filter-options'>
                <FormGroup tag='fieldset'>
                    {filterOptions[camelize(columnName)].map((option, idx) => {
                        return (
                            <FormGroup key={idx} check={true} className='mb-1'>
                                <Label check={true}>
                                    <Input type='radio' name='radio' />{' '}
                                    {option.label}
                                </Label>
                            </FormGroup>
                        );
                    })}
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
