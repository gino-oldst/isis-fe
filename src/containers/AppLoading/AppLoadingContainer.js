// @flow

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
/* eslint-disable camelcase */
import jwt_decode from 'jwt-decode';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation } from 'react-router-dom';

import WrapperBackground from '../../components/base/WrapperBackground/WrapperBackground';
import Typography from '../../components/base/Typography/Typography';
import Storage from '../../utils/Storage';
import { isTokenValid } from '../../utils/Auth';
import { storageKey } from '../../config/constants';
import { updateUserToken, authUser, setLoggingOut } from '../../redux/modules/authentication';
import './app-loading.scss';

type Props = {
    children: any,
    route: string,
}

export default function AppLoadingContainer({
    children,
    ...props
}: Props): any | React$Element<"div"> {
    const dispatch = useDispatch();
    const location = useLocation();

    const [isAppReady, setAppReady] = useState(false);
    const [isErrorLoaded, setErrorLoaded] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [location]);

    const checkAuth = async () => {
        try {
            setErrorLoaded(false);

            const shouldLoggout = /\/login|\/sign-up|\/forgot-password/.test(location.pathname); // Add other unauthenticated routes here
            const accessToken = Storage.getItem(storageKey.accessToken);
            const token: Object = shouldLoggout ? null : accessToken ? jwt_decode(JSON.parse(accessToken)) : null;

            if (token && token.exp && isTokenValid(token.exp)) {
                setTimeout(() => {}, 5000);
                dispatch(updateUserToken(accessToken));
                Storage.setItem(storageKey.accessToken, accessToken);
                const userId = localStorage.getItem('userId');

                dispatch(authUser({
                    user: token.sub,
                    userId: userId
                }));
            } else {
                localStorage.clear();
                dispatch(setLoggingOut());
            }

            setAppReady(true);
        } catch (err) {
            setAppReady(true);
            setErrorLoaded(true);
        }
    };

    if (isAppReady) {
        return isErrorLoaded
            ? <WrapperBackground>
                <div className='app-loading__error'>
                    <Typography>Page error</Typography>
                </div>
            </WrapperBackground>
            : children;
    }

    return (
        <WrapperBackground className='app-loading'>
            <Spinner animation='border' role='status'>
                <span className='sr-only'>Loading...</span>
            </Spinner>
        </WrapperBackground>
    );
}
