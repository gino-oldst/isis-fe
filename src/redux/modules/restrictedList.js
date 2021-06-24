// @flow
import moment from 'moment';

const SET_RESTRICTED_LIST_DATA = 'SET_RESTRICTED_LIST_DATA';
const FILTER_RESTRICTED_LIST_DATA = 'FILTER_RESTRICTED_LIST_DATA';

export function setRestrictedListData(data: Array) {
    return {
        type: SET_RESTRICTED_LIST_DATA,
        data
    };
}

export function filterRestrictedListData(
    selectedOption: Integer,
    dateRangeValues: Date
) {
    return {
        type: FILTER_RESTRICTED_LIST_DATA,
        selectedOption,
        dateRangeValues
    };
}

const initialState = {
    table: {
        isFiltered: false,
        columns: [
            {
                header: 'ISIN',
                accessor: 'isin',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Summary',
                accessor: 'summary',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Restricted Date',
                accessor: 'restrictedDate',
                disableFilters: false,
                clickable: false
            }
        ],
        data: [],
        filtered: []
    }
};

export default function notifications(state: Object = initialState, action: Object) {
    switch (action.type) {
        case SET_RESTRICTED_LIST_DATA:
            return {
                table: {
                    ...state.table,
                    data: action.data
                }
            };

        case FILTER_RESTRICTED_LIST_DATA: {
            let filteredData = state.table.data;
            const { start, end } = action.dateRangeValues;

            if (action.selectedOption === 1) {
                filteredData = filteredData.filter(data => moment.utc(data.restrictedDate).format('DD MM YYYY') === moment.utc().format('DD MM YYYY'));
            } else if (action.selectedOption === 2) {
                filteredData = filteredData.filter(data => moment(data.restrictedDate).isBetween(moment.utc().subtract(7, 'd'), moment.utc()));
            } else if (action.selectedOption === 3) {
                filteredData = filteredData.filter(data => moment.utc(data.restrictedDate).isBetween(moment.utc(start), moment.utc(end)));
            }

            return {
                ...state,
                table: {
                    ...state.table,
                    isFiltered: action.selectedOption > 0,
                    filtered: action.selectedOption > 0 ? filteredData : []
                }
            };
        }

        default:
            return state;
    }
}
