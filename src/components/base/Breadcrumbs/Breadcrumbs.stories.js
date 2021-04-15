import React from 'react';
import Breadcrumbs from './BreadcrumbsContainer';

const config = {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <Breadcrumbs {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
