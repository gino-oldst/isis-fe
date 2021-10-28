// env config
const config = {
    apiUrl: process.env.REACT_APP_API_HOST,
    apiXApiKey: process.env.REACT_APP_X_API_KEY,
    apiSecretKey: process.env.REACT_APP_SECRET_KEY,
    oauth2Url: process.env.REACT_APP_OAUTH2_URL,
    adminApplAuthHeader: process.env.REACT_APP_ADMIN_APP_AUTH_HEADER,
    environmentName: process.env.REACT_APP_ENVIRONMENT_NAME
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

export {
    config,
    storageKey,
    ALERT_ESCALATION_OPTIONS,
    ALERT_STATUS_OPTIONS
};
