// @flow
const SET_IS_ROW_SELECTED = 'SET_IS_ROW_SELECTED';
const SET_APPLIED_FILTERS = 'SET_APPLIED_FILTERS';
const SET_FILTERED_ROWS = 'SET_FILTERED_ROWS';
const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE';
const RESET_STATE = 'RESET_STATE';

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

export function setFilteredRows(data: Array): {data: Array} {
    return {
        type: SET_FILTERED_ROWS,
        data
    };
}

export function setTablePageSize(pageSize: String) {
    return {
        type: SET_PAGE_SIZE,
        pageSize
    };
}

export function setActivePage(activePage: String) {
    return {
        type: SET_ACTIVE_PAGE,
        activePage
    };
}

export function resetTableState() {
    return {
        type: RESET_STATE
    };
}

const initialState = {
    isRowsSelected: false,
    selectedRows: [],
    filteredRows: [],
    appliedFilters: [],
    pageSize: 10,
    activePage: 0
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
        case SET_FILTERED_ROWS:
            return {
                ...state,
                filteredRows: action.data
            };
        case SET_PAGE_SIZE:
            return {
                ...state,
                pageSize: action.pageSize
            };
        case SET_ACTIVE_PAGE:
            return {
                ...state,
                activePage: action.activePage
            };
        case RESET_STATE:
            return initialState;
        default:
            return state;
    }
}
