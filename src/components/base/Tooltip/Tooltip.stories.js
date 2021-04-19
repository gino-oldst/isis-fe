import React from 'react';
import Tooltip from './Tooltip';

const config = {
    title: 'Components/Tooltip',
    component: Tooltip,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <Tooltip {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
