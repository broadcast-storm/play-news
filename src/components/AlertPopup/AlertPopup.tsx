import React from 'react';
import classNames from 'classnames';

import CloseImg from '@img/alert/close.png';
import CloseWhiteImg from '@img/alert/closeWhite.png';

import styles from './styles.module.scss';

type AlertPopupProps = {
   className?: string | null;
   isShow: boolean;
   setShowAlert: any;
   messageText: string | null;
   status?: 'Error' | 'Alert';
};

const AlertPopup: React.FC<AlertPopupProps> = ({
   isShow,
   setShowAlert,
   messageText,
   status,
   className
}) => {
   // В зависимости от передаваемого props выводится popup
   if (!isShow) return null;

   return (
      <div className={styles['popupBack']}>
         <div className={classNames(styles['popup'], className)}>
            {/* Оформление popup меняется от передаваемого props */}
            <div
               className={classNames(
                  styles['status'],
                  status === 'Alert' ? styles['alert'] : status === 'Error' ? styles['error'] : null
               )}>
               <span>
                  {status === 'Alert' ? 'Предупреждение' : status === 'Error' ? 'Ошибка' : null}
               </span>
               <img
                  src={
                     status === 'Alert' ? CloseImg : status === 'Error' ? CloseWhiteImg : undefined
                  }
                  alt=""
                  className={styles['exitImg']}
                  onClick={() => setShowAlert(false)}
               />
            </div>
            <div className={styles['text']}>
               <span>{messageText}</span>
            </div>
         </div>
      </div>
   );
};

AlertPopup.defaultProps = {
   className: null,
   isShow: false,
   messageText: null,
   status: 'Alert'
};

export default AlertPopup;
