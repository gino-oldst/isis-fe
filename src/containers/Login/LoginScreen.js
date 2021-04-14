// @flow
import React from 'react';
import { useDispatch } from 'react-redux';
import './login.scss';
import { Form, FormGroup, Input } from 'reactstrap';
import Button from '../../components/base/Button/Button';
import Typography from '../../components/base/Typography/Typography';

import { setModalContent } from '../../redux/modules/modalEvent';

type Props = {
    onSubmit: Function,
    onChange: Function,
    isLoading: Boolean,
    errMsg: String,
    setErrMsg: Function,
    handleCloseModal: Function
}

export default function Login({
    onSubmit,
    onChange,
    isLoading,
    errMsg,
    setErrMsg,
    handleCloseModal
}: Props): React$Element<any> {
    const dispatch = useDispatch();

    const showContactDetailsModal = () => {
        dispatch(setModalContent({
            modalContent: <ContactDetailsModal />
        }));
    };

    return (
        <div className='login'>
            <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                <div className='form-container'>
                    <Typography
                        variant='size-40' color='color-2'
                        className='text-center mb-5'>
                        MARIANA UFP
                    </Typography>
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Input type='email' name='email' placeholder='Email'
                                size='lg' onChange={onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Input type='password' name='password' placeholder='Password'
                                size='lg' onChange={onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Button label='Log In' variant='outline-dark' type='submit'
                                className='login__button w-100 d-block' />
                        </FormGroup>
                        <Typography
                            variant='size-14' color='color-2'
                            className='text-center mt-4'>
                            Forgot Password?
                            <span className='cursor-pointer color-link-text ml-1'
                                onClick={showContactDetailsModal}>Contact admin for help.</span>
                        </Typography>
                    </Form>
                </div>
            </div>
        </div>
    );
}

const ContactDetailsModal = () => {
    return (
        <div className='login__contact-details text-left py-2 px-4'>
            <Typography
                variant='size-26' color='color-2' weight='semi-bold'
                className='mb-1'>
                Admin contact details
            </Typography>
            <Typography
                variant='size-18' color='color-2'
                className='my-4'>
                If you have want to reset your password, you can reach the admin via:
            </Typography>
            <Typography
                variant='size-16' color='color-2'
                className='mb-1'>
                &bull; Calls: <span className='color-link-text cursor-pointer'>44 (0)20 3352 1231 / 44(0)20 2526 3158</span>
            </Typography>
            <Typography
                variant='size-16' color='color-2'
                className='mb-2'>
                &bull; Email: <span className='color-link-text cursor-pointer'>admin@admin.com</span>
            </Typography>
        </div>
    );
};
