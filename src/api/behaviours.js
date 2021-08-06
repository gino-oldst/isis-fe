import makeApiCall from '../api/makeApiCall';

const GET_BEHAVIOURS = '/measure/behaviour/list';
const UPDATE_BEHAVIOUR = '/measure/behaviour';
const GET_RULE = '/measure/rules/list';
const GET_RULES = '/measure/rules/list?pageNumber=0&pageSize=10';
const GET_BEHAVIOUR_BY_CODE = '/measure/behaviour/code/';
const PROCESS_BEHAVIOUR_BY_DATE = '/measure/behaviour/processBehaviour';

export async function getBehaviours(
    page: String,
    size: String,
    sort: Object
) {
    const withSorting = () => sort.column !== '' && sort.type !== '' ? `&sort=${sort.column},${sort.type}` : '';

    return await makeApiCall(`${GET_BEHAVIOURS}?page=${page}&size=${size}${withSorting()}`, 'POST', {});
}

export async function updateBehaviour(data: Object) {
    return await makeApiCall(UPDATE_BEHAVIOUR, 'PUT', data);
}

export async function getRules() {
    return await makeApiCall(GET_RULES, 'POST', {});
}

export async function getRule(behaviourId: String) {
    return await makeApiCall(`${GET_RULE}?pageNumber=0&pageSize=10`, 'POST', { behaviourId: behaviourId });
}

export async function getBehaviourByCode(code: String) {
    return await makeApiCall(`${GET_BEHAVIOUR_BY_CODE}${code}`, 'GET');
}

export async function processBehaviourByDate(data: Object) {
    return await makeApiCall(`${PROCESS_BEHAVIOUR_BY_DATE}`, 'POST', data);
}
