import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { withRouter } from 'react-router-dom';

import Article from '@components/Article';

import { getViewedArticle } from '@actions/showedArticle';

import { CircleSpinner } from 'react-spinners-kit';

import SideList from '@components/SideList';

import styles from './style.module.scss';

type ArticleProps = {
   match: any;
};

const ArticlePage: React.FC<ArticleProps> = ({ match }) => {
   const dispatch = useDispatch();
   const { initialized } = useSelector((state: any) => state.firebase);
   const { isLoading, isLoadingComments, description, content, comments, error } = useSelector(
      (state: any) => state.showedArticle
   );
   useEffect(() => {
      if (initialized) {
         dispatch(getViewedArticle(match.params.type, match.params.id));
      }
      // eslint-disable-next-line
   }, [match.params.id, initialized]);
   return (
      <div className={styles['article']}>
         <div className={styles['article__main-container']}>
            {isLoading ? (
               <div className={styles['loader']}>
                  <CircleSpinner size={40} color="#f2cb04" />
               </div>
            ) : error ? (
               <div className={styles['loader']}>
                  <span>Статьи по данной ссылке нет =(</span>
               </div>
            ) : (
               <>
                  <Article
                     content={content}
                     header={description.header}
                     date={description.date}
                     author={description.author}
                     authorLink={description.authorLink}
                     likes={description.likes}
                     dislikes={description.dislikes}
                     commentsCount={description.commentsCount}
                     viewsCount={description.viewsCount}
                     photoUrl={description.mainPhotoUrl}
                     type={description.articleType}
                     tags={description.tags}
                  />
               </>
            )}
         </div>
         <div className={styles['article__side-container']}>
            <SideList />
         </div>
      </div>
   );
};

export default withRouter(ArticlePage);
