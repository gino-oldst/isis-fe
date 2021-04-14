import React from 'react';
import AppButton from './Button';

const config = {
    title: 'Components/Button/Basic',
    component: AppButton,
    argTypes: {
        onClick: () => { },
        label: {
            description: 'Button Label',
            defaultValue: 'Primary',
            type: { name: 'string', required: false },
            control: {
                type: 'text'
            }
        },
        variant: {
            description: 'Button variant',
            defaultValue: 'primary',
            type: { name: 'string', required: true },
            table: {
                defaultValue: { summary: 'primary' }
            },
            control: {
                type: 'select',
                options: ['primary', 'secondary', 'success', 'warning', 'info', 'danger', 'dark', 'link']
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
    variant: 'secondary',
    label: 'Secondary'
};

export const Success = Template.bind({});
Success.args = {
    variant: 'success',
    label: 'Success'
};

export const Warning = Template.bind({});
Warning.args = {
    variant: 'warning',
    label: 'Warning'
};

export const Danger = Template.bind({});
Danger.args = {
    variant: 'danger',
    label: 'Danger'
};

export const Info = Template.bind({});
Info.args = {
    variant: 'info',
    label: 'Info'
};

export const Light = Template.bind({});
Light.args = {
    variant: 'light',
    label: 'Light'
};

export const Dark = Template.bind({});
Dark.args = {
    variant: 'dark',
    label: 'Dark'
};

export const Link = Template.bind({});
Link.args = {
    variant: 'link',
    label: 'Link'
};
