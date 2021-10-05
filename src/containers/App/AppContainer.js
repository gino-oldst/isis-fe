import React from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import routes from '../../config/routes';
import AppLoadingContainer from '../AppLoading/AppLoadingContainer';
import AppModal from '../../components/base/Modal/Modal';
import FlashNotification from '../../components/modules/FlashNotification/FlashNotification';
import WrapperBackground from '../../components/base/WrapperBackground/WrapperBackground';
import Navbar from '../../components/base/Navbar/Navbar';
import Notifications from '../../containers/Notifications/NotificationsContainer';
import { clearModalContent } from '../../redux/modules/modalEvent';
import { setLoggingOut } from '../../redux/modules/authentication';
import navbarBrand from '../../assets/logos/mariana_logo.png';
import './app.scss';

import {
    Nav,
    UncontrolledDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const loading = () => (
    <WrapperBackground>
        <Spinner animation='border' role='status'>
            <span className='sr-only'>Loading...</span>
        </Spinner>
    </WrapperBackground>
);

function App() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { modalContent, onToggle, ...modalEvent } = useSelector(({ modalEvent }) => modalEvent);
    const { isAuthed, profileData } = useSelector(({ authentication }) => authentication);

    const sidebarMenu = [{
        label: 'Dashboard',
        onClick: () => {
            history.push('/dashboard');
        },
        key: 'dashboard'
    }, {
        label: 'Alerts',
        onClick: () => {
            history.push('/alerts');
        },
        key: 'alert'
    }, {
        label: 'Behaviours',
        onClick: () => {
            history.push('/behaviours');
        },
        key: 'behaviour'
    }, {
        label: 'Restricted List',
        onClick: () => {
            history.push('/restricted_list');
        },
        key: 'restricted_list'
    }];

    const handleCloseModal = () => {
        dispatch(clearModalContent());
        onToggle && onToggle();
    };

    const NavbarLinks = () => {
        return (
            <Nav className='navlinks-right'>
                <Notifications eventTypes='click' />
                <UncontrolledDropdown nav={true} direction='down' className='mr-4'>
                    <NavbarAccount />
                </UncontrolledDropdown>
            </Nav>
        );
    };

    return (
        <AppLoadingContainer>
            <div id='outer-container'>
                {isAuthed && <Navbar navbarBrand={navbarBrand}><NavbarLinks /></Navbar>}
                <React.Suspense fallback={loading()}>
                    <Switch>
                        {routes.map((route, i) => (
                            route.authedRoute
                                ? <PrivateRoute key={i} {...route} sidebarMenu={sidebarMenu}
                                    handleCloseModal={handleCloseModal} userId={profileData.userId}
                                    useMediaQuery={useMediaQuery} isAuthed={isAuthed} />
                                : <RouteWithSubRoutes key={i} {...route} isAuthed={isAuthed}
                                    handleCloseModal={handleCloseModal} />
                        ))}
                    </Switch>
                </React.Suspense>
            </div>

            <FlashNotification/>
            <AppModal
                {...modalEvent}
                isShow={!!modalContent}
                onToggle={handleCloseModal}>
                {modalContent}
            </AppModal>
        </AppLoadingContainer>
    );
}

const NavbarAccount = () => {
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.clear();
        dispatch(setLoggingOut());
        window.location.href = '/login';
    };

    return (
        <div className='navbar__account'>
            <DropdownToggle nav={true} className='d-flex'>
                <FontAwesomeIcon className='navbar__user-icon' icon='user-circle' size='lg'
                    color='gray' />
            </DropdownToggle>
            <DropdownMenu right={true}>
                <DropdownItem className='px-4 py-2' onClick={logout}>
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </div>
    );
};

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes({ component: Component, isAuthed, handleCloseModal, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => (
                isAuthed
                    ? <Redirect to={{
                        pathname: '/dashboard',
                        state: { from: props.location }
                    }}/>
                    : <Component {...props} routes={props.routes} handleCloseModal={handleCloseModal} />
            )} />
    );
}

function PrivateRoute({ component: Component, userId, useMediaQuery, isAuthed, sidebarMenu, handleCloseModal, ...rest }) {
    return (
        <Route {...rest} render={(routeProps) => (
            isAuthed
                ? <Component {...routeProps} userId={userId} sidebarMenu={sidebarMenu}
                    useMediaQuery={useMediaQuery}handleCloseModal={handleCloseModal} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: routeProps.location }
                }}/>
        )}/>
    );
}

export default App;
