// @flow
import React from 'react';
import { useDispatch } from 'react-redux';
import './login.scss';
import { Form, FormGroup, Input } from 'reactstrap';
import Button from '../../components/base/Button/Button';
import Typography from '../../components/base/Typography/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/logos/mariana_logo.png';

import { setModalContent } from '../../redux/modules/modalEvent';
import { config } from '../../config/constants';

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
            modalContent: <ContactDetailsModal handleCloseModal={handleCloseModal} />
        }));
    };

    return (
        <div className='login'>
            <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                <div className='form-container text-center'>
                    <img src={logo} alt='Mariana_UFP_logo' className='login__logo' />
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Input type='text' name='username' placeholder='Username'
                                bsSize='lg' onChange={onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Input type='password' name='password' placeholder='Password'
                                bsSize='lg' onChange={onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Button label='Log In' type='submit'
                                className='login__button w-100 d-block' />
                        </FormGroup>
                        <Typography
                            variant='size-16' color='color-2'
                            className='login__forgot-pass text-center mt-4'>
                            Forgot Password?
                            <span className='cursor-pointer color-sidebar-2 ml-1'
                                onClick={showContactDetailsModal}>Contact admin for help.</span>
                        </Typography>
                        <Typography
                            variant='size-14' color='color-1'
                            className='login__forgot-pass text-center mt-4'>
                            Isis {config.versionName}-{config.environmentName.toLowerCase()}
                        </Typography>
                    </Form>
                </div>
            </div>
        </div>
    );
}

const ContactDetailsModal = ({
    handleCloseModal
}) => {
    return (
        <div className='login__contact-details text-left py-2 px-4'>
            <FontAwesomeIcon className='color-link-text cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal} />
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
