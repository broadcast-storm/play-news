import React from 'react';
import { NavLink } from 'react-router-dom';

import Profile from '@components/Navbar/Profile';
// import Routes from '@config/routes';

import Logo from "@img/Navbar/logo.png";
import styles from './styles.module.scss';

const Navbar: React.FC = () => {

   return (
      <div className={styles['nav-bar']}>
         <div className={styles['nav-bar__container']}>
            <NavLink to={'/'} className={styles['nav-bar__link']}>Новости</NavLink>
            <NavLink to={'/'} className={styles['nav-bar__link']}>Статьи</NavLink>
            <NavLink to={'/'} className={styles['nav-bar__link']}>Обзоры</NavLink>
            <NavLink to={'/'} className={styles['nav-bar__logo']}>
               <img src={Logo} alt="Play News Logo" className={styles['logo__img']}/>
            </NavLink>
            <NavLink to={'/'} className={styles['nav-bar__link']}>Избранное</NavLink>
            <NavLink to={'/'} className={styles['nav-bar__link']}>FAQ</NavLink>
            <NavLink to={'/'} className={styles['nav-bar__link']}>Контакты</NavLink>
            <Profile />
         </div>
      </div>
   );
};

export default Navbar;
