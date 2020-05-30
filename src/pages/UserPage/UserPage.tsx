import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import LogOut from '@components/LogOut';
import AboutYourSelf from '@components/AboutYourSelf';
import Routes from '@config/routes';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

import styles from './style.module.scss';

import DefaultUserImg from '@img/user/defaultPhoto.png';

type UserProps = {
   match: any;
   auth: any;
   authUser: any;
   history: any;
   initialized: boolean;
};

const UserPage: React.FC<UserProps> = ({ match, auth, authUser, history, initialized }) => {
   const [checkYourAccount, setCheckYourAccount] = useState(false);

   const [loadingUserInfo, setLoadingUserInfo] = useState(true);

   const isYourAccount = () => {
      if (auth.currentUser === null) return false;
      return auth.currentUser.getIdTokenResult().then((idTokenResult: any) => {
         if (idTokenResult.claims.login === match.params.login) {
            if (!auth.currentUser.emailVerified) {
               history.push(Routes.verifyMail);
            } else return true;
         } else {
            return false;
         }
      });
   };

   useEffect(() => {
      if (initialized) {
         setCheckYourAccount(isYourAccount());
      }
      // eslint-disable-next-line
   }, [initialized]);

   useEffect(() => {
      setLoadingUserInfo(false);
   }, [checkYourAccount]);

   if (loadingUserInfo) return <CircleSpinner size={21} color="#f2cb04" />;

   return (
      <div className={styles['userContainer']}>
         <div className={styles['userContainer__contentContainer']}>
            <div className={styles['topInfo']}>
               <div className={styles['topInfo__photo']}>
                  <img src={DefaultUserImg} className={styles['image']} alt="" />
               </div>

               <div className={styles['topInfo__text']}>
                  <div className={styles['top']}>
                     <span className={styles['name']}>Никита Поздняк</span>
                     <LogOut />
                  </div>
                  <span className={styles['role']}>читатель</span>
                  <div className={styles['mail']}>
                     <span className={styles['mark']}>Почта:</span>
                     <a href="mailto:nikita220800@mail.ru" className={styles['mail-link']}>
                        nikita220800@mail.ru
                     </a>
                  </div>
                  <div className={styles['aboutYourSelf']}>
                     <span className={styles['mark']}>О себе:</span>
                     <AboutYourSelf
                        isYourAccount={checkYourAccount}
                        info={
                           'Очень интересная информация, которой я хочу поделиться на этой странице'
                        }
                     />
                  </div>
               </div>
            </div>
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
// @ts-ignore
export default withRouter(connect(mapStateToProps, null)(UserPage));
