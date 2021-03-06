import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import { createStore , combineReducers , compose , applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import * as sagaWatcher from './store/sagas/index';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import user from './store/reducers/user';
import post from './store/reducers/post';
import activity from './store/reducers/activity';
import connect from './store/reducers/connect';

import AppBootstrap from './AppBootstrap'

const composeEnhancers = 
process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined
? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
: null || compose;

const rootReducer = combineReducers({
    user, post, activity, connect    
});

const sagaMiddleWare = createSagaMiddleware();
const store = createStore( rootReducer , composeEnhancers(applyMiddleware(thunk , sagaMiddleWare)) );
sagaMiddleWare.run(sagaWatcher.watchAuth);
sagaMiddleWare.run(sagaWatcher.watchPost);
sagaMiddleWare.run(sagaWatcher.watchActivity);
sagaMiddleWare.run(sagaWatcher.watchConnect);

let appBootstrap = new AppBootstrap(store);

const app = (
    <BrowserRouter>
        <Provider store={store}><App /></Provider>
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
