import React from 'react';

const Login = React.lazy(() => import('../containers/Login/LoginContainer'));
const NotFound = React.lazy(() => import('../containers/NotFound/NotFoundContainer'));
const Dashboard = React.lazy(() => import('../containers/Dashboard/DashboardContainer'));
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
    path: '/dashboard',
    name: Dashboard,
    component: Dashboard,
    authedRoute: true
}, // ROUTE ENTRY CODE GENERATOR INDICATOR DO NOT DELETE
{
    path: '*',
    name: NotFound,
    component: NotFound
}];

export default routes;
