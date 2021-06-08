// @flow
const SET_DASHBOARD_DATA = 'SET_DASHBOARD_DATA';

export function setDashboardData(data: Array) {
    return {
        type: SET_DASHBOARD_DATA,
        data
    };
}

const initialState = {
    data: {}
};

export default function notifications(state: Object = initialState, action: Object) {
    switch (action.type) {
        case SET_DASHBOARD_DATA:
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
}
