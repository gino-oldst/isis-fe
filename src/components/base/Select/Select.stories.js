import React from 'react';
import Select from './Select';

const config = {
    title: 'Components/Select',
    component: Select,
    argTypes: {
        className: {
            description: 'Class for select component',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        isMulti: {
            description: 'Multiple selection option',
            type: { required: false },
            control: {
                type: 'boolean'
            }
        },
        defaultValue: {
            description: 'Select default value',
            type: { required: false },
            control: {
                type: 'object'
            }
        },
        options: {
            description: 'Select options',
            type: { required: true },
            control: {
                type: 'object'
            }
        }
    }
};

export default config;

const Template = (args) => <Select {...args} />;

const options = [
    {
        label: 'Sample option 1',
        value: 'Sample option 1',
        iconClass: '',
        iconColor: ''
    },
    {
        label: 'Sample option 2',
        value: 'Sample option 2',
        iconClass: '',
        iconColor: ''
    }];

const optionsWithIcon = [
    {
        label: 'Sample option 1',
        value: 'Sample option 1',
        iconClass: 'fa fa-square',
        iconColor: '#94BC76'
    },
    {
        label: 'Sample option 2',
        value: 'Sample option 2',
        iconClass: 'fa fa-square',
        iconColor: '#333F6A'
    }];

export const Normal = Template.bind({});
Normal.args = {
    className: '',
    options: options
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    className: '',
    options: optionsWithIcon
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
    className: '',
    defaultValue: options[0],
    options: optionsWithIcon
};

export const IsMultipleOption = Template.bind({});
IsMultipleOption.args = {
    className: '',
    isMulti: true,
    defaultValue: options[0],
    options: optionsWithIcon
};

export const WithError = Template.bind({});
WithError.args = {
    className: '',
    isMulti: true,
    defaultValue: options[0],
    options: optionsWithIcon,
    invalid: true
};
