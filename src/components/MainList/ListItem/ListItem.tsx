import React from 'react';
import { NavLink } from 'react-router-dom';
import Routes from '@config/routes';

import EyeImg from '@img/article/eye.svg';
import Comment from '@img/article/comment.svg';
import LikesDislikes from '@img/article/likedislike.svg';

import styles from './styles.module.scss';

type NewsType = {
   id: string;
   smallPhotoUrl: string;
   header: string;
   annotation: string;
   date: any;
   author: string;
   authorLink: string;
   articleType: string;
   viewsCount: number;
   commentsCount: number;
   likes: Array<string>;
   dislikes: Array<string>;
};

type ListItemProps = {
   className?: string | null;
   news: NewsType;
   isTest?: boolean;
};

// Выводит иформацию о статье, передаваемую через props
const ListItem: React.FC<ListItemProps> = ({ className, news }) => {
   function formatDate(date: any) {
      let _date: any;
      if (!(date instanceof Date)) {
         _date = new Date(date.seconds * 1000);
      } else _date = date;
      var dd = _date.getDate();
      if (dd < 10) dd = '0' + dd;

      var mm = _date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;

      return dd + '.' + mm + '.' + _date.getFullYear();
   }
   return (
      <div className={styles['news-item']}>
         <div className={styles['news-item__picture']}>
            {news.smallPhotoUrl === 'File Not Found' || news.smallPhotoUrl === '' ? (
               <div className={styles['emptyPhoto']}>
                  <span>Нет фото</span>
               </div>
            ) : (
               <img src={news.smallPhotoUrl} alt="" className={styles['picture__img']} />
            )}
         </div>
         <div className={styles['news-item__text']}>
            <h2 className={styles['text__header']}>
               <NavLink
                  to={Routes.mainText.article
                     .replace(':id', news.id)
                     .replace(':type', news.articleType)}
                  className={styles['text__header__link']}>
                  {news.header === '' ? 'Пустое название статьи' : news.header}
               </NavLink>
            </h2>
            <p className={styles['text__descrip']}>
               {news.annotation === '' ? 'Пустая аннотация к новой статье...' : news.annotation}
            </p>
            <div className={styles['text__row']}>
               <div>
                  <span className={styles['date']}>{formatDate(news.date)}</span>
                  <NavLink
                     to={Routes.userPage.replace(':login', news.authorLink)}
                     className={styles['author']}>
                     {news.author}
                  </NavLink>
               </div>
               <div>
                  <span className={styles['likes']}>
                     <img src={LikesDislikes} alt="" />{' '}
                     <span className={styles['green']}>{news.likes.length}</span>
                     {' / '}
                     <span className={styles['red']}>{news.dislikes.length}</span>
                  </span>
                  <span className={styles['type']}>
                     {news.articleType === 'news'
                        ? 'Новости'
                        : news.articleType === 'articles'
                        ? 'Статьи'
                        : news.articleType === 'reviews'
                        ? 'Обзоры'
                        : ''}
                  </span>
                  <span>
                     {' '}
                     <img src={EyeImg} alt="views" className={styles['views-img']} />
                     {news.viewsCount}
                  </span>
                  <span>
                     {' '}
                     <img src={Comment} alt="views" className={styles['comments-img']} />
                     {news.commentsCount}
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
