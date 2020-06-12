import React from 'react';
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

// // Форма регистрации

class Registration extends React.Component<
   { registrationFunc: any; isLoadingSignIn: boolean },
   {
      isValid: boolean;
      login: string;
      name: string;
      surname: string;
      emailReg: string;
      passwordReg: string;
      passwordRegCheck: string;
   }
> {
   constructor(props: any) {
      super(props);
      this.state = {
         emailReg: '',
         passwordReg: '',
         isValid: false,
         login: '',
         name: '',
         surname: '',
         passwordRegCheck: ''
      };
   }

   submitFunc = (e?: any) => {
      if (e !== undefined) e.preventDefault();
      const { emailReg, passwordReg, login, name, surname, passwordRegCheck } = this.state;
      var regexpEmail = /[^@\s]+@[^@\s]+\.[^@\s]+$/;
      var regexpPassword = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/;
      var regexpLogin = /[a-zA-Z0-9_]{5,}$/;
      var regexpName = /[a-zA-Zа-яА-Я]$/;
      var regexpSurname = /[a-zA-Zа-яА-Я]$/;

      if (
         regexpEmail.test(this.state.emailReg) &&
         regexpPassword.test(this.state.passwordReg) &&
         regexpLogin.test(this.state.login) &&
         regexpName.test(this.state.name) &&
         regexpSurname.test(this.state.surname) &&
         this.state.passwordReg === this.state.passwordRegCheck
      ) {
         this.setState({ isValid: true });
      }
      this.props.registrationFunc(login, name, surname, emailReg, passwordReg, passwordRegCheck);
   };

   render() {
      const { isLoadingSignIn } = this.props;
      const { emailReg, passwordReg, login, name, surname, passwordRegCheck } = this.state;
      return (
         <>
            <form className={styles['login-page__login-form']} onSubmit={this.submitFunc}>
               <input
                  type="text"
                  className={styles['login-from__input']}
                  placeholder={'Логин'}
                  name={'Login'}
                  required
                  value={login}
                  onChange={(e) => this.setState({ login: e.target.value })}
                  pattern="[a-zA-Z0-9_]{5,}"
                  title="Логин не менее 5 символов. Можно использовать: a-z A-Z 0-9 _"
               />
               <input
                  type="text"
                  className={styles['login-from__input']}
                  placeholder={'Имя'}
                  name={'Name'}
                  required
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
               />
               <input
                  type="text"
                  className={styles['login-from__input']}
                  placeholder={'Фамилия'}
                  name={'Surname'}
                  required
                  value={surname}
                  onChange={(e) => this.setState({ surname: e.target.value })}
               />
               <input
                  type="email"
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="example@mail.ru"
                  className={styles['login-from__input']}
                  placeholder={'E-mail'}
                  name={'Email'}
                  required
                  value={emailReg}
                  onChange={(e) => this.setState({ emailReg: e.target.value })}
               />
               <input
                  type="password"
                  className={styles['login-from__input']}
                  placeholder={'Пароль'}
                  required
                  name={'Password'}
                  value={passwordReg}
                  onChange={(e) => this.setState({ passwordReg: e.target.value })}
                  minLength={8}
                  pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*"
                  title="Минимум 8 символов, одна цифра, одна буква в верхнем регистре и одна в нижнем"
               />
               <input
                  type="password"
                  className={styles['login-from__input']}
                  placeholder={'Подтвердите пароль'}
                  required
                  name={'PasswordCheck'}
                  value={passwordRegCheck}
                  onChange={(e) => this.setState({ passwordRegCheck: e.target.value })}
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
   }
}

export default Registration;
