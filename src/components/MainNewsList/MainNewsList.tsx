import React, { useState, useEffect } from 'react';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';
import styles from './styles.module.scss';
import ListItem from './ListItem';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import SendImg from '@img/news/send.svg';
import SendHoverImg from '@img/news/sendHover.svg';
import SearchImg from '@img/news/search.png';

import LoadMore from '@components/LoadMore';

import Routes from '@config/routes';
import classNames from 'classnames';

import { NewsArray } from '../../mocks/index';

type MainNewsListProps = {
   className?: string | null;
   location: any;
   match: any;
   authUser: any;
   navbarInfo: any;
};

const MainNewsList: React.FC<MainNewsListProps> = ({
   className,
   location,
   match,
   authUser,
   navbarInfo
}) => {
   const [type, setType] = useState('editors');
   const [imgUrl, setImgUrl] = useState(SendImg);

   const [isShowing, setIsShowing] = useState(4);

   const [itemsList, setItemsList] = useState<any>(null);

   const [listIsLoading, setListIsLoading] = useState(true);

   const clickHandler = (type: string) => {
      setType(type);
   };
   const [userLogin, setUserLogin] = useState(null);

   const loadItems = () => {
      setListIsLoading(true);
      setTimeout(() => {
         setItemsList(NewsArray);
         setListIsLoading(false);
      }, 400);
   };

   useEffect(() => {
      loadItems();
   }, []);

   useEffect(() => {
      setListIsLoading(true);
      setItemsList(null);
      loadItems();
   }, [location.pathname]);

   useEffect(() => {
      if (authUser !== null)
         authUser.getIdTokenResult().then((idTokenResult: any) => {
            setUserLogin(idTokenResult.claims.login);
         });
   }, [authUser]);

   return (
      <>
         <div className={styles['news-list']}>
            <div className={styles['row']}>
               <div className={styles['news-type-change']}>
                  <button
                     className={styles['news-type']}
                     disabled={type === 'editors'}
                     onClick={() => clickHandler('editors')}>
                     редакционное
                  </button>
                  <span>&nbsp;/&nbsp;</span>
                  <button
                     className={styles['news-type']}
                     disabled={type === 'readers'}
                     onClick={() => clickHandler('readers')}>
                     читательское
                  </button>
               </div>
               {authUser !== null ? (
                  <NavLink
                     to={Routes.userPageScreens.editor.replace(':login', userLogin!)}
                     className={styles['send-new']}
                     onMouseEnter={() => {
                        setImgUrl(SendHoverImg);
                     }}
                     onMouseLeave={() => {
                        setImgUrl(SendImg);
                     }}>
                     {location.pathname === Routes.mainPage
                        ? 'прислать новость'
                        : location.pathname === Routes.mainCategories.reviews
                        ? 'написать обзор'
                        : location.pathname === Routes.mainCategories.articles
                        ? 'написать статью'
                        : null}
                     <img src={imgUrl} alt="send" className={styles['send-new__img']} />
                  </NavLink>
               ) : (
                  <div />
               )}
            </div>

            <div className={styles['row']}>
               <h2 className={styles['page-name']}>
                  {location.pathname === Routes.mainPage
                     ? 'Новости'
                     : location.pathname === Routes.mainCategories.reviews
                     ? 'Обзоры'
                     : location.pathname === Routes.mainCategories.articles
                     ? 'Статьи'
                     : null}
               </h2>
               <div className={styles['search-container']}>
                  <input
                     type="text"
                     className={styles['search-container__input']}
                     placeholder={'Поиск'}
                  />
                  <button className={styles['search-container__btn']}>
                     <img src={SearchImg} alt="search" />
                  </button>
               </div>
            </div>
            {listIsLoading ? (
               <div className={styles['loader']}>
                  <CircleSpinner size={40} color="#f2cb04" />
               </div>
            ) : (
               <>
                  {itemsList.slice(0, isShowing).map((item: any) => (
                     <ListItem news={item} key={item.id} />
                  ))}
               </>
            )}
         </div>
         {listIsLoading ? null : isShowing < itemsList.length ? (
            <LoadMore onClick={() => setIsShowing((prev) => prev + 3)} />
         ) : (
            <LoadMore onClick={() => setIsShowing(4)} reverse={true} />
         )}
      </>
   );
};

MainNewsList.defaultProps = {
   className: null
};

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};
// @ts-ignore
export default withRouter(connect(mapStateToProps, null)(MainNewsList));
