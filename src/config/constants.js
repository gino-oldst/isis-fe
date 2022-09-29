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
    apiAuth: process.env.REACT_APP_AUTH_API_HOST,
    versionName: process.env.REACT_APP_VERSION_VALUE
};

// keys for localstorage
const storageKey = {
    user: 'user',
    accessToken: 'accessToken',
    onboard: 'onboard',
    tokenValidUntil: 'tokenValidUntil',
    sidebarState: 'sidebarState',
    alertSearchParams: 'alertSearchParams',
    searchParams: 'searchParams'
};

const alertsStorageKey = {
    status: 'status',
    dateFrom: 'dateFrom',
    dateTo: 'dateTo',
    source: 'source',
    senders: 'senders',
    recipients: 'recipients'
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
    BLOOMBERG_MAIL: 'BLOOMBERG_MAIL'
};

const COMMUNICATION_ALERT_STATUS_OPTIONS = {
    OPEN: 'OPEN',
    RESOLVED: 'RESOLVED',
    ARCHIVED: 'ARCHIVED',
    IN_REVIEW: 'IN_REVIEW'
};

const ALERT_CATEGORIES = {
    MARKET_ABUSE: [113, 100, 71, 105, 26, 101, 119, 41, 7, 5, 32, 106, 34, 103, 114, 137, 107, 75, 2, 6, 64, 81, 51, 49, 37, 4, 13, 139, 109, 61, 62, 52, 122, 35, 28, 67, 93, 57, 43, 29, 131, 53, 65, 72, 99, 77, 39, 50],
    CONDUCT: [92, 88, 15, 134, 42, 82, 3, 79, 126, 124, 36, 25, 60, 68, 78, 108, 120, 135, 27, 54, 12, 24, 132, 136, 16, 73, 55, 98, 111, 94, 87, 38, 116, 125, 112, 45, 31, 83, 115, 97, 138, 47, 90, 104, 66, 9, 85, 63],
    MISLANGUAGE: [46, 21, 69, 91, 20, 86, 95, 118, 30, 129, 123, 121, 133, 117, 89, 18, 130, 14, 141, 19, 40, 59, 10, 102, 44, 22, 58, 76, 17, 110, 33, 127, 84, 96, 56, 128, 1, 70, 8, 0, 23, 74, 11, 48, 140, 80, 142]
};

export {
    config,
    storageKey,
    ALERT_ESCALATION_OPTIONS,
    ALERT_STATUS_OPTIONS,

    //  ISIS
    COMMUNICATION_ALERT_SOURCE_OPTIONS,
    COMMUNICATION_ALERT_STATUS_OPTIONS,
    ALERT_CATEGORIES
};
