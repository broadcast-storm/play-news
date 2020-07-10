import React from 'react';
import { NavLink } from 'react-router-dom';
import Routes from '@config/routes';
import classNames from 'classnames';

import styles from '@components/Navbar/styles.module.scss';

type MobileMenuProps = {
   isOpen: boolean;
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
   let shadow = null;
   let menuStyle = styles['mobile-menu'];
   // Мобильное меню выводится вместо основного при нажатии на конпку
   if (isOpen) {
      shadow = <div className={styles['menu-shadow']} />;
      menuStyle = classNames(styles['mobile-menu'], styles['mobile-menu_open']);
   }

   return (
      <>
         <div className={menuStyle}>
            <div className={styles['mobile-menu__items']}>
               <NavLink
                  exact
                  to={Routes.mainPage}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Новости
               </NavLink>
               <NavLink
                  to={Routes.mainCategories.articles}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Статьи
               </NavLink>
               <NavLink
                  to={Routes.mainCategories.reviews}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Обзоры
               </NavLink>
               <NavLink
                  to={Routes.infoPage}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  О проекте
               </NavLink>
               <NavLink
                  to={Routes.favourites}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  FAQ
               </NavLink>
               <NavLink
                  to={Routes.contacts}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Контакты
               </NavLink>
            </div>
         </div>
         {shadow}
      </>
   );
};

MobileMenu.defaultProps = {
   isOpen: false
};

export default MobileMenu;
