import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const SIGNIN_LOADING_BEGIN = 'SIGNIN_LOADING_BEGIN';
const SIGNIN_LOADING_END = 'SIGNIN_LOADING_END';
const SIGNIN_ERROR = 'SIGNIN_ERROR';
const DONE_PASSW_RESET = 'DONE_PASSW_RESET';

// ИНИЦИАЛИЗАЦИЯ FIREBASE
export function firebaseInit() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      app.initializeApp(firebase.firebaseConfig);
      const auth = app.auth();
      const db = app.firestore();
      dispatch({ type: 'INIT', payload: { auth, db } });
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
export const doCreateUserWithEmailAndPassword = (login, name, surname, email, password) => {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         dispatch({ type: SIGNIN_LOADING_BEGIN });
         var docRef = firebase.db.collection('users').doc(login);
         docRef
            .get()
            .then(async function(doc) {
               if (doc.exists) {
                  dispatch({ type: SIGNIN_LOADING_END });
                  dispatch({
                     type: SIGNIN_ERROR,
                     payload: { text: 'Пользователь с таким логином уже существует' }
                  });
                  console.log('Пользователь с таким логином уже существует');
               } else {
                  await firebase.auth.createUserWithEmailAndPassword(email, password);
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
         firebase.db
            .collection('admins')
            .where('mail', '==', email)
            .get()
            .then(async function(result) {
               if (result.size === 1)
                  await firebase.auth.signInWithEmailAndPassword(email, password);
               else {
                  dispatch({
                     type: SIGNIN_ERROR,
                     payload: {
                        text: 'Проверьте интернет-соединение и вводимые данные'
                     }
                  });
               }
               dispatch({ type: SIGNIN_LOADING_END });
            })
            .catch(function(error) {
               dispatch({ type: SIGNIN_LOADING_END });
               dispatch({
                  type: SIGNIN_ERROR,
                  payload: {
                     text: 'Проверьте интернет-соединение и вводимые данные'
                  }
               });
            });
      } catch (error) {
         dispatch({ type: SIGNIN_LOADING_END });
         dispatch({
            type: SIGNIN_ERROR,
            payload: {
               text: 'Проверьте интернет-соединение и вводимые данные'
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
