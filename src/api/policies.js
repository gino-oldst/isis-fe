import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';

const GET_POLICIES_DATA = `${config.apiStorage}/storage-service/policy-map/search/paged`;
const GET_KEYWORD_DATA = `${config.apiStorage}/storage-service/keyword`;
const GET_KEYWORD_SEARCH_DATA = `${config.apiStorage}/storage-service/keyword/search`;
const GET_KEYWORD_SEARCH_DATA_NUMBERED = `${config.apiStorage}/storage-service/keyword/search/paged`;

const GET_ALERT_POLICY_DATA = `${config.apiStorage}/storage-service/alert-policy/search/paged`;

export async function getPolicySearchData(page, size, sort, filters) {
    const filterBody = {};
    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=number,ASC';

    return await makeApiCall(`${GET_KEYWORD_SEARCH_DATA_NUMBERED}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

export async function getAlertPoliciesData(page, size, sort, filters) {
    const filterBody = {};
    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=dateCreated,ASC';

    return await makeApiCall(`${GET_ALERT_POLICY_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

export async function getAlertPolicyDataByID(id) {
    const filterBody = {
        id: id
    };

    const policy = await makeApiCall(`${GET_ALERT_POLICY_DATA}`, 'POST', filterBody);
    const { data } = policy.data;

    return data[0];
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

export async function getPolicyDataById() {
    return await makeApiCall(`${GET_KEYWORD_SEARCH_DATA_NUMBERED}`, 'POST', {});
}

export async function getKeywordById(keywordId) {
    return await makeApiCall(`${GET_KEYWORD_DATA}/${keywordId}`, 'GET');
}

export async function getPoliciesData() {
    return await makeApiCall(`${GET_KEYWORD_SEARCH_DATA_NUMBERED}`, 'POST', {});
}
