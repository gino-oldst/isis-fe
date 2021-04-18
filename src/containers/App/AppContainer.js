import React from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import routes from '../../config/routes';
import AppLoadingContainer from '../AppLoading/AppLoadingContainer';
import AppModal from '../../components/base/Modal/Modal';
import FlashNotification from '../../components/modules/FlashNotification/FlashNotification';
import WrapperBackground from '../../components/base/WrapperBackground/WrapperBackground';
import Typography from '../../components/base/Typography/Typography';
import Navbar from '../../components/base/Navbar/Navbar';
import { clearModalContent } from '../../redux/modules/modalEvent';
import { setLoggingOut } from '../../redux/modules/authentication';
import navbarBrand from '../../assets/logos/mariana_logo.png';

import {
    Nav,
    UncontrolledDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
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
    const { isAuthed } = useSelector(({ authentication }) => authentication);

    const sidebarMenu = [{
        label: 'Dashboard',
        onClick: () => history.push('/dashboard'),
        key: 'dashboard'
    }, {
        label: 'Alerts',
        onClick: () => history.push('/alerts'),
        key: 'alerts'
    }, {
        label: 'Behaviours',
        onClick: () => history.push('/behaviours'),
        key: 'behaviours'
    }];

    const handleCloseModal = () => {
        dispatch(clearModalContent());
        onToggle && onToggle();

        // To show modal, do this something like this:
        // dispatch(setModalContent({
        //     modalContent: <LoginContainer />,
        //     title: 'Login'
        // }));
    };

    const NavbarLinks = () => {
        return (
            <Nav className='navlinks-right'>
                <UncontrolledDropdown nav={true} direction='down' className='d-flex align-self-center mr-4'>
                    <Notifications />
                </UncontrolledDropdown>
                <UncontrolledDropdown nav={true} direction='down' className='mr-4'>
                    <NavbarAccount />
                </UncontrolledDropdown>
            </Nav>
        );
    };

    return (
        <AppLoadingContainer>
            <div id='outer-container'>
                {/* {isAuthed && <Navbar navbarBrand={navbarBrand}><NavbarLinks /></Navbar>} */}
                {<Navbar navbarBrand={navbarBrand}><NavbarLinks /></Navbar>}
                <React.Suspense fallback={loading()}>
                    <Switch>
                        {routes.map((route, i) => (
                            route.authedRoute
                                ? <PrivateRoute key={i} {...route} sidebarMenu={sidebarMenu}
                                    handleCloseModal={handleCloseModal}
                                    isAuthed={isAuthed} />
                                : <RouteWithSubRoutes key={i} {...route} handleCloseModal={handleCloseModal} />
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

const Notifications = () => {
    return (
        <div className='navbar__notifications'>
            <DropdownToggle nav={true} className='d-flex'>
                <FontAwesomeIcon className='navbar__notification-bell' icon='bell' size='lg'
                    color='gray' />
            </DropdownToggle>
            <DropdownMenu right={true} className='mt-2 pb-4 navbar__navbar__notifications-dropdown'>
                <DropdownItem header={true} tag='div' style={{ cursor: 'default' }}>
                    <Typography weight='semi-bold' className='py-2 pb-4'>Notifications</Typography>
                </DropdownItem>
            </DropdownMenu>
        </div>
    );
};

const NavbarAccount = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.clear();
        dispatch(setLoggingOut());
        history.push('/login');
    };

    return (
        <div className='navbar__account'>
            <DropdownToggle nav={true} className='d-flex'>
                <FontAwesomeIcon className='navbar__user-icon' icon='user-circle' size='lg'
                    color='gray' />
            </DropdownToggle>
            <DropdownMenu right={true}>
                <DropdownItem onClick={() => history.push('/reset-password')}>
                    Change Password
                </DropdownItem>
                <DropdownItem onClick={logout}>
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </div>
    );
};

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes({ component: Component, handleCloseModal, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => (
                // pass the sub-routes down to keep nesting
                <Component {...props} routes={props.routes} handleCloseModal={handleCloseModal} />
            )} />
    );
}

function PrivateRoute({ component: Component, isAuthed, sidebarMenu, handleCloseModal, ...rest }) {
    return (
        <Route {...rest} render={(routeProps) => (
            <Component {...routeProps} sidebarMenu={sidebarMenu} handleCloseModal={handleCloseModal} />
            // isAuthed
            //     ? <Component {...routeProps} sidebarMenu={sidebarMenu} handleCloseModal={handleCloseModal} />
            //     : <Redirect to={{
            //         pathname: '/login',
            //         state: { from: routeProps.location }
            //     }}/>
        )}/>
    );
}

export default App;
