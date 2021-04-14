import React from 'react';
import Typography from './Typography';

const config = {
    title: 'Components/Typography/Size',
    component: Typography,
    argTypes: {
        variant: {
            description: 'Font Size',
            defaultValue: 'size-40',
            type: { name: 'string', required: false },
            table: {
                defaultValue: { summary: 'size-40' }
            },
            control: {
                type: 'select',
                options: ['size-40', 'size-26', 'size-24', 'size-22', 'size-20', 'size-16', 'size-14', 'size-12']
            }
        }
    }
};

export default config;

const Template = (args) => <Typography {...args} />;

export const Size40 = Template.bind({});
Size40.args = {
    children: 'Size 40',
    variant: 'size-40'
};

export const Size26 = Template.bind({});
Size26.args = {
    children: 'Size 26',
    variant: 'size-26'
};

export const Size24 = Template.bind({});
Size24.args = {
    children: 'Size 24',
    variant: 'size-24'
};

export const Size22 = Template.bind({});
Size22.args = {
    children: 'Size 22',
    variant: 'size-22'
};

export const Size20 = Template.bind({});
Size20.args = {
    children: 'Size 20',
    variant: 'size-20'
};

export const Size16 = Template.bind({});
Size16.args = {
    children: 'Size 16',
    variant: 'size-16'
};

export const Size14 = Template.bind({});
Size14.args = {
    children: 'Size 14',
    variant: 'size-14'
};

export const Size12 = Template.bind({});
Size12.args = {
    children: 'Size 12',
    variant: 'size-12'
};
