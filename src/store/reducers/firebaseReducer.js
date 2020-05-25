const initialState = {
   remindList: [],
   noteList: [],
   isLoading: false,
   initialize: true,
   isLoadingSignIn: false,
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
   authUser: null
};

export const firebaseReducer = (state = initialState, action) => {
   switch (action.type) {
      case 'INIT':
         return {
            ...state,
            auth: action.payload.auth,
            db: action.payload.db
         };
      case 'CHANGE_AUTH_USER':
         return {
            ...state,
            authUser: action.payload.authUser,
            initialize: false
         };
      case 'CHANGE_AUTH':
         return {
            ...state,
            auth: action.payload.authNew
         };
      case 'CHANGE_DB':
         return {
            ...state,
            db: action.payload.newDb
         };
      case 'SIGNIN_LOADING_BEGIN':
         return {
            ...state,
            isLoadingSignIn: true,
            errorSignIn: null
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
      case 'LOADING':
         return {
            ...state,
            isLoading: true
         };
      case 'STOP_INITIALIZE':
         return {
            ...state,
            initialize: false
         };
      case 'LOADING_SMALL':
         return {
            ...state,
            isLoadingSmall: true
         };
      case 'SIGN_OUT':
         return {
            ...state,
            remindList: [],
            noteList: []
         };
      default:
         return state;
   }
};
