import React from 'react';
import Typography from './Typography';

const config = {
    title: 'Components/Typography/Weight',
    component: Typography,
    argTypes: {
        weight: {
            description: 'Font Weight',
            defaultValue: 'light',
            type: { name: 'string', required: false },
            table: {
                defaultValue: { summary: 'light' }
            },
            control: {
                type: 'select',
                options: ['light', 'regular', 'semi-bold', 'bold', 'extra-bold', 'black']
            }
        }
    }
};

export default config;

const Template = (args) => <Typography {...args} />;

export const Light = Template.bind({});
Light.args = {
    children: '300',
    weight: 'light'
};

export const Regular = Template.bind({});
Regular.args = {
    children: '400',
    weight: 'regular'
};

export const SemiBold = Template.bind({});
SemiBold.args = {
    children: '600',
    weight: 'semi-bold'
};

export const Bold = Template.bind({});
Bold.args = {
    children: '700',
    weight: 'bold'
};
