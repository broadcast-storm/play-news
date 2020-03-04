import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import ListItem from './ListItem';
import SendImg from '@img/news/sendNews.png';
import SearchImg from '@img/news/search.png';
import classNames from 'classnames';

import  {NewsArray} from '../../mocks/index';


type MainNewsListProps = {
   className?: string | null
}

const MainNewsList: React.FC<MainNewsListProps>= ({className}) => {
   const [type, setType] = useState('editors');

   const clickHandler = (type : string) => {
      setType(type);
   };

   return (
      <div className={styles['news-list']}>
         <div className={styles['row']}>
            <div  className={styles['news-type-change']}>
               <button className={styles['news-type']}
                       disabled={type === 'editors' }
                       onClick={() => clickHandler('editors')}>
                  редакционное
               </button>
               <span>&nbsp;/&nbsp;</span>
               <button className={styles['news-type']}
                       disabled={type === 'readers' }
                       onClick={() => clickHandler('readers')}>
                  читательское
               </button>
            </div>

            <NavLink to={'/send'} className={styles['send-new']}>
               прислать новость <img src={SendImg} alt="send"/>
            </NavLink>
         </div>
         <div className={styles['row']}>
            <h2 className={styles['page-name']}>Новости</h2>
            <div className={styles['search-container']}>
               <input type="text" className={styles['search-container__input']}
               placeholder={'Поиск'}/>
               <button className={styles['search-container__btn']}>
                  <img src={SearchImg} alt="search"/>
               </button>
            </div>
            
         </div>
         {NewsArray.map((item) => <ListItem news={item} key={item.id}/> )}
      </div>
   )
};

MainNewsList.defaultProps = {
   className: null
};

export default MainNewsList;