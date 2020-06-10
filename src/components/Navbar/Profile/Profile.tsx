import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import LogOut from '@components/LogOut';
import Routes from '@config/routes';
import { getNavbarInfo } from '@actions/firebase';
import EmptyProfile from '@img/Navbar/empty-logo.svg';
import DefaultUserImg from '@img/user/defaultPhoto.png';
import styles from '@components/Navbar/styles.module.scss';

type ProfileProps = {
   navbarInfoLoading?: boolean;
   navbarInfo?: any;
   location?: any;
   authUser?: any;
   getNavbarInfo?: any;
   initDone: any;
};

const Profile: React.FC<ProfileProps> = ({
   navbarInfoLoading,
   navbarInfo,
   location,
   authUser,
   getNavbarInfo,
   initDone
}) => {
   const [showInfo, setShowInfo] = useState(false);

   useEffect(() => {
      if (authUser !== null && initDone) {
         getNavbarInfo();
      }
   }, [authUser]);

   useEffect(() => {
      setShowInfo(false);
   }, [location.pathname]);

   if (navbarInfoLoading) {
      return <div className={styles['nav-bar__profile-empty']} />;
   }
   if (navbarInfo === null) {
      return (
         <NavLink to={Routes.loginPage} className={styles['nav-bar__profile']}>
            <img src={EmptyProfile} alt="" className={styles['profile__img']} />
         </NavLink>
      );
   }
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
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      getNavbarInfo: () => dispatch(getNavbarInfo())
   };
};

// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
