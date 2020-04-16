import React from 'react';
import RightArrowUrl from '@icons/slider/arrow.svg';
import classNames from 'classnames';

import styles from './style.module.scss';

type ArrowProps = {
   type: 'previous' | 'next';
   onClick?: any;
};
const Arrow: React.FC<ArrowProps> = ({ type, onClick }) => {
   return (
      <button
         onClick={onClick}
         type={'button'}
         className={classNames(
            styles['arrow'],
            type === 'previous' ? styles['prev'] : styles['next']
         )}>
         <img src={RightArrowUrl} alt={type} />
      </button>
   );
};

export default Arrow;
