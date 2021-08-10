import makeApiCall from '../api/makeApiCall';

const GET_RESTRICTED_LIST = '/measure/restricted-isin/list';

export async function getRestrictedList(
    page: String,
    size: String,
    filters: Array,
    sort: Object
) {
    const relevantFilters = filters.filter(item => item.value.length > 0);

    const filterBody = {};

    relevantFilters.map(body => {
        filterBody[body.id] = body.value.join(',');

        return null;
    });

    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sort.column},${sort.type}` : '';

    return await makeApiCall(`${GET_RESTRICTED_LIST}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}
