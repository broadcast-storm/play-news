import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from '@reducers/index';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';
// import { firebaseMiddleware } from '@actions/firebase';

export const store = createStore(
   rootReducer,
   applyMiddleware(
      thunk
      // logger
      // firebaseMiddleware
   )
);
