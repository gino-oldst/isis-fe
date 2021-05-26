// @flow
const SET_ALERTS_DATA = 'SET_ALERTS_DATA';
const SET_SELECTED_ALERT = 'SET_SELECTED_ALERT';
const SET_ASSIGNEES = 'SET_ASSIGNEES';
const REPLACE_ALERT_DETAILS = 'REPLACE_ALERT_DETAILS';

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

const initialState = {
    table: {
        columns: [
            {
                header: 'Identifier',
                accessor: 'behaviourCode',
                disableFilters: true,
                clickable: true
            },
            {
                header: 'Alert Type',
                accessor: 'behaviourDescription',
                disableFilters: false,
                clickable: false
            },
            {
                header: 'Date',
                accessor: 'dateCreated',
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
            }
        ],
        data: []
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
                    assignees: action.users
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
        default:
            return state;
    }
}
