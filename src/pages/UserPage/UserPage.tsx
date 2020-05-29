import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
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
                     <h2 className={styles['name']}>Никита Поздняк</h2>
                     <span>Выход</span>
                  </div>
                  <h3 className={styles['role']}>читатель</h3>
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
