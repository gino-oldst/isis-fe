import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import routes from '../../config/routes';
import AppLoadingContainer from '../AppLoading/AppLoadingContainer';
import AppModal from '../../components/base/Modal/Modal';
import FlashNotification from '../../components/modules/FlashNotification/FlashNotification';
import WrapperBackground from '../../components/base/WrapperBackground/WrapperBackground';
import Typography from '../../components/base/Typography/Typography';
import Badge from '../../components/base/Badge/Badge';
import Tooltip from '../../components/base/Tooltip/Tooltip';
import Navbar from '../../components/base/Navbar/Navbar';
import { clearModalContent } from '../../redux/modules/modalEvent';
import { setLoggingOut } from '../../redux/modules/authentication';
import navbarBrand from '../../assets/logos/mariana_logo.png';
import bellIcon from '../../assets/images/ic_bell-solid-white.svg';
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
    const { data } = useSelector(({ notifications }) => notifications);
    const { isAuthed } = useSelector(({ authentication }) => authentication);
    const [todaysNotification, setTodaysNotification] = useState({});
    const [yesterdaysNotification, setYesterdaysNotification] = useState({});

    useEffect(() => {
        const today = [];
        const yesterday = [];

        data.map(notif => {
            return moment(notif.date).isSame(moment(), 'day')
                ? today.push(notif)
                : yesterday.push(notif);
        });

        setTodaysNotification(today);
        setYesterdaysNotification(yesterday);
    }, []);

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
                    <Notifications today={todaysNotification} yesterday={yesterdaysNotification} />
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

const Notifications = ({
    today,
    yesterday
}) => {
    return (
        <div className='navbar__notifications'>
            <DropdownToggle nav={true} className='d-flex'>
                <FontAwesomeIcon className='navbar__notification-bell' icon='bell' size='lg'
                    color='gray' />
            </DropdownToggle>
            <DropdownMenu right={true} className='mt-2 navbar__notifications-dropdown'>
                <div className='navbar__notifications-title px-4 pt-2'>
                    <Typography color='color-3' weight='semi-bold' variant='size-16'
                        className='mb-2'>Notifications</Typography>
                </div>
                <div className='navbar__notifications-today'>
                    <div className='navbar__notifications-today-title px-4 py-1'>
                        <Typography color='color-3' weight='light' variant='size-10'>TODAY</Typography>
                    </div>
                    {today.map(now => {
                        return (
                            <>
                                <DropdownItem className='px-4 py-4 d-flex align-items-center'>
                                    <div className='navbar__notifications__icon'>
                                        <img src={bellIcon} alt='Notification_Bell_Icon' className='notification_icon' />
                                    </div>
                                    <div className='navbar__notifications__details mr-auto'>
                                        <Typography color='color-3' variant='size-14' weight='semi-bold'
                                            className='mb-2'>{now.description}</Typography>
                                        <Typography color='color-3' variant='size-16' className='mb-2'>
                                            <span className='mr-3'>{now.identifier} | {now.behaviour}</span>
                                            <Badge status={now.status} />
                                        </Typography>
                                        <Typography color='color-3' variant='size-12' className='text-muted'>Today, {moment(now.date).format('hh:mm a')}</Typography>
                                    </div>
                                    <div className='navbar__notifications__read-icon mr-2'>
                                        <FontAwesomeIcon className='navbar__notification-read' icon='circle' size='xs'
                                            data-tip={true} data-for='notif-1'/>
                                    </div>
                                    <Tooltip place='left' id='notif-1'>
                                        <Typography variant='size-10' weight='light' color='color-3'>{now.resolved ? 'Unread' : 'Mark as read'}</Typography>
                                    </Tooltip>
                                </DropdownItem>
                            </>
                        );
                    })}
                </div>
                <div className='navbar__notifications-past'>
                    <div className='navbar__notifications-past-title px-4 py-1'>
                        <Typography color='color-3' weight='light' variant='size-10'>YESTERDAY AND EARLIER</Typography>
                    </div>
                    {yesterday.map(yes => {
                        return (
                            <DropdownItem className='px-4 py-4 d-flex align-items-center'>
                                <div className='navbar__notifications__icon'>
                                    <img src={bellIcon} alt='Notification_Bell_Icon' className='notification_icon' />
                                </div>
                                <div className='navbar__notifications__details mr-auto'>
                                    <Typography color='color-3' variant='size-14' weight='semi-bold'
                                        className='mb-2'>{yes.description}</Typography>
                                    <Typography color='color-3' variant='size-16' className='mb-2'>
                                        <span className='mr-3'>{yes.identifier} | {yes.behaviour}</span>
                                        <Badge status={yes.status} />
                                    </Typography>
                                    <Typography color='color-3' variant='size-12' className='text-muted'>{moment(yes.date).format('DD MMM yyyy, hh:mm a')}</Typography>
                                </div>
                                <div className='navbar__notifications__read-icon mr-2'>
                                    <FontAwesomeIcon className='navbar__notification-read' icon='circle' size='xs'
                                        data-tip={true} data-for='notif-2'/>
                                </div>
                                <Tooltip place='left' id='notif-2'>
                                    <Typography variant='size-10' weight='light' color='color-3'>{yes.resolved ? 'Unread' : 'Mark as read'}</Typography>
                                </Tooltip>
                            </DropdownItem>
                        );
                    })}
                </div>
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
                <DropdownItem className='px-4 py-2' onClick={() => history.push('/reset-password')}>
                    Change Password
                </DropdownItem>
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
