import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Routes from '@config/routes';

import { Route, Switch, withRouter } from 'react-router-dom';

import Logo from '@components/Logo';

import styles from './style.module.scss';

import { Link, NavLink } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

import { CircleSpinner } from 'react-spinners-kit';

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

import Vk from '@img/login/vk.png';
import Facebook from '@img/login/facebook.png';
import Twitter from '@img/login/twitter.png';
import Tel from '@img/login/telegram.png';

type LoginProps = {
   doSignInWithEmailAndPassword: any;
   doCreateUserWithEmailAndPassword: any;
   doPasswordReset: any;
   isLoadingSignIn: boolean;
   errorSignIn: any;
   donePasswordReset: boolean;
   doSignInAdmin: any;
   location: any;
};

const Login: React.FC<LoginProps> = ({
   doSignInWithEmailAndPassword,
   doCreateUserWithEmailAndPassword,
   doPasswordReset,
   errorSignIn,
   donePasswordReset,
   doSignInAdmin,
   isLoadingSignIn,
   location
}) => {
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
      setShow(false);
      setShowPasswAlert(false);
   }, [location.pathname]);

   const [passwordsCheckWrong, setPasswordsCheckWrong] = useState(false);

   const [show, setShow] = useState(false);
   const [showPasswAlert, setShowPasswAlert] = useState(false);
   // FOR LOGIN
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   // FOR FORGOT PASSWORD
   const [emailForgotPassw, setEmailForgotPassw] = useState<string>('');
   // FOR REGISTRATION
   const [login, setLogin] = useState<string>('');
   const [name, setName] = useState<string>('');
   const [surname, setSurname] = useState<string>('');
   const [emailReg, setEmailReg] = useState<string>('');
   const [passwordReg, setPasswordReg] = useState<string>('');
   const [passwordRegCheck, setPasswordRegCheck] = useState<string>('');
   // FOR ADMIN
   const [emailAdmin, setEmailAdmin] = useState<string>('');
   const [passwordAdmin, setPasswordAdmin] = useState<string>('');

   const loginFunc = (e: any) => {
      e.preventDefault();
      doSignInWithEmailAndPassword(email, password);
   };

   const forgotPasswFunc = (e: any) => {
      e.preventDefault();
      doPasswordReset(emailForgotPassw);
   };

   const registrationFunc = (e: any) => {
      e.preventDefault();
      if (passwordReg === passwordRegCheck) {
         doCreateUserWithEmailAndPassword(login, name, surname, emailReg, passwordReg);
      } else {
         setPasswordsCheckWrong(true);
         setShow(true);
      }
   };

   const adminFunc = (e: any) => {
      e.preventDefault();
      doSignInAdmin(emailAdmin, passwordAdmin);
   };

   return (
      <div className={styles['login-page']}>
         <Logo className={styles['login-page__big-logo']} />
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
               render={() => <SignIn isLoadingSignIn={isLoadingSignIn} loginFunc={loginFunc} />}
            />
            <Route exact path={Routes.forgotPassword} render={() => <ForgotPassword />} />
            <Route exact path={Routes.regist} render={() => <Registration />} />
            <Route exact path={Routes.admin} render={() => <SignInAdmin />} />
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
