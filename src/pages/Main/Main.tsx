import React from 'react';
import MainList from '@components/MainList';
import SideList from '@components/SideList';
import NewsSlider from '@components/NewsSlider';
import styles from './style.module.scss';

import { NewsArray } from '../../mocks/index';

const Main: React.FC = () => {
   return (
      <>
         <div className={styles['news']}>
            <div className={styles['news__main-container']}>
               <MainList />
            </div>
            <div className={styles['news__side-container']}>
               <SideList />
            </div>
         </div>
         <NewsSlider NewsArray={NewsArray} header={'Популярное'} />
      </>
   );
};

export default Main;
