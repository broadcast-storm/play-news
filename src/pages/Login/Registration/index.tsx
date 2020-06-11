import React, { useState } from 'react';
import Routes from '@config/routes';
import { Link, NavLink } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';

import Vk from '@img/login/vk.png';
import Facebook from '@img/login/facebook.png';
import Twitter from '@img/login/twitter.png';
import Tel from '@img/login/telegram.png';

import styles from '../style.module.scss';

type LoginProps = {
   registrationFunc: any;
   isLoadingSignIn: boolean;
};

// Форма регистрации
const Registration: React.FC<LoginProps> = ({ registrationFunc, isLoadingSignIn }) => {
   const [login, setLogin] = useState<string>('');
   const [name, setName] = useState<string>('');
   const [surname, setSurname] = useState<string>('');
   const [emailReg, setEmailReg] = useState<string>('');
   const [passwordReg, setPasswordReg] = useState<string>('');
   const [passwordRegCheck, setPasswordRegCheck] = useState<string>('');

   return (
      <>
         <form
            className={styles['login-page__login-form']}
            onSubmit={(e) => {
               e.preventDefault();
               registrationFunc(login, name, surname, emailReg, passwordReg, passwordRegCheck);
            }}>
            <input
               type="text"
               className={styles['login-from__input']}
               placeholder={'Логин'}
               required
               value={login}
               onChange={(e) => setLogin(e.target.value)}
               pattern="[a-zA-Z0-9_]{5,}"
               title="Логин не менее 5 символов. Можно использовать: a-z A-Z 0-9 _"
            />
            <input
               type="text"
               className={styles['login-from__input']}
               placeholder={'Имя'}
               required
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
            <input
               type="text"
               className={styles['login-from__input']}
               placeholder={'Фамилия'}
               required
               value={surname}
               onChange={(e) => setSurname(e.target.value)}
            />
            <input
               type="email"
               pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
               title="example@mail.ru"
               className={styles['login-from__input']}
               placeholder={'E-mail'}
               required
               value={emailReg}
               onChange={(e) => setEmailReg(e.target.value)}
            />
            <input
               type="password"
               className={styles['login-from__input']}
               placeholder={'Пароль'}
               required
               value={passwordReg}
               onChange={(e) => setPasswordReg(e.target.value)}
               minLength={8}
               pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*"
               title="Минимум 8 символов, одна цифра, одна буква в верхнем регистре и одна в нижнем"
            />
            <input
               type="password"
               className={styles['login-from__input']}
               placeholder={'Подтвердите пароль'}
               required
               value={passwordRegCheck}
               onChange={(e) => setPasswordRegCheck(e.target.value)}
               minLength={8}
               pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*"
               title="Минимум 8 символов, одна цифра, одна буква в верхнем регистре и одна в нижнем"
            />
            <button type={'submit'} className={styles['login-form__btn']}>
               {!isLoadingSignIn ? (
                  'Зарегистрироваться'
               ) : (
                  <CircleSpinner size={21} color="#182126" />
               )}
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

export default Registration;
