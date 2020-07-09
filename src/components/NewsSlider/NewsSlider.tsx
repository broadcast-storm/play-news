import React from 'react';
// @ts-ignore
import Slider from 'react-slick';
import { NavLink } from 'react-router-dom';
import Arrow from './Arrow';
import classNames from 'classnames';
import { CircleSpinner } from 'react-spinners-kit';
import Routes from '@config/routes';

import EyeImg from '@img/article/eye.svg';
import Comment from '@img/article/comment.svg';

import styles from './style.module.scss';

type Props = {
   header?: string;
   NewsArray: Array<NewsType>;
   className?: string;
   isTest?: boolean;
   listIsLoading: boolean;
};

type NewsType = {
   id: string;
   smallPhotoUrl: string;
   header: string;
   descrip: string;
   date: any;
   author: string;
   authorLink: string;
   articleType: string;
   viewsCount: number;
   commentsCount: number;
   likes: Array<string>;
   dislikes: Array<string>;
};

const NewsSlider: React.FC<Props> = ({ className, NewsArray, header, isTest, listIsLoading }) => {
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

   // Настройки слайдера (адаптивность, ленивая загрузка и т д)
   const settings = {
      dots: false,
      infinite: false,
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
         {listIsLoading ? (
            <div className={styles['loader']}>
               <CircleSpinner size={40} color="#f2cb04" />
            </div>
         ) : (
            <Slider {...settings} className={styles['list-container']}>
               {NewsArray.map((newsItem) => (
                  <NavLink
                     key={newsItem.id}
                     className={styles['item']}
                     to={Routes.mainText.article
                        .replace(':id', newsItem.id)
                        .replace(':type', newsItem.articleType)}>
                     <div className={styles['photo-container']}>
                        {newsItem.smallPhotoUrl === 'File Not Found' ||
                        newsItem.smallPhotoUrl === '' ? (
                           <div className={styles['emptyPhoto']}>
                              <span>Нет фото</span>
                           </div>
                        ) : (
                           <img src={newsItem.smallPhotoUrl} alt="" className={styles['photo']} />
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
                              {newsItem.viewsCount}
                           </span>
                           <span>
                              <img src={Comment} alt="" className={styles['comments-img']} />
                              {newsItem.commentsCount}
                           </span>
                        </div>
                     </div>
                  </NavLink>
               ))}
            </Slider>
         )}
      </div>
   );
};

NewsSlider.defaultProps = {
   isTest: false,
   header: ''
};

export default NewsSlider;
