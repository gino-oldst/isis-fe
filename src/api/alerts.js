import makeApiCall from '../api/makeApiCall';

const GET_ALERTS = '/measure/alerts/list?pageNumber=0&pageSize=10';

export async function getAlerts() {
    return await makeApiCall(GET_ALERTS, 'POST', {});
}
