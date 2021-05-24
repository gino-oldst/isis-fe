import makeApiCall from '../api/makeApiCall';

const GET_DASHBOARD_DATA = '/measure/dashboard/dateFrom/21-05-2021/dateTo/25-05-2021';

export async function getDashboardData() {
    return await makeApiCall(GET_DASHBOARD_DATA, 'POST', {});
}
