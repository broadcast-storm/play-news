import React, { useState } from 'react';

import styles from '../style.module.scss';

import { CircleSpinner } from 'react-spinners-kit';

const VerifyMail: React.FC = () => {
   const [clicked, setClicked] = useState(false);
   return (
      <>
         <span>
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

export default VerifyMail;
