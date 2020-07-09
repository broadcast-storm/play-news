import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MainList from '@components/MainList';
import SideList from '@components/SideList';
import NewsSlider from '@components/NewsSlider';
import styles from './style.module.scss';

const Main: React.FC = () => {
   const { db } = useSelector((state: any) => state.firebase);
   const [itemsList, setItemsList] = useState<any>([]);
   const [listIsLoading, setListIsLoading] = useState(true);

   useEffect(() => {
      setItemsList([]);
      setListIsLoading(true);
      const query = db.collection('articles').where('isShowing', '==', true);

      const observer = query.onSnapshot(
         (querySnapshot: any) => {
            const docSnaps = querySnapshot.docs;
            const articles = [];
            for (var i in docSnaps) {
               articles.push(docSnaps[i].data());
            }
            setItemsList(
               articles
                  .filter((article) => article.viewsCount > 5)
                  .sort(function(a, b) {
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
   }, []);

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
         <NewsSlider NewsArray={itemsList} header={'Популярное'} listIsLoading={listIsLoading} />
      </>
   );
};

export default Main;
