import React from 'react';
import { Helmet } from 'react-helmet';

import BackImg from '@img/landing/back.jpg';
import LogoImg from '@img/landing/logo.png';

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

            <div className={styles['roles']}></div>
            <div className="jumbotron bg-white">
               <div className="container">
                  <h3 className="display-8">Информация о приложении</h3>
                  <p className="lead">Play News - сайт об играх и всём, что с ними связано</p>
                  <p>Автор: Никита Поздняков</p>
               </div>
            </div>
         </div>
      </>
   );
};

export default Info;
