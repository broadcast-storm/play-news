import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Routes from '@config/routes';
import { CircleSpinner } from 'react-spinners-kit';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Alert } from 'react-bootstrap';

import {
   doSignInWithEmailAndPassword,
   doCreateUserWithEmailAndPassword,
   doPasswordReset,
   doSignInAdmin
} from '@actions/firebase';

// Отдельные компоненты для каждой формы (регистрация, вход в аккаунт и т д)
import SignIn from './SignIn';
import SignInAdmin from './Admin';
import ForgotPassword from './ForgotPassword';
import Registration from './Registration';
import VerifyMail from './VerifyMail';

import Logo from '@components/Logo';

import styles from './style.module.scss';

type LoginProps = {
   location: any;
   history: any;
};

const Login: React.FC<LoginProps> = ({ location, history }) => {
   const dispatch = useDispatch();
   const {
      auth,
      authUser,
      initialized,
      loginSuccess,
      errorSignIn,
      donePasswordReset,
      isLoadingSignIn
   } = useSelector((state: any) => state.firebase);

   //В зависимости от авторизации пользователя и подтвердил ли он свою почту, происходит редирект на его личный кабинет
   //Если авторизация происходила в форме для админа, то происходит редирект в админ панель
   useEffect(() => {
      if (authUser !== null && initialized) {
         auth.currentUser.getIdTokenResult().then((idTokenResult: any) => {
            if (idTokenResult.claims.login !== undefined) {
               if (idTokenResult.claims.admin === true && location.pathname === Routes.admin) {
                  if (!auth.currentUser.emailVerified) history.push(Routes.verifyMail);
                  else {
                     if (idTokenResult.claims.loggedAsAdmin && loginSuccess)
                        setRedirectPath(
                           Routes.adminPage.replace(':login', idTokenResult.claims.login)
                        );
                  }
               } else {
                  if (location.pathname === Routes.regist || !auth.currentUser.emailVerified)
                     history.push(Routes.verifyMail);
                  else {
                     if (loginSuccess)
                        setRedirectPath(
                           Routes.userPage.replace(':login', idTokenResult.claims.login)
                        );
                  }
               }
            }
         });
      }
      // eslint-disable-next-line
   }, [authUser, loginSuccess, initialized]);

   // Выводить сообщение об изменении пароля, когда отправлено сообщение на почту
   useEffect(() => {
      if (donePasswordReset !== false) {
         setShowPasswAlert(true);
      }
   }, [donePasswordReset]);

   // Если произошла ошибка, то выводить сообщение
   useEffect(() => {
      if (errorSignIn !== null) {
         setShow(true);
      }
   }, [errorSignIn]);

   // При смене Url скрывать все сообщения об ошибках
   useEffect(() => {
      window.scrollTo(0, 0);
      setShow(false);
      setShowPasswAlert(false);
   }, [location.pathname]);

   const [redirectPath, setRedirectPath] = useState<string | null>(null);

   const [show, setShow] = useState(false);
   const [showPasswAlert, setShowPasswAlert] = useState(false);
   const [passwordsCheckWrong, setPasswordsCheckWrong] = useState(false);

   // Функция входа в личный кабинет по почте и паролю
   const loginFunc = (email: string, password: string) => {
      setShow(false);
      dispatch(doSignInWithEmailAndPassword(email, password));
   };

   // Функция смены пароля (отправить сообщение на почту)
   const forgotPasswFunc = (emailForgotPassw: string) => {
      dispatch(doPasswordReset(emailForgotPassw));
   };

   // Функция регистрации нового пользователя
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
         dispatch(doCreateUserWithEmailAndPassword(login, name, surname, emailReg, passwordReg));
      } else {
         setPasswordsCheckWrong(true);
         setShow(true);
      }
   };

   // Функция входа в админ панель
   const adminFunc = (emailAdmin: string, passwordAdmin: string) => {
      setShow(false);
      dispatch(doSignInAdmin(emailAdmin, passwordAdmin));
   };

   // Если авторизация прошла, то происходит редирект
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
export default withRouter(Login);
