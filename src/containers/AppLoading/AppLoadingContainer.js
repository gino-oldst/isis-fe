// @flow

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation } from 'react-router-dom';

import WrapperBackground from '../../components/base/WrapperBackground/WrapperBackground';
import Typography from '../../components/base/Typography/Typography';
import Storage from '../../utils/Storage';
import { isTokenValid } from '../../utils/Auth';
import { storageKey } from '../../config/constants';
import { updateUserToken, authUser } from '../../redux/modules/authentication';
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
    }, []);

    const checkAuth = async () => {
        try {
            setErrorLoaded(false);

            const shouldLoggout = /\/login|\/sign-up|\/forgot-password/.test(location.pathname); // Add other unauthenticated routes here
            const accessToken = Storage.getItem(storageKey.accessToken);
            let token: Object = shouldLoggout ? null : accessToken ? JSON.parse(accessToken) : null;

            if (!token || (token && token.expiry && isTokenValid(token.expiry)) || !token.expiry) {
                // TODO: set right values
                // let data = null;

                // if ((token && token.refresh_token)) {
                //     data = await getRefreshToken(token.refresh_token);
                // } else {
                //     data = await getAccessToken();
                // }

                // token = {
                //     ...data,
                //     expiry: moment().add(data.expires_in, 'seconds')
                // };

                token = {
                    accessToken: 'this-is-an-accesstoken'
                };
            }

            dispatch(updateUserToken(token));
            Storage.setItem(storageKey.accessToken, JSON.stringify(token));

            if ((token && token.refresh_token)) {
                // const profile = await getProfileData();

                dispatch(authUser({
                    // TODO: uncomment this
                    // profile
                }));
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
