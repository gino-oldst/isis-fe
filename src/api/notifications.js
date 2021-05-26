import makeApiCall from '../api/makeApiCall';

const GET_NOTIFICATIONS = '/measure/notifications/list?pageNumber=0&pageSize=10';
const UPDATE_NOTIFICATION = '/measure/notifications';

export async function getNotifications() {
    return await makeApiCall(GET_NOTIFICATIONS, 'POST', {});
}

export async function updateNotification(id: String) {
    return await makeApiCall(UPDATE_NOTIFICATION, 'PUT');
}
