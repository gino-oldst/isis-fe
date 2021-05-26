import makeApiCall from '../api/makeApiCall';

const GET_PARAMETERS = '/measure/parameters/rule';
const UPDATE_PARAMETER = '/measure/parameters';

export async function getParametersByRuleId(ruleId: String) {
    return await makeApiCall(`${GET_PARAMETERS}/${ruleId}?pageNumber=0&pageSize=10`, 'GET');
}

export async function updateParameter(data: Object) {
    return await makeApiCall(UPDATE_PARAMETER, 'PUT', data);
}
