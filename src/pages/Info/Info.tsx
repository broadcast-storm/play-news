import React from 'react';
import { Helmet } from 'react-helmet';
import ReactGoogleSlides from 'react-google-slides';

import BackImg from '@img/landing/back.jpg';
import BackImg2 from '@img/landing/back2.jpg';
import LogoImg from '@img/landing/logo.png';
import AdminImg from '@img/landing/admin.svg';
import UserImg from '@img/landing/user.svg';
import RedactorImg from '@img/landing/redactor.svg';

import FireBaseImg from '@img/landing/firebase.png';
import GitImg from '@img/landing/git.png';
import NodeImg from '@img/landing/nodejs.png';
import ReactImg from '@img/landing/react.png';
import ReduxImg from '@img/landing/redux.png';
import SassImg from '@img/landing/sass.png';
import TsImg from '@img/landing/ts.png';
import WebpackImg from '@img/landing/webpack.png';

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
                        <a
                           href="https://play-news.ru/"
                           className={styles['link']}
                           target="_blank"
                           rel="noopener noreferrer">
                           Сайт
                        </a>
                        <a
                           href="https://github.com/nikita220800/play-news"
                           className={styles['link']}
                           target="_blank"
                           rel="noopener noreferrer">
                           Репозиторий
                        </a>
                     </div>
                  </div>
                  <img src={BackImg} alt="" className={styles['back-pict']} />
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
                  <div className={classNames(styles['dark-back'], styles['second-dark'])}>
                     <div className={styles['text-block']}>
                        <h3>Обоснование проблемы:</h3>
                        <span>
                           Многие новостные сайты отпугивают пользователей своим громоздким и
                           неудобным дизайном
                        </span>
                        <span>
                           Сайты, посвященные игровой индустрии пытаются обхватить все сферы
                           игфромационного пространства (от кино до политики), что тоже плохо
                           сказывается на аудитории
                        </span>
                        <span>
                           Новостные сайты не дают пользователям возможность для обратной связи
                        </span>

                        <h3>Цели создания системы:</h3>
                        <span>
                           Привлечение целевой аудитории - геймеров и людей, интересующихся игровой
                           индустрией
                        </span>
                        <span>Популяризация бренда Play News</span>
                        <span>
                           Получение обратной связи от пользователей сайта и тем самым, удержание
                           аудитории
                        </span>
                     </div>
                  </div>
                  <img src={BackImg2} alt="" className={styles['back-pict']} />
               </div>
            </div>

            <h2 style={{ textAlign: 'center', margin: '50px 10px 10px 10px' }}>
               Использованные технологии
            </h2>
            <div className={styles['technologies']}>
               <a
                  href="https://reactjs.org/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={ReactImg} alt="react" />
               </a>
               <a
                  href="https://redux.js.org/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={ReduxImg} alt="redux" />
               </a>
               <a
                  href="https://firebase.google.com/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={FireBaseImg} alt="firebase" />
               </a>
               <a
                  href="https://nodejs.org/en/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={NodeImg} alt="nodejs" />
               </a>
               <a
                  href="https://git-scm.com/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={GitImg} alt="git" />
               </a>
               <a
                  href="https://sass-scss.ru/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={SassImg} alt="sass/scss" />
               </a>
               <a
                  href="https://www.typescriptlang.org/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={TsImg} alt="typescript" />
               </a>
               <a
                  href="https://webpack.js.org/"
                  className={styles['tech-link']}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={WebpackImg} alt="webpack" />
               </a>
            </div>

            <h2 style={{ textAlign: 'center', margin: '50px 10px 10px 10px' }}>Презентация</h2>
            <div className={styles['prezentation']}>
               <ReactGoogleSlides
                  width={300}
                  height={180}
                  slidesLink="https://docs.google.com/presentation/d/1meH9OZkFxCcs9Jf3BuExtfLRmf2HjIFdu9U79bVtZxk/edit?usp=sharing"
                  slideDuration={5}
                  showControls
                  loop
               />
            </div>

            <p className={styles['end-text']}>© 2020. Поздняков Никита. 181-322</p>
         </div>
      </>
   );
};

export default Info;
