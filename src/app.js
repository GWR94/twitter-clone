import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routes/AppRouter';
import './styles/styles.scss';
import LoadingPage from './components/LoadingPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import {composeWithDevTools} from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import reducers from './reducers/index';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(reduxThunk)));

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));
renderApp();