import makeApiCall from '../api/makeApiCall';

const GET_RESTRICTED_LIST = '/measure/restricted-isin/list';

export async function getRestrictedList(page: String, size: String, dateFrom: String, dateTo: String) {
    return await makeApiCall(`${GET_RESTRICTED_LIST}?page=${page}&size=${size}`, 'POST', {
        alertDateFromRange: dateFrom,
        alertDateToRange: dateTo
    });
}
