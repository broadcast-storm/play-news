import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { doSignOut } from '@actions/firebase';

import styles from '../style.module.scss';

import { CircleSpinner } from 'react-spinners-kit';

const VerifyMail: React.FC<{ doSignOut: any; verified: boolean }> = ({ doSignOut, verified }) => {
   const [clicked, setClicked] = useState(false);

   useEffect(() => {
      return () => {
         if (!clicked && !verified) {
            doSignOut();
         }
      };
   }, []);

   return (
      <>
         <span className={styles['verifyMail-text']}>
            На вашу почту отправлено письмо для подтверждения регистрации. Пожалуйста, перед
            переходом в свой профиль подтвердите свою почту
         </span>
         <br />
         <br />
         <div className={styles['login-page__login-form']}>
            <button
               className={styles['login-form__btn']}
               onClick={() => {
                  setClicked(true);
                  window.location.reload(false);
               }}>
               {!clicked ? 'Перейти в свой профиль' : <CircleSpinner size={21} color="#182126" />}
            </button>
         </div>
      </>
   );
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      doSignOut: () => dispatch(doSignOut())
   };
};

export default connect(null, mapDispatchToProps)(VerifyMail);
