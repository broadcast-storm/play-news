const initialState = {
   initDone: false,
   initialized: false,
   isLoadingSignIn: false,
   donePasswordReset: false,
   loginSuccess: false,
   errorSignIn: null,
   isLoadingSmall: false,
   error: null,
   // Необходимая конфигурация для использования Firebase
   firebaseConfig: {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_APP_ID
   },
   auth: null,
   db: null,
   functions: null,
   storage: null,
   storageRef: null,
   usersPhotoRef: null,
   defaultUserRef: null,
   authUser: null,
   viewedUserLoading: true,
   viewedUserOpenInfo: null,
   viewedUserSecureInfo: null,
   viewedUserPhoto: null,
   userInfoUpdating: false,
   navbarInfoLoading: false,
   navbarInfo: null,
   isPublishing: false,
   isDeletingDraft: false,
   isOpeningDraft: false,
   draft: null
};

export const firebaseReducer = (state = initialState, action) => {
   switch (action.type) {
      case 'INIT':
         return {
            ...state,
            auth: action.payload.auth,
            db: action.payload.db,
            functions: action.payload.functions,
            storage: action.payload.storage,
            storageRef: action.payload.storageRef,
            usersPhotoRef: action.payload.usersPhotoRef,
            defaultUserRef: action.payload.defaultUserRef,
            initDone: true
         };
      case 'LOGIN_SUCCESS':
         return {
            ...state,
            loginSuccess: true
         };
      case 'CHANGE_AUTH_USER':
         if (state.initialized)
            return {
               ...state,
               authUser: action.payload.authUser
            };
         else {
            if (action.payload.authUser !== null) {
               return {
                  ...state,
                  authUser: action.payload.authUser,
                  initialized: true,
                  loginSuccess: true
               };
            } else {
               return {
                  ...state,
                  authUser: action.payload.authUser,
                  initialized: true,
                  navbarInfoLoading: false
               };
            }
         }
      case 'SIGNIN_LOADING_BEGIN':
         return {
            ...state,
            isLoadingSignIn: true,
            errorSignIn: null,
            donePasswordReset: false
         };
      case 'SIGNIN_LOADING_END':
         return {
            ...state,
            isLoadingSignIn: false
         };
      case 'SIGNIN_ERROR':
         return {
            ...state,
            isLoadingSignIn: false,
            errorSignIn: action.payload.text
         };
      case 'DONE_PASSW_RESET':
         return {
            ...state,
            donePasswordReset: true
         };
      case 'SIGN_OUT':
         return {
            ...state,
            loginSuccess: false,
            authUser: null,
            viewedUserLoading: true,
            viewedUserOpenInfo: null,
            viewedUserSecureInfo: null,
            viewedUserPhoto: null,
            userInfoUpdating: false,
            navbarInfoLoading: false,
            navbarInfo: null
         };
      case 'VIEWED_USER_INFO_LOADING':
         return {
            ...state,
            viewedUserLoading: true
         };
      case 'NAVBAR_USER_INFO_LOADING':
         return {
            ...state,
            navbarInfoLoading: true
         };
      case 'VIEWED_USER_INFO_LOADED':
         return {
            ...state,
            viewedUserLoading: false,
            viewedUserOpenInfo: action.payload.openInfo,
            viewedUserSecureInfo: action.payload.secureInfo,
            viewedUserPhoto: action.payload.userPhoto
         };
      case 'NAVBAR_USER_INFO_LOADED':
         if (action.payload === null)
            return {
               ...state,
               navbarInfoLoading: false,
               navbarInfo: null
            };
         else
            return {
               ...state,
               navbarInfoLoading: false,
               navbarInfo: {
                  openInfo: action.payload.openInfo,
                  userPhoto: action.payload.userPhoto
               }
            };
      case 'CLEAR_VIEWED_USER_INFO':
         return {
            ...state,
            viewedUserLoading: false,
            viewedUserOpenInfo: null,
            viewedUserSecureInfo: null,
            viewedUserPhoto: null
         };

      case 'UPDATE_USER_INFO_BEGIN':
         return {
            ...state,
            userInfoUpdating: true
         };

      case 'USER_INFO_UPDATED':
         return {
            ...state,
            userInfoUpdating: false,
            ...action.payload
         };
      case 'START_PUBLISHING':
         return {
            ...state,
            isPublishing: true
         };
      case 'SUCCESS_FINISH_PUBLISHING':
         return {
            ...state,
            isPublishing: false
         };
      case 'START_DELETING_DRAFT':
         return {
            ...state,
            isDeletingDraft: true
         };
      case 'FINISH_DELETING_DRAFT':
         return {
            ...state,
            isDeletingDraft: false
         };
      case 'START_LOADING_DRAFT':
         return {
            ...state,
            isOpeningDraft: true
         };
      case 'FINISH_LOADING_DRAFT':
         return {
            ...state,
            isOpeningDraft: false
         };
      default:
         return state;
   }
};
