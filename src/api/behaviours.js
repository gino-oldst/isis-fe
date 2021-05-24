import makeApiCall from '../api/makeApiCall';

const GET_BEHAVIOURS = '/measure/behaviour/list?pageNumber=0&pageSize=10';
const GET_RULES = '/measure/rules/list?pageNumber=0&pageSize=10';
const GET_PARAMETERS = '/measure/parameters/list?pageNumber=0&pageSize=10';

export async function getBehaviours() {
    return await makeApiCall(GET_BEHAVIOURS, 'POST', {});
}

export async function getRules() {
    return await makeApiCall(GET_RULES, 'POST', {});
}

export async function getParameters() {
    return await makeApiCall(GET_PARAMETERS, 'POST', {});
}
