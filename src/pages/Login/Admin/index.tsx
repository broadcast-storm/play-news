import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Routes from '@config/routes';

import styles from './style.module.scss';

import { Link, NavLink } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

import { CircleSpinner } from 'react-spinners-kit';

import { doSignInAdmin } from '@actions/firebase';

type LoginProps = {
   isLoadingSignIn: boolean;
   adminFunc: any;
};

const SignInAdmin: React.FC<LoginProps> = ({ isLoadingSignIn, adminFunc }) => {
   // FOR ADMIN
   const [emailAdmin, setEmailAdmin] = useState<string>('');
   const [passwordAdmin, setPasswordAdmin] = useState<string>('');

   return (
      <>
         <form className={styles['login-page__login-form']} onSubmit={adminFunc}>
            <span className={styles['links__item']}>Для администратора</span>
            <br />
            <input
               type="email"
               pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
               title="example@mail.ru"
               className={styles['login-from__input']}
               placeholder={'E-mail'}
               required
               value={emailAdmin}
               onChange={(e) => setEmailAdmin(e.target.value)}
            />
            <input
               type="password"
               className={styles['login-from__input']}
               placeholder={'Пароль'}
               required
               value={passwordAdmin}
               onChange={(e) => setPasswordAdmin(e.target.value)}
               minLength={8}
            />
            <button type={'submit'} className={styles['login-form__btn']}>
               {!isLoadingSignIn ? 'Войти' : <CircleSpinner size={30} color="#182126" />}
            </button>
         </form>

         <div className={styles['links']}>
            <NavLink to={Routes.forgotPassword} className={styles['links__item']}>
               Забыли пароль
            </NavLink>
            <NavLink to={Routes.mainPage} className={styles['links__item']}>
               На главную
            </NavLink>
         </div>
      </>
   );
};

// @ts-ignore
export default SignInAdmin;
