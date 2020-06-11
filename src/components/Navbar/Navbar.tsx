import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Routes from '@config/routes';
import Profile from '@components/Navbar/Profile';
import Logo from '@components/Logo';
import MobileMenu from '@components/Navbar/MobileMenu';

import Menu from '@img/Navbar/menu.png';

import styles from './styles.module.scss';

const Navbar: React.FC = () => {
   const [openMobile, setOpenMobile] = useState(false);
   // Функция для открытия мобильного меню
   const openMenuHandler = () => {
      setOpenMobile((prevState) => !prevState);
   };

   return (
      <>
         <header className={styles['nav-bar']}>
            <nav className={styles['nav-bar__container']}>
               <div className={styles['nav-bar__empty-div']} />

               <div className={styles['nav-bar__links']}>
                  <NavLink
                     exact
                     to={Routes.mainPage}
                     className={styles['nav-bar__link']}
                     activeClassName={styles['link-active']}>
                     Новости
                  </NavLink>
                  <NavLink
                     to={Routes.mainCategories.articles}
                     className={styles['nav-bar__link']}
                     activeClassName={styles['link-active']}>
                     Статьи
                  </NavLink>
                  <NavLink
                     to={Routes.mainCategories.reviews}
                     className={styles['nav-bar__link']}
                     activeClassName={styles['link-active']}>
                     Обзоры
                  </NavLink>
               </div>

               <Logo className={styles['nav-bar__logo']} />

               <div className={styles['nav-bar__links']}>
                  <NavLink
                     to={Routes.faq}
                     className={styles['nav-bar__link']}
                     activeClassName={styles['link-active']}>
                     FAQ
                  </NavLink>
                  <NavLink
                     to={Routes.infoPage}
                     className={styles['nav-bar__link']}
                     activeClassName={styles['link-active']}>
                     О проекте
                  </NavLink>
                  <NavLink
                     to={Routes.contacts}
                     className={styles['nav-bar__link']}
                     activeClassName={styles['link-active']}>
                     Контакты
                  </NavLink>
                  <Profile />
               </div>

               <button className={styles['nav-bar__menu-btn']} onClick={openMenuHandler}>
                  <img src={Menu} alt="Menu" />
               </button>
            </nav>
         </header>
         <MobileMenu isOpen={openMobile} />
      </>
   );
};

export default Navbar;
