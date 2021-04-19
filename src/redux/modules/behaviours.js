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
            'Behaviour Name',
            'Status'
        ],
        data: [
            {
                identifier: 'MUB01',
                behaviourName: 'Insider Trading',
                status: 'Active'
            },
            {
                identifier: 'MUB02',
                behaviourName: 'Front Running',
                status: 'Active'
            },
            {
                identifier: 'MUB03',
                behaviourName: 'Making the Close',
                status: 'Active'
            },
            {
                identifier: 'MUB04',
                behaviourName: 'Flash Execution / Order',
                status: 'Active'
            },
            {
                identifier: 'MUB05',
                behaviourName: 'Away from the Market',
                status: 'Inactive'
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
