// @flow
const SET_IS_ROW_SELECTED = 'SET_IS_ROW_SELECTED';
const SET_APPLIED_FILTERS = 'SET_APPLIED_FILTERS';

export function setIsRowSelected(
    count: Integer,
    selectedRows: Array
) {
    return {
        type: SET_IS_ROW_SELECTED,
        count,
        selectedRows
    };
}

export function setAppliedFilters(data: Array): {data: Array} {
    return {
        type: SET_APPLIED_FILTERS,
        data
    };
}

const initialState = {
    isRowsSelected: false,
    selectedRows: [],
    appliedFilters: []
};

export default function table(state: Object = initialState, action: Object) {
    switch (action.type) {
        case SET_IS_ROW_SELECTED:
            return {
                ...state,
                isRowsSelected: action.count,
                selectedRows: action.selectedRows
            };
        case SET_APPLIED_FILTERS:
            return {
                ...state,
                appliedFilters: action.data
            };
        default:
            return state;
    }
}
