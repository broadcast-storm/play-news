import React from 'react';
import classNames from 'classnames';

import ArrowImg from '@icons/loadmore/arrow.svg';

import styles from './style.module.scss';

type Props = {
   className?: string;
   onClick?: any;
   reverse?: boolean;
};

const LoadMore: React.FC<Props> = ({ className, onClick, reverse }) => {
   return (
      <div className={classNames(styles['container'], className)} onClick={onClick}>
         {/* В зависимости от передаваемого props.reverse меняется вид кнопки */}
         {reverse ? (
            <>
               <span>Скрыть</span>
               <img
                  src={ArrowImg}
                  alt="Arrow"
                  className={classNames(styles['arrow'], styles['up'])}
               />
            </>
         ) : (
            <>
               <span>Показать ещё</span>
               <img src={ArrowImg} alt="Arrow" className={styles['arrow']} />
            </>
         )}
      </div>
   );
};

LoadMore.defaultProps = {
   reverse: false
};

export default LoadMore;
