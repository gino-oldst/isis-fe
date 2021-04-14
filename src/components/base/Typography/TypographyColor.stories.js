import React from 'react';
import Typography from './Typography';

const config = {
    title: 'Components/Typography/Color',
    component: Typography,
    argTypes: {
        color: {
            description: 'Font Color',
            defaultValue: 'color-2',
            type: { name: 'string', required: false },
            table: {
                defaultValue: { summary: 'color-1' }
            },
            control: {
                type: 'select',
                options: ['color-1', 'color-2', 'color-3']
            }
        }
    }
};

export default config;

const Template = (args) => <Typography {...args} />;

export const Color1 = Template.bind({});
Color1.args = {
    children: '#37A187',
    color: 'color-1'
};

export const Color2 = Template.bind({});
Color2.args = {
    children: '#464646',
    color: 'color-2'
};
