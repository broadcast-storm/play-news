import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Routes from '@config/routes';

import styles from '../style.module.scss';

import { Link, NavLink } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

import { CircleSpinner } from 'react-spinners-kit';

import { doPasswordReset } from '@actions/firebase';

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

const ForgotPassword: React.FC<LoginProps> = ({
   doPasswordReset,
   errorSignIn,
   donePasswordReset
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
   }, []);

   const [passwordsCheckWrong, setPasswordsCheckWrong] = useState(false);

   const [show, setShow] = useState(false);
   const [showPasswAlert, setShowPasswAlert] = useState(false);

   // FOR FORGOT PASSWORD
   const [emailForgotPassw, setEmailForgotPassw] = useState<string>('');

   const forgotPasswFunc = (e: any) => {
      e.preventDefault();
      doPasswordReset(emailForgotPassw);
   };

   return (
      <>
         <span className={styles['links__item']}>Введите почту, привязанную к вашему аккаунту</span>
         <br />
         <br />
         <form className={styles['login-page__login-form']} onSubmit={forgotPasswFunc}>
            <input
               type="email"
               pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
               title="example@mail.ru"
               className={styles['login-from__input']}
               placeholder={'E-mail'}
               required
               value={emailForgotPassw}
               onChange={(e) => setEmailForgotPassw(e.target.value)}
            />
            <button type={'submit'} className={styles['login-form__btn']}>
               Отправить запрос
            </button>
         </form>
         <div className={styles['links']}>
            <NavLink to={Routes.loginPage} className={styles['links__item']}>
               Войти в аккаунт
            </NavLink>
            <NavLink to={Routes.mainPage} className={styles['links__item']}>
               На главную
            </NavLink>
         </div>
      </>
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
      doPasswordReset: (email: string) => dispatch(doPasswordReset(email))
   };
};
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
