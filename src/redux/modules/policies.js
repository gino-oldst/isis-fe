// @flow
const SET_SELECTED_POLICY = 'SET_SELECTED_POLICY';
const SET_POLICIES_DATA = 'SET_POLICIES_DATA';
const SET_PARAMETERS_DATA = 'SET_PARAMETERS_DATA';
const REPLACE_PARAMETER_STATUS = 'REPLACE_PARAMETER_STATUS';
const REPLACE_PARAMETERS_DATA = 'REPLACE_PARAMETERS_DATA';
const SET_LOADING = 'SET_LOADING';

export function setSelectedPolicies(data: Object) {
    return {
        type: SET_SELECTED_POLICY,
        data
    };
}

export function setPoliciesData(data: Array, totalNoOfRecords: String, totalPages: String) {
    return {
        type: SET_POLICIES_DATA,
        data,
        totalNoOfRecords,
        totalPages
    };
}

export function setParametersData(data: Array, totalNoOfRecords: String, totalPages: String) {
    return {
        type: SET_PARAMETERS_DATA,
        data,
        totalNoOfRecords,
        totalPages
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

export function setLoading() {
    return {
        type: SET_LOADING
    };
}

const initialState = {
    table: {
        loading: false,
        columns: [
            {
                header: 'Alert No.',
                accessor: 'alertId',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Keyword',
                accessor: 'keyword',
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
        loading: false,
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
        data: [],
        totalNoOfRecords: null,
        totalPages: null
    }
};

export default function policies(state: Object = initialState, action: Object):
  | any
  | {
    table: {}
  } {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                table: {
                    ...state.table,
                    loading: true
                },
                selected: {
                    ...state.selected,
                    loading: true
                }
            };
        case SET_SELECTED_POLICY:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    id: action.data.id,
                    keyword: action.data.keyword,
                    status: action.data.status
                }
            };
        case SET_POLICIES_DATA:
            return {
                ...state,
                table: {
                    ...state.table,
                    data: action.data,
                    totalNoOfRecords: action.totalNoOfRecords,
                    totalPages: action.totalPages,
                    loading: false
                }
            };
        case SET_PARAMETERS_DATA:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    data: action.data,
                    totalNoOfRecords: action.totalNoOfRecords,
                    totalPages: action.totalPages,
                    loading: false
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
