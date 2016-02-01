import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import { syncHistory, routeReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import * as reducers from './reducers';
import createMiddleware from './middleware/clientMiddleware';
import { App, AlterationSummarizer } from './components';

const history = useRouterHistory(createHistory)();
const historyMiddleware = syncHistory(history);
const reducer = combineReducers({
  ...reducers,
  form: formReducer,
  routing: routeReducer
});

const finalCreateStore = applyMiddleware(historyMiddleware, createMiddleware(reducer))(createStore);
const store = finalCreateStore(reducer);
historyMiddleware.listenForReplays(store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={AlterationSummarizer}/>
        </Route>
      </Router>
    </div>
  </Provider>,
  document.getElementById('root')
);
