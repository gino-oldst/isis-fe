import React from 'react';
import Table from './Table';

const config = {
    title: 'Components/Table',
    component: Table,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <Table {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
