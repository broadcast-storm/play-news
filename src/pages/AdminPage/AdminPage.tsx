import React, { useState, useEffect } from 'react';
import LogOut from '@components/LogOut';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import { getViewedUserInfo } from '@actions/firebase';
import Routes from '@config/routes';
import classNames from 'classnames';
import DefaultUserImg from '@img/user/defaultPhoto.png';
import { Route, Switch, withRouter } from 'react-router-dom';
import styles from './style.module.scss';

type AdminProps = {
   match: any;
   auth: any;
   initialized: boolean;
   history: any;
   getViewedUserInfo?: any;
   viewedUserLoading?: boolean;
   viewedUserOpenInfo?: any;
   viewedUserSecureInfo?: any;
   viewedUserPhoto?: any;
};

const AdminPage: React.FC<AdminProps> = ({
   auth,
   match,
   initialized,
   history,
   getViewedUserInfo,
   viewedUserLoading,
   viewedUserOpenInfo,
   viewedUserSecureInfo,
   viewedUserPhoto
}) => {
   const [checkAdmin, setCheckAdmin] = useState(false);

   const isAdmin = () => {
      if (auth.currentUser === null) return history.push(Routes.mainPage);
      return auth.currentUser.getIdTokenResult().then((idTokenResult: any) => {
         if (
            idTokenResult.claims.loggedAsAdmin !== true ||
            idTokenResult.claims.admin !== true ||
            match.params.login !== idTokenResult.claims.login ||
            !auth.currentUser.emailVerified
         ) {
            history.push(Routes.mainPage);
         } else setCheckAdmin(true);
      });
   };

   useEffect(() => {
      if (initialized) {
         isAdmin();
      }
      // eslint-disable-next-line
   }, [initialized]);

   useEffect(() => {
      if (checkAdmin) {
         getViewedUserInfo(match.params.login);
      }
      // eslint-disable-next-line
   }, [checkAdmin]);

   if (!checkAdmin || viewedUserLoading)
      return (
         <div className={classNames(styles['userContainer'], styles['containerLoader'])}>
            <div
               className={classNames(styles['userContainer__contentContainer'], styles['loader'])}>
               <CircleSpinner size={40} color="#f2cb04" />{' '}
            </div>
         </div>
      );

   return (
      <div className={styles['userContainer']}>
         <div className={styles['userContainer__contentContainer']}>
            <div className={styles['topInfo']}>
               <div className={styles['topInfo__photo']}>
                  <img
                     src={viewedUserPhoto !== null ? viewedUserPhoto : DefaultUserImg}
                     className={styles['image']}
                     alt=""
                  />
               </div>

               <div className={styles['topInfo__text']}>
                  <div className={styles['top']}>
                     <span className={styles['name']}>
                        {viewedUserOpenInfo.name + ' ' + viewedUserOpenInfo.surname}
                     </span>
                     <LogOut />
                  </div>
                  <span className={styles['role']}>Админ</span>
               </div>
            </div>
            <h2>Админ панель</h2> <span>(в разработке)</span>
         </div>
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
      getViewedUserInfo: (login: string) => dispatch(getViewedUserInfo(login))
   };
};
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminPage));
