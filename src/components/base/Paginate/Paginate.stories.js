import React from 'react';
import Paginate from './PaginateContainer';

const config = {
    title: 'Components/Paginate',
    component: Paginate,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <Paginate {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
