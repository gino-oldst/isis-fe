// @flow

const SET_HISTORIC_DATA = 'SET_HISTORIC_DATA';
const SET_LOADING = 'SET_LOADING';

export function setHistoricData(data: Array, totalNoOfRecords: Integer, totalPages: Integer) {
    console.log(totalNoOfRecords);
    console.log(totalPages);

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
                accessor: 'dateImported',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Expiry Date',
                accessor: 'dateExpiry',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Imported by',
                accessor: 'userId',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Status',
                accessor: 'historicDataStatus',
                disableFilters: true,
                clickable: false
            },
            {
                header: '',
                accessor: 'historicDataFunction',
                disableFilters: true,
                clickable: false
            }
        ],
        data: [],
        totalNoOfRecords: null,
        totalPages: null
    }
};

export default function historicData(state: Object = initialState, action: Object):
 | any
 | {
    table: {},
 } {
    switch (action.type) {
        case SET_HISTORIC_DATA:
            return {
                ...state,
                table: {
                    ...state.table,
                    data: action.data,
                    totalNoOfRecords: action.totalNoOfRecords,
                    totalPages: action.totalPages
                }
            };

        default:
            return state;
    }
}
