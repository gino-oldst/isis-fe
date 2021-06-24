// @flow
import moment from 'moment';

const SET_ALERTS_DATA = 'SET_ALERTS_DATA';
const SET_SELECTED_ALERT = 'SET_SELECTED_ALERT';
const SET_ASSIGNEES = 'SET_ASSIGNEES';
const REPLACE_ALERT_DETAILS = 'REPLACE_ALERT_DETAILS';
const FILTER_ALERTS_DATA = 'FILTER_ALERTS_DATA';

export function setSelectedAlert(data: Object) {
    return {
        type: SET_SELECTED_ALERT,
        data
    };
}

export function setAlertsData(data: Array) {
    return {
        type: SET_ALERTS_DATA,
        data
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
        type: REPLACE_ALERT_DETAILS,
        data
    };
}

export function filterAlertsData(
    selectedOption: Integer,
    dateRangeValues: Date
) {
    return {
        type: FILTER_ALERTS_DATA,
        selectedOption,
        dateRangeValues
    };
}

const initialState = {
    table: {
        isFiltered: false,
        columns: [
            {
                header: 'Alert Type',
                accessor: 'behaviourCode',
                disableFilters: false,
                clickable: true
            },
            {
                header: 'Date',
                accessor: 'alertDate',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Broker',
                accessor: 'broker',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Ticker',
                accessor: 'ticker',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Book',
                accessor: 'book',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Quantity',
                accessor: 'quantity',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Client',
                accessor: 'client',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Escalation',
                accessor: 'escalation',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Assigned',
                accessor: 'assignedUser',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Status',
                accessor: 'status',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Parameter',
                accessor: 'parameterValues',
                disableFilters: false,
                clickable: false
            }
        ],
        data: [],
        filtered: []
    },
    selected: {
        data: {},
        assignees: []
    }
};

export default function alerts(state: Object = initialState, action: Object):
  | any
  | {
    table: {}
  } {
    switch (action.type) {
        case SET_ALERTS_DATA:
            return {
                ...state,
                table: {
                    ...state.table,
                    data: action.data
                }
            };
        case SET_SELECTED_ALERT:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: action.data
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

        case REPLACE_ALERT_DETAILS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: action.data
                }
            };

        case FILTER_ALERTS_DATA: {
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

        default:
            return state;
    }
}
