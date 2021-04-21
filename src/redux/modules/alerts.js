// @flow
const SET_SELECTED_ALERT = 'SET_SELECTED_ALERT';

export function setSelectedAlert(data: Object) {
    return {
        type: SET_SELECTED_ALERT,
        data
    };
}

const initialState = {
    table: {
        columns: [
            'Identifier',
            'Alert Type',
            'Date',
            'Broker',
            'Ticker',
            'Book',
            'Quantity',
            'Client',
            'Escalation',
            'Assigned',
            'Status'
        ],
        data: [
            {
                identifier: 'MUA312',
                alertType: 'Insider Trading',
                date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 1',
                escalation: 'Base',
                assigned: 'Mark Thomson',
                status: 'Resolved',
                detail: '/alert/MUA312'
            },
            {
                identifier: 'MUA313',
                alertType: 'Marking the Close',
                date: new Date(new Date(2021, 5, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 8, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 2',
                escalation: 'Base',
                assigned: 'Mark Thomson',
                status: 'In Review',
                detail: '/alert/MUA313'
            },
            {
                identifier: 'MUA314',
                alertType: 'High Volume',
                date: new Date(new Date(2021, 6, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 3',
                escalation: 'Manager',
                assigned: 'Mark Thomson',
                status: 'Archived',
                detail: '/alert/MUA314'
            },
            {
                identifier: 'MUA315',
                alertType: 'Flash Execution',
                date: new Date(new Date(2021, 7, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 2, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 4',
                escalation: 'Manager',
                assigned: 'Mark Thomson',
                status: 'Resolved',
                detail: '/alert/MUA315'
            },
            {
                identifier: 'MUA316',
                alertType: 'Flash Order',
                date: new Date(new Date(2021, 8, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 5, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 5',
                escalation: 'CO',
                assigned: 'Mark Thomson',
                status: 'Open',
                detail: '/alert/MUA316'
            }, {
                identifier: 'MUA312',
                alertType: 'Insider Trading',
                date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 6',
                escalation: 'Base',
                assigned: 'Mark Thomson',
                status: 'Resolved',
                detail: '/alert/MUA312'
            },
            {
                identifier: 'MUA313',
                alertType: 'Marking the Close',
                date: new Date(new Date(2021, 5, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 8, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 7',
                escalation: 'Base',
                assigned: 'Mark Thomson',
                status: 'In Review',
                detail: '/alert/MUA313'
            },
            {
                identifier: 'MUA314',
                alertType: 'High Volume',
                date: new Date(new Date(2021, 6, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 8',
                escalation: 'Manager',
                assigned: 'Mark Thomson',
                status: 'Archived',
                detail: '/alert/MUA314'
            },
            {
                identifier: 'MUA315',
                alertType: 'Flash Execution',
                date: new Date(new Date(2021, 7, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 2, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 9',
                escalation: 'Manager',
                assigned: 'Mark Thomson',
                status: 'Resolved',
                detail: '/alert/MUA315'
            },
            {
                identifier: 'MUA316',
                alertType: 'Flash Order',
                date: new Date(new Date(2021, 8, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 5, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 10',
                escalation: 'CO',
                assigned: 'Mark Thomson',
                status: 'Open',
                detail: '/alert/MUA316'
            },
            {
                identifier: 'MUA315',
                alertType: 'Flash Execution',
                date: new Date(new Date(2021, 7, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 2, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 11',
                escalation: 'Manager',
                assigned: 'Mark Thomson',
                status: 'Resolved',
                detail: '/alert/MUA315'
            },
            {
                identifier: 'MUA316',
                alertType: 'Flash Order',
                date: new Date(new Date(2021, 8, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 5, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 12',
                escalation: 'CO',
                assigned: 'Mark Thomson',
                status: 'Open',
                detail: '/alert/MUA316'
            }
        ]
    },
    selected: {
        data: {},
        activity: []
    }
};

export default function authentication(state: Object = initialState, action: Object):
  | any
  | {
    table: {}
  } {
    switch (action.type) {
        case SET_SELECTED_ALERT:
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
