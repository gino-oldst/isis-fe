import React from 'react';
import BootstrapTable from './BootstrapTableContainer';

const config = {
    title: 'Components/BootstrapTable',
    component: BootstrapTable,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <BootstrapTable {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
