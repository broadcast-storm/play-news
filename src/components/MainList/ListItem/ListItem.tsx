import React from 'react';
import { NavLink } from 'react-router-dom';
import Routes from '@config/routes';

import EyeImg from '@img/article/eye.svg';
import Comment from '@img/article/comment.svg';
import LikesDislikes from '@img/article/likedislike.svg';

import styles from './styles.module.scss';

type NewsType = {
   id: string;
   imgUrl: string;
   header: string;
   descrip: string;
   date: any;
   author: string;
   author_id: string;
   type: string;
   views: number;
   comments: number;
   likes: number;
   dislikes: number;
};

type ListItemProps = {
   className?: string | null;
   news: NewsType;
   isTest?: boolean;
};

// Выводит иформацию о статье, передаваемую через props
const ListItem: React.FC<ListItemProps> = ({ className, news }) => {
   function formatDate(date: any) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;

      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;

      return dd + '.' + mm + '.' + date.getFullYear();
   }
   return (
      <div className={styles['news-item']}>
         <div className={styles['news-item__picture']}>
            {news.imgUrl === 'File Not Found' || news.imgUrl === '' ? (
               <div className={styles['emptyPhoto']}>
                  <span>Нет фото</span>
               </div>
            ) : (
               <img src={news.imgUrl} alt="" className={styles['picture__img']} />
            )}
         </div>
         <div className={styles['news-item__text']}>
            <h2 className={styles['text__header']}>
               <NavLink
                  to={Routes.mainText.article.replace(':id', news.id).replace(':type', news.type)}
                  className={styles['text__header__link']}>
                  {news.header === '' ? 'Пустое название статьи' : news.header}
               </NavLink>
            </h2>
            <p className={styles['text__descrip']}>
               {news.descrip === '' ? 'Пустая аннотация к новой статье...' : news.descrip}
            </p>
            <div className={styles['text__row']}>
               <div>
                  <span className={styles['date']}>{formatDate(news.date)}</span>
                  <NavLink
                     to={Routes.userPage.replace(':login', news.author_id)}
                     className={styles['author']}>
                     {news.author}
                  </NavLink>
               </div>
               <div>
                  <span className={styles['likes']}>
                     <img src={LikesDislikes} alt="" />{' '}
                     <span className={styles['green']}>{news.likes}</span>
                     {' / '}
                     <span className={styles['red']}>{news.dislikes}</span>
                  </span>
                  <span className={styles['type']}>
                     {news.type === 'news'
                        ? 'Новости'
                        : news.type === 'articles'
                        ? 'Статьи'
                        : news.type === 'reviews'
                        ? 'Обзоры'
                        : ''}
                  </span>
                  <span>
                     {' '}
                     <img src={EyeImg} alt="views" className={styles['views-img']} />
                     {news.views}
                  </span>
                  <span>
                     {' '}
                     <img src={Comment} alt="views" className={styles['comments-img']} />
                     {news.comments}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
};

ListItem.defaultProps = {
   className: null,
   isTest: false
};

export default ListItem;
