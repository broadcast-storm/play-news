import React, { useEffect } from 'react';

import { NavLink } from 'react-router-dom';

import draftToHtml from 'draftjs-to-html';
// eslint-disable-next-line
import htmlToDraft from 'html-to-draftjs';
// @ts-ignore
import toHtml from 'string-to-html';

import {
   FacebookShareButton,
   TelegramShareButton,
   TwitterShareButton,
   VKShareButton
} from 'react-share';

import { FacebookIcon, TelegramIcon, TwitterIcon, VKIcon } from 'react-share';

import Star from '@img/article/star.svg';
import StarChecked from '@img/article/star_checked.svg';

import Eye from '@img/article/eye.svg';
import Comment from '@img/article/comment.svg';
import LikesDislikes from '@img/article/likedislike.svg';

import styles from './styles.module.scss';

type ArticleProps = {
   className?: string | null;
   content: any;
   isTest?: boolean;
   header: string | null;
   isFavourite?: boolean;
   date: any;
   author: string;
   authorLink: string;
   likes: number;
   dislikes: number;
   commentsCount: number;
   viewsCount: number;
   photoUrl: any;
};

const Article: React.FC<ArticleProps> = ({
   className,
   content,
   isTest,
   header,
   isFavourite,
   date,
   author,
   authorLink,
   likes,
   dislikes,
   commentsCount,
   viewsCount,
   photoUrl
}) => {
   useEffect(() => {
      if (content !== null) {
         const result = document.getElementById('articleResult');
         if (result !== null) {
            result.innerHTML = '';
            result.append(toHtml(draftToHtml(content)));
         }
      }
      // eslint-disable-next-line
   }, []);

   function formatDate(date: any) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;

      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;

      return dd + '.' + mm + '.' + date.getFullYear();
   }

   return (
      <div className={styles['article-container']}>
         <h1 className={styles['header']}>{header === '' ? 'Пустое название статьи' : header}</h1>
         <div className={styles['share-favourite']}>
            <div className={styles['share']}>
               <span className={styles['share-text']}>Поделиться: </span>
               <FacebookShareButton
                  url={'https://play-news.ru/'}
                  title={header!}
                  disabled={isTest}
                  className={styles['share-icon']}>
                  <FacebookIcon size={25} />
               </FacebookShareButton>
               <TelegramShareButton
                  url={'https://play-news.ru/'}
                  disabled={isTest}
                  title={header!}
                  className={styles['share-icon']}>
                  <TelegramIcon size={25} />
               </TelegramShareButton>
               <TwitterShareButton
                  url={'https://play-news.ru/'}
                  disabled={isTest}
                  title={header!}
                  className={styles['share-icon']}>
                  <TwitterIcon size={25} />
               </TwitterShareButton>
               <VKShareButton
                  url={'https://play-news.ru/'}
                  disabled={isTest}
                  title={header!}
                  className={styles['share-icon']}>
                  <VKIcon size={25} />
               </VKShareButton>
            </div>
            <div className={styles['favourite']}>
               <div className={styles['fav-icon']}>
                  <img src={isFavourite ? StarChecked : Star} alt="" />
               </div>
               <span className={styles['fav-text']}>В избранное</span>
            </div>
         </div>
         <div className={styles['info']}>
            <div className={styles['date-author']}>
               <span className={styles['date']}>{formatDate(date)}</span>
               {isTest ? (
                  <span className={styles['author']}>{author}</span>
               ) : (
                  <NavLink to={authorLink} className={styles['author']}>
                     {author}
                  </NavLink>
               )}
            </div>
            <div className={styles['statistics']}>
               <div className={styles['likes']}>
                  <div className={styles['pict']}>
                     <img src={LikesDislikes} alt="" />
                  </div>
                  <span className={styles['text']}>
                     {' '}
                     <span className={styles['green']}>{likes}</span>
                     {' / '}
                     <span className={styles['red']}>{dislikes}</span>
                  </span>
               </div>
               <div className={styles['views']}>
                  <div className={styles['pict']}>
                     <img src={Eye} alt="" />
                  </div>
                  <span className={styles['text']}>{viewsCount}</span>
               </div>
               <div className={styles['comments']}>
                  <div className={styles['pict']}>
                     <img src={Comment} alt="" />
                  </div>
                  <span className={styles['text']}>{commentsCount}</span>
               </div>
            </div>
         </div>
         <div className={styles['mainPhoto']}>
            {photoUrl === '' ? (
               <div className={styles['emptyPhoto']}>
                  <span>Нет главного фото</span>
               </div>
            ) : (
               <img src={photoUrl} alt="" />
            )}
         </div>
         <div id="articleResult" className={styles['content']}></div>
         <div>
            <div className={styles['share']}>
               <span className={styles['share-text']}>Поделиться: </span>
               <FacebookShareButton
                  url={'https://play-news.ru/'}
                  title={header!}
                  disabled={isTest}
                  className={styles['share-icon']}>
                  <FacebookIcon size={25} />
               </FacebookShareButton>
               <TelegramShareButton
                  url={'https://play-news.ru/'}
                  disabled={isTest}
                  title={header!}
                  className={styles['share-icon']}>
                  <TelegramIcon size={25} />
               </TelegramShareButton>
               <TwitterShareButton
                  url={'https://play-news.ru/'}
                  disabled={isTest}
                  title={header!}
                  className={styles['share-icon']}>
                  <TwitterIcon size={25} />
               </TwitterShareButton>
               <VKShareButton
                  url={'https://play-news.ru/'}
                  disabled={isTest}
                  title={header!}
                  className={styles['share-icon']}>
                  <VKIcon size={25} />
               </VKShareButton>
            </div>
         </div>
      </div>
   );
};

Article.defaultProps = {
   className: null,
   content: null,
   isTest: false,
   isFavourite: false
};

export default Article;
