import React, { useState } from 'react';
import { connect } from 'react-redux';

import Routes from '@config/routes';

import { Route, Switch } from 'react-router-dom';

import Logo from '@components/Logo';

import styles from './style.module.scss';

import { Link, NavLink } from 'react-router-dom';

import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword } from '@actions/firebase';
import Vk from '@img/login/vk.png';
import Facebook from '@img/login/facebook.png';
import Twitter from '@img/login/twitter.png';
import Tel from '@img/login/telegram.png';

type LoginProps = {
   doSignInWithEmailAndPassword: any;
   doCreateUserWithEmailAndPassword: any;
};

const Login: React.FC<LoginProps> = ({
   doSignInWithEmailAndPassword,
   doCreateUserWithEmailAndPassword
}) => {
   // FOR LOGIN
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   // FOR FOGGOT PASSWORD
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
   };

   const registrationFunc = (e: any) => {
      e.preventDefault();
      doCreateUserWithEmailAndPassword(login, name, surname, emailReg, passwordReg);
   };

   const adminFunc = (e: any) => {
      e.preventDefault();
   };

   return (
      <div className={styles['login-page']}>
         <Logo className={styles['login-page__big-logo']} />

         <Switch>
            <Route
               exact
               path={Routes.loginPage}
               render={() => (
                  <>
                     <form className={styles['login-page__login-form']} onSubmit={loginFunc}>
                        <input
                           type="email"
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
                        />
                        <button type={'submit'} className={styles['login-form__btn']}>
                           Войти
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
               )}
            />

            <Route
               exact
               path={Routes.forgotPassword}
               render={() => (
                  <>
                     <form className={styles['login-page__login-form']} onSubmit={forgotPasswFunc}>
                        <input
                           type="email"
                           className={styles['login-from__input']}
                           placeholder={'E-mail'}
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
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
               )}
            />

            <Route
               exact
               path={Routes.regist}
               render={() => (
                  <>
                     <form className={styles['login-page__login-form']} onSubmit={registrationFunc}>
                        <input
                           type="text"
                           className={styles['login-from__input']}
                           placeholder={'Логин'}
                           required
                           value={login}
                           onChange={(e) => setLogin(e.target.value)}
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
                        />
                        <input
                           type="password"
                           className={styles['login-from__input']}
                           placeholder={'Подтвердите пароль'}
                           required
                           value={passwordRegCheck}
                           onChange={(e) => setPasswordRegCheck(e.target.value)}
                        />
                        <button type={'submit'} className={styles['login-form__btn']}>
                           Зарегистрироваться
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
               )}
            />
            <Route
               exact
               path={Routes.admin}
               render={() => (
                  <>
                     <form className={styles['login-page__login-form']} onSubmit={adminFunc}>
                        <span className={styles['links__item']}>Для администратора</span>
                        <br />
                        <input
                           type="email"
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
                        />
                        <button type={'submit'} className={styles['login-form__btn']}>
                           Войти
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
               )}
            />
         </Switch>
      </div>
   );
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      doSignInWithEmailAndPassword: (email: string, password: string) =>
         dispatch(doSignInWithEmailAndPassword(email, password)),
      doCreateUserWithEmailAndPassword: (
         login: string,
         name: string,
         surname: string,
         email: string,
         password: string
      ) => dispatch(doCreateUserWithEmailAndPassword(login, name, surname, email, password))
   };
};

export default connect(null, mapDispatchToProps)(Login);
