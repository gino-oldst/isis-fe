import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';

const GET_ALERT_DATA = `${config.apiStorage}/storage-service/quick-communication/search/paged`;

export async function getCommunicationAlertData(page, size, sort, alert, status, dFrom, dTo, sources, senders, recipients) {
    const filterBody = {
        keywordIds: alert.length > 0 ? [...alert.map(row => { return row.value; })] : [],
        sources: sources.length > 0 ? [...sources.map(row => { return row.value; })] : [],
        statusTypes: status.length > 0 ? [...status.map(row => { return row.value; })] : ['OPEN', 'RESOLVED', 'IN_REVIEW'],
        dateFrom: dFrom,
        dateTo: dTo,
        senders: senders,
        recipients: recipients
    };

    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '&sort=timeSent,DESC';

    return await makeApiCall(`${GET_ALERT_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

// {{storage-url}}/alert/1090b868-2a3b-4e5e-82c0-bcd915d1f401
// ALERTS
const GET_TRIGGER_ALERT_DATA = `${config.apiStorage}/storage-service/alert/`;

export async function getCommunicationMessageDetail(id) {
    // const sortColumn = sort.column;
    // const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';

    return await makeApiCall(`${GET_TRIGGER_ALERT_DATA}${id}`, 'GET');
}

const GET_MSG_ALERT_DATA = `${config.apiStorage}/storage-service/alert/search`;

export async function getMessageAlerts(commMessageId) {
    const filterBody = { commMessageId: commMessageId };

    return await makeApiCall(`${GET_MSG_ALERT_DATA}`, 'POST', filterBody);
}

const UPDATE_ALERT = `${config.apiStorage}/storage-service/alert`;

export async function updateAlert(data: Object) {
    return await makeApiCall(UPDATE_ALERT, 'PUT', data);
}

// const GET_KEYWORDS = `${config.apiStorage}/storage-service/policy-map/search`;
const GET_KEYWORDS = `${config.apiStorage}/storage-service/keyword/search`;

export async function getKeywords() {
    const keywords = await makeApiCall(`${GET_KEYWORDS}`, 'POST', {});

    const { data } = keywords.data;

    const alertList = data.map((keyword) => ({
        value: keyword.id,
        label: `Alert ${keyword.number}`
    }));

    return alertList;
}

const DOWNLOAD_ALERTS_LIST = '/storage-service/download/alerts';

export async function downloadCommAlertsList(alert, status, dFrom, dTo, sources, senders, recipients) {
    const filterBody = {
        keywordIds: alert.length > 0 ? [...alert.map(row => { return row.value; })] : [],
        sources: sources.length > 0 ? [...sources.map(row => { return row.value; })] : [],
        statusTypes: status.length > 0 ? [...status.map(row => { return row.value; })] : ['OPEN', 'RESOLVED', 'IN_REVIEW'],
        dateFrom: dFrom,
        dateTo: dTo,
        senders: senders,
        recipients: recipients
    };

    return await makeApiCall(DOWNLOAD_ALERTS_LIST, 'POST', filterBody);
}

const GET_ACTIVITY_LIST = `${config.apiStorage}/storage-service/message-activity/search`;

export async function getActivityList(messageId, type) {
    const filterBody = {
        messageId: messageId
        // type: type
    };

    return await makeApiCall(GET_ACTIVITY_LIST, 'POST', filterBody);
}

const POST_MESSAGE_ACTIVITY = `${config.apiStorage}/storage-service/message-activity`;

export async function postComment(requestBody) {
    return await makeApiCall(POST_MESSAGE_ACTIVITY, 'POST', requestBody);
}
