import React, { useEffect } from 'react';

import 'firebase/auth';
import 'firebase/database';
import { firebaseInit, startAuthStateChangeCheck } from '@actions/firebase';
import { connect } from 'react-redux';

import Navbar from '@components/Navbar';
import Routes from '@config/routes';
import { Route, Switch, withRouter } from 'react-router-dom';

import Info from '@pages/Info';
import News from '@pages/News';
import Login from '@pages/Login';

import Footer from '@components/Footer';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './style.module.scss';

// @ts-ignore
const App: React.FC = ({ location, firebaseInit, startAuthStateChangeCheck, initialized }) => {
   useEffect(() => {
      firebaseInit();
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      if (initialized) {
         startAuthStateChangeCheck();
      }
      // eslint-disable-next-line
   }, [initialized]);

   return (
      <div
         className={
            !location.pathname.includes(Routes.loginPage)
               ? styles['background']
               : styles['dark-background']
         }>
         <Switch>
            <Route path={Routes.loginPage} render={() => null} />
            <Route path={Routes.mainPage} component={Navbar} />
         </Switch>

         <div className={styles['container']}>
            <Switch>
               <Route exact path={Routes.mainPage} component={News} />
               <Route path={Routes.infoPage} component={Info} />
               <Route path={Routes.loginPage} component={Login} />
            </Switch>
         </div>

         <Switch>
            <Route path={Routes.loginPage} render={() => null} />
            <Route path={Routes.mainPage} component={Footer} />
         </Switch>
      </div>
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
