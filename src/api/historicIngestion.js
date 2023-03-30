import makeApiCall from '../api/makeApiCall';
import { config } from '../config/constants';

const GET_ALL_DATA = `${config.apiExtraction}/extraction-service/historic-data/all`;

export async function getData() {
    return await makeApiCall(GET_ALL_DATA, 'GET', {});
}

const DOWNLOAD_BLOOMBERG_DATA = `${config.apiExtraction}/extraction-service/historic-data/download/reuters`;
const DOWNLOAD_REUTERS_DATA = `${config.apiExtraction}/extraction-service/historic-data/download/bloomberg`;

export async function downloadAllHistoricData(dateFrom, dateTo) {
    try {
        const data = {
            dateFrom: dateFrom,
            dateTo: dateTo
        };

        console.log(data);
        await makeApiCall(DOWNLOAD_BLOOMBERG_DATA, 'POST', data);

        console.log(data);
        await makeApiCall(DOWNLOAD_REUTERS_DATA, 'POST', data);
    } catch (e) {
        console.log(e);
    }
}

export async function downloadBloombergHistoricData(dateFrom, dateTo) {
    const request = {
        dateFrom: dateFrom,
        dateTo: dateTo
    };

    await makeApiCall(DOWNLOAD_BLOOMBERG_DATA, 'POST', request);
}

export async function downloadReutersHistoricData(dateFrom, dateTo) {
    const request = {
        dateFrom: dateFrom,
        dateTo: dateTo
    };

    await makeApiCall(DOWNLOAD_REUTERS_DATA, 'POST', request);
}
