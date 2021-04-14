// @flow
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
const AUTHENTICATE_USER = 'AUTHENTICATE_USER';
const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
const SET_LOGGING_OUT = 'SET_LOGGING_OUT';

export function updateUserToken(userToken: Object): {userToken: string} {
    return {
        type: SET_ACCESS_TOKEN,
        userToken
    };
}

export function authUser(data: Object): {data: Object} {
    return {
        type: AUTHENTICATE_USER,
        data
    };
}

export function updateProfileData(data: Object): {data: Object} {
    return {
        type: SET_PROFILE_DATA,
        data
    };
}

export function setLoggingOut(): {} {
    return {
        type: SET_LOGGING_OUT
    };
}

const initialState = {
    isAuthed: false,
    isLoggingOut: false,
    profileData: {},
    userToken: null
};

export default function authentication(state: Object = initialState, action: Object):
  | any
  | {
    isAuthed: boolean,
    isLoggingOut: boolean,
    profileData: {},
    userToken: null
  } {
    switch (action.type) {
        case SET_ACCESS_TOKEN:
            return {
                ...state,
                isLoggingOut: false,
                userToken: action.userToken
            };
        case AUTHENTICATE_USER:
            return {
                ...state,
                profileData: action.data,
                isAuthed: true
            };
        case SET_PROFILE_DATA:
            return {
                ...state,
                profileData: {
                    ...state.profileData,
                    ...action.data
                }
            };
        case SET_LOGGING_OUT:
            return {
                ...initialState,
                isLoggingOut: true
            };
        default:
            return state;
    }
}
