// env config
const config = {
    apiUrl: process.env.REACT_APP_API_HOST,
    apiXApiKey: process.env.REACT_APP_X_API_KEY,
    apiSecretKey: process.env.REACT_APP_SECRET_KEY,
    oauth2Url: process.env.REACT_APP_OAUTH2_URL,
    userService: 'user-service/',
    coreService: 'core-service/',
    clientService: 'client-service/',
    adminApplAuthHeader: process.env.REACT_APP_ADMIN_APP_AUTH_HEADER,
    environmentName: process.env.REACT_APP_ENVIRONMENT_NAME
};

// keys for localstorage
const storageKey = {
    accessToken: 'accessToken',
    onboard: 'onboard',
    tokenValidUntil: 'tokenValidUntil',
    sidebarState: 'sidebarState'
};

export {
    config,
    storageKey
};
