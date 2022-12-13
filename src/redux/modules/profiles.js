// @flow
const SET_SELECTED_POLICY = 'SET_SELECTED_POLICY';
const SET_PROFILES_DATA = 'SET_PROFILES_DATA';
const SET_PARAMETERS_DATA = 'SET_PARAMETERS_DATA';
const REPLACE_PARAMETER_STATUS = 'REPLACE_PARAMETER_STATUS';
const REPLACE_PARAMETERS_DATA = 'REPLACE_PARAMETERS_DATA';
const SET_LOADING = 'SET_LOADING';
const SET_KEYWORDS = 'SET_KEYWORDS';
const SET_POLICY_FORM = 'SET_POLICY_FORM';

export function setSelectedPolicies(data: Object) {
    return {
        type: SET_SELECTED_POLICY,
        data
    };
}

export function setProfilesData(data: Array, totalNoOfRecords: String, totalPages: String) {
    return {
        type: SET_PROFILES_DATA,
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

export function setKeywords(data: Object) {
    return {
        type: SET_KEYWORDS,
        data
    };
}

export function setPolicyForm(form: Object) {
    return {
        type: SET_POLICY_FORM,
        form
    };
}

const initialState = {
    table: {
        loading: false,
        columns: [
            {
                header: 'Name',
                accessor: 'profileName',
                disableFilters: true,
                clickable: true
            },
            {
                header: 'Company',
                accessor: 'profileCompany',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Associated Emails',
                accessor: 'profileEmails',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Internal Person',
                accessor: 'profileInternalPerson',
                disableFilters: true,
                clickable: false
            },
            {
                header: ' ',
                accessor: 'policiesAction',
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
                header: 'Name',
                accessor: 'name',
                disableFilters: true,
                clickable: true
            },
            {
                header: 'Company',
                accessor: 'profileCompany',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Associated Emails',
                accessor: 'profileEmails',
                disableFilters: true,
                clickable: false
            },
            {
                header: 'Internal Person',
                accessor: 'profileInternalPerson',
                disableFilters: true,
                clickable: false
            }
        ],
        data: [],
        totalNoOfRecords: null,
        totalPages: null
    },
    form: {
        categoryName: '',
        categoryType: '',
        selectedKeywords: []
    },
    keywords: []
};

export default function profiles(state: Object = initialState, action: Object):
  | any
  | {
    table: {}
  } {
    switch (action.type) {
        case SET_POLICY_FORM:
            console.log(action);

            return {
                ...state,
                form: {
                    ...state.form,
                    categoryName: action.form.categoryName,
                    categoryType: action.form.categoryType,
                    selectedKeywords: action.form.selectedKeywords
                }
            };
        case SET_KEYWORDS:
            return {
                ...state,
                keywords: action.data
            };
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
        case SET_PROFILES_DATA:
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
