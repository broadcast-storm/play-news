import React from 'react';
// @ts-ignore
import Slider from 'react-slick';
import { NavLink } from 'react-router-dom';
import Arrow from './Arrow';
import classNames from 'classnames';

import Routes from '@config/routes';

import EyeImg from '@img/article/eye.svg';
import Comment from '@img/article/comment.svg';

import styles from './style.module.scss';

type Props = {
   header?: string;
   NewsArray: Array<NewsType>;
   className?: string;
   isTest?: boolean;
};

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

const NewsSlider: React.FC<Props> = ({ className, NewsArray, header, isTest }) => {
   function formatDate(date: any) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;

      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;

      return dd + '.' + mm + '.' + date.getFullYear();
   }

   // Настройки слайдера (адаптивность, ленивая загрузка и т д)
   const settings = {
      dots: false,
      infinite: !isTest,
      speed: 500,
      lazyload: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      nextArrow: <Arrow type={'next'} />,
      prevArrow: <Arrow type={'previous'} />,
      responsive: [
         {
            breakpoint: 1050,
            settings: {
               slidesToShow: 4
            }
         },
         {
            breakpoint: 860,
            settings: {
               slidesToShow: 3
            }
         },
         {
            breakpoint: 650,
            settings: {
               slidesToShow: 2
            }
         },
         {
            breakpoint: 440,
            settings: {
               slidesToShow: 1
            }
         }
      ]
   };
   return (
      <div className={classNames(styles['slider-container'], className)}>
         {!isTest ? <span className={styles['header']}>{header}</span> : null}
         <Slider {...settings} className={styles['list-container']}>
            {NewsArray.map((newsItem) => (
               <NavLink
                  key={newsItem.id}
                  className={styles['item']}
                  to={
                     newsItem.type === 'articles'
                        ? Routes.mainText.article.replace(':id', newsItem.id)
                        : newsItem.type === 'reviews'
                        ? Routes.mainText.review.replace(':id', newsItem.id)
                        : newsItem.type === 'news'
                        ? Routes.mainText.news.replace(':id', newsItem.id)
                        : '/'
                  }>
                  <div className={styles['photo-container']}>
                     {newsItem.imgUrl === 'File Not Found' || newsItem.imgUrl === '' ? (
                        <div className={styles['emptyPhoto']}>
                           <span>Нет фото</span>
                        </div>
                     ) : (
                        <img src={newsItem.imgUrl} alt="" className={styles['photo']} />
                     )}
                  </div>
                  <div className={styles['text-container']}>
                     <span className={styles['text-container__name']}>
                        {newsItem.header === ''
                           ? 'Пустое название'
                           : newsItem.header.length > 60
                           ? newsItem.header.slice(0, 59) + '...'
                           : newsItem.header}
                     </span>

                     <div className={styles['text-container__info']}>
                        <span>{formatDate(newsItem.date)}</span>
                        <span>
                           <img src={EyeImg} alt="" className={styles['pict']} />
                           {newsItem.views}
                        </span>
                        <span>
                           <img src={Comment} alt="" className={styles['comments-img']} />
                           {newsItem.comments}
                        </span>
                     </div>
                  </div>
               </NavLink>
            ))}
         </Slider>
      </div>
   );
};

NewsSlider.defaultProps = {
   isTest: false,
   header: ''
};

export default NewsSlider;
