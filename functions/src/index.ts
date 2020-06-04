import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { tmpdir } from 'os';
import { join, dirname } from 'path';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

admin.initializeApp();

const gcs = admin.storage();

exports.generateThumbs = functions.storage.object().onFinalize(async (object, context) => {
   const bucket = gcs.bucket(object.bucket);
   const filePath = object.name;
   const contentType = object.contentType;
   const fileName = filePath!.split('/').pop();
   const bucketDir = dirname(filePath!);
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
   await bucket.file(filePath!).download({
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

   return fs.remove(workingDir);
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

// УСТАНОВКА НАЧАЛЬНЫХ ЗНАЧЕНИЙ
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
               photo: null,
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
