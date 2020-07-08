import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { useSelector, useDispatch } from 'react-redux';

import { withRouter } from 'react-router-dom';

import Article from '@components/Article';

import Comments from '@components/Comments';

import { getViewedArticle } from '@actions/showedArticle';

import { CircleSpinner } from 'react-spinners-kit';

import SideList from '@components/SideList';

import styles from './style.module.scss';

type ArticleProps = {
   match: any;
};

const ArticlePage: React.FC<ArticleProps> = ({ match }) => {
   const dispatch = useDispatch();
   const [comments, setComments] = useState<any>(null);
   const [description, setDescription] = useState<any>(null);
   const [isLoadingDescrip, setIsLoadingDescrip] = useState(true);
   const [errorLoading, setErrorLoading] = useState(false);
   const { initialized, db, storageRef } = useSelector((state: any) => state.firebase);
   const { isLoading, content, error, commentIsSending } = useSelector(
      (state: any) => state.showedArticle
   );

   useEffect(() => {
      const unsubscribeArticles = db
         .collection('articles')
         .doc(match.params.id)
         .onSnapshot((doc: any) => {
            if (doc.exists) setDescription(doc.data());
            else setErrorLoading(true);
            setIsLoadingDescrip(false);
         });

      const unsubscribeComments = db
         .collection('comments')
         .doc(match.params.id)
         .onSnapshot(async (doc: any) => {
            if (doc.exists) {
               let dataComments = doc.data().comments;
               await Promise.all(
                  dataComments.map(async (comment: any) => {
                     if (comment.userPhoto !== null)
                        comment.userPhoto = await storageRef
                           .child(`usersPhoto/${comment.userLogin}/thumb@64_photo.jpg`)
                           .getDownloadURL();
                  })
               );
               setComments(dataComments);
            } else {
               setErrorLoading(true);
            }
         });
      return () => {
         unsubscribeArticles();
         unsubscribeComments();
      };
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      if (initialized) {
         dispatch(getViewedArticle(match.params.type, match.params.id));
      }

      // eslint-disable-next-line
   }, [match.params.id, initialized]);

   return (
      <>
         <Helmet>
            <title>{description !== null ? description.header : 'Play News'}</title>
            <meta
               name="description"
               content={description !== null ? description.annotation : 'Play News'}
            />
         </Helmet>
         <div className={styles['article']}>
            <div className={styles['article__main-container']}>
               {isLoading || isLoadingDescrip ? (
                  <div className={styles['loader']}>
                     <CircleSpinner size={40} color="#f2cb04" />
                  </div>
               ) : error || errorLoading ? (
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
                        articleId={match.params.id}
                     />
                  </>
               )}
            </div>
            <div className={styles['article__side-container']}>
               <SideList />
            </div>
         </div>
         <div>
            <Comments
               articleLoading={isLoading}
               commentSending={commentIsSending}
               comments={comments}
               articleId={match.params.id}
            />
         </div>
      </>
   );
};

export default withRouter(ArticlePage);
