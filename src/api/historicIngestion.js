import makeApiCall from '../api/makeApiCall';
import { config } from '../config/constants';

const GET_ALL_DATA = `${config.apiExtraction}/extraction-service/historic-data/all`;

export async function getData() {
    return await makeApiCall(GET_ALL_DATA, 'GET', {});
}

const DOWNLOAD_BLOOMBERG_DATA = `${config.apiExtraction}/extraction-service/historic-data/download/reuters`;
const DOWNLOAD_REUTERS_DATA = `${config.apiExtraction}/extraction-service/historic-data/download/bloomberg`;

export async function downloadAllHistoricData(dateFrom, dateTo, user) {
    try {
        const data = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            userId: user
        };

        console.log(data);
        await makeApiCall(DOWNLOAD_BLOOMBERG_DATA, 'POST', data);

        console.log(data);
        await makeApiCall(DOWNLOAD_REUTERS_DATA, 'POST', data);
    } catch (e) {
        console.log(e);
    }
}

export async function downloadBloombergHistoricData(dateFrom, dateTo, user) {
    const request = {
        dateFrom: dateFrom,
        dateTo: dateTo,
        userId: user
    };

    await makeApiCall(DOWNLOAD_BLOOMBERG_DATA, 'POST', request);
}

export async function downloadReutersHistoricData(dateFrom, dateTo, user) {
    const request = {
        dateFrom: dateFrom,
        dateTo: dateTo,
        userId: user
    };

    await makeApiCall(DOWNLOAD_REUTERS_DATA, 'POST', request);
}

const PURGE_HISTORIC_DATA = `${config.apiExtraction}/extraction-service/historic-data/purge-data`;

export async function purgeHistoricData(data) {
    console.log(data);

    const request = {
        id: data.id,
        userId: data.userId,
        dataDate: data.dataDate,
        dateImported: data.dateImported,
        dateExpiry: data.dateExpiry,
        historicDataStatus: 'Deleting...',
        expired: true,
        source: data.source
    };

    return await makeApiCall(PURGE_HISTORIC_DATA, 'PUT', request);
}

const GET_UNEXPIRED_DATA = `${config.apiExtraction}/extraction-service/historic-data/unexpired-data`;

export async function getUnexpiredData() {
    return await makeApiCall(GET_UNEXPIRED_DATA, 'GET', {});
}
