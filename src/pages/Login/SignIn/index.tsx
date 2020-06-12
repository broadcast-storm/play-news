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
   loginFunc: any;
   isLoadingSignIn: boolean;
   logined: boolean;
   setLogined: any;
};

// Форма входа в аккаунт

class SignIn extends React.Component<
   { loginFunc: any; isLoadingSignIn: boolean },
   { email: string; password: string; logedIn: boolean }
> {
   constructor(props: any) {
      super(props);
      this.state = { email: '', password: '', logedIn: false };
   }

   submitFunc = (e?: any) => {
      if (e !== undefined) e.preventDefault();
      var regexpEmail = /[^@\s]+@[^@\s]+\.[^@\s]+$/;
      var regexpPassword = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/;
      if (regexpEmail.test(this.state.email) && regexpPassword.test(this.state.password)) {
         this.setState({ logedIn: true });
      }
      this.props.loginFunc(this.state.email, this.state.password);
   };

   render() {
      const { loginFunc, isLoadingSignIn } = this.props;
      const { email, password, logedIn } = this.state;
      return (
         <>
            <form className={styles['login-page__login-form']} onSubmit={this.submitFunc}>
               <input
                  type="email"
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="example@mail.ru"
                  className={styles['login-from__input']}
                  placeholder={'E-mail'}
                  required
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
               />
               <input
                  type="password"
                  className={styles['login-from__input']}
                  placeholder={'Пароль'}
                  required
                  value={password}
                  onChange={(e) => this.setState({ password: e.target.value })}
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
   }
}

export default SignIn;
