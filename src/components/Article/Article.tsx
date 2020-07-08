import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { dislikeArticle, likeArticle } from '@actions/showedArticle';
import { CircleSpinner } from 'react-spinners-kit';

import { NavLink } from 'react-router-dom';

import draftToHtml from 'draftjs-to-html';
// eslint-disable-next-line
import htmlToDraft from 'html-to-draftjs';
// @ts-ignore
import toHtml from 'string-to-html';

import classNames from 'classnames';

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

import LikeSvg from '@img/likes/like.svg';
import LikedSvg from '@img/likes/liked.svg';
import DislikeSvg from '@img/likes/dislike.svg';
import DislikedSvg from '@img/likes/disliked.svg';
import LikeGraySvg from '@img/likes/like_gray.svg';
import DislikeGraySvg from '@img/likes/dislike_gray.svg';

import styles from './styles.module.scss';

type TagsArray =
   | 'xbox'
   | 'pc'
   | 'ps4'
   | 'shooter'
   | 'strategy'
   | 'rpg'
   | 'racing'
   | 'e3'
   | 'exclusive'
   | 'simulator';

type ArticleProps = {
   className?: string | null;
   content: any;
   isTest?: boolean;
   header: string | null;
   isFavourite?: boolean;
   date: any;
   author: string;
   authorLink: string;
   likes: Array<string>;
   dislikes: Array<string>;
   commentsCount: number;
   viewsCount: number;
   photoUrl: any;
   type: string;
   tags: Array<TagsArray>;
   articleId: string;
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
   photoUrl,
   tags,
   articleId
}) => {
   const TagsObj = {
      pc: 'PC',
      xbox: 'Xbox',
      ps4: 'PS4',
      shooter: 'Шутеры',
      strategy: 'Стратегии',
      rpg: 'RPG',
      racing: 'Гонки',
      e3: 'E3',
      exclusive: 'Эксклюзивы',
      simulator: 'Симуляторы'
   };

   const dispatch = useDispatch();
   const { navbarInfo, authUser } = useSelector((state: any) => state.firebase);
   const { isLikingArticle } = useSelector((state: any) => state.showedArticle);

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

   const sendLike = () => {
      if (authUser !== null && isLikingArticle === null && !isTest)
         dispatch(likeArticle(articleId));
   };

   const sendDislike = () => {
      if (authUser !== null && isLikingArticle === null && !isTest)
         dispatch(dislikeArticle(articleId));
   };
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
            <div className={classNames(styles['favourite'], styles['hidden'])}>
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
                     <span className={styles['green']}>{likes.length}</span>
                     {' / '}
                     <span className={styles['red']}>{dislikes.length}</span>
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
            {photoUrl === 'File Not Found' ? (
               <div className={styles['emptyPhoto']}>
                  <span>Нет главного фото</span>
               </div>
            ) : (
               <img src={photoUrl} alt="" />
            )}
         </div>
         <div id="articleResult" className={styles['content']}></div>
         <div className={styles['share-favourite']}>
            <div className={styles['tags']}>
               {tags.length === 0
                  ? 'Нет тегов'
                  : tags.map((tag, index) => (
                       <span key={'tag' + index} className={styles['tag']}>
                          {/* @ts-ignore */}
                          {TagsObj[tag]}
                       </span>
                    ))}
            </div>
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
         {authUser === null || isTest ? null : (
            <div
               className={classNames(
                  styles['doYouLike'],
                  navbarInfo === null
                     ? null
                     : dislikes.indexOf(navbarInfo.openInfo.login) !== -1
                     ? styles['disliked']
                     : likes.indexOf(navbarInfo.openInfo.login) !== -1
                     ? styles['liked']
                     : null
               )}>
               <span className={styles['question']}>А вам понравилась статья? </span>
               <div
                  className={classNames(
                     styles['like-btn'],
                     styles['dislike'],
                     navbarInfo === null
                        ? null
                        : likes.indexOf(navbarInfo.openInfo.login) !== -1
                        ? styles['gray']
                        : null
                  )}
                  onClick={sendDislike}>
                  <span>Нет</span>
                  <div className={styles['pict']}>
                     <img
                        src={
                           navbarInfo === null
                              ? DislikeSvg
                              : dislikes.indexOf(navbarInfo.openInfo.login) !== -1
                              ? DislikedSvg
                              : likes.indexOf(navbarInfo.openInfo.login) !== -1
                              ? DislikeGraySvg
                              : DislikeSvg
                        }
                        alt=""
                     />
                  </div>
                  {isLikingArticle === 'dislike' ? (
                     <div className={styles['like-loader']}>
                        <CircleSpinner size={16} color={'#C90E0E'} />
                     </div>
                  ) : null}
               </div>
               <div
                  className={classNames(
                     styles['like-btn'],
                     styles['like'],
                     navbarInfo === null
                        ? null
                        : dislikes.indexOf(navbarInfo.openInfo.login) !== -1
                        ? styles['gray']
                        : null
                  )}
                  onClick={sendLike}>
                  <span>Да</span>
                  <div className={styles['pict']}>
                     <img
                        src={
                           navbarInfo === null
                              ? LikeSvg
                              : likes.indexOf(navbarInfo.openInfo.login) !== -1
                              ? LikedSvg
                              : dislikes.indexOf(navbarInfo.openInfo.login) !== -1
                              ? LikeGraySvg
                              : LikeSvg
                        }
                        alt=""
                     />
                  </div>
                  {isLikingArticle === 'like' ? (
                     <div className={styles['like-loader']}>
                        <CircleSpinner size={16} color={'#3FC90E'} />
                     </div>
                  ) : null}
               </div>
            </div>
         )}
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
