import makeApiCall from '../api/makeApiCall';

const GET_ALERT_SPECIFICS = '/measure/alerts-specifics/';

export async function getAlertSpecifics(alertId: number) {
    return await makeApiCall(`${GET_ALERT_SPECIFICS}${alertId}`, 'GET');
}
