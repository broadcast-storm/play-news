import React from 'react';
import MainNewsList from '@components/MainNewsList'
import SideList from '@components/SideList'
import styles from './style.module.scss'


const News: React.FC = () => {

   return (
      <div className={styles['news']}>
         <div className={styles['news__main-container']}>
            <MainNewsList />
         </div>
         <div className={styles['news__side-container']}>
            <SideList/>
         </div>

      </div>
   );
};

export default News;
