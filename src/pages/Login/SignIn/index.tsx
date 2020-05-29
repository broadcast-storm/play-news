import React, { useState } from 'react';

import Routes from '@config/routes';

import styles from '../style.module.scss';

import { Link, NavLink } from 'react-router-dom';

import { CircleSpinner } from 'react-spinners-kit';

import Vk from '@img/login/vk.png';
import Facebook from '@img/login/facebook.png';
import Twitter from '@img/login/twitter.png';
import Tel from '@img/login/telegram.png';

type LoginProps = {
   loginFunc: any;
   isLoadingSignIn: boolean;
};

const SignIn: React.FC<LoginProps> = ({ loginFunc, isLoadingSignIn }) => {
   // FOR LOGIN
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');

   return (
      <>
         <form
            className={styles['login-page__login-form']}
            onSubmit={(e) => {
               e.preventDefault();
               loginFunc(email, password);
            }}>
            <input
               type="email"
               pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
               title="example@mail.ru"
               className={styles['login-from__input']}
               placeholder={'E-mail'}
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
            <input
               type="password"
               className={styles['login-from__input']}
               placeholder={'Пароль'}
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               minLength={8}
            />
            <button type={'submit'} className={styles['login-form__btn']}>
               {!isLoadingSignIn ? 'Войти' : <CircleSpinner size={21} color="#182126" />}
            </button>
         </form>
         <span>Войти через социальные сети</span>
         <div className={styles['social']}>
            <Link to={'/'} className={styles['social__item']}>
               <img src={Vk} alt="Vk" />
            </Link>
            <Link to={'/'} className={styles['social__item']}>
               <img src={Facebook} alt="Facebook" />
            </Link>
            <Link to={'/'} className={styles['social__item']}>
               <img src={Twitter} alt="Twitter" />
            </Link>
            <Link to={'/'} className={styles['social__item']}>
               <img src={Tel} alt="Telegram" />
            </Link>
         </div>
         <div className={styles['links']}>
            <NavLink to={Routes.forgotPassword} className={styles['links__item']}>
               Забыли пароль
            </NavLink>
            <NavLink to={Routes.regist} className={styles['links__item']}>
               Зарегистрироваться
            </NavLink>
         </div>
      </>
   );
};

export default SignIn;
