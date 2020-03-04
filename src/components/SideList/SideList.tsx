import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import SendImg from '@img/news/sendNews.png'
import classNames from 'classnames';

type MainNewsListProps = {
   className?: string | null
}

const SideList: React.FC<MainNewsListProps>= ({className}) => {

   const [type, setType] = useState('events');

   const clickHandler = (type : string) => {
      setType(type);
   };

   return (
      <div className={styles['side-list']}>
         <div className={styles['row']}>
               <button className={styles['news-type']}
                       disabled={type === 'events' } onClick={() => clickHandler('events')}>события</button>
               <button className={styles['news-type']}
                       disabled={type === 'reviews' } onClick={() => clickHandler('reviews')}>обзоры</button>
               <button className={styles['news-type']}
                       disabled={type === 'articles' } onClick={() => clickHandler('articles')}>статьи</button>
         </div>
      </div>
   )
};

SideList.defaultProps = {
   className: null
};

export default SideList;