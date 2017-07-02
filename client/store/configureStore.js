import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import rootReducer from '../reducers'


export default function configureStore(initialState) {
  return createStore(rootReducer,
    compose(
      applyMiddleware(thunk, promise),
      window.devToolsExtension ? window.devToolsExtension() :
      f => f
     ));
}