import makeApiCall from '../api/makeApiCall';

const GET_ALERTS = '/measure/alerts/list';
const GET_ALERT = '/measure/alerts';
const UPDATE_ALERT = '/measure/alerts';
const BULK_UPDATE_ALERT = '/measure/alerts/bulk-edit';
const DOWNLOAD_ALERTS_LIST = '/measure/alerts/download-list';
const DOWNLOAD_ALERTS_RECORD = '/measure/alerts/download-alerts-record';

export async function getAlerts() {
    return await makeApiCall(`${GET_ALERTS}?`, 'POST', {});
}

export async function getAlert(id: String) {
    return await makeApiCall(`${GET_ALERT}/${id}`, 'GET');
}

export async function updateAlert(data: Object) {
    return await makeApiCall(UPDATE_ALERT, 'PUT', data);
}

export async function bulkUpdateAlert(data: Array) {
    return await makeApiCall(BULK_UPDATE_ALERT, 'POST', data);
}

export async function downloadAlertsList(data: Object) {
    return await makeApiCall(DOWNLOAD_ALERTS_LIST, 'POST', data);
}

export async function downloadAlertsRecord(id: String) {
    return await makeApiCall(`${DOWNLOAD_ALERTS_RECORD}/${id}`, 'POST', {});
}
