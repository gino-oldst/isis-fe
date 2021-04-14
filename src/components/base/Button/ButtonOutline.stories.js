import React from 'react';
import AppButton from './Button';

const config = {
    title: 'Components/Button/Outline',
    component: AppButton,
    argTypes: {
        onClick: () => { },
        label: {
            description: 'Button Label',
            defaultValue: 'Primary',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        variant: {
            description: 'Button variant',
            defaultValue: 'outline-primary',
            type: { required: false },
            table: {
                defaultValue: { summary: 'primary' }
            },
            control: {
                type: 'select',
                options: ['outline-primary', 'outline-secondary', 'outline-success', 'outline-warning', 'outline-info', 'outline-danger', 'outline-dark', 'outline-link']
            }
        }
    }
};

export default config;

const Template = (args) => <AppButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: 'Primary'
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: 'outline-secondary',
    label: 'Secondary'
};

export const Success = Template.bind({});
Success.args = {
    variant: 'outline-success',
    label: 'Success'
};

export const Warning = Template.bind({});
Warning.args = {
    variant: 'outline-warning',
    label: 'Warning'
};

export const Danger = Template.bind({});
Danger.args = {
    variant: 'outline-danger',
    label: 'Danger'
};

export const Info = Template.bind({});
Info.args = {
    variant: 'outline-info',
    label: 'Info'
};

export const Light = Template.bind({});
Light.args = {
    variant: 'outline-light',
    label: 'Light'
};

export const Dark = Template.bind({});
Dark.args = {
    variant: 'outline-dark',
    label: 'Dark'
};

export const Link = Template.bind({});
Link.args = {
    variant: 'outline-link',
    label: 'Link'
};
