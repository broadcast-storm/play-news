const initialState = {
   initDone: false,
   initialized: false,
   isLoadingSignIn: false,
   donePasswordReset: false,
   loginSuccess: false,
   errorSignIn: null,
   isLoadingSmall: false,
   error: null,
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
   authUser: null
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
         else
            return {
               ...state,
               authUser: action.payload.authUser,
               initialized: true
            };
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
            loginSuccess: false
         };
      default:
         return state;
   }
};
