import React from 'react';
import FlashNotification from './FlashNotification';

const config = {
    title: 'Components/FlashNotification',
    component: FlashNotification,
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <FlashNotification {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
