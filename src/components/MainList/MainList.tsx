import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import ListItem from './ListItem';
import LoadMore from '@components/LoadMore';
import Routes from '@config/routes';
import classNames from 'classnames';

import SendImg from '@img/news/send.svg';
import SendHoverImg from '@img/news/sendHover.svg';
import SearchImg from '@img/news/search.png';

import styles from './styles.module.scss';

type MainListProps = {
   className?: string | null;
   location: any;
   match: any;
   authUser: any;
   navbarInfo: any;
};

const MainList: React.FC<MainListProps> = ({
   className,
   location,
   match,
   authUser,
   navbarInfo
}) => {
   const [type, setType] = useState('redactor');
   const [tags, setTags] = useState<string>('');
   const [headerSearch, setHeaderSearch] = useState('');
   const [imgUrl, setImgUrl] = useState(SendImg);

   const [isShowing, setIsShowing] = useState(4);

   const [itemsList, setItemsList] = useState<any>(null);

   const [listIsLoading, setListIsLoading] = useState(true);

   const { db } = useSelector((state: any) => state.firebase);

   // Изменить тип выводимых статей (написанные читателями или редакторами)
   const clickHandler = (type: string) => {
      setType(type);
   };
   const [userLogin, setUserLogin] = useState(null);

   // Начать загрузку статей, когда компонент загружен
   useEffect(() => {
      setItemsList(null);
      setListIsLoading(true);
      const query = db.collection('articles').where('isShowing', '==', true);
      const filterArticleType = query.where(
         'articleType',
         '==',
         location.pathname === Routes.mainPage
            ? 'news'
            : location.pathname === Routes.mainCategories.reviews
            ? 'reviews'
            : location.pathname === Routes.mainCategories.articles
            ? 'articles'
            : null
      );
      const filterTag =
         tags === '' ? filterArticleType : filterArticleType.where('tags', 'array-contains', tags);

      const filterAuthorType = filterTag.where('authorType', '==', type);

      const observer = filterAuthorType.onSnapshot(
         (querySnapshot: any) => {
            const docSnaps = querySnapshot.docs;
            const articles = [];
            for (var i in docSnaps) {
               articles.push(docSnaps[i].data());
            }
            console.log(articles);
            setItemsList(
               articles.sort(function(a, b) {
                  return b.date.seconds - a.date.seconds;
               })
            );
            setListIsLoading(false);
         },
         (err: any) => {
            console.log(`Error loading articles: ${err}`);
         }
      );
      return () => {
         observer();
      };
      // eslint-disable-next-line
   }, [type, tags, location.pathname]);

   // Если пользователь авторизован, то сохранить его лоигн для добавления в ссылку
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
                     disabled={type === 'redactor'}
                     onClick={() => clickHandler('redactor')}>
                     редакционное
                  </button>
                  <span>&nbsp;/&nbsp;</span>
                  <button
                     className={styles['news-type']}
                     disabled={type === 'user'}
                     onClick={() => clickHandler('user')}>
                     читательское
                  </button>
               </div>
               {/* Если пользователь авторизован, то выводить ссылку ведующую 
               к редактору в его личном кабинете (вид ссылки меняется в зависимости от типа статей на экране) */}
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
               <div className={styles['search-part']}>
                  <select
                     className={classNames(styles['input'], styles['article-type'])}
                     required
                     title="Выберите один тег"
                     onChange={(e) => {
                        if (e.target.value === 'none') setTags('');
                        else setTags(e.target.value);
                     }}>
                     <option
                        value="none"
                        style={{
                           backgroundColor: '#E5E5E5',
                           fontStyle: 'italic',
                           color: 'gray'
                        }}>
                        По тегу
                     </option>
                     <option value="pc">PC</option>
                     <option value="xbox">Xbox</option>
                     <option value="ps4">PS4</option>
                     <option value="shooter">Шутеры</option>
                     <option value="strategy">Стратегии</option>
                     <option value="rpg">RPG</option>
                     <option value="racing">Гонки</option>
                     <option value="e3">E3</option>
                     <option value="exclusive">Эксклюзивы</option>
                     <option value="simulator">Симуляторы</option>
                  </select>

                  <div className={styles['search-container']}>
                     <input
                        type="text"
                        className={styles['search-container__input']}
                        placeholder={'Поиск'}
                        value={headerSearch}
                        onChange={(e) => setHeaderSearch(e.target.value)}
                     />
                     <button className={styles['search-container__btn']}>
                        <img src={SearchImg} alt="search" />
                     </button>
                  </div>
               </div>
            </div>
            {listIsLoading ? (
               <div className={styles['loader']}>
                  <CircleSpinner size={40} color="#f2cb04" />
               </div>
            ) : itemsList.length === 0 ? (
               <div className={styles['loader']}>
                  <span>Таких статей еще нет =(</span>
               </div>
            ) : (
               <>
                  {itemsList
                     .filter((item: any) => item.header.includes(headerSearch))
                     .slice(0, isShowing)
                     .map((item: any) => (
                        <ListItem news={item} key={item.id} />
                     ))}
               </>
            )}
         </div>
         {/* В зависимости от кол-ва видимых статей меняется действие функции нажатия на кнопку LoadMore */}
         {listIsLoading || itemsList.length < 5 ? null : isShowing < itemsList.length ? (
            <LoadMore onClick={() => setIsShowing((prev) => prev + 3)} />
         ) : (
            <LoadMore onClick={() => setIsShowing(4)} reverse={true} />
         )}
      </>
   );
};

MainList.defaultProps = {
   className: null
};

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};
// @ts-ignore
export default withRouter(connect(mapStateToProps, null)(MainList));
