// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faBell, faCircle, faSort, faEdit, faCircleNotch, faUserCircle, faFilter, faFileDownload, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './redux/store';
import App from './containers/App/AppContainer';
import reportWebVitals from './utils/reportWebVitals';
import './styles/styles.scss';

const store = configureStore();

library.add(fab, faBell, faSort, faEdit, faCircle, faCircleNotch, faUserCircle, faFilter, faFileDownload, faCalendarAlt, faTimes);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App history={history}/>
            </ConnectedRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
