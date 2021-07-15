// @flow
const SET_SELECTED_BEHAVIOUR = 'SET_SELECTED_BEHAVIOUR';
const SET_BEHAVIOURS_DATA = 'SET_BEHAVIOURS_DATA';
const SET_PARAMETERS_DATA = 'SET_PARAMETERS_DATA';
const REPLACE_PARAMETER_STATUS = 'REPLACE_PARAMETER_STATUS';
const REPLACE_PARAMETERS_DATA = 'REPLACE_PARAMETERS_DATA';

export function setSelectedBehaviour(data: Object) {
    return {
        type: SET_SELECTED_BEHAVIOUR,
        data
    };
}

export function setBehavioursData(data: Array, totalNoOfRecords: String, totalPages: String) {
    return {
        type: SET_BEHAVIOURS_DATA,
        data,
        totalNoOfRecords,
        totalPages
    };
}

export function setParametersData(data: Array) {
    return {
        type: SET_PARAMETERS_DATA,
        data
    };
}

export function replaceParameterStatus(status: String) {
    return {
        type: REPLACE_PARAMETER_STATUS,
        status
    };
}

export function replaceParametersData(data: Object) {
    return {
        type: REPLACE_PARAMETERS_DATA,
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
        data: [],
        totalNoOfRecords: null,
        totalPages: null
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

export default function behaviours(state: Object = initialState, action: Object):
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
                    data: action.data,
                    totalNoOfRecords: action.totalNoOfRecords,
                    totalPages: action.totalPages
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
        case REPLACE_PARAMETER_STATUS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    status: action.status
                }
            };

        case REPLACE_PARAMETERS_DATA: {
            const toUpdateIndex = state.selected.data.findIndex(param => param.id === action.data.id);

            const newData = [...state.selected.data];

            newData[toUpdateIndex] = action.data;

            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: newData
                }
            };
        }

        default:
            return state;
    }
}
