// @flow
const SET_SELECTED_BEHAVIOUR = 'SET_SELECTED_BEHAVIOUR';
const SET_BEHAVIOURS_DATA = 'SET_BEHAVIOURS_DATA';
const SET_PARAMETERS_DATA = 'SET_PARAMETERS_DATA';

export function setSelectedBehaviour(data: Object) {
    return {
        type: SET_SELECTED_BEHAVIOUR,
        data
    };
}

export function setBehavioursData(data: Array) {
    return {
        type: SET_BEHAVIOURS_DATA,
        data
    };
}

export function setParametersData(data: Array) {
    return {
        type: SET_PARAMETERS_DATA,
        data
    };
}

const initialState = {
    table: {
        columns: [
            {
                header: 'Identifier',
                accessor: 'internalCode',
                disableFilters: true,
                clickable: true
            },
            {
                header: 'Behaviour Name',
                accessor: 'description',
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
        data: []
    },
    selected: {
        id: null,
        code: null,
        identifier: '',
        behaviour: '',
        status: '',
        columns: [
            {
                header: 'Code',
                accessor: 'name',
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
        data: []
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
                    id: action.data.id,
                    code: action.data.code,
                    identifier: action.data.internalCode,
                    behaviour: action.data.description,
                    status: action.data.status
                }
            };
        case SET_BEHAVIOURS_DATA:
            return {
                ...state,
                table: {
                    ...state.table,
                    data: action.data
                }
            };
        case SET_PARAMETERS_DATA:
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
