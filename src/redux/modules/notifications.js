// @flow
import moment from 'moment';

const SET_NOTIFICATIONS_DATA = 'SET_NOTIFICATIONS_DATA';

export function setNotifications(data: Array) {
    return {
        type: SET_NOTIFICATIONS_DATA,
        data
    };
}

const initialState = {
    data: {
        today: [],
        yesterday: []
    }
};

export default function notifications(state: Object = initialState, action: Object) {
    switch (action.type) {
        case SET_NOTIFICATIONS_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    today: action.data.filter(notif => moment(notif.dateCreated).isSame(moment(), 'day')),
                    yesterday: action.data.filter(notif => !moment(notif.dateCreated).isSame(moment(), 'day'))
                }
            };
        default:
            return state;
    }
}
