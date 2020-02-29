const initialState = {
  remindList: [],
  noteList: [],
  isLoading: false,
  initialize: true,
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
    case "INIT":
      return {
        ...state,
        auth: action.payload.auth,
        db: action.payload.db
      };
    case "CHANGE_AUTH_USER":
      return {
        ...state,
        authUser: action.payload.authUser,
        initialize: false
      };
    case "CHANGE_AUTH":
      return {
        ...state,
        auth: action.payload.authNew
      };
    case "CHANGE_DB":
      return {
        ...state,
        db: action.payload.newDb
      };
    case "ADD_REMIND":
      return {
        ...state,
        remindList: [action.payload, ...state.remindList],
        isLoadingSmall: false
      };
    case "FETCH_REMINDS":
      return {
        ...state,
        remindList: action.payload != null ? action.payload : [],
        isLoading: false
      };
    case "DELETE_REMIND":
      return {
        ...state,
        remindList: state.remindList.filter(
          remind => remind.id !== action.payload
        )
      };
    case "ADD_NOTE":
      return {
        ...state,
        noteList: [action.payload, ...state.noteList],
        isLoadingSmall: false
      };
    case "EDIT_NOTE": {
      let index = state.noteList.findIndex(
        item => item.id === action.payload.oldId
      );

      state.noteList[index] = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
        startTime: action.payload.startTime
      };
      return {
        ...state,
        noteList: [...state.noteList],
        isLoadingSmall: false
      };
    }
    case "FETCH_NOTES":
      return {
        ...state,
        noteList: action.payload != null ? action.payload : [],
        isLoading: false
      };
    case "DELETE_NOTE":
      return {
        ...state,
        noteList: state.noteList.filter(note => note.id !== action.payload)
      };
    case "LOADING":
      return {
        ...state,
        isLoading: true
      };
    case "STOP_INITIALIZE":
      return {
        ...state,
        initialize: false
      };
    case "LOADING_SMALL":
      return {
        ...state,
        isLoadingSmall: true
      };
    case "SIGN_OUT":
      return {
        ...state,
        remindList: [],
        noteList: []
      };
    default:
      return state;
  }
};
