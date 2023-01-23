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

const GET_SEARCH_DATA_OPEN_SEARCH = `${config.openSearchUrl}`;

export async function getCommunicationSearchDataOpenSearch(page, size, sort, filters) {
    previousKeyword = filters.filterText;

    if (filters.filterId != '' || filters.filterId) {
        filterBody.id = filters.filterId;
    }

    const sortColumn = 'time_sent'; // sort.column;
    // const sortValue = sort.column != '' && sort.type != '' ? [sortColumn, sort.type] : ['time_sent', sort.type != '' ? 'desc' : sort.type];
    const sortValue = sort.type ? [sortColumn, sort.type] : [sortColumn, 'DESC'];

    // Get Filters
    const filterBody = {
        size: size,
        from: (page * size),
        sort: [
            {
                [sortValue[0]]: {
                    order: sortValue[1]
                }
            }
        ],
        query: {
            bool: {
                must: [],
                must_not: [
                    { match_phrase: { content: '[Bloomberg created note: ]' } } // Filters out all system events
                ],
                // Condition for SHOULD for senders and recipients
                should: [],
                // Specifies the minimum number of queries that the document must match for it to be returned in the results.
                minimum_should_match: 1,
                filter: [
                    {
                        range: {
                            time_sent: {
                                gte: filters.filterDateFrom.replace('T', ' '),
                                lte: filters.filterDateTo.replace('T', ' '),
                                format: 'yyyy-MM-dd HH:mm:ss',
                                relation: 'within'
                            }
                        }
                    },
                    { match_phrase: { type: 'Send' } }// Filters out all system events
                ]
            }
        }
    };

    // counter of multiple fields
    var fieldsShouldMatchCounter = 0;

    // Append senders if available
    if (filters.filterSenders.length > 0) {
        filters.filterSenders.map(sender => {
            filterBody.query.bool.should.push({ match_phrase: { sender: sender.value } });
        });
        fieldsShouldMatchCounter++;
    }

    // Append recipients if available
    if (filters.filterRecipients.length > 0) {
        filters.filterRecipients.map(recipeint => {
            filterBody.query.bool.should.push({ match_phrase: { recipients: recipeint.value } });
        });
        fieldsShouldMatchCounter++;
    }

    // Append text
    // { match_phrase: { content: filters.filterText } }
    if (filters.filterText != '') {
        filterBody.query.bool.must.push({ match_phrase: { content: filters.filterText } });
    }

    // Append sources if available
    if (filters.filterSource.length > 0) {
        filters.filterSource.map(source => {
            filterBody.query.bool.should.push({ match_phrase: { source: source.value } });
        });
        fieldsShouldMatchCounter++;
    }

    // Count all items inside should (n-1)
    filterBody.query.bool.minimum_should_match = fieldsShouldMatchCounter;

    // Append filter text if available
    if (filters.filterText != '') {
        filterBody.query.bool.filter.push({
            match_phrase: {
                content: filters.filterText
            }
        });
    }

    const { data } = await makeApiCall(`${GET_SEARCH_DATA_OPEN_SEARCH}`, 'POST', JSON.stringify(filterBody));

    const messageList = data.hits.hits.map((msg) => ({
        id: msg._id,
        chainLinkId: msg._source.chain_id,
        sender: msg._source.sender,
        recipients: msg._source.recipients.split(','),
        source: msg._source.source,
        timeSent: msg._source.time_sent,
        type: msg._source.type,
        message: msg._source.content
    }));

    const processedResult = {
        data: messageList,
        searchIds: '',
        totalCurrentElements: size,
        totalNoOfRecords: data.hits.total.value,
        totalPages: Math.floor(data.hits.total.value / size)
    };

    // return await makeApiCall(`${GET_SEARCH_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
    return processedResult;
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

const GET_MESSAGE_THREAD_DATA_OPEN_SEARCH = `${config.openSearchUrl}`;

// message details via open search
export async function getCommunicationMessageDetailOpenSearch(commMessageId) {
    return await makeApiCall(`${GET_MESSAGE_THREAD_DATA_OPEN_SEARCH}?scroll=1m`, 'GET');
}

//  Get whole message thread via open search
export async function getMessageThreadOpenSearch(chainLinkId, timeSent) {
    const filterBody = {
        size: 1000,
        from: 0,
        sort: [
            {
                time_sent: {
                    order: 'asc'
                }
            }
        ],
        query: {
            bool: {
                must: [
                    {
                        match_phrase: {
                            chain_id: chainLinkId
                        }
                    }
                ],
                filter: {
                    range: {
                        time_sent: {
                            gte: moment(timeSent).utc().local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss'),
                            lte: moment(timeSent).utc().local().set({ hour: 23, minute: 59, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss'),
                            format: 'yyyy-MM-dd HH:mm:ss',
                            relation: 'within'
                        }
                    }
                }

            }
        }
    };

    const { data } = await makeApiCall(`${GET_MESSAGE_THREAD_DATA_OPEN_SEARCH}`, 'POST', JSON.stringify(filterBody));

    const messageThreadList = data.hits.hits.map((msg) => ({
        id: msg._id,
        chainLinkId: msg._source.chain_id,
        timeSent: msg._source.time_sent,
        message: msg._source.content,
        sender: msg._source.sender,
        source: msg._source.source,
        type: msg._source.type
    }));

    const processedResult = {
        data: messageThreadList
        // totalCurrentElements: size
        // totalNoOfRecords: data.hits.total.value,
        // totalPages: Math.floor(data.hits.total.value / size)

    };

    return processedResult;
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

const DOWNLOAD_SEARCH_LIST_OPEN_SEACH = `${config.openSearchUrl}`;

export function downloadCommSearchListOpenSearch(filters: Object) {
    const filterBody = {
        size: 1000,
        from: 0,
        sort: [
            {
                time_sent: {
                    order: 'asc'
                }
            }
        ]
    };
    const { data } = Promise.all([makeApiCall(DOWNLOAD_SEARCH_LIST_OPEN_SEACH, 'POST', JSON.stringify(filterBody))]);

    const downloadDataFromSearch = data.hits.hits.map((msg) => ({
        sender: msg._source.sender,
        recipients: msg._source.recipients.split(','),
        source: msg._source.source,
        timeSent: msg._source.time_sent,
        message: msg._source.content
    }));

    const processedResult = {
        data: downloadDataFromSearch
        // totalCurrentElements: size
        // totalNoOfRecords: data.hits.total.value,
        // totalPages: Math.floor(data.hits.total.value / size)

    };
}
