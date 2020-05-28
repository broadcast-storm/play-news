import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Routes from '@config/routes';

import styles from '../style.module.scss';

import { Link, NavLink } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

import { CircleSpinner } from 'react-spinners-kit';

import { doCreateUserWithEmailAndPassword } from '@actions/firebase';
import Vk from '@img/login/vk.png';
import Facebook from '@img/login/facebook.png';
import Twitter from '@img/login/twitter.png';
import Tel from '@img/login/telegram.png';

type LoginProps = {
   doCreateUserWithEmailAndPassword: any;
   isLoadingSignIn: boolean;
   errorSignIn: any;
};

const Registration: React.FC<LoginProps> = ({
   doCreateUserWithEmailAndPassword,
   errorSignIn,
   isLoadingSignIn
}) => {
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
   // FOR REGISTRATION
   const [login, setLogin] = useState<string>('');
   const [name, setName] = useState<string>('');
   const [surname, setSurname] = useState<string>('');
   const [emailReg, setEmailReg] = useState<string>('');
   const [passwordReg, setPasswordReg] = useState<string>('');
   const [passwordRegCheck, setPasswordRegCheck] = useState<string>('');

   const registrationFunc = (e: any) => {
      e.preventDefault();
      if (passwordReg === passwordRegCheck) {
         doCreateUserWithEmailAndPassword(login, name, surname, emailReg, passwordReg);
      } else {
         setPasswordsCheckWrong(true);
         setShow(true);
      }
   };

   return (
      <>
         <form className={styles['login-page__login-form']} onSubmit={registrationFunc}>
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
                  <CircleSpinner size={30} color="#182126" />
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

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};

const mapDispatchToProps = (dispatch: any) => {
   return {
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
export default connect(mapStateToProps, mapDispatchToProps)(Registration);
