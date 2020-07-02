import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { tmpdir } from 'os';
import { join, dirname } from 'path';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

// FIREBASE ФУНКЦИИ

admin.initializeApp();

const gcs = admin.storage();

// СОЗДАНИЕ ОПТИМИЗИРОВАННЫХ ФОТОГРАФИЙ ПРИ СМЕНЕ ФОТО ПРОФИЛЯ
exports.generateThumbs = functions.storage.object().onFinalize(async (object, context) => {
   const bucket = gcs.bucket(object.bucket);
   const filePath = object.name;
   if (filePath?.includes('usersPhoto')) {
      const contentType = object.contentType;
      const fileName = filePath.split('/').pop();
      const bucketDir = dirname(filePath);
      const workingDir = join(tmpdir(), 'thumbs');
      const tmpFilePath = join(workingDir, context.eventId);
      const metadata = {
         contentType: contentType
      };

      if (fileName?.includes('thumb@') || !object.contentType?.includes('image')) {
         console.log('resize func close');
         return false;
      }

      await fs.ensureDir(workingDir);
      await bucket.file(filePath).download({
         destination: tmpFilePath
      });
      const sizes = [64, 128, 200];

      const uploadPromises = sizes.map(async (size) => {
         const thumbName = `thumb@${size}_${fileName}`;
         const thumbPath = join(workingDir, thumbName);

         await sharp(tmpFilePath)
            .resize(size, size)
            .toFile(thumbPath);

         return bucket.upload(thumbPath, {
            destination: join(bucketDir, thumbName),
            metadata: metadata
         });
      });

      await Promise.all(uploadPromises);

      const file = bucket.file(filePath);

      await file.delete();
      return fs.remove(workingDir);
   } else return false;
});

// НАЗНАЧЕНИЕ АДМИНИСТРАТОРА
async function grantAdminRole(email: string): Promise<void> {
   const user = await admin.auth().getUserByEmail(email);
   if (user.customClaims && (user.customClaims as any).admin === true) {
      return;
   }
   const login = (user.customClaims as any).login;
   return admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      redactor: false,
      login: login
   });
}

exports.addAdmin = functions.https.onCall((data, context) => {
   if (context.auth?.token.admin !== true) {
      return {
         error: 'User must be admin to creat new admin!'
      };
   }
   const email = data.email;
   return grantAdminRole(email).then(() => {
      return {
         result: `${email} is now a new admin!`
      };
   });
});

// ПОЛУЧЕНИЕ АДМИН-СТАТУСА ПРИ ВХОДЕ
async function getAdminStatusFunc(email: string): Promise<void> {
   const user = await admin.auth().getUserByEmail(email);
   if ((user.customClaims as any).admin !== true) {
      return;
   }
   const login = (user.customClaims as any).login;
   return admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      redactor: false,
      login: login,
      loggedAsAdmin: true
   });
}

exports.getAdminStatus = functions.https.onCall((data, context) => {
   if (context.auth?.token.admin !== true) {
      return {
         error: 'User must be admin to creat new admin!'
      };
   }
   const email = data.email;
   return getAdminStatusFunc(email).then(() => {
      return {
         result: `${email} logged as admin!`
      };
   });
});

// УДАЛЕНИЕ АДМИН-СТАТУСА ПРИ ВЫХОДЕ
async function clearAdminStatusFunc(email: string): Promise<void> {
   const user = await admin.auth().getUserByEmail(email);
   if ((user.customClaims as any).admin !== true) {
      return;
   }
   const login = (user.customClaims as any).login;
   return admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      redactor: false,
      login: login
   });
}

exports.clearAdminStatus = functions.https.onCall((data, context) => {
   if (context.auth?.token.admin !== true) {
      return {
         error: 'User must be admin to creat new admin!'
      };
   }
   const email = data.email;
   return clearAdminStatusFunc(email).then(() => {
      return {
         result: `${email} log out as admin!`
      };
   });
});

// СОХРАНЕНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ
async function saveNewLogin(email: string, login: string): Promise<void> {
   const user = await admin.auth().getUserByEmail(email);
   if (user.customClaims && (user.customClaims as any).login !== undefined) {
      return;
   }
   return admin.auth().setCustomUserClaims(user.uid, {
      login: login,
      redactor: false,
      admin: false
   });
}

exports.saveLogin = functions.https.onCall((data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Registration failed'
      };
   }
   const loginsListRef = admin
      .firestore()
      .collection('loginsList')
      .doc('logins');

   return loginsListRef
      .update({
         loginList: admin.firestore.FieldValue.arrayUnion(data.login)
      })
      .then(() => {
         const email = data.email;
         const login = data.login;
         return saveNewLogin(email, login).then(() => {
            return {
               result: `User ${email} saved login ${login}!`
            };
         });
      })
      .catch((error) => {
         return error;
      });
});

// УСТАНОВКА НАЧАЛЬНЫХ ЗНАЧЕНИЙ ПРОФИЛЯ
exports.setInitialInfo = functions.https.onCall((data, context) => {
   if (context.auth?.token.login === undefined) {
      return {
         error: 'Login error!'
      };
   }
   const usersSecureListRef = admin
      .firestore()
      .collection('usersSecure')
      .doc(context.auth?.token.login);

   return usersSecureListRef
      .set({
         email: data.email,
         comments: [],
         drafts: [],
         otherInfo: {}
      })
      .then(() => {
         const usersOpenListRef = admin
            .firestore()
            .collection('usersOpen')
            .doc(context.auth?.token.login);

         return usersOpenListRef
            .set({
               login: data.login,
               name: data.name,
               surname: data.surname,
               level: 1,
               points: 0,
               currentLevelPoints: 0,
               articles: [],
               isOnline: true,
               userType: 'user',
               photo: [],
               avatar: null,
               aboutYourself: '',
               otherInfo: {},
               email: null
            })
            .then(() => {
               return {
                  result: `User start info created!`
               };
            })
            .catch((error: any) => {
               return error;
            });
      })
      .catch((error: any) => {
         return error;
      });
});

// ПУБЛИКАЦИЯ НОВОЙ СТАТЬИ

exports.publishArticle = functions.https.onCall(async (data, context) => {
   if (
      context.auth?.uid === null ||
      (context.auth?.token.redactor === false && context.auth?.token.admin === false)
   ) {
      return {
         error: 'Publishing available only for redactors or admins'
      };
   }
   const article = admin
      .firestore()
      .collection('articles')
      .doc(data.descrip.id);

   const articleContent = admin
      .firestore()
      .collection('articlesContent')
      .doc(data.descrip.id);

   const articleComments = admin
      .firestore()
      .collection('comments')
      .doc(data.descrip.id);

   return articleComments
      .set({
         comments: []
      })
      .then(async () => {
         try {
            await article.set({
               ...data.descrip,
               date: new Date(),
               lastEdited: new Date(),
               likes: 0,
               dislikes: 0,
               commentsCount: 0,
               viewsCount: 0,
               isShowing: true,
               isShowingComments: true,
               isEditing: false,
               isBlockedComments: false,
               redactor: context.auth?.token.login
            });
            try {
               await articleContent.set({
                  content: data.content
               });
               return { message: 'Publishing done' };
            } catch (error) {
               return error;
            }
         } catch (error_1) {
            return error_1;
         }
      });
});

// ПОЛУЧИТЬ СТАТЬЮ (ОБЫЧНЫЙ ПОЛЬЗОВАТЕЛЬ)

exports.getArticle = functions.https.onCall(async (data) => {
   if (data.type !== 'article' && data.type !== 'review' && data.type !== 'news') {
      return {
         error: 'Wrong type'
      };
   }

   const description = admin
      .firestore()
      .collection('articles')
      .doc(data.id);

   const content = admin
      .firestore()
      .collection('articlesContent')
      .doc(data.id);

   const comments = admin
      .firestore()
      .collection('comments')
      .doc(data.id);

   return description.get().then(async (doc) => {
      try {
         if (doc.exists) {
            const descriptionArticle = doc.data();
            if (descriptionArticle!.isShowing) {
               const contentArticle = (await content.get()).data();
               const commentsArticle = (await comments.get()).data();
               return {
                  message: 'well done',
                  result: {
                     description: descriptionArticle,
                     content: contentArticle,
                     comments: commentsArticle
                  }
               };
            } else
               return {
                  message: 'no article',
                  result: null
               };
         } else
            return {
               message: 'no article',
               result: null
            };
      } catch (error_1) {
         return error_1;
      }
   });
});
