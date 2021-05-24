import makeApiCall from '../api/makeApiCall';

const GET_USERS = '/measure/behaviour/list?pageNumber=0&pageSize=10';

export async function getUsers() {
    return await makeApiCall(GET_USERS, 'POST', {});
}
