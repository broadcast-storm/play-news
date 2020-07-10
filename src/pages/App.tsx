import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
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

import Footer from '@components/Footer';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './style.module.scss';

const UserPage = loadable(() => pMinDelay(import('@pages/UserPage'), 100));

const AdminPage = loadable(() => pMinDelay(import('@pages/AdminPage'), 100));

const Login = loadable(() => pMinDelay(import('@pages/Login'), 100));

const Main = loadable(() => pMinDelay(import('@pages/Main'), 100));

const ArticlePage = loadable(() => pMinDelay(import('@pages/ArticlePage'), 100));

const Info = loadable(() => pMinDelay(import('@pages/Info'), 100));

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
         <Helmet>
            <title>Play News</title>
         </Helmet>
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
               <Route path={Routes.loginPage} render={() => <Login fallback={null} />} />
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
