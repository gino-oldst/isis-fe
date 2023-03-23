// @flow

const SET_HISTORIC_DATA = 'SET_HISTORIC_DATA';
const SET_LOADING = 'SET_LOADING';

export function setHistoricData(data: Array, totalNoOfRecords: Integer, totalPages: Integer) {
    return {
        type: SET_HISTORIC_DATA,
        data,
        totalNoOfRecords,
        totalPages
    };
}

export function setLoading() {
    return {
        type: SET_LOADING
    };
}

const initialState = {
    table: {
        loading: false,
        columns: [
            {
                header: 'Data Date',
                accessor: 'dataDate',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Source',
                accessor: 'source',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Import Date',
                accessor: 'importDate',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Expiry Date',
                accessor: 'expiryDate',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Imported by',
                accessor: 'userId',
                disableFilters: true,
                clickable: false
            }
        ],
        data: [],
        totalNoOfRecords: null,
        totalPages: null
    }
};

export default function HistoricData(state: Object = initialState, action: Object):
 | any
 | {
    table: {},
 }
