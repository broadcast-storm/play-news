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
exports.generateThumbs = functions
   .region('europe-west3')
   .storage.object()
   .onFinalize(async (object, context) => {
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

exports.addAdmin = functions.region('europe-west3').https.onCall((data, context) => {
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

exports.getAdminStatus = functions.region('europe-west3').https.onCall((data, context) => {
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

exports.clearAdminStatus = functions.region('europe-west3').https.onCall((data, context) => {
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

exports.saveLogin = functions.region('europe-west3').https.onCall((data, context) => {
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
exports.setInitialInfo = functions.region('europe-west3').https.onCall((data, context) => {
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

exports.publishArticle = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Publishing available only for authorized users'
      };
   }
   if (data.oldId !== data.descrip.id && data.oldId !== null) {
      await admin
         .firestore()
         .collection('articles')
         .doc(data.oldId)
         .delete();
      await admin
         .firestore()
         .collection('articlesContent')
         .doc(data.oldId)
         .delete();
      await admin
         .firestore()
         .collection('comments')
         .doc(data.oldId)
         .delete();
   }
   const isUser = context.auth?.token.redactor === false && context.auth?.token.admin === false;

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
               likes: [],
               dislikes: [],
               commentsCount: 0,
               viewsCount: 0,
               isShowing: true,
               isShowingComments: true,
               isEditing: false,
               isBlockedComments: false,
               redactor: isUser ? null : context.auth?.token.login,
               redactorAnswer: ''
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

exports.getArticle = functions.region('europe-west3').https.onCall(async (data) => {
   if (data.type !== 'articles' && data.type !== 'reviews' && data.type !== 'news')
      return {
         error: 'Wrong type'
      };

   const content = admin
      .firestore()
      .collection('articlesContent')
      .doc(data.id);

   return content.get().then(async (doc) => {
      try {
         if (doc.exists) {
            const contentArticle = doc.data();

            return {
               message: 'well done',
               result: {
                  content: contentArticle
               }
            };
         } else
            return {
               message: 'no article',
               result: null
            };
      } catch (error_1) {
         return {
            message: error_1,
            result: null
         };
      }
   });
});

exports.sendComment = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Publishing available only for logged users'
      };
   }

   try {
      const comments = admin
         .firestore()
         .collection('comments')
         .doc(data.articleId);

      const article = admin
         .firestore()
         .collection('articles')
         .doc(data.articleId);

      const commentsDoc = await comments.get();

      const articleDoc = await article.get();

      if (commentsDoc.exists && articleDoc.exists) {
         const usersOpenData = (
            await admin
               .firestore()
               .collection('usersOpen')
               .doc(context.auth?.token.login)
               .get()
         ).data();

         let photoUrl = null;

         const chance = require('chance').Chance();

         if (usersOpenData!.photo.length !== 0) {
            photoUrl = `thumb@64_photo.jpg`;
         }

         await comments.update({
            comments: admin.firestore.FieldValue.arrayUnion({
               id: chance.string({ length: 20 }),
               text: data.text,
               userLogin: usersOpenData!.login,
               userPhoto: photoUrl,
               userName: usersOpenData!.name + ' ' + usersOpenData!.surname,
               date: new Date(),
               likes: [],
               dislikes: []
            })
         });

         await article.update({
            commentsCount: admin.firestore.FieldValue.increment(1)
         });

         return {
            message: 'comment added',
            result: 'success'
         };
      } else
         return {
            message: 'no article with this comment',
            result: null
         };
   } catch (e) {
      return { message: e.message, result: null };
   }
});

exports.likeComment = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Like comments available only for authorized users'
      };
   }

   try {
      const comments = admin
         .firestore()
         .collection('comments')
         .doc(data.articleId);

      const commentsDoc = await comments.get();

      if (commentsDoc.exists) {
         const commentsData = commentsDoc.data();
         const commentCahnge = commentsData!.comments.find(
            (comment: any) => comment.id === data.commentId
         );
         if (commentCahnge !== undefined) {
            await comments.update({
               comments: admin.firestore.FieldValue.arrayRemove({ ...commentCahnge })
            });
            const isLiked = commentCahnge.likes.indexOf(context.auth?.token.login);
            const isDisliked = commentCahnge.dislikes.indexOf(context.auth?.token.login);
            if (isLiked !== -1) {
               commentCahnge.likes.splice(isLiked, 1);
            }
            if (isDisliked !== -1) {
               commentCahnge.dislikes.splice(isDisliked, 1);
               commentCahnge.likes.push(context.auth?.token.login);
            }
            if (isLiked === -1 && isDisliked === -1) {
               commentCahnge.likes.push(context.auth?.token.login);
            }

            await comments.update({
               comments: admin.firestore.FieldValue.arrayUnion(commentCahnge)
            });

            return {
               message: 'success like comment'
            };
         } else {
            return {
               message: 'failed like comment'
            };
         }
      } else
         return {
            message: 'no article with this comment'
         };
   } catch (e) {
      return { message: e.message };
   }
});

exports.dislikeComment = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Like comments available only for authorized users'
      };
   }

   try {
      const comments = admin
         .firestore()
         .collection('comments')
         .doc(data.articleId);

      const commentsDoc = await comments.get();

      if (commentsDoc.exists) {
         const commentsData = commentsDoc.data();
         const commentCahnge = commentsData!.comments.find(
            (comment: any) => comment.id === data.commentId
         );
         if (commentCahnge !== undefined) {
            await comments.update({
               comments: admin.firestore.FieldValue.arrayRemove({ ...commentCahnge })
            });
            const isLiked = commentCahnge.likes.indexOf(context.auth?.token.login);
            const isDisliked = commentCahnge.dislikes.indexOf(context.auth?.token.login);
            if (isLiked !== -1) {
               commentCahnge.likes.splice(isLiked, 1);
               commentCahnge.dislikes.push(context.auth?.token.login);
            }
            if (isDisliked !== -1) {
               commentCahnge.dislikes.splice(isDisliked, 1);
            }
            if (isLiked === -1 && isDisliked === -1) {
               commentCahnge.dislikes.push(context.auth?.token.login);
            }

            await comments.update({
               comments: admin.firestore.FieldValue.arrayUnion(commentCahnge)
            });

            return {
               message: 'success dislike comment'
            };
         } else {
            return {
               message: 'failed dislike comment'
            };
         }
      } else
         return {
            message: 'no article with this comment'
         };
   } catch (e) {
      return { message: e.message };
   }
});

exports.deleteComment = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Delete comments available only for authorized users'
      };
   }

   try {
      const comments = admin
         .firestore()
         .collection('comments')
         .doc(data.articleId);

      const article = admin
         .firestore()
         .collection('articles')
         .doc(data.articleId);

      const commentsDoc = await comments.get();

      const articleDoc = await article.get();

      if (commentsDoc.exists && articleDoc.exists) {
         const commentsData = commentsDoc.data();
         const commentDelete = commentsData!.comments.find(
            (comment: any) => comment.id === data.commentId
         );
         if (
            commentDelete !== undefined &&
            (context.auth?.token.login === commentDelete.userLogin ||
               context.auth?.token.admin === true)
         ) {
            await article.update({
               commentsCount: admin.firestore.FieldValue.increment(-1)
            });
            await comments.update({
               comments: admin.firestore.FieldValue.arrayRemove({ ...commentDelete })
            });

            return {
               message: 'success delete comment'
            };
         } else {
            return {
               message: 'failed delete comment'
            };
         }
      } else
         return {
            message: 'no article with this comment'
         };
   } catch (e) {
      return { message: e.message };
   }
});

exports.dislikeArticle = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Dislike articles available only for authorized users'
      };
   }

   try {
      const article = admin
         .firestore()
         .collection('articles')
         .doc(data.articleId);

      const articleDoc = await article.get();

      if (articleDoc.exists) {
         const articleData = articleDoc.data();
         if (articleData !== undefined) {
            const isLiked = articleData.likes.indexOf(context.auth?.token.login);
            const isDisliked = articleData.dislikes.indexOf(context.auth?.token.login);
            if (isLiked !== -1) {
               await article.update({
                  likes: admin.firestore.FieldValue.arrayRemove(context.auth?.token.login)
               });
               await article.update({
                  dislikes: admin.firestore.FieldValue.arrayUnion(context.auth?.token.login)
               });
            }
            if (isDisliked !== -1) {
               await article.update({
                  dislikes: admin.firestore.FieldValue.arrayRemove(context.auth?.token.login)
               });
            }
            if (isLiked === -1 && isDisliked === -1) {
               await article.update({
                  dislikes: admin.firestore.FieldValue.arrayUnion(context.auth?.token.login)
               });
            }

            return {
               message: 'success dislike article'
            };
         } else {
            return {
               message: 'failed dislike article'
            };
         }
      } else
         return {
            message: 'no article with this id'
         };
   } catch (e) {
      return { message: e.message };
   }
});

exports.likeArticle = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Like articles available only for authorized users'
      };
   }

   try {
      const article = admin
         .firestore()
         .collection('articles')
         .doc(data.articleId);

      const articleDoc = await article.get();

      if (articleDoc.exists) {
         const articleData = articleDoc.data();
         if (articleData !== undefined) {
            const isLiked = articleData.likes.indexOf(context.auth?.token.login);
            const isDisliked = articleData.dislikes.indexOf(context.auth?.token.login);
            if (isLiked !== -1) {
               await article.update({
                  likes: admin.firestore.FieldValue.arrayRemove(context.auth?.token.login)
               });
            }
            if (isDisliked !== -1) {
               await article.update({
                  dislikes: admin.firestore.FieldValue.arrayRemove(context.auth?.token.login)
               });
               await article.update({
                  likes: admin.firestore.FieldValue.arrayUnion(context.auth?.token.login)
               });
            }
            if (isLiked === -1 && isDisliked === -1) {
               await article.update({
                  likes: admin.firestore.FieldValue.arrayUnion(context.auth?.token.login)
               });
            }

            return {
               message: 'success like article'
            };
         } else {
            return {
               message: 'failed like article'
            };
         }
      } else
         return {
            message: 'no article with this id'
         };
   } catch (e) {
      return { message: e.message };
   }
});

exports.addView = functions.region('europe-west3').https.onCall(async (data) => {
   try {
      const article = admin
         .firestore()
         .collection('articles')
         .doc(data.articleId);

      const articleDoc = await article.get();

      if (articleDoc.exists) {
         await article.update({
            viewsCount: admin.firestore.FieldValue.increment(1)
         });

         return {
            message: 'success view added'
         };
      } else {
         return {
            message: 'failed view add'
         };
      }
   } catch (e) {
      return { message: e.message };
   }
});

exports.deleteDraft = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Delete draft available only for authorized users'
      };
   }

   try {
      const article = admin
         .firestore()
         .collection('articles')
         .doc(data.draftId);

      const articleDoc = await article.get();

      if (articleDoc.exists) {
         const articleData = articleDoc.data();
         if (
            articleData !== undefined &&
            articleData.isEditing &&
            context.auth?.token.login === articleData.authorLink
         ) {
            await article.delete();

            await admin
               .firestore()
               .collection('comments')
               .doc(data.draftId)
               .delete();
            await admin
               .firestore()
               .collection('articlesContent')
               .doc(data.draftId)
               .delete();

            return {
               message: 'success delete draft'
            };
         } else {
            return {
               message: 'failed delete draft'
            };
         }
      } else
         return {
            message: 'no draft for deleting'
         };
   } catch (e) {
      return { message: e.message };
   }
});

exports.getUserDraft = functions.region('europe-west3').https.onCall(async (data, context) => {
   if (context.auth?.uid === null) {
      return {
         error: 'Get draft available only for authorized users'
      };
   }
   const description = admin
      .firestore()
      .collection('articles')
      .doc(data.draftId);

   return description.get().then(async (doc) => {
      try {
         if (doc.exists) {
            const descripDraft = doc.data();

            if (
               descripDraft !== undefined &&
               descripDraft.isEditing &&
               (context.auth?.token.login === descripDraft.authorLink ||
                  context.auth?.token.redactor === true ||
                  context.auth?.token.admin === true)
            ) {
               const content = admin
                  .firestore()
                  .collection('articlesContent')
                  .doc(data.draftId);

               const contentDraft = (await content.get()).data();

               console.log({
                  content: contentDraft,
                  description: descripDraft,
                  oldId: descripDraft.id
               });

               return {
                  message: 'well done',
                  result: {
                     content: contentDraft,
                     description: descripDraft,
                     oldId: descripDraft.id
                  }
               };
            } else
               return {
                  message: 'no access to this draft',
                  result: null
               };
         } else
            return {
               message: 'no draft',
               result: null
            };
      } catch (error_1) {
         return {
            message: error_1,
            result: null
         };
      }
   });
});
