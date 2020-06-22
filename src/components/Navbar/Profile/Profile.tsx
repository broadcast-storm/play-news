import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import LogOut from '@components/LogOut';
import Routes from '@config/routes';

import { getNavbarInfo } from '@actions/firebase';

import EmptyProfile from '@img/Navbar/empty-logo.svg';
import DefaultUserImg from '@img/user/defaultPhoto.png';

import styles from '@components/Navbar/styles.module.scss';

type ProfileProps = {
   location?: any;
};

const Profile: React.FC<ProfileProps> = ({ location }) => {
   const dispatch = useDispatch();
   const { navbarInfo, navbarInfoLoading, authUser, initialized } = useSelector(
      (state: any) => state.firebase
   );

   const [showInfo, setShowInfo] = useState(false);

   // Если пользователь авторизован, то получить данные для главного меню (фото профиля, ссылку на личный кабинет)
   useEffect(() => {
      if (authUser !== null && initialized) {
         dispatch(getNavbarInfo());
      }
      // eslint-disable-next-line
   }, [authUser]);

   // При смене URL скрывать открываемое меню с данными пользователя
   useEffect(() => {
      setShowInfo(false);
      // eslint-disable-next-line
   }, [location.pathname]);

   // если происходит загрузка данных, то показывать заглушку
   if (navbarInfoLoading) {
      return <div className={styles['nav-bar__profile-empty']} />;
   }
   // если не авторизован, то выводить ссылку на старинцу входа
   if (navbarInfo === null) {
      return (
         <NavLink to={Routes.loginPage} className={styles['nav-bar__profile']}>
            <img src={EmptyProfile} alt="" className={styles['profile__img']} />
         </NavLink>
      );
   }
   // елси авторизован и загрузка завершена, то выводить всё
   return (
      <div className={styles['nav-bar__profile']} onClick={() => setShowInfo((prev) => !prev)}>
         <img
            src={navbarInfo.userPhoto !== null ? navbarInfo.userPhoto : DefaultUserImg}
            alt=""
            className={styles['profile__img']}
         />
         {showInfo ? (
            <div className={styles['profile__info']}>
               <NavLink
                  className={styles['name']}
                  to={Routes.userPage.replace(':login', navbarInfo.openInfo.login)}>
                  {navbarInfo.openInfo.name}
               </NavLink>
               <span className={styles['userType']}>
                  {navbarInfo.openInfo.userType === 'admin'
                     ? 'Админ'
                     : navbarInfo.openInfo.userType === 'redactor'
                     ? 'Редактор'
                     : navbarInfo.openInfo.userType === 'user'
                     ? 'Читатель'
                     : null}
               </span>

               <LogOut />
            </div>
         ) : null}
      </div>
   );
};

// @ts-ignore
export default withRouter(Profile);
