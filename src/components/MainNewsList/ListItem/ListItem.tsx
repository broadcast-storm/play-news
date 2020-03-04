import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import EyeImg from '@img/news/eye.png';

type NewsType = {
   id: string,
   imgUrl: string,
   header: string,
   descrip: string,
   date:string,
   author:string,
   author_id: string,
   type:string,
   views:number
}

type ListItemProps = {
   className?: string | null,
   news: NewsType
}

const ListItem: React.FC<ListItemProps>= ({className, news}) => {

   return (
      <div className={styles['news-item']}>
         <div className={styles['news-item__picture']}>
            <img src={news.imgUrl} alt="News pict" className={styles['picture__img']}/>
         </div>
         <div className={styles['news-item__text']}>
            <h2 className={styles['text__header']}>
               <NavLink to={'article/'+news.id} className={styles['text__header__link']}>{news.header} </NavLink>
            </h2>
            <p className={styles['text__descrip']}>{news.descrip}</p>
            <div className={styles['text__row']}>
               <div>
                  <span className={styles['date']}>{news.date}</span>
                  <NavLink to={'profile/'+news.author_id} className={styles['author']}>{news.author}</NavLink>
               </div>
               <div>
                  <span className={styles['type']}>{news.type}</span>
                  <span> <img src={EyeImg} alt="views" className={styles['views-img']}/>{news.views}</span>
               </div>

            </div>
         </div>
      </div>
   )
};

ListItem.defaultProps = {
   className: null
};

export default ListItem;