import React from 'react';
import { Helmet } from 'react-helmet';

import BackImg from '@img/landing/back.jpg';
import BackImg2 from '@img/landing/back2.jpg';
import LogoImg from '@img/landing/logo.png';
import AdminImg from '@img/landing/admin.svg';
import UserImg from '@img/landing/user.svg';
import RedactorImg from '@img/landing/redactor.svg';

import classNames from 'classnames';

import styles from './style.module.scss';

const Info: React.FC = () => {
   return (
      <>
         <Helmet>
            <title>Play News | О проекте</title>
         </Helmet>
         <div className={styles['info-page']}>
            <div className={styles['main-picture']}>
               <div className={styles['main-picture__picture-container']}>
                  <div className={styles['dark-back']}>
                     <img src={LogoImg} alt="" />
                     <h3>Курсовой проект Позднякова Никиты, 181-322</h3>
                     <h1>
                        Новостной сайт об игровой индустрии <br /> Play News
                     </h1>
                     <div className={styles['links']}>
                        <a href="https://play-news.ru/" className={styles['link']}>
                           Сайт
                        </a>
                        <a
                           href="https://github.com/nikita220800/play-news"
                           className={styles['link']}>
                           Репозиторий
                        </a>
                     </div>
                  </div>
                  <img src={BackImg} alt="" />
               </div>
            </div>
            <h2 style={{ textAlign: 'center', margin: '50px 10px 10px 10px' }}>
               Роли, имеющиеся в системе
            </h2>
            <div className={styles['roles']}>
               <div className={styles['role']}>
                  <div className={styles['img-container']}>
                     <img src={AdminImg} alt="" />
                  </div>
                  <div className={styles['text-container']}>
                     <h2>Администратор</h2>
                     <span>
                        Имеет доступ ко спискам всех пользователей, редакторов, статей. Может
                        назначать роли (админов, редакторов) другим пользователям. Имеет все
                        возможности редактора
                     </span>
                  </div>
               </div>
               <div className={styles['role']}>
                  <div className={styles['img-container']}>
                     <img src={RedactorImg} alt="" />
                  </div>
                  <div className={styles['text-container']}>
                     <h2>Редактор</h2>
                     <span>
                        Может писать статьи, проверять статьи, отправленные обычными читателями и
                        публиковать их{' '}
                     </span>
                  </div>
               </div>
               <div className={styles['role']}>
                  <div className={styles['img-container']}>
                     <img src={UserImg} alt="" />
                  </div>
                  <div className={styles['text-container']}>
                     <h2>Читатель</h2>
                     <span>
                        Может просматривать статьи, оставлять им оценки и комментарии, а так же сам
                        писать статьи.
                     </span>
                  </div>
               </div>
            </div>

            <div className={styles['main-picture']}>
               <div
                  className={classNames(
                     styles['main-picture__picture-container'],
                     styles['second-picture-container']
                  )}>
                  <div className={classNames(styles['dark-back'], styles['second-dark'])}></div>
                  <img src={BackImg2} alt="" />
               </div>
            </div>
            <div className="jumbotron bg-white">
               <div className="container">
                  <p>Автор: Никита Поздняков</p>
               </div>
            </div>
         </div>
      </>
   );
};

export default Info;
