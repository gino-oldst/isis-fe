// env config
const config = {
    apiUrl: process.env.REACT_APP_API_HOST,
    apiXApiKey: process.env.REACT_APP_X_API_KEY,
    apiSecretKey: process.env.REACT_APP_SECRET_KEY,
    oauth2Url: process.env.REACT_APP_OAUTH2_URL,
    environmentName: process.env.REACT_APP_ENVIRONMENT_NAME,

    // ISIS
    adminApplAuthHeader: process.env.REACT_APP_ADMIN_APP_AUTH_HEADER,
    apiStorage: process.env.REACT_APP_STORAGE_API_HOST,
    apiAuth: process.env.REACT_APP_AUTH_API_HOST
};

// keys for localstorage
const storageKey = {
    user: 'user',
    accessToken: 'accessToken',
    onboard: 'onboard',
    tokenValidUntil: 'tokenValidUntil',
    sidebarState: 'sidebarState'
};

const ALERT_ESCALATION_OPTIONS = {
    BASE: 'BASE',
    CO: 'CO',
    MANAGER: 'MANAGER'
};

const ALERT_STATUS_OPTIONS = {
    OPEN: 'OPEN',
    RESOLVED: 'RESOLVED',
    ARCHIVED: 'ARCHIVED',
    IN_REVIEW: 'IN_REVIEW'
};

//  ISIS
const COMMUNICATION_ALERT_SOURCE_OPTIONS = {
    // EMAIL: 'EMAIL',
    REUTERS: 'REUTERS',
    BLOOMBERG_CHAT: 'BLOOMBERG_CHAT',
    BLOOMBERG_EMAIL: 'BLOOMBERG_EMAIL'
};

const COMMUNICATION_ALERT_STATUS_OPTIONS = {
    OPEN: 'OPEN',
    RESOLVED: 'RESOLVED',
    ARCHIVED: 'ARCHIVED',
    IN_REVIEW: 'IN_REVIEW'
};

export {
    config,
    storageKey,
    ALERT_ESCALATION_OPTIONS,
    ALERT_STATUS_OPTIONS,

    //  ISIS
    COMMUNICATION_ALERT_SOURCE_OPTIONS,
    COMMUNICATION_ALERT_STATUS_OPTIONS
};
