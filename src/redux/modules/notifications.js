// @flow
import moment from 'moment';

const SET_NOTIFICATIONS_DATA = 'SET_NOTIFICATIONS_DATA';

export function setNotifications(userId: Integer, data: Array) {
    return {
        type: SET_NOTIFICATIONS_DATA,
        userId,
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
        case SET_NOTIFICATIONS_DATA: {
            const filteredData = action.data.filter(notif => notif.userId === parseInt(action.userId) && notif.status.toLowerCase() !== 'read');

            return {
                ...state,
                data: {
                    ...state.data,
                    today: filteredData.filter(notif => moment(notif.dateCreated).isSame(moment(), 'day')).sort((a, b) => moment(b.dateCreated) - moment(a.dateCreated)),
                    yesterday: filteredData.filter(notif => !moment(notif.dateCreated).isSame(moment(), 'day')).sort((a, b) => moment(b.dateCreated) - moment(a.dateCreated))
                }
            };
        }

        default:
            return state;
    }
}
