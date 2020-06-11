import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Routes from '@config/routes';
import classNames from 'classnames';

import Logo from '@components/Logo';
import Vk from '@img/social/vk.png';
import Tel from '@img/social/telegram.png';
import Facebook from '@img/social/facebook.png';
import Twitter from '@img/social/twitter.png';
import Inst from '@img/social/instagram.png';

import styles from './styles.module.scss';

const Footer: React.FC = () => {
   // Функция подписки на рассылку о нвостях по почте
   const submitFunc = (e: any) => {
      e.preventDefault();
   };
   return (
      <footer className={styles['footer']}>
         <div className={styles['footer__row']}>
            <Logo className={styles['footer__logo']} />
            <div className={styles['footer__links']}>
               <NavLink
                  exact
                  to={Routes.mainPage}
                  className={styles['links__item']}
                  activeClassName={styles['link-active']}>
                  Новости
               </NavLink>
               <NavLink
                  to={Routes.mainCategories.articles}
                  className={styles['links__item']}
                  activeClassName={styles['link-active']}>
                  Статьи
               </NavLink>
               <NavLink
                  to={Routes.mainCategories.reviews}
                  className={styles['links__item']}
                  activeClassName={styles['link-active']}>
                  Обзоры
               </NavLink>
               <NavLink
                  to={Routes.infoPage}
                  className={styles['links__item']}
                  activeClassName={styles['link-active']}>
                  О проекте
               </NavLink>
               <NavLink
                  to={Routes.faq}
                  className={styles['links__item']}
                  activeClassName={styles['link-active']}>
                  FAQ
               </NavLink>
            </div>
            <div className={styles['footer__empty-div']} />
         </div>
         <form className={styles['footer__subscribe']}>
            <label>
               <span className={styles['subscribe__text']}>Подписка на игровые новости</span>
               <div className={styles['subscribe__row']}>
                  <input
                     type="email"
                     className={styles['subscribe__input']}
                     inputMode={'email'}
                     placeholder={'Ваш e-mail'}
                  />
                  <button className={styles['subscribe__btn']} onClick={submitFunc}>
                     Подписаться
                  </button>
               </div>
            </label>
         </form>
         <div className={styles['footer__row-bottom']}>
            <div className={styles['footer__social']}>
               <Link to={'/'} className={styles['social__item']}>
                  <img src={Vk} alt="Vk" />
               </Link>
               <Link to={'/'} className={styles['social__item']}>
                  <img src={Facebook} alt="Facebook" />
               </Link>
               <Link to={'/'} className={styles['social__item']}>
                  <img src={Inst} alt="Instagram" />
               </Link>
               <Link to={'/'} className={styles['social__item']}>
                  <img src={Twitter} alt="Twitter" />
               </Link>
               <Link to={'/'} className={styles['social__item']}>
                  <img src={Tel} alt="Telegram" />
               </Link>
            </div>
            <div className={styles['footer__bottom-links']}>
               <NavLink
                  to={'/advertising'}
                  className={classNames(styles['links__item'], styles['link-border'])}
                  activeClassName={styles['link-active']}>
                  Реклама
               </NavLink>
               <NavLink
                  to={'/contacts'}
                  className={classNames(styles['links__item'], styles['link-border'])}
                  activeClassName={styles['link-active']}>
                  Контакты
               </NavLink>
               <NavLink
                  to={'/job-openings'}
                  className={classNames(styles['links__item'], styles['link-last'])}
                  activeClassName={styles['link-active']}>
                  Вакансии
               </NavLink>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
