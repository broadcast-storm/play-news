import React from 'react';
import classNames from 'classnames';

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
   redactorAnswer: string;
};

type ListItemProps = {
   className?: string | null;
   news: NewsType;
   isTest?: boolean;
   sendToEditorFunc: any;
   deleteFunc: any;
};

// Выводит иформацию о статье, передаваемую через props
const ListItem: React.FC<ListItemProps> = ({ className, news, sendToEditorFunc, deleteFunc }) => {
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
               <span className={styles['text__header__link']}>
                  {news.header === '' ? 'Пустое название статьи' : news.header}
               </span>
            </h2>
            <p className={styles['text__descrip']}>
               {news.annotation === '' ? 'Пустая аннотация к новой статье...' : news.annotation}
            </p>
            <div className={styles['text__row']}>
               <div>
                  <span className={styles['date']} onClick={() => sendToEditorFunc(news.id)}>
                     Редактировать
                  </span>
                  <span className={styles['author']} onClick={() => deleteFunc(news.id)}>
                     Удалить
                  </span>
               </div>
               <div
                  className={classNames(
                     styles['status'],
                     news.redactorAnswer === '' ? null : styles['red']
                  )}>
                  <span>Отправлено редактору</span>
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
