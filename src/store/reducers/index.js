import { combineReducers } from 'redux';
import { firebaseReducer } from './firebaseReducer';
import { showedArticleReducer } from './showedArticleReducer';

export const rootReducer = combineReducers({
   firebase: firebaseReducer,
   showedArticle: showedArticleReducer
});
