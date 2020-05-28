import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const SIGNIN_LOADING_BEGIN = 'SIGNIN_LOADING_BEGIN';
const SIGNIN_LOADING_END = 'SIGNIN_LOADING_END';
const ADMIN_LOGGED_IN = 'ADMIN_LOGGED_IN';
const SIGNIN_ERROR = 'SIGNIN_ERROR';
const DONE_PASSW_RESET = 'DONE_PASSW_RESET';

// ИНИЦИАЛИЗАЦИЯ FIREBASE
export function firebaseInit() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      app.initializeApp(firebase.firebaseConfig);
      const auth = app.auth();
      const db = app.firestore();
      const functions = app.functions();
      dispatch({ type: 'INIT', payload: { auth, db, functions } });
   };
}

// ПРОВЕРКА ВХОДА В АККАУНТ
export function startAuthStateChangeCheck() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      firebase.auth.onAuthStateChanged((authUser) => {
         authUser
            ? dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser } })
            : dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser: null } });
      });
   };
}

// РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ПО ПОЧТЕ И ПАРОЛЮ

function searchStringInArray(str, strArray) {
   for (var j = 0; j < strArray.length; j++) {
      if (strArray[j].match(str)) return true;
   }
   return false;
}

export const doCreateUserWithEmailAndPassword = (login, name, surname, email, password) => {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         dispatch({ type: SIGNIN_LOADING_BEGIN });
         var docRef = firebase.db.collection('loginsList').doc('logins');
         docRef
            .get()
            .then(async function(doc) {
               const loginList = doc.data().loginList;
               if (searchStringInArray(login, loginList)) {
                  dispatch({ type: SIGNIN_LOADING_END });
                  dispatch({
                     type: SIGNIN_ERROR,
                     payload: { text: 'Пользователь с таким логином уже существует' }
                  });
               } else {
                  await firebase.auth.createUserWithEmailAndPassword(email, password);
                  const addNewLogin = firebase.functions.httpsCallable('addNewLogin');
                  const result = await addNewLogin({ login });
                  console.log(result);

                  await firebase.db
                     .collection('users')
                     .doc(login)
                     .set({
                        email,
                        login,
                        name,
                        surname
                     });
                  dispatch({ type: SIGNIN_LOADING_END });
               }
            })
            .catch(function(error) {
               dispatch({ type: SIGNIN_LOADING_END });
               dispatch({
                  type: SIGNIN_ERROR,
                  payload: {
                     text:
                        error.code === 'auth/email-already-in-use'
                           ? 'Эта почта уже используется другим аккаунтом'
                           : 'Проверьте интернет-соединение'
                  }
               });
            });
      } catch (e) {}
   };
};

// ВХОД ПО ПОЧТЕ И ПАРОЛЮ
export function doSignInWithEmailAndPassword(email, password) {
   return async (dispatch, getState) => {
      dispatch({ type: SIGNIN_LOADING_BEGIN });
      const { firebase } = getState();

      try {
         await firebase.auth.signInWithEmailAndPassword(email, password);
         dispatch({ type: SIGNIN_LOADING_END });
      } catch (error) {
         dispatch({ type: SIGNIN_LOADING_END });
         dispatch({
            type: SIGNIN_ERROR,
            payload: {
               text:
                  error.code === 'auth/user-not-found'
                     ? 'Пользователь с этой почтой не найден'
                     : error.code === 'auth/wrong-password'
                     ? 'Введён не верный пароль'
                     : 'Проверьте интернет-соединение'
            }
         });
      }
   };
}

// ВХОД АДМИНА
export function doSignInAdmin(email, password) {
   return async (dispatch, getState) => {
      dispatch({ type: SIGNIN_LOADING_BEGIN });
      try {
         const { firebase } = getState();
         await firebase.auth.signInWithEmailAndPassword(email, password);
         const idTokenResult = await firebase.auth.currentUser.getIdTokenResult();
         if (idTokenResult.claims.admin === true) {
            dispatch({ type: ADMIN_LOGGED_IN });
         } else {
            dispatch(doSignOut());
            dispatch({
               type: SIGNIN_ERROR,
               payload: {
                  text: 'Проверьте вводимые данные'
               }
            });
         }
         dispatch({ type: SIGNIN_LOADING_END });
      } catch (error) {
         dispatch({ type: SIGNIN_LOADING_END });
         dispatch({
            type: SIGNIN_ERROR,
            payload: {
               text: 'Проверьте интернет-соединение'
            }
         });
      }
   };
}

// ВЫХОД
export const doSignOut = () => {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      await firebase.auth.signOut();

      dispatch({ type: 'SIGN_OUT' });
   };
};

// ОТПРАВКА ЗАЯВКИ НА ПОЧТУ ДЛЯ СМЕНЫ ПАРОЛЯ
export const doPasswordReset = (email) => {
   return (dispatch, getState) => {
      dispatch({ type: SIGNIN_LOADING_BEGIN });
      const { firebase } = getState();
      firebase.auth
         .sendPasswordResetEmail(email)
         .then(function() {
            dispatch({ type: DONE_PASSW_RESET });
            dispatch({ type: SIGNIN_LOADING_END });
         })
         .catch(function(error) {
            dispatch({ type: SIGNIN_LOADING_END });
            dispatch({
               type: SIGNIN_ERROR,
               payload: {
                  text:
                     error.code === 'auth/user-not-found'
                        ? 'Не найден пользователь с введённой почтой'
                        : 'Проверьте интернет-соединение'
               }
            });
         });
   };
};

// ДОБАВЛЕНИЕ НОВОГО АДМИНИСТРАТОРА
export function addNewAdmin(email) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         const addNewAdmin = firebase.functions.httpsCallable('addAdmin');
         const result = await addNewAdmin({ email: email });
         console.log(result);
      } catch (e) {
         console.log(e);
      }
   };
}

export function areYouAdmin() {
   return (dispatch, getState) => {
      const { firebase } = getState();

      firebase.auth.currentUser.getIdTokenResult().then((idTokenResult) => {
         console.log(idTokenResult);
         if (idTokenResult.claims.admin === true) return true;
         else return false;
      });
   };
}

export function reAuthenticate() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         const user = firebase.auth.currentUser;

         const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            'userProvidedPassword'
         );

         user
            .reauthenticateWithCredential(credential)
            .then(function() {
               // User re-authenticated.
            })
            .catch(function(error) {
               // An error happened.
            });
      } catch (e) {
         console.log(e);
      }
   };
}
