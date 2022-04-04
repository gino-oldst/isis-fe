import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';

// const GET_DASHBOARD_DATA = '/measure/dashboard';

// ULR: /message/search/paged?size=50&page=1
// const GET_SEARCH_DATA = `${config.apiStorage}/storage-service/alert/search/paged`;
const GET_SEARCH_DATA = `${config.apiStorage}/storage-service/message/search/paged`;

export async function getCommunicationSearchData(page, size, sort, filters) {
    console.log('ss', filters);
    const filterBody = {
        message: filters.filterText,
        senders: filters.filterSenders,
        // recipients: filters.filterRecipients.length > 0 ? filters.filterRecipient : ['sample@email.com'],
        sources: filters.filterSource,
        dateSentFrom: filters.filterDateFrom,
        dateSentTo: filters.filterDateTo
    };

    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';

    return await makeApiCall(`${GET_SEARCH_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

// const GET_SEARCH_DATA = `${config.apiStorage}/storage-service/alert/search/paged`;

// export async function getCommunicationSearchData(page, size, sort, filters) {
//     // const sortColumn = sort.column;
//     // const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';

//     return await makeApiCall(`${GET_SEARCH_DATA}`, 'POST');
// }

// MESSAGE DETAILS
const GET_COMM_MESSAGE_DATA = `${config.apiStorage}/storage-service/message/`;

export async function getCommunicationMessageDetail(commMessageId) {
    // const sortColumn = sort.column;
    // const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';
    console.log('call getCommunicationMessageDetail ', commMessageId);

    return await makeApiCall(`${GET_COMM_MESSAGE_DATA}${commMessageId}`, 'GET');
}

const GET_RECENT_MESSAGE_DATA = `${config.apiStorage}/storage-service/message/search/recent`;

// recent search (before-after)
// POST <host>/storage-service/recent/search?size=5
// {
// "id":"f623466e-2d73-483a-9829-8962485ae68a" //communication message id
// }
export async function getRecentMessages(messageId, size) {
    console.log('call getRecentMessages ', size);

    const filterBody = {
        id: messageId
    };

    return await makeApiCall(`${GET_RECENT_MESSAGE_DATA}?size=${size}`, 'POST', filterBody);
}

// message activity log (user comments on the message)
// Create comment
// POST <host>/storage-service/message-activity
// {
//      "messageId":"", //message id where the activity belongs
//      "executorId":"", //user id of the commenter
//      "event":"", //event, message or comment
//      "type":"USER_EVENT", //SYSTEM_EVENT other value but is only for system-generated activities
// }
const ADD_MESSAGE_ACTIVITY = `${config.apiStorage}/storage-service/message-activity`;

export async function addMessageActivity(formData) {
    console.log('call addMessageActivity ', formData);

    // const body = {
    //     messageId: formData.messageId,
    //     executorId: formData.executorId,
    //     event: formData.event,
    //     type: formData.type
    // };

    return await makeApiCall(`${ADD_MESSAGE_ACTIVITY}`, 'POST', formData);
}

// Search for message activities
// POST <host>/storage-service/message-activity/search/paged
// {
//      "messageId":"", //message id where the activity belongs
// }
const GET_MESSAGE_ACTIVITY = `${config.apiStorage}/storage-service/message-activity/search/paged`;

export async function getMessageActivity(messageId) {
    console.log('call getMessageActivity ', messageId);

    const filterBody = {
        messageId: messageId
    };

    return await makeApiCall(`${GET_MESSAGE_ACTIVITY}`, 'POST');
}
