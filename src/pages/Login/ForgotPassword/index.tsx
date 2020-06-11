import React, { useState } from 'react';
import Routes from '@config/routes';
import { NavLink } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';

import styles from '../style.module.scss';

type LoginProps = {
   forgotPasswFunc: any;
   isLoadingSignIn: boolean;
};
// Форма для смены пароля
const ForgotPassword: React.FC<LoginProps> = ({ forgotPasswFunc, isLoadingSignIn }) => {
   const [emailForgotPassw, setEmailForgotPassw] = useState<string>('');

   return (
      <>
         <span className={styles['links__item']}>Введите почту, привязанную к вашему аккаунту</span>
         <br />
         <br />
         <form
            className={styles['login-page__login-form']}
            onSubmit={(e: any) => {
               e.preventDefault();
               forgotPasswFunc(emailForgotPassw);
            }}>
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
               {!isLoadingSignIn ? 'Отправить запрос' : <CircleSpinner size={21} color="#182126" />}
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
export default ForgotPassword;
