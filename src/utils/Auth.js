import { AsyncStorage } from 'AsyncStorage';
import { storageKey } from '../config/constants';
/* eslint-disable camelcase */
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import 'moment-timezone';

/**
 * Check if token is valid
 * @param {String} date
 * @returns {Boolean}
 */
export function isTokenValid(date: string) {
    const dateObj = new Date(date);
    const timeZone = moment.tz.guess();
    const momentObj = moment(dateObj).tz(timeZone).format();

    return moment().isBefore(momentObj);
}

export async function checkAuthorization() {
    const accessToken = await AsyncStorage.getItem(storageKey.accessToken);

    if (accessToken) {
        const data = jwt_decode(accessToken);

        if (data.exp < new Date().getTime() / 1000) {
            localStorage.clear();

            window.location.href = '/login';
        }
    }

    return accessToken !== undefined && accessToken !== null;
}

export async function getAuthToken() {
    const accessToken = await AsyncStorage.getItem(storageKey.accessToken);

    if (accessToken == null) {
        return null;
    }

    const tokenJson = JSON.parse(accessToken);

    return tokenJson;
}

export async function saveAuthorizationToken(authToken) {
    await AsyncStorage.setItem(storageKey.accessToken, JSON.stringify(authToken));
}
