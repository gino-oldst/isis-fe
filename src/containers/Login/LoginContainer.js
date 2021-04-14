// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import Login from './LoginScreen';
import { isValidEmail } from '../../utils/helpers';
import { authUser } from '../../redux/modules/authentication';
import { saveAuthorizationToken, checkAuthorization } from '../../utils/Auth';
import { setFlashNotification } from '../../redux/modules/flashNotification';

type Props = {
    handleCloseModal: Function
}

export default function LoginContainer({
    handleCloseModal
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    // check if user is logged in
    // useEffect(() => {
    //     checkAuth();
    // }, []);

    // const checkAuth = async () => {
    //     const auth = await checkAuthorization();

    //     if (auth) history.push('/dashboard');
    // };

    const onSubmit = async e => {
        setIsLoading(true);
        setErrMsg('');
        e.preventDefault();

        try {
            if (isValidEmail(loginForm.email) && loginForm.password) {
                // const response = await userLogin(loginForm);

                // if (Object.keys(response).length === 0) {
                //     setErrMsg('Invalid email!');
                // } else if (response.data.message) {
                //     setErrMsg(response.data.message);
                // } else {
                //     const { data } = response;

                //     localStorage.setItem('userId', data.userId);
                //     saveAuthorizationToken(data.token);
                //     dispatch(authUser({
                //         email: loginForm.email
                //     }));

                //     history.replace('/dashboard');
                // }

                localStorage.setItem('userId', 1);
                saveAuthorizationToken('temp_token');
                dispatch(authUser({
                    email: loginForm.email
                }));

                history.replace('/dashboard');
            }
        } catch (err) {
            dispatch(setFlashNotification({
                message: 'ERROR',
                isError: true
            }));
        }
    };

    const onChange = e => {
        const { name, value } = e.target;

        setLoginForm({
            ...loginForm,
            [name]: value
        });
    };

    return <Login
        onSubmit={onSubmit}
        onChange={onChange}
        isLoading={isLoading}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
        handleCloseModal={handleCloseModal} />;
}
