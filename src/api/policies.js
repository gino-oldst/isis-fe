import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';

const GET_POLICIES_DATA = `${config.apiStorage}/storage-service/policy-map/search/paged`;
const GET_KEYWORD_DATA = `${config.apiStorage}/storage-service/keyword`;
const GET_KEYWORD_SEARCH_DATA = `${config.apiStorage}/storage-service/keyword/search`;

export async function getPolicySearchData(page, size, sort, filters) {
    const filterBody = {};
    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';

    return await makeApiCall(`${GET_POLICIES_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

export async function getKeywordById(keywordId) {
    return await makeApiCall(`${GET_KEYWORD_DATA}/${keywordId}`, 'GET');
}

export async function getKeywordSearch() {
    return await makeApiCall(`${GET_KEYWORD_SEARCH_DATA}`, 'POST', {});
}
