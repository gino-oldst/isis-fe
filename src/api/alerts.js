import makeApiCall from '../api/makeApiCall';

const GET_ALERTS = '/measure/alerts/list';
const GET_ALERT = '/measure/alerts';
const UPDATE_ALERT = '/measure/alerts';
const BULK_UPDATE_ALERT = '/measure/alerts/bulk-edit';
const DOWNLOAD_ALERTS_LIST = '/measure/alerts/download-list';

export async function getAlerts() {
    return await makeApiCall(`${GET_ALERTS}?pageNumber=0&pageSize=50000`, 'POST', {});
}

export async function getAlert(id: String) {
    return await makeApiCall(`${GET_ALERT}/${id}`, 'GET');
}

export async function updateAlert(data: Object) {
    return await makeApiCall(UPDATE_ALERT, 'PUT', data);
}

export async function bulkUpdateAlert() {
    return await makeApiCall(BULK_UPDATE_ALERT, 'POST', {});
}

export async function downloadAlertsList() {
    return await makeApiCall(DOWNLOAD_ALERTS_LIST, 'POST', {});
}
