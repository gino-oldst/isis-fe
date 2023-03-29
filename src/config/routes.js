import React from 'react';
import { downloadAllHistoricData } from '../api/communicationSearch';

const Login = React.lazy(() => import('../containers/Login/LoginContainer'));
const NotFound = React.lazy(() => import('../containers/NotFound/NotFoundContainer'));
const CommunicationAlerts = React.lazy(() => import('../containers/CommunicationAlerts/CommunicationAlertsContainer'));
const CommunicationAlertsDetail = React.lazy(() => import('../containers/CommunicationAlertsDetail/CommunicationAlertsDetailContainer'));
const CommunicationSearch = React.lazy(() => import('../containers/CommunicationSearch/CommunicationSearchContainer'));
const CommunicationPolicies = React.lazy(() => import('../containers/CommunicationPolicies/PoliciesContainer'));
const CommunicationPoliciesDetail = React.lazy(() => import('../containers/CommunicationPoliciesDetail/PoliciesDetailContainer'));

const Dashboard = React.lazy(() => import('../containers/Dashboard/DashboardContainer'));
// const Alerts = React.lazy(() => import('../containers/Alerts/AlertsContainer'));
// const Behaviours = React.lazy(() => import('../containers/Behaviours/BehavioursContainer'));
// const AlertDetail = React.lazy(() => import('../containers/AlertDetail/AlertDetailContainer'));
// const BehaviourDetail = React.lazy(() => import('../containers/BehaviourDetail/BehaviourDetailContainer'));
// const RestrictedList = React.lazy(() => import('../containers/RestrictedList/RestrictedListContainer'));
const CommunicationSearchResults = React.lazy(() => import('../containers/CommunicationSearchResults/CommunicationSearchResultsContainer'));
const CommunicationSearchMessageDetails = React.lazy(() => import('../containers/CommunicationSearchMessageDetails/CommunicationSearchMessageDetailsContainer'));
const Profiles = React.lazy(() => import('../containers/Profiles/ProfilesContainer'));
const ProfileDetail = React.lazy(() => import('../containers/ProfileDetail/ProfileDetailContainer'));
const HistoricIngestion = React.lazy(() => import('../containers/HistoricIngestion/HistoricIngestionContainer'));
// ROUTE IMPORT CODE GENERATOR INDICATOR DO NOT DELETE

const routes = [{
    // mostly this will be the landing page
    path: '/',
    exact: true,
    name: 'Login',
    component: Login
}, {
    path: '/login',
    name: 'Login',
    component: Login
}, {
    path: '/communication_alerts',
    name: 'Alerts',
    component: CommunicationAlerts,
    authedRoute: true
}, {
    path: '/communication_alerts_detail/:id',
    name: 'CommunicationAlertsDetail',
    component: CommunicationAlertsDetail,
    authedRoute: true
}, {
    path: '/communication_search',
    name: 'Search',
    component: CommunicationSearch,
    authedRoute: true
}, {
    path: '/communication_policies',
    name: 'Policies',
    component: CommunicationPolicies,
    authedRoute: true
}, {
    path: '/communication-policies-detail',
    name: 'PoliciesDetail',
    component: CommunicationPoliciesDetail,
    authedRoute: true
}, {
    path: '/communication_search_results',
    name: 'CommunicationSearchResults',
    component: CommunicationSearchResults,
    authedRoute: true
}, {
    path: '/communication_search_message_details',
    name: 'CommunicationSearchMessageDetails',
    component: CommunicationSearchMessageDetails,
    authedRoute: true
}, {
    path: '/profiles',
    name: 'Profiles',
    component: Profiles,
    authedRoute: true
}, {
    path: '/profile-detail',
    name: 'ProfileDetail',
    component: ProfileDetail,
    authedRoute: true
}, {
    path: '/historic_ingestion',
    name: 'HistoricIngestion',
    component: HistoricIngestion,
    authedRoute: true
}, {
    path: '*',
    name: NotFound,
    component: NotFound
}];

// {
//     path: '/dashboard',
//     name: Dashboard,
//     component: Dashboard,
//     authedRoute: true
// }, {
//     path: '/alerts',
//     name: 'Alerts',
//     component: Alerts,
//     authedRoute: true
// },
// {
//     path: '/behaviours',
//     name: 'Behaviours',
//     component: Behaviours,
//     authedRoute: true
// }, {
//     path: '/alert/:id',
//     name: 'AlertDetail',
//     component: AlertDetail,
//     authedRoute: true
// }, {
//     path: '/behaviour/:id',
//     name: 'BehaviourDetail',
//     component: BehaviourDetail,
//     authedRoute: true
// }, {
//     path: '/restricted_list',
//     name: 'RestrictedList',
//     component: RestrictedList,
//     authedRoute: true
// }, {
// ROUTE ENTRY CODE GENERATOR INDICATOR DO NOT DELETE

export default routes;
