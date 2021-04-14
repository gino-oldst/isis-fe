import React from 'react';
import Modal from './Modal';

const config = {
    title: 'Components/Modal',
    component: Modal,
    argTypes: {
        className: {
            description: 'Class for content wrapper',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        title: {
            description: 'Header title',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        children: {
            description: 'Modal body. To show the modal `modalContent` is required. Accepts string or component.',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        onHide: {
            description: 'Function called to hide the modal.',
            type: { required: true }
        },
        onSubmit: {
            description: 'Function for submit button at the footer.',
            type: { required: false }
        },
        submitLabel: {
            description: 'Submit button label at the footer',
            type: { required: false },
            control: {
                type: 'text'
            }
        },
        closeLabel: {
            description: 'Close button label at the footer',
            defaultValue: 'Close',
            type: { required: false },
            control: {
                type: 'text'
            }
        }
    }
};

export default config;

const Template = (args) => <Modal {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    isDemo: true,
    title: 'Sample modal',
    children: 'Content',
    submitLabel: 'Submit',
    onHide: () => {}
};
