import makeApiCall from '../api/makeApiCall';

// const GET_DASHBOARD_DATA = '/measure/dashboard';

const GET_SEARCH_DATA = '/storage-service/search-communication/search/paged'

// export async function getDashboardData(dateFrom, dateTo) {
//     return await makeApiCall(`${GET_DASHBOARD_DATA}/dateFrom/${dateFrom}/dateTo/${dateTo}`, 'GET');
// }

export async function getCommunicationSearchData(size, page, sort, filters, dateFrom, dateTo) {
    const filterBody = {
        message : "thanks",
        senders: [],
        dateFrom : "",
        dateTo : ""
    };

    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';

    return await makeApiCall(`${GET_SEARCH_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

// export async function getSearchData(
//     page: String,
//     size: String,
//     dateFrom: String,
//     dateTo: String,
//     filters: Array,
//     sort: Object
// ) {
//     const relevantFilters = filters.filter(item => item.value.length > 0);

//     const filterBody = {
//         alertDateFromRange: dateFrom,
//         alertDateToRange: dateTo
//     };

//     relevantFilters.map(body => {
//         let key = '';
//         let value = body.value;

//         switch (body.id.toLowerCase()) {
//             case 'behaviourcode':
//                 key = 'behaviourIdList';
//                 break;
//             case 'escalation':
//                 key = 'escalationList';
//                 break;
//             case 'assigneduser':
//                 key = 'assignedUserIdList';
//                 break;
//             case 'status':
//                 key = 'statusList';
//                 break;
//             case 'ticker':
//                 key = 'tickers';
//                 value = value.map(val => val.value);
//                 break;
//             case 'client':
//                 key = 'clients';
//                 value = value.map(val => val.value);
//                 break;
//             case 'book':
//                 key = 'books';
//                 value = value.map(val => val.value);
//                 break;
//             default:
//                 key = body.id;
//                 value = body.value;
//                 break;
//         }

//         filterBody[key] = value;

//         return null;
//     });

//     let sortColumn = sort.column;

//     if (sort.column === 'assignedUser') sortColumn = 'assignedUserId';

//     const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';

//     return await makeApiCall(`${GET_ALERTS}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
// }
