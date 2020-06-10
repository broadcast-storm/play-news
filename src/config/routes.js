export default {
   mainPage: '/',
   mainCategories: {
      articles: '/articles',
      reviews: '/reviews'
   },
   mainText: {
      news: '/news/:id',
      article: '/articles/:id',
      review: '/reviews/:id'
   },
   infoPage: '/info',
   loginPage: '/auth',
   forgotPassword: '/auth/forgot-password',
   regist: '/auth/registration',
   admin: '/auth/admin',
   verifyMail: '/auth/verify-mail',
   userPage: '/user/:login',
   userPageScreens: {
      editor: '/user/:login/editor',
      articles: '/user/:login',
      otherUsersArticles: '/user/:login/other-user-articles',
      comments: '/user/:login/comments',
      drafts: '/user/:login/drafts',
      blog: '/user/:login/blog'
   },
   adminPage: '/admin/:login',
   faq: '/faq',
   favourites: '/favourites',
   contacts: '/contacts'
};
