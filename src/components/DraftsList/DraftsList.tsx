import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import ListItem from './ListItem';
import LoadMore from '@components/LoadMore';

import styles from './styles.module.scss';

type DraftsListProps = {
   className?: string | null;
   login: string;
   sendToEditorFunc: any;
   deleteDraftFunc: any;
};

const DraftsList: React.FC<DraftsListProps> = ({
   className,
   login,
   sendToEditorFunc,
   deleteDraftFunc
}) => {
   const [isShowing, setIsShowing] = useState(4);

   const [itemsList, setItemsList] = useState<any>(null);

   const [listIsLoading, setListIsLoading] = useState(true);

   const { db } = useSelector((state: any) => state.firebase);

   // Начать загрузку статей, когда компонент загружен
   useEffect(() => {
      setItemsList(null);
      setListIsLoading(true);
      const query = db.collection('articles').where('isShowing', '==', false);

      const filterAuthor = query.where('authorLink', '==', login);

      const observer = filterAuthor.onSnapshot(
         (querySnapshot: any) => {
            const docSnaps = querySnapshot.docs;
            const articles = [];
            for (var i in docSnaps) {
               articles.push(docSnaps[i].data());
            }
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
   }, []);

   return (
      <>
         <div className={styles['news-list']}>
            {listIsLoading ? (
               <div className={styles['loader']}>
                  <CircleSpinner size={40} color="#f2cb04" />
               </div>
            ) : itemsList.length === 0 ? (
               <div className={styles['loader']}>
                  <span>Вы еще не написали ни одной статьи =(</span>
               </div>
            ) : (
               <>
                  {itemsList.slice(0, isShowing).map((item: any) => (
                     <ListItem
                        news={item}
                        key={item.id}
                        sendToEditorFunc={sendToEditorFunc}
                        deleteFunc={deleteDraftFunc}
                     />
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

DraftsList.defaultProps = {
   className: null
};

// @ts-ignore
export default DraftsList;
