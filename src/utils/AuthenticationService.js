/** @format */

import { AsyncStorage } from 'AsyncStorage';
import { storageKey } from '../config/constants';
import moment from 'moment';
import { userLogin } from '../api/auth';

export async function checkAuthorization() {
    const accessToken = await AsyncStorage.getItem(storageKey.accessToken);

    if (accessToken == null) {
        return false;
    } else {
        const tokenValidUntil = await AsyncStorage.getItem(
            storageKey.tokenValidUntil
        );

        try {
            const date = new Date(tokenValidUntil);
            const momentDate = moment(date.toISOString());

            return moment().isSameOrBefore(momentDate);
        } catch (err) {
            return false;
        }
    }
}

export async function getAuthToken() {
    const accessToken = await AsyncStorage.getItem(storageKey.accessToken);

    if (accessToken == null) {
        return null;
    }

    const tokenJson = JSON.parse(accessToken);

    return tokenJson.token;
}

export async function saveAuthorizationToken(authToken) {
    await AsyncStorage.setItem(storageKey.accessToken, JSON.stringify(authToken));
    const expiration = moment().add(authToken.expiration, 'seconds');

    await AsyncStorage.setItem(storageKey.tokenValidUntil, expiration);
}

export async function removeAuthorizationToken() {
    await AsyncStorage.setItem(
        storageKey.accessToken,
        JSON.stringify('accessToken')
    );
    await AsyncStorage.setItem(storageKey.tokenValidUntil, 'tokenValidUntil');
}

export async function getAuthTokenAndSave() {
    const accessToken = await userLogin();

    await saveAuthorizationToken(accessToken.data);
}
