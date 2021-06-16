// @flow
import moment from 'moment';

const SET_DASHBOARD_DATA = 'SET_DASHBOARD_DATA';
const SET_DASHBOARD_DATE_RANGE = 'SET_DASHBOARD_DATE_RANGE';

export function setDashboardData(data: Array) {
    return {
        type: SET_DASHBOARD_DATA,
        data
    };
}

export function setDashboardDateRange(target: String, date: String) {
    return {
        type: SET_DASHBOARD_DATE_RANGE,
        target,
        date
    };
}

const initialState = {
    dateRange: {
        from: moment(),
        to: moment()
    },
    data: {}
};

export default function notifications(state: Object = initialState, action: Object) {
    switch (action.type) {
        case SET_DASHBOARD_DATA:
            return {
                ...state,
                data: action.data
            };
        case SET_DASHBOARD_DATE_RANGE:
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
