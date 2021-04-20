// @flow
import React from 'react';
import './select.scss';

import Select, { components } from 'react-select';

const { Option } = components;
const customStyles = {
    control: (base, state) => ({
        ...base,
        '&:hover': { borderColor: '#dc3545' }, // border style on hover
        border: '1px solid #dc3545', // default border color
        boxShadow: 'none' // no box-shadow
    }),
    dropdownIndicator: base => ({
        ...base,
        padding: '5px 8px 8px 8px'
    }),
    indicatorSeparator: base => ({
        ...base,
        display: 'none'
    })
};

const colourStyles = { // remove default bg color and text color (blue)
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            color: null,
            backgroundColor: null
        };
    },
    // control: (base) => ({
    //     ...base,
    //     height: 33,
    //     minHeight: 33,
    //     fontSize: 14
    // }),
    dropdownIndicator: base => ({
        ...base,
        padding: '5px 2px 8px 5px'
    }),
    indicatorSeparator: base => ({
        ...base,
        display: 'none'
    })
};

const CustomSelectOption = props => ( // for option icon
    <Option {...props} className={`${props.data.isDisabled ? 'text-muted' : ''}`}>
        {props.data.iconClass !== '' &&
        props.data.iconColor !== '' &&
        <i className={`${props.data.iconClass} mr-2`} style={{ color: props.data.iconColor }} />}
        {props.data.label}
    </Option>
);

const CustomSelectValue = props => ( // for selected value icon
    <div>
        {props.data.iconClass !== '' &&
        props.data.iconColor !== '' &&
        <i className={`${props.data.iconClass} mr-2`} style={{ color: props.data.iconColor }} />}
        {props.data.label}
    </div>
);

type Props = {
    className?: string,
    name: string,
    isMulti?: Boolean,
    defaultValue?: string,
    options: Array,
    invalid: Boolean,
    onChangeHandler: Function
}

export default function AppSelect({
    className = '',
    name,
    isMulti = false,
    defaultValue,
    options,
    invalid = false,
    onChangeHandler,
    ...rest
}: Props): React$Element<any> {
    return (
        <Select
            {...rest}
            name={name}
            isMulti={isMulti}
            options={options}
            defaultValue={defaultValue}
            components={{ Option: CustomSelectOption, SingleValue: CustomSelectValue }}
            className={`${className}`}
            onChange={onChangeHandler}
            styles={invalid ? customStyles : colourStyles} />
    );
}
