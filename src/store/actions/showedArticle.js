import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

const LOADING_ARTICLE_BEGIN = 'LOADING_ARTICLE_BEGIN';
const LOADING_ARTICLE_FAILED = 'LOADING_ARTICLE_FAILED';
const LOADING_ARTICLE_SUCCESS = 'LOADING_ARTICLE_SUCCESS';

const SEND_COMMENT_BEGIN = 'SEND_COMMENT_BEGIN';
const SEND_COMMENT_FAILED = 'SEND_COMMENT_FAILED';
const SEND_COMMENT_SUCCESS = 'SEND_COMMENT_SUCCESS';
const SEND_LIKE = 'SEND_LIKE';
const SEND_LIKE_DONE = 'SEND_LIKE_DONE';
const SEND_LIKE_ARTICLE = 'SEND_LIKE_ARTICLE';
const SEND_LIKE_ARTICLE_DONE = 'SEND_LIKE_ARTICLE_DONE';
const DELETE_COMMENT = 'DELETE_COMMENT';
const DELETE_COMMENT_DONE = 'DELETE_COMMENT_DONE';

// ПОЛУЧИТЬ КОНТЕНТ СТАТЬИ
export function getViewedArticle(type, id) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: LOADING_ARTICLE_BEGIN });
      if (type === 'articles' || type === 'reviews' || type === 'news') {
         const getArtilce = firebase.functions.httpsCallable('getArticle');
         const gettingArticleResult = await getArtilce({ type, id });
         if (gettingArticleResult.data.result === null) dispatch({ type: LOADING_ARTICLE_FAILED });
         else {
            dispatch({
               type: LOADING_ARTICLE_SUCCESS,
               payload: {
                  content: gettingArticleResult.data.result.content.content
               }
            });
         }
      } else {
         dispatch({ type: LOADING_ARTICLE_FAILED });
      }
   };
}

// Отправить комментарий
export function sendComment(text, articleId) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: SEND_COMMENT_BEGIN });
      if (text.length > 0 && text.length <= 200) {
         const sendComment = firebase.functions.httpsCallable('sendComment');
         const sendCommentResult = await sendComment({ text, articleId });
         console.log(sendCommentResult);
         if (sendCommentResult.data.result === 'success') {
            dispatch({
               type: SEND_COMMENT_SUCCESS
            });
         }
      } else {
         dispatch({ type: SEND_COMMENT_FAILED });
      }
   };
}

// ПОСТАВИТЬ ЛАЙК КОММЕНТУ
export function likeComment(commentId, articleId) {
   return async (dispatch, getState) => {
      dispatch({ type: SEND_LIKE, payload: { type: 'like', id: commentId } });
      const { firebase } = getState();
      const likeComment = firebase.functions.httpsCallable('likeComment');
      const likeCommentResult = await likeComment({ commentId, articleId });
      console.log(likeCommentResult);
      dispatch({ type: SEND_LIKE_DONE });
   };
}

// ПОСТАВИТЬ ДИЗЛАЙК КОММЕНТУ
export function dislikeComment(commentId, articleId) {
   return async (dispatch, getState) => {
      dispatch({ type: SEND_LIKE, payload: { type: 'dislike', id: commentId } });
      const { firebase } = getState();
      const dislikeComment = firebase.functions.httpsCallable('dislikeComment');
      const dislikeCommentResult = await dislikeComment({ commentId, articleId });
      console.log(dislikeCommentResult);
      dispatch({ type: SEND_LIKE_DONE });
   };
}

// УДАЛИТЬ КОММЕНТАРИЙ
export function deleteComment(commentId, articleId) {
   return async (dispatch, getState) => {
      dispatch({ type: DELETE_COMMENT, payload: commentId });
      const { firebase } = getState();
      const deleteComment = firebase.functions.httpsCallable('deleteComment');
      const deleteCommentResult = await deleteComment({ commentId, articleId });
      console.log(deleteCommentResult);
      dispatch({ type: DELETE_COMMENT_DONE });
   };
}

// ПОСТАВИТЬ ДИЗЛАЙК СТАТЬЕ
export function dislikeArticle(articleId) {
   return async (dispatch, getState) => {
      dispatch({ type: SEND_LIKE_ARTICLE, payload: 'dislike' });
      const { firebase } = getState();
      const dislikeArticle = firebase.functions.httpsCallable('dislikeArticle');
      const dislikeArticleResult = await dislikeArticle({ articleId });
      console.log(dislikeArticleResult);
      dispatch({ type: SEND_LIKE_ARTICLE_DONE });
   };
}

// ПОСТАВИТЬ ЛАЙК СТАТЬЕ
export function likeArticle(articleId) {
   return async (dispatch, getState) => {
      dispatch({ type: SEND_LIKE_ARTICLE, payload: 'like' });
      const { firebase } = getState();
      const likeArticle = firebase.functions.httpsCallable('likeArticle');
      const likeArticleResult = await likeArticle({ articleId });
      console.log(likeArticleResult);
      dispatch({ type: SEND_LIKE_ARTICLE_DONE });
   };
}

// ДОБАВИТЬ ПРОСМОТР СТАТЬИ
export function addView(articleId) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      const addView = firebase.functions.httpsCallable('addView');
      addView({ articleId });
   };
}
