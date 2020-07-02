const initialState = {
   isLoading: true,
   isLoadingComments: true,
   description: null,
   content: null,
   comments: null,
   error: false
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
            description: action.payload.description,
            content: action.payload.content,
            comments: action.payload.comments
         };

      default:
         return state;
   }
};
