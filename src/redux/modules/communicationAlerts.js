// @flow
import moment from 'moment';

const SET_COMMUNICATION_ALERTS_DATA = 'SET_COMMUNICATION_ALERTS_DATA';
const SET_COMMUNICATION_ALERTS_SPECIFICS_DATA = 'SET_COMMUNICATION_COMMUNICATION_ALERTS_SPECIFICS_DATA';
const SET_SELECTED_COMMUNICATION_ALERTS = 'SET_SELECTED_COMMUNICATION_ALERTS';
const SET_ASSIGNEES = 'SET_ASSIGNEES';
const SET_COLUMN_FILTER_VALUES = 'SET_COLUMN_FILTER_VALUES';
const REPLACE_COMMUNICATION_ALERTS_DETAILS = 'REPLACE_COMMUNICATION_ALERTS_DETAILS';
const FILTER_COMMUNICATION_ALERTS_DATA = 'FILTER_COMMUNICATION_ALERTS_DATA';
const SET_LOADING = 'SET_LOADING';
const SET_COMMUNICATION_ALERTS_DATE_RANGE = 'SET_COMMUNICATION_ALERTS_DATE_RANGE';
const SET_MESSAGE_ALERTS = 'SET_MESSAGE_ALERTS';
const SET_ALERTS_LIST = 'SET_ALERTS_LIST';

export function setAlertsListDetail(data: Object) {
    return {
        type: SET_ALERTS_LIST,
        data
    };
}

export function setMessageAlerts(data: Object) {
    return {
        type: SET_MESSAGE_ALERTS,
        data
    };
}

export function setSelectedCommnunicationAlert(data: Object) {
    return {
        type: SET_SELECTED_COMMUNICATION_ALERTS,
        data
    };
}

export function setCommunicationAlertsData(data: Array, totalNoOfRecords: Integer, totalPages: Integer) {
    return {
        type: SET_COMMUNICATION_ALERTS_DATA,
        data,
        totalNoOfRecords,
        totalPages
    };
}

export function setCommunicationAlertSpecificsData(data: Object) {
    return {
        type: SET_COMMUNICATION_ALERTS_SPECIFICS_DATA,
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

export function replaceAlertDetails(data: Array) {
    return {
        type: REPLACE_COMMUNICATION_ALERTS_DETAILS,
        data
    };
}

export function filterCommunicationAlertsData(
    selectedOption: Integer,
    dateRangeValues: Date
) {
    return {
        type: FILTER_COMMUNICATION_ALERTS_DATA,
        selectedOption,
        dateRangeValues
    };
}

export function setAlertsDateRange(target: String, date: String) {
    return {
        type: SET_COMMUNICATION_ALERTS_DATE_RANGE,
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
    columnFilterValues: null,
    table: {
        loading: false,
        isFiltered: false,
        columns: [
            {
                header: 'Alert',
                accessor: 'expander',
                disableFilters: true,
                clickable: true
            },
            // {
            //     header: '',
            //     accessor: 'chainLinkId',
            //     disableFilters: true,
            //     sortable: false,
            //     hideHeader: true
            // },
            {
                header: 'Status',
                accessor: 'status',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Date & Time',
                accessor: 'date',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Source',
                accessor: 'alertSource',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Sender',
                accessor: 'sender',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Recipient',
                accessor: 'recipient',
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
    selected: {
        data: {},
        assignees: [],
        alertSpecifics: {}
    },
    messageAlerts: {
        alerts: {}
    },
    alertsList: {}
};

export default function communicationAlerts(state: Object = initialState, action: Object):
  | any
  | {
    table: {},
    selected: {},
    columnFilterValues: null,
    messageAlerts: {},
    alertsList: {}
  } {
    switch (action.type) {
        case SET_ALERTS_LIST:
            return {
                ...state,
                alertsList: action.data
            };
        case SET_MESSAGE_ALERTS:
            return {
                ...state,
                messageAlerts: {
                    ...state.messageAlerts,
                    alerts: action.data
                }
            };
        case SET_LOADING:
            return {
                ...state,
                table: {
                    ...state.table,
                    loading: true
                }
            };
        case SET_COMMUNICATION_ALERTS_DATA:
            return {
                ...state,
                table: {
                    ...state.table,
                    data: action.data,
                    totalNoOfRecords: action.totalNoOfRecords,
                    totalPages: action.totalPages,
                    loading: false
                }
            };
        case SET_SELECTED_COMMUNICATION_ALERTS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: action.data
                }
            };
        case SET_COMMUNICATION_ALERTS_SPECIFICS_DATA:
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

        case REPLACE_COMMUNICATION_ALERTS_DETAILS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: action.data
                }
            };

        case FILTER_COMMUNICATION_ALERTS_DATA: {
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

        case SET_COMMUNICATION_ALERTS_DATE_RANGE:
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
