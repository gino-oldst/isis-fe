import React from 'react';
import Pagination from './Pagination';

const config = {
    title: 'Components/Pagination',
    component: Pagination,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <Pagination {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
