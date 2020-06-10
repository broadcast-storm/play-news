import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Routes from '@config/routes';

import { CircleSpinner } from 'react-spinners-kit';

import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

import Logo from '@components/Logo';

import styles from './style.module.scss';

import { Alert } from 'react-bootstrap';

import {
   doSignInWithEmailAndPassword,
   doCreateUserWithEmailAndPassword,
   doPasswordReset,
   doSignInAdmin
} from '@actions/firebase';

import SignIn from './SignIn';
import SignInAdmin from './Admin';
import ForgotPassword from './ForgotPassword';
import Registration from './Registration';
import VerifyMail from './VerifyMail';

type LoginProps = {
   doSignInWithEmailAndPassword: any;
   doCreateUserWithEmailAndPassword: any;
   doPasswordReset: any;
   isLoadingSignIn: boolean;
   errorSignIn: any;
   donePasswordReset: boolean;
   doSignInAdmin: any;
   loginSuccess: boolean;
   location: any;
   auth: any;
   authUser: any;
   history: any;
   initialized: boolean;
};

const Login: React.FC<LoginProps> = ({
   doSignInWithEmailAndPassword,
   doCreateUserWithEmailAndPassword,
   doPasswordReset,
   errorSignIn,
   donePasswordReset,
   doSignInAdmin,
   loginSuccess,
   isLoadingSignIn,
   location,
   auth,
   authUser,
   history,
   initialized
}) => {
   useEffect(() => {
      if (authUser !== null && initialized) {
         auth.currentUser.getIdTokenResult().then((idTokenResult: any) => {
            if (idTokenResult.claims.login !== undefined) {
               if (idTokenResult.claims.admin === true && location.pathname === Routes.admin) {
                  if (!auth.currentUser.emailVerified) history.push(Routes.verifyMail);
                  else {
                     if (idTokenResult.claims.loggedAsAdmin && loginSuccess)
                        setRedirectPath('/admin/' + idTokenResult.claims.login);
                  }
               } else {
                  if (location.pathname === Routes.regist || !auth.currentUser.emailVerified)
                     history.push(Routes.verifyMail);
                  else {
                     if (loginSuccess) setRedirectPath('/user/' + idTokenResult.claims.login);
                  }
               }
            }
         });
      }
      // eslint-disable-next-line
   }, [authUser, loginSuccess, initialized]);

   useEffect(() => {
      if (donePasswordReset !== false) {
         setShowPasswAlert(true);
      }
   }, [donePasswordReset]);

   useEffect(() => {
      if (errorSignIn !== null) {
         setShow(true);
      }
   }, [errorSignIn]);

   useEffect(() => {
      window.scrollTo(0, 0);
      setShow(false);
      setShowPasswAlert(false);
   }, [location.pathname]);

   const [redirectPath, setRedirectPath] = useState<string | null>(null);

   const [show, setShow] = useState(false);
   const [showPasswAlert, setShowPasswAlert] = useState(false);
   const [passwordsCheckWrong, setPasswordsCheckWrong] = useState(false);

   const loginFunc = (email: string, password: string) => {
      setShow(false);
      doSignInWithEmailAndPassword(email, password);
   };

   const forgotPasswFunc = (emailForgotPassw: string) => {
      doPasswordReset(emailForgotPassw);
   };

   const registrationFunc = (
      login: string,
      name: string,
      surname: string,
      emailReg: string,
      passwordReg: string,
      passwordRegCheck: string
   ) => {
      setShow(false);
      if (passwordReg === passwordRegCheck) {
         doCreateUserWithEmailAndPassword(login, name, surname, emailReg, passwordReg);
      } else {
         setPasswordsCheckWrong(true);
         setShow(true);
      }
   };

   const adminFunc = (emailAdmin: string, passwordAdmin: string) => {
      setShow(false);
      doSignInAdmin(emailAdmin, passwordAdmin);
   };

   if (redirectPath !== null) return <Redirect to={redirectPath} />;
   return (
      <div className={styles['login-page']}>
         <Logo className={styles['login-page__big-logo']} />
         {!initialized ? (
            <div className={styles['loader']}>
               <CircleSpinner size={40} color="#f2cb04" />
            </div>
         ) : (
            <>
               {show ? (
                  <Alert
                     variant="danger"
                     onClose={() => {
                        setShow(false);
                        if (passwordsCheckWrong) setPasswordsCheckWrong(false);
                     }}
                     dismissible>
                     <p>{passwordsCheckWrong ? 'Не совпадают введёные пароли' : errorSignIn}</p>
                  </Alert>
               ) : null}
               {showPasswAlert ? (
                  <Alert
                     variant="success"
                     onClose={() => {
                        setShowPasswAlert(false);
                     }}
                     dismissible>
                     <p>Проверьте свою почту. Вам отправлено письмо для смены пароля.</p>
                  </Alert>
               ) : null}
               <Switch>
                  <Route
                     exact
                     path={Routes.loginPage}
                     render={() => (
                        <SignIn isLoadingSignIn={isLoadingSignIn} loginFunc={loginFunc} />
                     )}
                  />
                  <Route
                     exact
                     path={Routes.forgotPassword}
                     render={() => (
                        <ForgotPassword
                           forgotPasswFunc={forgotPasswFunc}
                           isLoadingSignIn={isLoadingSignIn}
                        />
                     )}
                  />
                  <Route
                     exact
                     path={Routes.regist}
                     render={() => (
                        <Registration
                           isLoadingSignIn={isLoadingSignIn}
                           registrationFunc={registrationFunc}
                        />
                     )}
                  />
                  <Route
                     exact
                     path={Routes.admin}
                     render={() => (
                        <SignInAdmin adminFunc={adminFunc} isLoadingSignIn={isLoadingSignIn} />
                     )}
                  />
                  <Route
                     exact
                     path={Routes.verifyMail}
                     render={() => <VerifyMail verified={auth.currentUser.emailVerified} />}
                  />
               </Switch>
            </>
         )}
      </div>
   );
};

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      doSignInWithEmailAndPassword: (email: string, password: string) =>
         dispatch(doSignInWithEmailAndPassword(email, password)),
      doSignInAdmin: (email: string, password: string) => dispatch(doSignInAdmin(email, password)),
      doPasswordReset: (email: string) => dispatch(doPasswordReset(email)),
      doCreateUserWithEmailAndPassword: (
         login: string,
         name: string,
         surname: string,
         email: string,
         password: string
      ) => dispatch(doCreateUserWithEmailAndPassword(login, name, surname, email, password))
   };
};
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
