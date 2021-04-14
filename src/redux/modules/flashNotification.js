// @flow

const SET_NOTIFICATION = 'SET_NOTIFICATION';
const CLEAR_FLASH_MESSAGE = 'CLEAR_FLASH_MESSAGE';

type Props = {
    message?: string,
    isError?: boolean,
    duration?: number
}

export function setFlashNotification({ message = '', isError = false, duration = 3000 }: Props): any {
    return {
        type: SET_NOTIFICATION,
        message,
        isError,
        duration
    };
}

export function clearFlashMessage(): any {
    return {
        type: CLEAR_FLASH_MESSAGE
    };
}

const initialState = {
    message: '',
    isError: false,
    duration: 3000
};

export default function flashNotification(state: Object = initialState, action: Object): any {
    switch (action.type) {
        case SET_NOTIFICATION:
            return {
                ...state,
                ...action
            };
        case CLEAR_FLASH_MESSAGE:
            return {
                ...state,
                message: ''
            };
        default:
            return state;
    }
}
