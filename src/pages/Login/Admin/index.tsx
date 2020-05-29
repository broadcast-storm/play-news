import React, { useState } from 'react';

import Routes from '@config/routes';

import styles from '../style.module.scss';

import { NavLink } from 'react-router-dom';

import { CircleSpinner } from 'react-spinners-kit';

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
         <form
            className={styles['login-page__login-form']}
            onSubmit={(e) => {
               e.preventDefault();
               adminFunc(emailAdmin, passwordAdmin);
            }}>
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
               {!isLoadingSignIn ? 'Войти' : <CircleSpinner size={21} color="#182126" />}
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

export default SignInAdmin;
