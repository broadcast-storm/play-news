import React, { useEffect } from 'react';
import 'firebase/auth';
import 'firebase/database';
import { firebaseInit, startAuthStateChangeCheck } from '@actions/firebase';

import { useSelector, useDispatch } from 'react-redux';
import Navbar from '@components/Navbar';
import Loader from '@components/Loader';
import Routes from '@config/routes';
import { Route, Switch, withRouter } from 'react-router-dom';

// @ts-ignore
import loadable from '@loadable/component';
// @ts-ignore
import pMinDelay from 'p-min-delay';

// Основные страницы сайта
// import UserPage from '@pages/UserPage';
// import AdminPage from '@pages/AdminPage';
// import Login from '@pages/Login';
// import Main from '@pages/Main';
// import ArticlePage from '@pages/ArticlePage';
// import Info from '@pages/Info';

import Footer from '@components/Footer';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './style.module.scss';

const UserPage = loadable(() => pMinDelay(import('@pages/UserPage'), 500));

const AdminPage = loadable(() => pMinDelay(import('@pages/AdminPage'), 500));

const Login = loadable(() => pMinDelay(import('@pages/Login'), 500));

const Main = loadable(() => pMinDelay(import('@pages/Main'), 500));

const ArticlePage = loadable(() => pMinDelay(import('@pages/ArticlePage'), 500));

const Info = loadable(() => pMinDelay(import('@pages/Info'), 500));

// @ts-ignore
const App: React.FC = ({ location }) => {
   const dispatch = useDispatch();
   const { initDone } = useSelector((state: any) => state.firebase);

   // Инициализировать firebase в приложении
   useEffect(() => {
      dispatch(firebaseInit());
      // eslint-disable-next-line
   }, []);

   // Когда произошла инициализация firebase, проверить, авторизован ли пользователь
   useEffect(() => {
      if (initDone) {
         dispatch(startAuthStateChangeCheck());
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
               <Route path={Routes.userPage} render={() => <UserPage fallback={<Loader />} />} />
               <Route path={Routes.adminPage} render={() => <AdminPage fallback={<Loader />} />} />
               <Route path={Routes.loginPage} render={() => <Login fallback={<Loader />} />} />
               <Route path={Routes.infoPage} render={() => <Info fallback={<Loader />} />} />
               <Route
                  path={Routes.mainText.article}
                  render={() => <ArticlePage fallback={<Loader />} />}
               />
               <Route
                  exact
                  path={[
                     Routes.mainPage,
                     Routes.mainCategories.articles,
                     Routes.mainCategories.reviews
                  ]}
                  render={() => <Main fallback={<Loader />} />}
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
export default withRouter(App);
