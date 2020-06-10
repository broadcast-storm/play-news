import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '@components/Navbar/styles.module.scss';
import classNames from 'classnames';
import Profile from '@components/Navbar/Profile';

type MobileMenuProps = {
   isOpen: boolean;
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
   let shadow = null;
   let menuStyle = styles['mobile-menu'];

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
                  to={'/'}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Новости
               </NavLink>
               <NavLink
                  to={'/articles'}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Статьи
               </NavLink>
               <NavLink
                  to={'/reviews'}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Обзоры
               </NavLink>
               <NavLink
                  to={'/favourites'}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  Избранное
               </NavLink>
               <NavLink
                  to={'/faq'}
                  className={classNames(styles['nav-bar__link'], styles['mobile-menu_mobile'])}
                  activeClassName={styles['link-active']}>
                  FAQ
               </NavLink>
               <NavLink
                  to={'/contacts'}
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
