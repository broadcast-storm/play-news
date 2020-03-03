import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import Profile from '@components/Navbar/Profile';
import Logo from '@components/Logo'
import MobileMenu from '@components/Navbar/MobileMenu';

// import Routes from '@config/routes';

import Menu from "@img/Navbar/menu.png";
import styles from './styles.module.scss';

const Navbar: React.FC = () => {

   const [openMobile, setOpenMobile] = useState(false);

   const openMenuHandler = () => {
      setOpenMobile(prevState => !prevState);

   };

   return (
      <>
      <header className={styles['nav-bar']}>
         <nav className={styles['nav-bar__container']}>

            <div className={styles['nav-bar__empty-div']}/>

            <div className={styles['nav-bar__links']}>
               <NavLink exact to={'/'} className={styles['nav-bar__link']} activeClassName={styles['link-active']}>Новости</NavLink>
               <NavLink to={'/articles'} className={styles['nav-bar__link']} activeClassName={styles['link-active']}>Статьи</NavLink>
               <NavLink to={'/reviews'} className={styles['nav-bar__link']} activeClassName={styles['link-active']}>Обзоры</NavLink>
            </div>

            <Logo className={styles['nav-bar__logo']}/>

            <div className={styles['nav-bar__links']}>
               <NavLink to={'/favourites'} className={styles['nav-bar__link']} activeClassName={styles['link-active']}>Избранное</NavLink>
               <NavLink to={'/faq'} className={styles['nav-bar__link']} activeClassName={styles['link-active']}>FAQ</NavLink>
               <NavLink to={'/contacts'} className={styles['nav-bar__link']} activeClassName={styles['link-active']}>Контакты</NavLink>
               <Profile />
            </div>

            <button className={styles['nav-bar__menu-btn']} onClick={openMenuHandler}><img src={Menu} alt="Menu"/></button>
         </nav>
      </header>
         <MobileMenu isOpen={openMobile}/>
      </>
   );
};

export default Navbar;
