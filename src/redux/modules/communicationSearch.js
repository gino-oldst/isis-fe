// @flow
import moment from 'moment';

const SET_COMMUNICATION_SEARCH_DATA = 'SET_COMMUNICATION_SEARCH_DATA';
const SET_COMMUNICATION_SEARCH_SPECIFICS_DATA = 'SET_COMMUNICATION_COMMUNICATION_SEARCH_SPECIFICS_DATA';
const SET_SELECTED_COMMUNICATION_SEARCH = 'SET_SELECTED_COMMUNICATION_SEARCH';
const SET_ASSIGNEES = 'SET_ASSIGNEES';
const SET_COLUMN_FILTER_VALUES = 'SET_COLUMN_FILTER_VALUES';
const REPLACE_COMMUNICATION_SEARCH_DETAILS = 'REPLACE_COMMUNICATION_SEARCH_DETAILS';
const FILTER_COMMUNICATION_SEARCH_DATA = 'FILTER_COMMUNICATION_SEARCH_DATA';
const SET_LOADING = 'SET_LOADING';
const SET_COMMUNICATION_SEARCH_DATE_RANGE = 'SET_COMMUNICATION_SEARCH_DATE_RANGE';
const SET_SELECTED_MESSAGE = 'SET_SELECTED_MESSAGE';
const SET_SEARCH_FILTER_VALUES = 'SET_SEARCH_FILTER_VALUES';
const SET_ALERTS_LIST = 'SET_ALERTS_LIST';

export function setAlertsList(data: Object) {
    return {
        type: SET_ALERTS_LIST,
        data
    };
}

export function setSelectedMessage(data: String) {
    return {
        type: SET_SELECTED_MESSAGE,
        data
    };
}

export function setSearchFilterValues(values: object) {
    return {
        type: SET_SEARCH_FILTER_VALUES,
        values
    };
}

// for search details
export function setSelectedCommnunicationSearch(data: Object) {
    return {
        type: SET_SELECTED_COMMUNICATION_SEARCH,
        data
    };
}

export function setCommunicationSearchData(data: Array, searchIds: Array, totalNoOfRecords: Integer, totalPages: Integer) {
    return {
        type: SET_COMMUNICATION_SEARCH_DATA,
        data,
        searchIds,
        totalNoOfRecords,
        totalPages
    };
}

export function setCommunicationSearchSpecificsData(data: Object) {
    return {
        type: SET_COMMUNICATION_SEARCH_SPECIFICS_DATA,
        data
    };
}

export function setColumnFilterValues(values: object) {
    return {
        type: SET_COLUMN_FILTER_VALUES,
        values
    };
}

export function setAssignees(users: Array) {
    return {
        type: SET_ASSIGNEES,
        users
    };
}

export function replaceSearchDetails(data: Array) {
    return {
        type: REPLACE_COMMUNICATION_SEARCH_DETAILS,
        data
    };
}

export function filterCommunicationSearchData(
    selectedOption: Integer,
    dateRangeValues: Date
) {
    return {
        type: FILTER_COMMUNICATION_SEARCH_DATA,
        selectedOption,
        dateRangeValues
    };
}

export function setSearchDateRange(target: String, date: String) {
    return {
        type: SET_COMMUNICATION_SEARCH_DATE_RANGE,
        target,
        date
    };
}

export function setLoading() {
    return {
        type: SET_LOADING
    };
}

const initialState = {
    // dateRange: {
    //     start: moment().subtract(7, 'd'),
    //     end: moment(),
    //     activeOption: 2
    // },
    searchFilterValue: null,
    columnFilterValues: null,
    alertsList: null,
    table: {
        loading: false,
        isFiltered: false,
        columns: [
            {
                header: 'ID',
                accessor: 'id',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Subject & Message',
                accessor: 'message',
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
                header: 'Date & Time',
                accessor: 'timeSent',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Sender',
                accessor: 'senderSearch',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Recipients',
                accessor: 'recipients',
                disableFilters: true,
                clickable: false
            }
        ],
        data: [],
        alertIds: [],
        filtered: [],
        totalNoOfRecords: null,
        totalPages: null
    },
    selectedMessage: {
        messageId: null,
        keyword: null
    },
    selected: {
        data: {},
        assignees: [],
        alertSpecifics: {}
    }
};

export default function communicationSearch(state: Object = initialState, action: Object):
  | any
  | {
    table: {}
  } {
    switch (action.type) {
        case SET_ALERTS_LIST:
            return {
                ...state,
                alertsList: action.data
            };
        case SET_LOADING:
            return {
                ...state,
                table: {
                    ...state.table,
                    loading: true
                }
            };
        case SET_COMMUNICATION_SEARCH_DATA:
            return {
                ...state,
                table: {
                    ...state.table,
                    data: action.data,
                    searchIds: action.id,
                    totalNoOfRecords: action.totalNoOfRecords,
                    totalPages: action.totalPages,
                    loading: false
                }
            };
        case SET_SELECTED_COMMUNICATION_SEARCH:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: action.data
                }
            };
        case SET_COMMUNICATION_SEARCH_SPECIFICS_DATA:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    alertSpecifics: action.data
                }
            };
        case SET_ASSIGNEES:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    assignees: action.users.filter(user => user.fullName.toLowerCase() !== 'admin' || user.username.toLowerCase() !== 'admin')
                }
            };
        case SET_COLUMN_FILTER_VALUES:
            return {
                ...state,
                columnFilterValues: action.values
            };

        case SET_SEARCH_FILTER_VALUES:
            return {
                ...state,
                searchFilterValue: action.values
            };

        case REPLACE_COMMUNICATION_SEARCH_DETAILS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: action.data
                }
            };

        case FILTER_COMMUNICATION_SEARCH_DATA: {
            let filteredData = state.table.data;
            const { start, end } = action.dateRangeValues;

            if (action.selectedOption === 1) {
                filteredData = filteredData.filter(data => moment.utc(data.dateCreated).format('DD MM YYYY') === moment.utc().format('DD MM YYYY'));
            } else if (action.selectedOption === 2) {
                filteredData = filteredData.filter(data => moment(data.dateCreated).isBetween(moment.utc().subtract(7, 'd'), moment.utc()));
            } else if (action.selectedOption === 3) {
                filteredData = filteredData.filter(data => moment.utc(data.dateCreated).isBetween(moment.utc(start), moment.utc(end)));
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

        case SET_COMMUNICATION_SEARCH_DATE_RANGE:
            return {
                ...state,
                dateRange: {
                    ...state.dateRange,
                    [action.target]: action.date
                }
            };

        default:
            return state;
    }
}
