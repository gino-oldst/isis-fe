import axios from 'axios';
import { config, grantType } from 'config/constants';
import { store } from 'redux/store';

export const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000
});

/**
 * Serialize javascript object for sending to api
 * @param {Object} data
 * @returns {String}
 */
export function serialize(data: Object) {
    return Object.keys(data).map((keyName) => {
        return `${encodeURIComponent(keyName)}=${data[keyName] ? encodeURIComponent(data[keyName]) : ''}`;
    }).join('&');
}

/**
 * Method for making ajax calls to the site's api
 * @param {String} endpoint - the endpoint url
 * @param {String} method api methid POST | GET | DELETE
 * @param {Object|String} [data] - key:value pairs of the data to be sent to server
 * @param {String} contentType - header contentType of request
 * @returns {Promise}
 */
export default async function makeApiRequest(endpoint: string, method: string, data: Object | string = null, contentType: string) {
    const { userToken } = store.getState().authentication;
    const request = {
        method,
        url: endpoint,
        data: data ? endpoint.includes('oauth') ? serialize(data) : data : ''
    };

    if (endpoint.includes('oauth')) {
        request.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${data.grant_type === grantType.CLIENT_CREDENTIALS
                ? config.clientCredentialInternal
                : config.clientCredentialMobile}`
        };
    } else {
        request.headers = {
            Authorization: `Bearer ${userToken.access_token}`
        };

        if (contentType) {
            request.headers['Content-Type'] = contentType;
        } else if (endpoint.includes('convert-to-pdf')) {
            request.headers['Content-Type'] = 'application/json';
            request.headers.Accept = 'application/pdf';
            request.responseType = 'blob';
        }
    }

    const response = await api(request);

    if (response.status === 200) {
        return response.data;
    } else {
        const error = new Error(response.statusText);

        error.response = response;
        throw error;
    }
}

/**
 * Method for making ajax calls to the site's api
 * @param {String} apiUrl - the api url
 * @param {String} endpoint - the endpoint url
 * @param {Object|string} [data] - key:value pairs of the data to be sent to server
 * @returns {Promise}
 */
export async function makeExternalRequest(apiUrl, endpoint, data = null) {
    const url = `${apiUrl}${endpoint}${data ? `?${serialize(data)}` : ''}`;
    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();

        return data;
    } else {
        const error = new Error(response.statusText);

        error.response = response;
        throw error;
    }
}
