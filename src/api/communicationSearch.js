import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';
import moment from 'moment';

// For Cancelling Requests
// const handleCancelPreviousRequest = () => {
//     cancelTokenSource.cancel('Request was canceled');
// };

// GET EMAILS of FILTERS
const GET_EMAIL_DATA = `${config.apiStorage}/storage-service/external/search?sort=firstName,lastName,ASC`;

export async function getEmails(likeEmail, likeFirstName, likeLastName) {
    return await makeApiCall(`${GET_EMAIL_DATA}`, 'POST', {
        likeEmail: likeEmail,
        likeFirstName: likeFirstName,
        likeLastName: likeLastName
    });
}

const GET_EMAIL_DATA_ALL = `${config.apiStorage}/storage-service/external/search`;

export async function getEmailsAll(likeEmail, likeFirstName, likeLastName) {
    const emails = await makeApiCall(`${GET_EMAIL_DATA_ALL}`, 'POST', {
        likeEmail: likeEmail,
        likeFirstName: likeFirstName,
        likeLastName: likeLastName
    });

    const { data } = emails.data;

    const alertList = data.map((item) => ({
        value: item.email,
        label: item.email
    }));

    return alertList;
}

// ULR: /message/search/paged?size=50&page=1
// const GET_SEARCH_DATA = `${config.apiStorage}/storage-service/alert/search/paged`;
const GET_SEARCH_DATA = `${config.apiStorage}/storage-service/message/search/paged`;
var previousKeyword = '';

export async function getCommunicationSearchData(page, size, sort, filters) {
    // if (previousKeyword != filters.filterText && previousKeyword != '') {
    //     handleCancelPreviousRequest();
    //     console.log('cancel');
    // }

    previousKeyword = filters.filterText;

    const filterBody = {
        message: filters.filterText,
        senders: filters.filterSenders.length > 0 ? [...filters.filterSenders.map(row => { return row.value; })] : [],
        recipients: filters.filterRecipients.length > 0 ? [...filters.filterRecipients.map(row => { return row.value; })] : [],
        sources: filters.filterSource.length > 0 ? [...filters.filterSource.map(row => { return row.value; })] : [],
        dateSentFrom: filters.filterDateFrom,
        dateSentTo: filters.filterDateTo,
        bypassType: 'DEFAULT'
    };

    if (filters.filterId != '' || filters.filterId) {
        filterBody.id = filters.filterId;
    }

    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=timeSent,DESC';

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

    return await makeApiCall(`${GET_COMM_MESSAGE_DATA}${commMessageId}`, 'GET');
}

// recent search (before-after)
// POST <host>/storage-service/recent/search?size=5
// {
// "id":"f623466e-2d73-483a-9829-8962485ae68a" //communication message id
// }

const GET_RECENT_MESSAGE_DATA = `${config.apiStorage}/storage-service/message/search/recent`;

export async function getRecentMessages(messageId, size) {
    const filterBody = {
        id: messageId
    };

    return await makeApiCall(`${GET_RECENT_MESSAGE_DATA}?size=${size}`, 'POST', filterBody);
}

// Get Whole Message Thread
const GET_MESSAGE_THREAD = `${config.apiStorage}/storage-service/message/search`;

export async function getMessageThread(chainLinkId, timeSent) {
    const filterBody = {
        chainLinkId: chainLinkId,
        dateSentFrom: moment(timeSent).utc().local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
        dateSentTo: moment(timeSent).utc().local().set({ hour: 23, minute: 59, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss')
    };

    return await makeApiCall(`${GET_MESSAGE_THREAD}?sort=timeSent,ASC`, 'POST', filterBody);
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
    const filterBody = {
        messageId: messageId
    };

    return await makeApiCall(`${GET_MESSAGE_ACTIVITY}`, 'POST');
}

// {{storage-url}}/recipient/search
// const GET_COMMENTS = `${config.apiStorage}/storage-service/message-activity/search/paged`;
const GET_RECIPIENTS = `${config.apiStorage}/storage-service/recipient/search`;

export async function getRecipients(chainLinkId) {
    const filterBody = {
        chainLinkId: chainLinkId
    };

    return await makeApiCall(`${GET_RECIPIENTS}`, 'POST', filterBody);
}

const DOWNLOAD_SEARCH_LIST = '/storage-service/download/messages';

export function downloadCommSearchList(filters: Object) {
    const filterBody = {
        message: filters.filterText,
        senders: filters.filterSenders.length > 0 ? [...filters.filterSenders.map(row => { return row.value; })] : [],
        recipients: filters.filterRecipients.length > 0 ? [...filters.filterRecipients.map(row => { return row.value; })] : [],
        sources: filters.filterSource.length > 0 ? [...filters.filterSource.map(row => { return row.value; })] : [],
        dateSentFrom: filters.filterDateFrom,
        dateSentTo: filters.filterDateTo
    };

    if (filters.filterId != '' || filters.filterId) {
        filterBody.id = filters.filterId;
    }

    // return await makeApiCall(DOWNLOAD_SEARCH_LIST, 'POST', filterBody);
    return Promise.all([makeApiCall(DOWNLOAD_SEARCH_LIST, 'POST', filterBody)]);
}
