const initialState = {
   isLoading: true,
   content: null,
   commentIsSending: false,
   error: false,
   errorComments: false,
   isLikingComment: null,
   isLikingArticle: null,
   isDeletingComment: null
};

export const showedArticleReducer = (state = initialState, action) => {
   switch (action.type) {
      case 'LOADING_ARTICLE_BEGIN':
         return {
            ...state,
            isLoading: true
         };
      case 'LOADING_ARTICLE_FAILED':
         return {
            ...state,
            isLoading: false,
            error: true
         };
      case 'LOADING_ARTICLE_SUCCESS':
         return {
            ...state,
            isLoading: false,
            error: false,
            content: action.payload.content
         };

      case 'SEND_COMMENT_BEGIN':
         return {
            ...state,
            errorComments: false,
            commentIsSending: true
         };

      case 'SEND_COMMENT_FAILED':
         return {
            ...state,
            errorComments: true,
            commentIsSending: false
         };
      case 'SEND_COMMENT_SUCCESS':
         return {
            ...state,
            commentIsSending: false
         };
      case 'SEND_LIKE':
         return {
            ...state,
            isLikingComment: { ...action.payload }
         };
      case 'SEND_LIKE_DONE':
         return {
            ...state,
            isLikingComment: null
         };

      case 'DELETE_COMMENT':
         return {
            ...state,
            isDeletingComment: action.payload
         };
      case 'DELETE_COMMENT_DONE':
         return {
            ...state,
            isDeletingComment: null
         };
      case 'SEND_LIKE_ARTICLE':
         return {
            ...state,
            isLikingArticle: action.payload
         };
      case 'SEND_LIKE_ARTICLE_DONE':
         return {
            ...state,
            isLikingArticle: null
         };
      default:
         return state;
   }
};
