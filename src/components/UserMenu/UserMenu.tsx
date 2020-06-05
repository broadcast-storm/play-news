import React from 'react';
import Routes from '@config/routes';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';

type LogoProps = {
   className?: string | null;
   isYourAccount: boolean;
   isRedactor: boolean;
   login: string;
};

const UserMenu: React.FC<LogoProps> = ({ className, isYourAccount, isRedactor, login }) => {
   return (
      <div className={classNames(styles['menu-container'], className)}>
         <div className={styles['links']}>
            <NavLink
               exact
               to={Routes.userPage.replace(':login', login)}
               className={styles['link-item']}
               activeClassName={styles['link-active']}>
               Статьи
            </NavLink>
            <NavLink
               to={Routes.userPageScreens.blog.replace(':login', login)}
               className={styles['link-item']}
               activeClassName={styles['link-active']}>
               Блог
            </NavLink>
            <NavLink
               to={Routes.userPageScreens.comments.replace(':login', login)}
               className={styles['link-item']}
               activeClassName={styles['link-active']}>
               Комментарии
            </NavLink>
            {isYourAccount ? (
               <NavLink
                  to={Routes.userPageScreens.drafts.replace(':login', login)}
                  className={styles['link-item']}
                  activeClassName={styles['link-active']}>
                  Черновики
               </NavLink>
            ) : null}
            {isYourAccount && isRedactor ? (
               <NavLink
                  to={Routes.userPageScreens.otherUsersArticles.replace(':login', login)}
                  className={styles['link-item']}
                  activeClassName={styles['link-active']}>
                  Читательские
               </NavLink>
            ) : null}
         </div>
         {isYourAccount ? (
            <NavLink
               to={Routes.userPageScreens.editor.replace(':login', login)}
               className={styles['link-editor']}
               activeClassName={styles['link-hide']}>
               Написать статью
            </NavLink>
         ) : null}
      </div>
   );
};

UserMenu.defaultProps = {
   className: null,
   isYourAccount: false
};

export default UserMenu;
