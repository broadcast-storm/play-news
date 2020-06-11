import React, { useEffect } from 'react';
import 'firebase/auth';
import 'firebase/database';
import { firebaseInit, startAuthStateChangeCheck } from '@actions/firebase';

import { connect } from 'react-redux';
import Navbar from '@components/Navbar';
import Routes from '@config/routes';
import { Route, Switch, withRouter } from 'react-router-dom';

// Основные страницы сайта
import UserPage from '@pages/UserPage';
import AdminPage from '@pages/AdminPage';
import Login from '@pages/Login';
import Main from '@pages/Main';
import ArticlePage from '@pages/ArticlePage';
import Info from '@pages/Info';

import Footer from '@components/Footer';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './style.module.scss';

// @ts-ignore
const App: React.FC = ({ location, firebaseInit, startAuthStateChangeCheck, initDone }) => {
   // Инициализировать firebase в приложении
   useEffect(() => {
      firebaseInit();
      // eslint-disable-next-line
   }, []);

   // Когда произошла инициализация firebase, проверить, авторизован ли пользователь
   useEffect(() => {
      if (initDone) {
         startAuthStateChangeCheck();
      }
      // eslint-disable-next-line
   }, [initDone]);

   return (
      <>
         <div
            className={
               !location.pathname.includes(Routes.loginPage)
                  ? styles['background']
                  : styles['dark-background']
            }
         />
         {/* Сайт разделен на 3 части: главное меню, основной контент и футер. 
         В зависимости от Url отображаются разные компоненты */}
         <Switch>
            <Route path={Routes.loginPage} render={() => null} />
            <Route path={Routes.mainPage} component={Navbar} />
         </Switch>

         <div className={styles['container']}>
            <Switch>
               <Route path={Routes.userPage} component={UserPage} />
               <Route path={Routes.adminPage} component={AdminPage} />
               <Route path={Routes.loginPage} component={Login} />
               <Route path={Routes.infoPage} component={Info} />
               <Route
                  path={[Routes.mainText.article, Routes.mainText.review, Routes.mainText.news]}
                  component={ArticlePage}
               />
               <Route
                  exact
                  path={[
                     Routes.mainPage,
                     Routes.mainCategories.articles,
                     Routes.mainCategories.reviews
                  ]}
                  component={Main}
               />
            </Switch>
         </div>

         <Switch>
            <Route path={Routes.loginPage} render={() => null} />
            <Route path={Routes.mainPage} component={Footer} />
         </Switch>
      </>
   );
};

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};

const mapDispatchToProps = (
   dispatch: (arg0: (dispatch: any, getState: any) => Promise<void>) => any
) => {
   return {
      firebaseInit: () => dispatch(firebaseInit()),
      startAuthStateChangeCheck: () => dispatch(startAuthStateChangeCheck())
   };
};

// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
