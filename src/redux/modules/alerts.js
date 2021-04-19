// @flow
const FILTER_TABLE = 'SET_LOGGING_OUT';

export function updateUserToken(userToken: Object): {userToken: string} {
    return {
        type: FILTER_TABLE,
        userToken
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
                status: 'Resolved'
            },
            {
                identifier: 'MUA313',
                alertType: 'Marking the Close',
                date: new Date(new Date(2021, 5, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 8, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 1',
                escalation: 'Base',
                assigned: 'Mark Thomson',
                status: 'In Review'
            },
            {
                identifier: 'MUA314',
                alertType: 'High Volume',
                date: new Date(new Date(2021, 6, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 1',
                escalation: 'Manager',
                assigned: 'Mark Thomson',
                status: 'Archived'
            },
            {
                identifier: 'MUA315',
                alertType: 'Flash Execution',
                date: new Date(new Date(2021, 7, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 2, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 1',
                escalation: 'Manager',
                assigned: 'Mark Thomson',
                status: 'Resolved'
            },
            {
                identifier: 'MUA316',
                alertType: 'Flash Order',
                date: new Date(new Date(2021, 8, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 5, 7).getTime())),
                broker: 'Peter Davidson',
                ticker: 'BP',
                book: '',
                quantity: 89,
                client: 'Client 1',
                escalation: 'CO',
                assigned: 'Mark Thomson',
                status: 'Open'
            }
        ]
    }
};

export default function authentication(state: Object = initialState, action: Object):
  | any
  | {
    table: {}
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
