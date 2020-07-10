import app from 'firebase/app';
import * as FIREBASE from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

const SIGNIN_LOADING_BEGIN = 'SIGNIN_LOADING_BEGIN';
const SIGNIN_LOADING_END = 'SIGNIN_LOADING_END';
const SIGNIN_ERROR = 'SIGNIN_ERROR';
const DONE_PASSW_RESET = 'DONE_PASSW_RESET';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const VIEWED_USER_INFO_LOADING = 'VIEWED_USER_INFO_LOADING';
const VIEWED_USER_INFO_LOADED = 'VIEWED_USER_INFO_LOADED';
const NAVBAR_USER_INFO_LOADING = 'NAVBAR_USER_INFO_LOADING';
const NAVBAR_USER_INFO_LOADED = 'NAVBAR_USER_INFO_LOADED';
const CLEAR_VIEWED_USER_INFO = 'CLEAR_VIEWED_USER_INFO';
const UPDATE_USER_INFO_BEGIN = 'UPDATE_USER_INFO_BEGIN';
const USER_INFO_UPDATED = 'USER_INFO_UPDATED';

const START_PUBLISHING = 'START_PUBLISHING';
const SUCCESS_FINISH_PUBLISHING = 'SUCCESS_FINISH_PUBLISHING';

const START_DELETING_DRAFT = 'START_DELETING_DRAFT';
const FINISH_DELETING_DRAFT = 'FINISH_DELETING_DRAFT';

const START_LOADING_DRAFT = 'START_LOADING_DRAFT';
const FINISH_LOADING_DRAFT = 'FINISH_LOADING_DRAFT';

// ИНИЦИАЛИЗАЦИЯ FIREBASE
export function firebaseInit() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      app.initializeApp(firebase.firebaseConfig);
      const auth = app.auth();
      const db = app.firestore();
      const functions = FIREBASE.app().functions('europe-west3');
      const storage = app.storage();
      const storageRef = storage.ref();
      const usersPhotoRef = storageRef.child('usersPhoto');
      const defaultUserRef = usersPhotoRef.child('default');

      dispatch({
         type: 'INIT',
         payload: { auth, db, functions, storage, storageRef, usersPhotoRef, defaultUserRef }
      });
   };
}

// ПРОВЕРКА ВХОДА В АККАУНТ
export function startAuthStateChangeCheck() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      firebase.auth.onAuthStateChanged((authUser) => {
         if (authUser !== null) {
            dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser } });
         } else dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser: null } });
      });
   };
}

// Функция поиска строки в массиве строк (для поиска используемого уже используемого логина)
function searchStringInArray(str, strArray) {
   for (var j = 0; j < strArray.length; j++) {
      if (strArray[j].match(str)) return true;
   }
   return false;
}

// РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ПО ПОЧТЕ И ПАРОЛЮ
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
                  const saveNewLogin = firebase.functions.httpsCallable('saveLogin');
                  const saveResult = await saveNewLogin({ email: email, login: login });
                  dispatch(doSignOut());
                  await firebase.auth.signInWithEmailAndPassword(email, password);
                  console.log(saveResult);
                  const setInitialValues = firebase.functions.httpsCallable('setInitialInfo');
                  const initialResult = await setInitialValues({
                     email,
                     login,
                     name,
                     surname
                  });

                  console.log(initialResult);

                  dispatch({ type: SIGNIN_LOADING_END });
                  dispatch({ type: LOGIN_SUCCESS });
                  var user = firebase.auth.currentUser;

                  user
                     .sendEmailVerification()
                     .then(function() {
                        // Email sent.
                     })
                     .catch(function(error) {
                        // An error happened.
                        console.log(error);
                     });
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

         dispatch({ type: LOGIN_SUCCESS });
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
            const getAdminStatus = firebase.functions.httpsCallable('getAdminStatus');
            const getStatusResult = await getAdminStatus({ email });
            console.log(getStatusResult);

            const credential = FIREBASE.auth.EmailAuthProvider.credential(email, password);
            await firebase.auth.currentUser.reauthenticateWithCredential(credential);

            dispatch({ type: LOGIN_SUCCESS });
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
         console.log(error);
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

// ВЫХОД ИЗ АККАУНТА
export const doSignOut = () => {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      const idTokenResult = await firebase.auth.currentUser.getIdTokenResult();
      if (idTokenResult.claims.loggedAsAdmin === true) {
         const clearAdminStatus = firebase.functions.httpsCallable('clearAdminStatus');
         const clearAdminStatusResults = await clearAdminStatus({
            email: firebase.auth.currentUser.email
         });
         console.log(clearAdminStatusResults);
      }
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

// ЗАГРУЗКА ИНФОРМАЦИИ О ПОЛЬЗОВАТЕЛЕ В ГЛАВНОЕ МЕНЮ
export function getNavbarInfo() {
   return (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: NAVBAR_USER_INFO_LOADING });

      firebase.auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
         if (firebase.authUser.emailVerified) {
            const openInfo = await firebase.db
               .collection('usersOpen')
               .doc(idTokenResult.claims.login)
               .get();

            if (openInfo.data().photo.length !== 0) {
               firebase.storageRef
                  .child(`usersPhoto/${idTokenResult.claims.login}/thumb@64_photo.jpg`)
                  .getDownloadURL()
                  .then(function(url) {
                     dispatch({
                        type: NAVBAR_USER_INFO_LOADED,
                        payload: {
                           openInfo: openInfo.data(),
                           userPhoto: url
                        }
                     });
                  })
                  .catch(function(error) {
                     console.log(error);
                  });
            } else {
               dispatch({
                  type: NAVBAR_USER_INFO_LOADED,
                  payload: {
                     openInfo: openInfo.data(),
                     userPhoto: null
                  }
               });
            }
         } else {
            dispatch({
               type: NAVBAR_USER_INFO_LOADED,
               payload: null
            });
         }
      });
   };
}

// ПОЛУЧИТЬ ДАННЫЕ ДЛЯ ПРОСМАТРИВАЕМОГО ЛИЧНОГО КАБИНЕТА
export function getViewedUserInfo(login) {
   return (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: VIEWED_USER_INFO_LOADING });

      firebase.auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
         if (idTokenResult.claims.login === login) {
            const openInfo = await firebase.db
               .collection('usersOpen')
               .doc(login)
               .get();

            const secureInfo = await firebase.db
               .collection('usersSecure')
               .doc(login)
               .get();

            if (openInfo.data().photo.length !== 0) {
               const url = await firebase.storageRef
                  .child(`usersPhoto/${login}/thumb@200_photo.jpg`)
                  .getDownloadURL();

               dispatch({
                  type: VIEWED_USER_INFO_LOADED,
                  payload: {
                     openInfo: openInfo.data(),
                     secureInfo: secureInfo.data(),
                     userPhoto: url
                  }
               });
            } else {
               dispatch({
                  type: VIEWED_USER_INFO_LOADED,
                  payload: {
                     openInfo: openInfo.data(),
                     secureInfo: secureInfo.data(),
                     userPhoto: null
                  }
               });
            }
         } else {
            const openInfo = await firebase.db
               .collection('usersOpen')
               .doc(login)
               .get();
            if (openInfo.data().photo.length !== 0) {
               firebase.storageRef
                  .child(`usersPhoto/${login}/thumb@200_photo.jpg`)
                  .getDownloadURL()
                  .then(function(url) {
                     dispatch({
                        type: VIEWED_USER_INFO_LOADED,
                        payload: { openInfo: openInfo.data(), secureInfo: null, userPhoto: url }
                     });
                  })
                  .catch(function(error) {
                     // Handle any errors
                  });
            } else {
               dispatch({
                  type: VIEWED_USER_INFO_LOADED,
                  payload: { openInfo: openInfo.data(), secureInfo: null, userPhoto: null }
               });
            }
         }
      });
   };
}

// ОЧИСТИТЬ ДАННЫЕ ПРОСМАТРИВАЕМОГО ЛИЧНОГО КАБИНЕТА
export function clearViewedUserInfo() {
   return (dispatch, getState) => {
      dispatch({ type: CLEAR_VIEWED_USER_INFO });
   };
}

// ИЗМЕНИТЬ ТЕКСТ "О СЕБЕ"
export function changeAboutYourself(text) {
   return (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: UPDATE_USER_INFO_BEGIN });

      firebase.auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
         await firebase.db
            .collection('usersOpen')
            .doc(idTokenResult.claims.login)
            .update({
               aboutYourself: text
            });
         const openInfo = await firebase.db
            .collection('usersOpen')
            .doc(idTokenResult.claims.login)
            .get();
         // const secureInfo = await firebase.db
         //    .collection('usersSecure')
         //    .doc(idTokenResult.claims.login)
         //    .get();
         dispatch({
            type: USER_INFO_UPDATED,
            payload: { viewedUserOpenInfo: openInfo.data() }
         });
      });
   };
}

// ЗАГРУЗИТЬ НОВОЕ ФОТО
export function uploadUserPhoto(imageBlob) {
   return (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: UPDATE_USER_INFO_BEGIN });

      firebase.auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
         var photoUserRef = firebase.storageRef.child(
            `usersPhoto/${idTokenResult.claims.login}/photo.jpg`
         );
         photoUserRef.put(imageBlob).then(async function(snapshot) {
            setTimeout(async () => {
               await firebase.db
                  .collection('usersOpen')
                  .doc(idTokenResult.claims.login)
                  .update({
                     photo: ['thumb@200_photo.jpg', 'thumb@128_photo.jpg', 'thumb@64_photo.jpg']
                  });

               const openInfo = await firebase.db
                  .collection('usersOpen')
                  .doc(idTokenResult.claims.login)
                  .get();

               const photo200Url = await firebase.storageRef
                  .child(`usersPhoto/${idTokenResult.claims.login}/thumb@200_photo.jpg`)
                  .getDownloadURL();

               const photo64Url = await firebase.storageRef
                  .child(`usersPhoto/${idTokenResult.claims.login}/thumb@64_photo.jpg`)
                  .getDownloadURL();

               dispatch({
                  type: USER_INFO_UPDATED,
                  payload: {
                     viewedUserOpenInfo: openInfo.data(),
                     viewedUserPhoto: photo200Url,
                     navbarInfo: {
                        openInfo: openInfo.data(),
                        userPhoto: photo64Url
                     }
                  }
               });
            }, 5000);
         });
      });
   };
}

export function publishArticle(
   articleContent,
   header,
   annotation,
   mainPhoto,
   smallPhoto,
   articleType,
   tags,
   url,
   author,
   authorLink,
   oldId,
   authorType
) {
   return (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: START_PUBLISHING });
      firebase.auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
         if (oldId !== url && oldId !== null) {
            await firebase.storageRef.child(`articles/${oldId}/${oldId}.jpg`).delete();
            await firebase.storageRef.child(`articles/${oldId}/${oldId}_small.jpg`).delete();
         }

         var mainPhotoRef = firebase.storageRef.child(`articles/${url}/${url}.jpg`);
         var smallPhotoRef = firebase.storageRef.child(`articles/${url}/${url}_small.jpg`);
         mainPhotoRef.put(mainPhoto).then(async function(snapshot) {
            smallPhotoRef.put(smallPhoto).then(async function(snapshot) {
               const mainPhotoUrl = await firebase.storageRef
                  .child(`articles/${url}/${url}.jpg`)
                  .getDownloadURL();
               const smallPhotoUrl = await firebase.storageRef
                  .child(`articles/${url}/${url}_small.jpg`)
                  .getDownloadURL();

               const publishArticle = firebase.functions.httpsCallable('publishArticle');

               const result = await publishArticle({
                  descrip: {
                     id: url,
                     header: header,
                     author: author,
                     authorLink: authorLink,
                     articleType: articleType,
                     mainPhotoUrl: mainPhotoUrl,
                     smallPhotoUrl: smallPhotoUrl,
                     tags: tags,
                     annotation: annotation,
                     authorType
                  },
                  oldId,
                  content: articleContent
               });

               console.log(result);

               dispatch({ type: SUCCESS_FINISH_PUBLISHING });
            });
         });
      });
   };
}

export function deleteDraft(draftId) {
   return (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: START_DELETING_DRAFT });
      firebase.auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
         const deleteDraft = firebase.functions.httpsCallable('deleteDraft');

         const result = await deleteDraft({
            draftId
         });
         await firebase.storageRef.child(`articles/${draftId}/${draftId}.jpg`).delete();
         await firebase.storageRef.child(`articles/${draftId}/${draftId}_small.jpg`).delete();

         console.log(result);

         dispatch({ type: FINISH_DELETING_DRAFT });
      });
   };
}

export function getDraft(draftId) {
   return (dispatch, getState) => {
      const { firebase } = getState();
      dispatch({ type: START_LOADING_DRAFT });
      firebase.auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
         const getDraft = firebase.functions.httpsCallable('getUserDraft');

         const result = await getDraft({
            draftId
         });

         console.log(result);

         dispatch({ type: FINISH_LOADING_DRAFT });
      });
   };
}
