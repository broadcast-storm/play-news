import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import Logo from '@components/Logo'
// import classNames from 'classnames';


const Footer: React.FC= () => {
   return (
      <footer className={styles['footer']}>
         <div className={styles['footer__row']}>
            <Logo className={styles['footer__logo']}/>
            <div className={styles['footer__links']}>
               <NavLink exact to={'/'} className={styles['links__item']} activeClassName={styles['link-active']}>Новости</NavLink>
               <NavLink to={'/articles'} className={styles['links__item']} activeClassName={styles['link-active']}>Статьи</NavLink>
               <NavLink to={'/reviews'} className={styles['links__item']} activeClassName={styles['link-active']}>Обзоры</NavLink>
               <NavLink to={'/favourites'} className={styles['links__item']} activeClassName={styles['link-active']}>Избранное</NavLink>
               <NavLink to={'/faq'} className={styles['links__item']} activeClassName={styles['link-active']}>FAQ</NavLink>
               <NavLink to={'/contacts'} className={styles['links__item']} activeClassName={styles['link-active']}>Контакты</NavLink>
            </div>
            <div className={styles['footer__empty-div']}/>
         </div>
            <form className={styles['footer__subscribe']}>
               <label>
                  <span className={styles['subscribe__text']}>Подписка на игровые новости</span>
               <div className={styles['subscribe__row']}>
                  <input type="email" className={styles['subscribe__input']}
                         inputMode={"email"} placeholder={'Ваш e-mail'} />
                  <button type='submit' className={styles['subscribe__btn']}>Подписаться</button>
               </div>
               </label>
            </form>
      </footer>
   )
};



export default Footer;