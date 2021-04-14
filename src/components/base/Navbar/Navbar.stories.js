import React from 'react';
import Navbar from './Navbar';

const config = {
    title: 'Components/Navbar',
    component: Navbar,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <Navbar {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
