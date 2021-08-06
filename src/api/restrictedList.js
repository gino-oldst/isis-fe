import makeApiCall from '../api/makeApiCall';

const GET_RESTRICTED_LIST = '/measure/restricted-isin/list';

export async function getRestrictedList(
    page: String,
    size: String,
    dateFrom: String,
    dateTo: String,
    filters: Array,
    sort: Object
) {
    console.log(filters);

    const withSorting = () => sort.column !== '' && sort.type !== '' ? `&sort=${sort.column},${sort.type}` : '';

    return await makeApiCall(`${GET_RESTRICTED_LIST}?page=${page}&size=${size}${withSorting()}`, 'POST');
}
