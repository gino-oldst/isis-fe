import makeApiCall from '../api/makeApiCall';

const AUTH_ENDPOINT = '/measure/token/generate-token';

export async function userLogin(credentials: Object) {
    return await makeApiCall(AUTH_ENDPOINT, 'POST', credentials);
}
