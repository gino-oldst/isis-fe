import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';

/** TODO - When we are merging Measure 1 and Isis we shall put these in one Promise.All
 * and put a tag (AppName['measure','isis']) to determine what app it came from
 * and to have it easy when updating seen */

// const GET_NOTIFICATIONS = '/measure/notifications/list?pageNumber=0&pageSize=10';
// const UPDATE_NOTIFICATION = '/measure/notifications';

// export async function getNotifications() {
//     return await makeApiCall(GET_NOTIFICATIONS, 'POST', {});
// }

// export async function updateNotification(data: Object) {
//     return await makeApiCall(UPDATE_NOTIFICATION, 'PUT', data);
// }

const GET_NOTIFICATIONS = `${config.apiStorage}/storage-service/notification/search`;
const UPDATE_NOTIFICATION = `${config.apiStorage}/storage-service/notification`;

export async function getNotifications() {
    return await makeApiCall(GET_NOTIFICATIONS, 'POST', {});
}

export async function updateNotification(data: Object) {
    return await makeApiCall(UPDATE_NOTIFICATION, 'PUT', data);
}
