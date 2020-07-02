import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

const LOADING_ARTICLE_BEGIN = 'LOADING_ARTICLE_BEGIN';
const LOADING_ARTICLE_FAILED = 'LOADING_ARTICLE_FAILED';
const LOADING_ARTICLE_SUCCESS = 'LOADING_ARTICLE_SUCCESS';

// ПОЛУЧИТЬ КОНТЕНТ СТАТЬИ
export function getViewedArticle(type, id) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: LOADING_ARTICLE_BEGIN });
      if (type === 'article' || type === 'review' || type === 'news') {
         const getArtilce = firebase.functions.httpsCallable('getArticle');
         const gettingArticleResult = await getArtilce({ type, id });
         if (gettingArticleResult.data.result === null) dispatch({ type: LOADING_ARTICLE_FAILED });
         else {
            dispatch({
               type: LOADING_ARTICLE_SUCCESS,
               payload: {
                  description: gettingArticleResult.data.result.description,
                  content: gettingArticleResult.data.result.content.content,
                  comments: gettingArticleResult.data.result.comments
               }
            });
         }
      } else {
         dispatch({ type: LOADING_ARTICLE_FAILED });
      }
   };
}
