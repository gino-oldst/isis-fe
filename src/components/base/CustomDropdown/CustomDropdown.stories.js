import React from 'react';
import CustomDropdown from './CustomDropdown';

const config = {
    title: 'Components/CustomDropdown',
    component: CustomDropdown,
    argTypes: {
        variant: {
            description: 'Dropdown color variant',
            defaultValue: 'primary',
            type: { name: 'string', required: false },
            table: {
                defaultValue: { summary: 'primary' }
            },
            control: {
                type: 'select',
                options: ['primary', 'secondary', 'success', 'warning', 'info', 'danger', 'dark', 'link']
            }
        },
        tag: {
            description: 'Dropdown custom element type',
            defaultValue: 'button',
            type: { name: 'string', required: false },
            control: {
                type: 'text'
            }
        },
        toggle: {
            description: 'Dropdown custom element content',
            defaultValue: 'Dropdown',
            type: { name: 'string', required: false },
            control: {
                type: 'text'
            }
        },
        direction: {
            description: 'Dropdown direction',
            defaultValue: 'down',
            type: { name: 'string', required: false },
            control: {
                type: 'select',
                options: ['up', 'down', 'left', 'right']
            }
        },
        hasCaret: {
            description: 'Dropdown caret icon',
            defaultValue: false,
            type: { name: 'boolean', required: false },
            control: {
                type: 'select',
                options: [true, false]
            }
        },
        children: {
            description: 'Dropdown menu items',
            defaultValue: '<i>Haha</i>',
            type: { name: 'boolean', required: false },
            control: {
                type: 'select',
                options: [true, false]
            }
        }
    }
};

export default config;

const Template = (args) => <CustomDropdown {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    variant: 'primary',
    tag: 'button',
    toggle: 'Dropdown',
    direction: 'up',
    hasCaret: false
};
