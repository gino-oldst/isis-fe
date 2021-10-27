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
    control: (base) => ({
        ...base,
        fontSize: 15
    }),
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
    components: any
}

export default function AppSelect({
    className = '',
    name,
    isMulti = false,
    defaultValue,
    options,
    invalid = false,
    components,
    ...rest
}: Props): React$Element<any> {
    if (rest.allowSelectAll) {
        return (
            <Select
                {...rest}
                name={name}
                isMulti={isMulti}
                defaultValue={defaultValue}
                options={[rest.allOption, ...options]}
                components={components || { Option: CustomSelectOption, SingleValue: CustomSelectValue }}
                className={`${className}`}
                styles={invalid ? customStyles : colourStyles}
                onChange={(selected, event) => {
                    if (selected !== null && selected.length > 0) {
                        if (selected[selected.length - 1].value === rest.allOption.value) {
                            return rest.onChange([rest.allOption, ...options]);
                        }

                        let result = [];

                        if (selected.length === options.length) {
                            if (selected.includes(rest.allOption)) {
                                result = selected.filter(
                                    option => option.value !== rest.allOption.value
                                );
                            } else if (event.action === 'select-option') {
                                result = [rest.allOption, ...options];
                            }

                            return rest.onChange(result);
                        }
                    }

                    return rest.onChange(selected);
                }}/>
        );
    }

    return (
        <Select
            {...rest}
            name={name}
            isMulti={isMulti}
            options={options}
            defaultValue={defaultValue}
            components={components || { Option: CustomSelectOption, SingleValue: CustomSelectValue }}
            className={`${className}`}
            styles={invalid ? customStyles : colourStyles} />
    );
}

AppSelect.defaultProps = {
    allOption: {
        label: 'Select all',
        value: '*'
    }
};
