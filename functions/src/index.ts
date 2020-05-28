import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.addNewLogin = functions.https.onCall((data) => {
   const loginsListRef = admin
      .firestore()
      .collection('loginsList')
      .doc('logins');

   return loginsListRef
      .update({
         loginList: admin.firestore.FieldValue.arrayUnion(data.login)
      })
      .then(() => {
         return { message: 'new login added' };
      })
      .catch((error) => {
         return error;
      });
});

async function grantAdminRole(email: string): Promise<void> {
   const user = await admin.auth().getUserByEmail(email);
   if (user.customClaims && (user.customClaims as any).admin === true) {
      return;
   }
   return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
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
