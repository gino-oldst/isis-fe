import makeApiCall from '../api/makeApiCall';

const GET_RESTRICTED_LIST = '/measure/restricted-isin/list';

export async function getRestrictedList() {
    return await makeApiCall(`${GET_RESTRICTED_LIST}`, 'POST', {});
}
