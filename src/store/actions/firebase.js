import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const LOADING = 'LOADING';
const LOADING_SMALL = 'LOADING_SMALL';
const ADD_REMIND = 'ADD_REMIND';
const FETCH_REMINDS = 'FETCH_REMINDS';
const DELETE_REMIND = 'DELETE_REMIND';
const ADD_NOTE = 'ADD_NOTE';
const FETCH_NOTES = 'FETCH_NOTES';
const DELETE_NOTE = 'DELETE_NOTE';
const EDIT_NOTE = 'EDIT_NOTE';

// export const firebaseMiddleware = store => next => action => {
//   const actionWith = (type, payload) => ({
//     type,
//     payload
//   });

//   if (action.FIREBASE_CALL) {
//     switch (action.type) {
//       case "PASSWORD_RESET":
//         store
//           .getState()
//           .firebase.auth.sendPasswordResetEmail(action.payload.email);
//         break;
//       case "PASSWORD_UPDATE":
//         store
//           .getState()
//           .firebase.auth.currentUser.updatePassword(action.payload.password);
//         break;

//       default:
//         break;
//     }
//     next(action);
//   } else {
//     return next(action);
//   }
// };

export function firebaseInit() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      app.initializeApp(firebase.firebaseConfig);
      const auth = app.auth();
      const db = app.firestore();
      dispatch({ type: 'INIT', payload: { auth, db } });
      auth.onAuthStateChanged((authUser) => {
         authUser
            ? dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser } })
            : dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser: null } });
      });
   };
}

// export function onAuthStateChanged() {
//   return async (dispatch, getState) => {
//     const { firebase } = getState();
//     firebase.auth.onAuthStateChanged(authUser => {
//       authUser
//         ? dispatch({ type: "CHANGE_AUTH_USER", payload: { authUser } })
//         : dispatch({ type: "CHANGE_AUTH_USER", payload: { authUser: null } });
//     });
//   };
// }

export async function user(uid) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      const newDb = firebase.db;
      let res = await newDb.ref(`users/${uid}`);
      console.log(res);
      dispatch({ type: 'CHANGE_DB', payload: { newDb } });
   };
}

export const doCreateUserWithEmailAndPassword = (login, name, surname, email, password) => {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         const authNew = firebase.auth;
         const newDb = firebase.db;
         var docRef = newDb.collection('users').doc(login);
         docRef
            .get()
            .then(async function(doc) {
               if (doc.exists) {
                  console.log('Пользователь с таким логином уже существует');
               } else {
                  const authUser = await authNew.createUserWithEmailAndPassword(email, password);

                  console.log(authUser);
                  dispatch({ type: 'CHANGE_AUTH', payload: { authNew } });

                  await newDb
                     .collection('users')
                     .doc(login)
                     .set({
                        email,
                        login,
                        name,
                        surname
                     });

                  dispatch({ type: 'CHANGE_DB', payload: { newDb } });

                  dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser } });
               }
            })
            .catch(function(error) {
               console.log('Error getting document:', error);
            });
      } catch (e) {
         throw new Error(e.message);
      }
   };
};

export function doSignInWithEmailAndPassword(email, password) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         const authNew = firebase.auth;
         await authNew.signInWithEmailAndPassword(email, password);
         dispatch({ type: 'CHANGE_AUTH', payload: { authNew } });
         await authNew.onAuthStateChanged((authUser) => {
            dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser } });
         });
      } catch (e) {
         throw new Error(e.message);
      }
   };
}

export const doSignOut = () => {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      const authNew = firebase.auth;
      await authNew.signOut();
      dispatch({ type: 'CHANGE_AUTH', payload: { authNew } });
      await authNew.onAuthStateChanged((authUser) => {
         dispatch({ type: 'CHANGE_AUTH_USER', payload: { authUser } });
      });
      dispatch({ type: 'SIGN_OUT' });
   };
};

export const doPasswordReset = (email) => {
   return (dispatch) => {
      dispatch({
         type: 'PASSWORD_RESET',
         FIREBASE_CALL: true,
         payload: { email }
      });
   };
};

export const doPasswordUpdate = (password) => {
   return (dispatch) => {
      dispatch({
         type: 'PASSWORD_UPDATE',
         FIREBASE_CALL: true,
         payload: { password }
      });
   };
};

// FROM NOTES

//
export function showLoader() {
   return (dispatch) => {
      dispatch({ type: LOADING });
   };
}

export function fetchReminds() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         dispatch({ type: LOADING });

         const newDb = firebase.db;
         const userId = firebase.authUser.uid;
         const res = await newDb
            .ref('/users/' + userId + '/reminds/')
            .once('value')
            .then(function(snapshot) {
               return snapshot.val();
            });

         const payload = res
            ? Object.keys(res).map((key) => {
                 return {
                    ...res[key],
                    id: key
                 };
              })
            : null;
         dispatch({
            type: FETCH_REMINDS,
            payload
         });
      } catch (e) {
         console.log(e);
         throw new Error(e.message);
      }
   };
}

export function fetchNotes() {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      try {
         dispatch({ type: LOADING });
         const newDb = firebase.db;
         var userId = firebase.authUser.uid;
         const res = await newDb
            .ref('/users/' + userId + '/notes/')
            .once('value')
            .then(function(snapshot) {
               return snapshot.val();
            });
         const payload = res
            ? Object.keys(res).map((key) => {
                 return {
                    ...res[key],
                    id: key
                 };
              })
            : null;
         dispatch({ type: FETCH_NOTES, payload });
      } catch (e) {
         console.log(e);
         throw new Error(e.message);
      }
   };
}

export function addRemind(name, selectedDate) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      const newRemind = {
         name: name,
         startTime: new Date().toLocaleString(),
         endTime: selectedDate
      };
      try {
         dispatch({ type: LOADING_SMALL });

         const newDb = firebase.db;
         const newRemindKey = newDb
            .ref(`users/${firebase.authUser.uid}`)
            .child('reminds')
            .push().key;

         const updates = {};
         updates['/reminds/' + newRemindKey] = newRemind;

         newDb.ref('/users/' + firebase.authUser.uid).update(updates);

         const payload = {
            ...newRemind,
            id: newRemindKey
         };

         dispatch({ type: 'CHANGE_DB', payload: { newDb } });
         dispatch({ type: ADD_REMIND, payload: payload });
      } catch (e) {
         throw new Error(e.message);
      }
   };
}

export function addNote(name, description) {
   return async (dispatch, getState) => {
      const { firebase } = getState();

      const newNote = {
         name: name,
         startTime: new Date().toLocaleString(),
         description: description
      };

      try {
         dispatch({ type: LOADING_SMALL });
         const newDb = firebase.db;
         const newNoteKey = newDb
            .ref(`users/${firebase.authUser.uid}`)
            .child('notes')
            .push().key;

         const updates = {};
         updates['/notes/' + newNoteKey] = newNote;

         newDb.ref('/users/' + firebase.authUser.uid).update(updates);

         const payload = {
            ...newNote,
            id: newNoteKey
         };

         dispatch({ type: 'CHANGE_DB', payload: { newDb } });
         dispatch({ type: ADD_NOTE, payload: payload });
      } catch (e) {
         console.log(e);
         throw new Error(e.message);
      }
   };
}

export function editNote(id, name, description) {
   return async (dispatch, getState) => {
      const { firebase } = getState();
      const newNote = {
         name: name,
         startTime: new Date().toLocaleString(),
         description: description
      };
      try {
         dispatch({ type: LOADING_SMALL });

         const newDb = firebase.db;

         var updates = {};
         updates['/notes/' + id] = newNote;

         newDb.ref('/users/' + firebase.authUser.uid).update(updates);

         const payload = {
            ...newNote,
            id: id,
            oldId: id
         };
         dispatch({ type: EDIT_NOTE, payload });
      } catch (e) {
         throw new Error(e.message);
      }
   };
}

export function deleteRemind(id) {
   return async (dispatch, getState) => {
      try {
         const { firebase } = getState();
         const newDb = firebase.db;
         await newDb.ref('/users/' + firebase.authUser.uid + '/reminds/' + id).remove();
         dispatch({ type: DELETE_REMIND, payload: id });
         dispatch({ type: 'CHANGE_DB', payload: { newDb } });
      } catch (e) {
         console.log(e);
      }
   };
}

export function deleteNote(id) {
   return async (dispatch, getState) => {
      try {
         const { firebase } = getState();
         const newDb = firebase.db;
         await newDb.ref('/users/' + firebase.authUser.uid + '/notes/' + id).remove();
         dispatch({ type: DELETE_NOTE, payload: id });
         dispatch({ type: 'CHANGE_DB', payload: { newDb } });
      } catch (e) {
         console.log(e);
      }
   };
}
