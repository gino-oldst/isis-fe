import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import * as rootReducer from './reducers';

export const history = createBrowserHistory();

export default function configureAppStore(preloadedState) {
    const store = configureStore({
        reducer: { router: connectRouter(history), ...rootReducer },
        middleware: [thunk, routerMiddleware(history), ...getDefaultMiddleware({ serializableCheck: false })],
        devTools: process.env.NODE_ENV !== 'production',
        preloadedState
    });

    return store;
}
