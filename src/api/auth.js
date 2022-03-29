import { config } from '../config/constants';
import makeApiCall from './makeApiCall';

// const AUTH_ENDPOINT = '/measure/token/generate-token';

// export async function userLogin(credentials: Object) {
//     return await makeApiCall(AUTH_ENDPOINT, 'POST', credentials);
// }

// http://isis-auth-dev.kopona.io/auth-service/oauth/token
// Uname: admin
// Password: admin123!
const AUTH_ENDPOINT = `${config.apiAuth}/auth-service/oauth/token`;

export async function userLogin(credentials: Object) {
    var datas = new FormData();

    datas.append('grant_type', credentials.grant_type);
    datas.append('username', credentials.username);
    datas.append('password', credentials.password);

    console.log(datas, ...datas);

    return await makeApiCall(AUTH_ENDPOINT, 'POST', datas);
}
