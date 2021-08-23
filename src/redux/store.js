import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import * as rootReducer from './reducers';

export const history = createBrowserHistory();

const reducers = combineReducers({
    router: connectRouter(history),
    ...rootReducer
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['dashboard']
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default function configureAppStore(preloadedState) {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: [thunk, routerMiddleware(history), ...getDefaultMiddleware({ serializableCheck: false })],
        devTools: process.env.NODE_ENV !== 'production',
        preloadedState
    });

    return store;
}
