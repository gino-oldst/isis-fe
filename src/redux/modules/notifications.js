// @flow
const FILTER_TABLE = 'SET_LOGGING_OUT';

export function updateUserToken(userToken: Object): {userToken: string} {
    return {
        type: FILTER_TABLE,
        userToken
    };
}

const initialState = {
    data: [
        {
            identifier: 'MU311',
            status: 'Open',
            behaviour: 'Marking the Close',
            date: new Date('April 20, 2021 02:15:30'),
            resolved: true,
            description: 'Jonathan Greene assigned an alert to you'
        },
        {
            identifier: 'MU305',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('August 19, 1975 23:15:30'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        },
        {
            identifier: 'MU306',
            status: 'Open',
            behaviour: 'Flash Order',
            date: new Date('Feb 8, 1999 13:15:10'),
            resolved: true,
            description: 'Pamela Johnson assigned an alert to you'
        }
    ]
};

export default function authentication(state: Object = initialState, action: Object):
  | any
  | {
    data: []
  } {
    switch (action.type) {
        case FILTER_TABLE:
            return {
                state
            };
        default:
            return state;
    }
}
