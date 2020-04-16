import React from 'react';

// @ts-ignore
import Slider from 'react-slick';

import classNames from 'classnames';

import { NavLink } from 'react-router-dom';

import Arrow from './Arrow';

import EyeImg from '@img/news/eye.png';

import styles from './style.module.scss';

type Props = {
   header: string;
   NewsArray: Array<NewsItem>;
   className?: string;
};

type NewsItem = {
   id: string;
   imgUrl: string;
   header: string;
   date: string;
   comments: number;
   views: number;
};

const NewsSlider: React.FC<Props> = ({ className, NewsArray, header }) => {
   const settings = {
      dots: false,
      infinite: true,
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
         <span className={styles['header']}>{header}</span>
         <Slider {...settings} className={styles['list-container']}>
            {NewsArray.map((newsItem) => (
               <NavLink key={newsItem.id} className={styles['item']} to={'news/' + newsItem.id}>
                  <div className={styles['photo-container']}>
                     <img src={newsItem.imgUrl} alt={'news pict'} className={styles['photo']} />
                  </div>
                  <div className={styles['text-container']}>
                     <span className={styles['text-container__name']}>
                        {newsItem.header.length > 60
                           ? newsItem.header.slice(0, 59) + '...'
                           : newsItem.header}
                     </span>

                     <div className={styles['text-container__info']}>
                        <span>{newsItem.date}</span>
                        <span>
                           {' '}
                           <img src={EyeImg} alt="show" className={styles['pict']} />
                           {newsItem.views}
                        </span>
                        <span>{newsItem.comments}</span>
                     </div>
                  </div>
               </NavLink>
            ))}
         </Slider>
      </div>
   );
};

export default NewsSlider;
