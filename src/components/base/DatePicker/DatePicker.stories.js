import React from 'react';
import DatePicker from './DatePicker';

const config = {
    title: 'Components/DatePicker',
    component: DatePicker,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <DatePicker {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
