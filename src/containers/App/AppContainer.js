import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import routes from '../../config/routes';
import AppLoadingContainer from '../AppLoading/AppLoadingContainer';
import AppModal from '../../components/base/Modal/Modal';
import FlashNotification from '../../components/modules/FlashNotification/FlashNotification';
import WrapperBackground from '../../components/base/WrapperBackground/WrapperBackground';
import Navbar from '../../components/base/Navbar/Navbar';
import { clearModalContent } from '../../redux/modules/modalEvent';

const loading = () => (
    <WrapperBackground>
        <Spinner animation='border' role='status'>
            <span className='sr-only'>Loading...</span>
        </Spinner>
    </WrapperBackground>
);

function App() {
    const dispatch = useDispatch();
    const { modalContent, onToggle, ...modalEvent } = useSelector(({ modalEvent }) => modalEvent);
    const { isAuthed } = useSelector(({ authentication }) => authentication);

    const handleCloseModal = () => {
        dispatch(clearModalContent());
        onToggle && onToggle();

        // To show modal, do this something like this:
        // dispatch(setModalContent({
        //     modalContent: <LoginContainer />,
        //     title: 'Login'
        // }));
    };

    return (
        <AppLoadingContainer>
            <div id='outer-container'>
                {isAuthed && <Navbar />}
                <React.Suspense fallback={loading()}>
                    <Switch>
                        {routes.map((route, i) => (
                            route.authedRoute
                                ? <PrivateRoute key={i} {...route} handleCloseModal={handleCloseModal}
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

function PrivateRoute({ component: Component, isAuthed, handleCloseModal, ...rest }) {
    return (
        <Route {...rest} render={(routeProps) => (
            isAuthed
                ? <Component {...routeProps} handleCloseModal={handleCloseModal} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: routeProps.location }
                }}/>
        )}/>
    );
}

export default App;
