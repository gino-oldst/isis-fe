import makeApiCall from '../api/makeApiCall';

const GET_NOTIFICATIONS = '/measure/notifications/list?pageNumber=0&pageSize=10';

export async function getNotifications() {
    return await makeApiCall(GET_NOTIFICATIONS, 'POST', {});
}
