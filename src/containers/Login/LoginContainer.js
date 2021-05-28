// @flow
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Login from './LoginScreen';
import Storage from '../../utils/Storage';
import { storageKey } from '../../config/constants';
import { authUser } from '../../redux/modules/authentication';
import { userLogin } from '../../api/auth';
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
        username: '',
        password: ''
    });

    const onSubmit = async e => {
        setIsLoading(true);
        setErrMsg('');
        e.preventDefault();

        try {
            if (loginForm.username && loginForm.password) {
                const response = await userLogin(loginForm);

                if (Object.keys(response).length === 0) {
                    setErrMsg('Invalid username!');
                } else if (response.data.message) {
                    setErrMsg(response.data.message);
                } else {
                    const { data } = response;

                    localStorage.setItem('userId', data.userId);
                    Storage.setItem(storageKey.accessToken, JSON.stringify(data.token));
                    dispatch(authUser({
                        username: loginForm.username
                    }));

                    history.replace('/dashboard');
                }
            }
        } catch (err) {
            dispatch(setFlashNotification({
                message: 'Invalid username or password.',
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
