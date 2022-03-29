import React from 'react';
import BaseTable from './BaseTableContainer';

const config = {
    title: 'Components/BaseTable',
    component: BaseTable,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <BaseTable {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
