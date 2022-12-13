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
    versionName: process.env.REACT_APP_VERSION_VALUE,
    openSearchUrl: process.env.REACT_APP_OPEN_SEARCH_URL,
    openSearchAuthHeader: process.env.REACT_APP_OPEN_SEARCH_AUTH_HEADER
};

// keys for localstorage
const storageKey = {
    user: 'user',
    accessToken: 'accessToken',
    onboard: 'onboard',
    tokenValidUntil: 'tokenValidUntil',
    sidebarState: 'sidebarState',
    alertSearchParams: 'alertSearchParams',
    searchParams: 'searchParams',
    tempUpdatedInDetails: 'tempUpdatedInDetails',
    tempSorted: 'sorted'
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

const MESSAGE_TYPE = {
    JOIN: 'Join',
    LEAVE: 'Leave'
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

const COMMUNICATION_ALERT_ESCALATIONS_OPTIONS = {
    BASE: 'BASE',
    MANAGER: 'MANAGER',
    CO: 'CO'
};

const ALERT_CATEGORIES = {
    MARKET_ABUSE: [8, 34, 26, 24, 31, 7, 38, 1, 12, 21, 19, 22, 10, 29, 40, 5, 3, 36, 37, 15, 2, 35, 20, 28, 6, 41, 32, 42, 17, 16, 44, 43, 14, 13, 25, 33, 9, 18, 23, 30, 11, 4, 39, 27],
    CONDUCT: [74, 69, 77, 46, 64, 56, 63, 47, 70, 54, 67, 75, 52, 60, 65, 49, 72, 66, 73, 51, 53, 50, 68, 71, 58, 45, 59, 61, 62, 76, 57, 55, 48],
    MISLANGUAGE: [80, 88, 125, 127, 140, 141, 142, 89, 82, 117, 79, 81, 121, 130, 83, 78, 132, 128, 116, 99, 109, 120, 136, 92, 104, 95, 84, 118, 100, 97, 101, 96, 113, 86, 108, 93, 98, 105, 115, 106, 129, 139, 110, 103, 133, 114, 126, 135, 91, 107, 87, 112, 131, 134, 122, 137, 90, 119, 124, 102, 94, 111, 138, 85, 123],
    _marketAbuse: ['avertir', 'avoir une info', 'Banged the drum', 'Banging the drum', 'caché', 'confidential', 'confidentiel', 'Dodgy', 'Frontran', 'Frontranfronran', 'Frontrun', 'hidden', 'Hint', 'info', 'information privilégiée', 'informer', 'Inside Information', 'Layered', 'Layering', 'Mark the close', 'Mark the open', 'Marking the close', 'Marking the open', 'non public', 'non publique', 'not public', 'Painted the tape', 'Painting the tape', 'privacy', 'privileged', 'privilégié', 'Pump and dump', 'Rmor', 'Rumor', 'Secret', 'Spoof', 'Spoofed', 'Spoofing', 'Tip', 'Tip-off', 'Tipped off', 'Trash and cash', 'Wash', 'wash trade'],
    _conduct: ['Bribe', 'Compliance', 'Facebook', 'FCB', 'Fcebook', 'Gift', 'Insta', 'Instagram', 'Issue', 'Laundering', 'message vocal', 'Messenger', 'Mobile', 'Money Laundering', 'msg vocal', 'mssger', 'Sanction', 'Sanctioned', 'Signal', 'Sms', 'Snap', 'Snapchat', 'Tele', 'Telegram', 'Vocal', 'vocal message', 'vocal msg', 'vocalmsg', 'voice message', 'voice msg', 'voicemsg', 'WhatsApp', 'WS'],
    _mislanguage: ['Abruti', 'Arse', 'Arsehole', 'Asshole', 'Bastard', 'Batard', 'batarde', 'Bitch', 'Bordel', 'cabron', 'Capullo', 'Casse couilles', 'Coma mierde', 'Con', 'Connard', 'Connasse', 'Conne', 'Cono', 'Coño de su madre', 'Cunt', 'Dork', 'enclé', 'Enculé', 'Enfoiré', 'f**k', 'F*cl', 'FDP', 'Feignasse', 'Fils de pute', 'Fuck', 'Fuckface', 'Fvck', 'Gilipollas', 'Hija de puta', 'Hijo de puta', 'Jerk', 'JODER', 'Knob', 'MARICÓN', 'Me cago en', 'Me cago en tí', 'Merde', 'mierda', 'Motherfucker', 'Nique sa mère', 'No me jodas', 'NTM', 'Pendejo', 'Piece of shit', 'Piss Off', 'Pouffiasse', 'PUTA MADRE', 'Puta madre', 'Putain', 'Pute', 'Raclure', 'Sac à merde', 'Salope', 'Scumbag', 'Shit', 'Tocard', 'Tocarde', 'Trou du cul', 'Twit', 'Vete a la mierda', 'Wanker']
};

export {
    config,
    storageKey,
    ALERT_ESCALATION_OPTIONS,
    ALERT_STATUS_OPTIONS,

    //  ISIS
    COMMUNICATION_ALERT_SOURCE_OPTIONS,
    COMMUNICATION_ALERT_STATUS_OPTIONS,
    COMMUNICATION_ALERT_ESCALATIONS_OPTIONS,
    ALERT_CATEGORIES,
    MESSAGE_TYPE
};
