import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';
import id from 'date-fns/esm/locale/id';

const GET_POLICIES_DATA = `${config.apiStorage}/storage-service/policy-map/search/paged`;
const GET_POLICIES_DATA_RAW = `${config.apiStorage}/storage-service/policy-map/search`;

const GET_KEYWORD_DATA = `${config.apiStorage}/storage-service/keyword`;
const GET_KEYWORD_SEARCH_DATA = `${config.apiStorage}/storage-service/keyword/search`;
const GET_KEYWORD_SEARCH_DATA_NUMBERED = `${config.apiStorage}/storage-service/keyword/search/paged`;

const GET_ALERT_POLICY_DATA = `${config.apiStorage}/storage-service/alert-policy/search/paged`;
const GET_ALERT_POLICY_DATA_BY_ID = `${config.apiStorage}/storage-service/alert-policy`;

const POST_NEW_ALERT_POLICY = `${config.apiStorage}/storage-service/alert-policy`;
const POST_NEW_POLICY_MAP = `${config.apiStorage}/storage-service/policy-map`;
const POST_NEW_KEYWORD = `${config.apiStorage}/storage-service/keyword`;

const DELETE_ALERT_POLICY = `${config.apiStorage}/storage-service/alert-policy`;
const DELETE_POLICY_MAP = `${config.apiStorage}/storage-service/policy-map`;
const DELETE_KEYWORD = `${config.apiStorage}/storage-service/keyword`;

const UPDATE_ALERT_POLICY = `${config.apiStorage}/storage-service/alert-policy`;
const UPDATE_POLICY_MAP = `${config.apiStorage}/storage-service/policy-map`;

export async function updatePolicy(data: Object) {
    return await makeApiCall(UPDATE_ALERT_POLICY, 'PUT', data);
}

export async function updatePolicyMap(data: Object) {
    return await makeApiCall(UPDATE_POLICY_MAP, 'PUT', data);
}

export async function getPolicySearchData(page, size, sort, filters) {
    const filterBody = {};
    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=number,ASC';

    return await makeApiCall(`${GET_KEYWORD_SEARCH_DATA_NUMBERED}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

export async function getAlertPoliciesData(page, size, sort, name) {
    const filterBody = { name: name };
    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=dateCreated,ASC';

    return await makeApiCall(`${GET_ALERT_POLICY_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

export async function getAlertPolicyDataByID(id) {
    const policy = await makeApiCall(`${GET_ALERT_POLICY_DATA_BY_ID}/${id}`, 'GET');

    return policy.data;
}

export async function getKeywordSearch() {
    const keywords = await makeApiCall(`${GET_KEYWORD_SEARCH_DATA}`, 'POST', {});

    const { data } = keywords.data;

    const alertList = data.map((keyword) => ({
        id: keyword.id,
        label: keyword.word
    }));

    return alertList;
}

export async function getKeywordSearchNumbered() {
    const keywords = await makeApiCall(`${GET_KEYWORD_SEARCH_DATA}`, 'POST', {});

    const { data } = keywords.data;

    const alertList = data.map((keyword) => ({
        id: keyword.id,
        label: keyword.word,
        number: keyword.number
    }));

    return alertList;
}

export async function getPolicymapById(page, size, sort, filters) {
    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=dateCreated,ASC';

    return await makeApiCall(`${GET_POLICIES_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filters);
}

export async function getPolicymapByIdRaw(filters) {
    return await makeApiCall(`${GET_POLICIES_DATA_RAW}`, 'POST', filters);
}

export async function getPolicyMapByIdRaw(policyId) {
    const filterBody = {
        policyId: policyId
    };

    return await makeApiCall(`${GET_POLICIES_DATA_RAW}`, 'POST', filterBody);
}

export async function getPolicyDataById() {
    return await makeApiCall(`${GET_KEYWORD_SEARCH_DATA_NUMBERED}`, 'POST', {});
}

export async function getKeywordById(keywordId) {
    return await makeApiCall(`${GET_KEYWORD_DATA}/${keywordId}`, 'GET');
}

export async function getPoliciesData() {
    return await makeApiCall(`${GET_KEYWORD_SEARCH_DATA_NUMBERED}`, 'POST', {});
}

export async function postNewKeyword(requestBody) {
    return await makeApiCall(POST_NEW_KEYWORD, 'POST', requestBody);
}

export async function postNewPolicy(requestBody) {
    const ret = await makeApiCall(POST_NEW_ALERT_POLICY, 'POST', requestBody);

    return ret.data;
}

export async function postNewPolicyMap(requestBody) {
    return await makeApiCall(POST_NEW_POLICY_MAP, 'POST', requestBody);
}

export async function deleteKeyword(requestBody) {
    return await makeApiCall(`${DELETE_KEYWORD}/${id}`, 'DELETE', requestBody);
}

export async function deletePolicy(policyId) {
    return await makeApiCall(`${DELETE_ALERT_POLICY}/${policyId}`, 'DELETE');
}

export async function deletePolicyMap(id) {
    return await makeApiCall(`${DELETE_POLICY_MAP}/${id}`, 'DELETE');
}
