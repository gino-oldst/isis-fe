import makeApiCall from '../api/makeApiCall';

const GET_DASHBOARD_DATA = '/measure/dashboard';

export async function getDashboardData(dateFrom, dateTo) {
    return await makeApiCall(`${GET_DASHBOARD_DATA}/dateFrom/${dateFrom}/dateTo/${dateTo}`, 'GET');
}
