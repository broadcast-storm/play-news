import React from 'react';

import Logo from '@components/Logo';

import styles from './style.module.scss'

import { Link, NavLink } from 'react-router-dom';
import Vk from '@img/login/vk.png';
import Facebook from '@img/login/facebook.png';
import Twitter from '@img/login/twitter.png';
import Tel from '@img/login/telegram.png';

const Login: React.FC = () => {
   return (
      <div className={styles['login-page']}>
         <Logo className={styles['login-page__big-logo']}/>
         <form className={styles['login-page__login-form']}>
            <input type="email" className={styles['login-from__input']} placeholder={'E-mail'} required/>
            <input type="password" className={styles['login-from__input']} placeholder={'Пароль'} required/>
            <button type={'submit'} className={styles['login-form__btn']}>Войти</button>
         </form>
         <span>Войти через социальные сети</span>
         <div className={styles['social']}>
            <Link to={'/'} className={styles['social__item']}><img src={Vk} alt="Vk"/></Link>
            <Link to={'/'} className={styles['social__item']}><img src={Facebook} alt="Facebook"/></Link>
            <Link to={'/'} className={styles['social__item']}><img src={Twitter} alt="Twitter"/></Link>
            <Link to={'/'} className={styles['social__item']}><img src={Tel} alt="Telegram"/></Link>
         </div>
         <div className={styles['links']}>
            <NavLink to={'/'} className={styles['links__item']}>Забыли пароль</NavLink>
            <NavLink to={'/'} className={styles['links__item']}>Зарегистрироваться</NavLink>
         </div>
      </div>
   );
};

export default Login;
