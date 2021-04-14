import React from 'react';
import CollapsibleSidebar from './CollapsibleSidebarContainer';
import { MdDashboard, MdStar, MdSettings } from 'react-icons/md';

const config = {
    title: 'Components/CollapsibleSidebar',
    component: CollapsibleSidebar,
    argTypes: {
        className: {
            description: 'Class for content wrapper',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        children: {
            description: 'Content of the sidebar',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        menu: {
            description: 'Outer div class',
            defaultValue: `{
                label: string,
                onClick?: Function,
                icon: React$Element,
                submenu: Array<{
                    label: string,
                    onClick?: Function
                }>
            }`,
            type: { required: false },
            control: {
                type: 'text'
            }
        }
    }
};

export default config;

const Template = (args) => <CollapsibleSidebar {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    menu: [{
        label: 'Dashboard',
        onClick: () => {},
        icon: MdDashboard,
        key: 'dashboard'
    }, {
        label: 'Charts',
        onClick: () => {},
        icon: MdStar,
        key: 'charts'
    }, {
        label: 'Settings',
        icon: MdSettings,
        key: 'settings',
        subMenu: [{
            label: 'One'
        }, {
            label: 'Two'
        }, {
            label: 'Three'
        }]
    }]
};
