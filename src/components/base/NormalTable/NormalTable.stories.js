import React from 'react';
import NormalTable from './NormalTable';

const config = {
    title: 'Components/NormalTable',
    component: NormalTable,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <NormalTable {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
