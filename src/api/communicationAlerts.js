import { config } from '../config/constants';
import makeApiCall from '../api/makeApiCall';

const GET_ALERT_DATA = `${config.apiStorage}/storage-service/quick-communication/search/paged`;

export async function getCommunicationAlertData(page, size, sort, filters) {
    const filterBody = {};

    const sortColumn = sort.column;
    const withSorting = () => sort && sort.column !== '' && sort.type !== '' ? `&sort=${sortColumn},${sort.type}` : '';

    return await makeApiCall(`${GET_ALERT_DATA}?page=${page}&size=${size}${withSorting()}`, 'POST', filterBody);
}

// {{storage-url}}/alert/1090b868-2a3b-4e5e-82c0-bcd915d1f401
// ALERTS
const GET_TRIGGER_ALERT_DATA = `${config.apiStorage}/alert/`;

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

const UPDATE_BEHAVIOUR = `${config.apiStorage}/alert`;

export async function updateAlert(data: Object) {
    return await makeApiCall(UPDATE_BEHAVIOUR, 'PUT', data);
}

const GET_KEYWORDS = `${config.apiStorage}/storage-service/keyword/search`;

export async function getKeywords() {
    const keywords = await makeApiCall(`${GET_KEYWORDS}`, 'POST', {});

    const { data } = keywords.data;

    const alertList = data.map((keyword) => ({
        value: keyword.word,
        label: keyword.word
    }));

    return alertList;
}
