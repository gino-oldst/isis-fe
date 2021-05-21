// @flow
const SET_SELECTED_BEHAVIOUR = 'SET_SELECTED_BEHAVIOUR';

export function setSelectedBehaviour(identifier: String, behaviour: String) {
    return {
        type: SET_SELECTED_BEHAVIOUR,
        identifier,
        behaviour
    };
}

const initialState = {
    table: {
        columns: [
            {
                header: 'Identifier',
                accessor: 'identifier',
                disableFilters: true,
                clickable: true
            },
            {
                header: 'Behaviour Name',
                accessor: 'behaviourName',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Status',
                accessor: 'status',
                disableFilters: true,
                clickable: false
            }
        ],
        data: [
            {
                identifier: 'MUB01',
                behaviourName: 'Insider Trading',
                status: 'Active',
                detail: '/behaviour/MUB01'
            },
            {
                identifier: 'MUB02',
                behaviourName: 'Front Running',
                status: 'Active',
                detail: '/behaviour/MUB02'
            },
            {
                identifier: 'MUB03',
                behaviourName: 'Making the Close',
                status: 'Active',
                detail: '/behaviour/MUB03'
            },
            {
                identifier: 'MUB04',
                behaviourName: 'Flash Execution / Order',
                status: 'Active',
                detail: '/behaviour/MUB04'
            },
            {
                identifier: 'MUB05',
                behaviourName: 'Away from the Market',
                status: 'Inactive',
                detail: '/behaviour/MUB05'
            },
            {
                identifier: 'MUB06',
                behaviourName: 'Away from the Market',
                status: 'Inactive',
                detail: '/behaviour/MUB05'
            },
            {
                identifier: 'MUB07',
                behaviourName: 'Away from the Market',
                status: 'Inactive',
                detail: '/behaviour/MUB05'
            },
            {
                identifier: 'MUB08',
                behaviourName: 'Away from the Market',
                status: 'Inactive',
                detail: '/behaviour/MUB05'
            }
        ]
    },
    selected: {
        identifier: '',
        behaviour: '',
        columns: [
            {
                header: 'Code',
                accessor: 'code',
                disableFilters: true,
                clickable: true
            },
            {
                header: 'Description',
                accessor: 'description',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Value',
                accessor: 'value',
                disableFilters: true,
                clickable: false
            }
        ],
        data: [
            {
                code: 'Excess return',
                description: 'Excess return in days',
                value: '3'
            },
            {
                code: 'Excess return threshold',
                description: 'Excess return threshold percentage',
                value: '20%'
            },
            {
                code: 'Excess loss',
                description: 'Excess loss in days',
                value: '3'
            },
            {
                code: 'Excess loss threshold',
                description: 'Excess loss threshold percentage',
                value: '20%'
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
        case SET_SELECTED_BEHAVIOUR:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    identifier: action.identifier,
                    behaviour: action.behaviour
                }
            };
        default:
            return state;
    }
}
