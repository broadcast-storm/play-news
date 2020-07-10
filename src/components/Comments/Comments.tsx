import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
   sendComment,
   likeComment,
   dislikeComment,
   deleteComment,
   addView
} from '@actions/showedArticle';
import { CircleSpinner } from 'react-spinners-kit';
import LoadMore from '@components/LoadMore';
import Routes from '@config/routes';
import { useInView } from 'react-intersection-observer';
import classNames from 'classnames';

import ArrowSvg from '@img/comments/arrow.svg';
import DefaultUserImg from '@img/user/defaultPhoto.svg';
import LikeSvg from '@img/likes/like.svg';
import LikedSvg from '@img/likes/liked.svg';
import DislikeSvg from '@img/likes/dislike.svg';
import DislikedSvg from '@img/likes/disliked.svg';

import styles from './styles.module.scss';

type CommentsProps = {
   className?: string | null;
   comments: Array<any> | null;
   articleLoading: boolean;
   commentSending: boolean;
   articleId?: string | null;
};

// Выводится логотип как ссылка на главную страницу
const Comments: React.FC<CommentsProps> = ({
   className,
   articleLoading,
   articleId,
   comments,
   commentSending
}) => {
   const dispatch = useDispatch();
   const { navbarInfo, authUser, auth, initialized } = useSelector((state: any) => state.firebase);
   const { isLikingComment, isDeletingComment } = useSelector((state: any) => state.showedArticle);
   const [ref, inView] = useInView({
      /* Optional options */
      threshold: 0,
      triggerOnce: true
   });

   useEffect(() => {
      if (initialized)
         (async () => {
            if (authUser !== null) {
               const idTokenResult = await auth.currentUser.getIdTokenResult();
               if (auth.currentUser.emailVerified && idTokenResult.claims.admin) setIsAdmin(true);
            }
         })();
      // eslint-disable-next-line
   }, [initialized]);

   useEffect(() => {
      if (inView) {
         dispatch(addView(articleId));
      }
      // eslint-disable-next-line
   }, [inView]);

   const [newComment, setNewComment] = useState('');

   const [isHidden, setIsHidden] = useState(false);

   const [isShowing, setIsShowing] = useState(3);

   const [sendError, setSendError] = useState('');

   const [isAdmin, setIsAdmin] = useState(false);

   const sendCommentHanlder = (e: any) => {
      setSendError('');
      e.preventDefault();
      let sendStr = strip(newComment);
      if (articleId !== null && sendStr !== ' ') dispatch(sendComment(sendStr, articleId));
      if (sendStr.length === 0) setSendError('Нельзя отправить пустой комментарий');
   };

   const changeDislike = (commentId: string) => {
      if (authUser !== null && isLikingComment === null)
         dispatch(dislikeComment(commentId, articleId));
   };

   const changeLike = (commentId: string) => {
      if (authUser !== null && isLikingComment === null)
         dispatch(likeComment(commentId, articleId));
   };

   const deleteCommentHandler = (commentId: string) => {
      if (authUser !== null && isDeletingComment === null)
         dispatch(deleteComment(commentId, articleId));
   };

   function formatDate(date: any) {
      let _date: any;
      if (!(date instanceof Date)) {
         _date = new Date(date.seconds * 1000);
      } else _date = date;
      var dd = _date.getDate();
      if (dd < 10) dd = '0' + dd;

      var mm = _date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;

      var hh = _date.getHours();
      if (hh < 10) hh = '0' + hh;

      var min = _date.getMinutes();
      if (min < 10) min = '0' + min;

      return dd + '.' + mm + '.' + _date.getFullYear() + ' ' + hh + ':' + min;
   }

   function strip(str: string) {
      let newStr = '';
      newStr = str
         .replace(/\s+/g, ' ')
         .replace(/^\s/, '')
         .replace(/\s$/, '');
      return newStr;
   }

   useEffect(() => {
      if (!commentSending && newComment !== '') setNewComment('');
      // eslint-disable-next-line
   }, [commentSending]);

   if (articleLoading) return null;

   return (
      <div className={classNames(styles['container'], className)} ref={ref}>
         <div className={styles['top']}>
            <div className={styles['name']}>
               <span className={styles['header']}>Комментарии</span>
               <span className={styles['count']}>
                  ({comments === null ? '0' : comments.length})
               </span>
            </div>
            <div
               className={styles['arrow']}
               onClick={() => {
                  setIsHidden((prev) => !prev);
                  setIsShowing(3);
               }}>
               <img src={ArrowSvg} alt="" className={isHidden ? styles['arrow-down'] : undefined} />
            </div>
         </div>
         <div
            className={classNames(
               styles['input-container'],
               authUser === null ? styles['closed'] : styles['logged']
            )}>
            {authUser !== null ? (
               <>
                  <div className={styles['photo']}>
                     <img
                        src={
                           navbarInfo === null
                              ? DefaultUserImg
                              : navbarInfo.userPhoto !== null
                              ? navbarInfo.userPhoto
                              : DefaultUserImg
                        }
                        alt=""
                     />
                  </div>
                  <form className={styles['input']} onSubmit={sendCommentHanlder}>
                     <textarea
                        value={newComment}
                        onChange={(e) => {
                           if (e.target.value.length <= 200 && !commentSending) {
                              if (sendError !== '') setSendError('');
                              setNewComment(e.target.value);
                           }
                        }}
                        className={styles['input-area']}
                        required
                     />
                     <div className={styles['btn-area']}>
                        <span className={styles['send-error']}>{sendError}</span>
                        <span className={styles['count']}>{newComment.length}/200</span>
                        <button
                           className={styles['send-btn']}
                           type="submit"
                           disabled={commentSending}>
                           {commentSending ? (
                              <CircleSpinner size={20} color="#ffffff" />
                           ) : (
                              'Отправить'
                           )}
                        </button>
                     </div>
                  </form>
               </>
            ) : (
               <span>
                  <NavLink to={Routes.loginPage} className={styles['link']}>
                     Войдите
                  </NavLink>{' '}
                  или{' '}
                  <NavLink to={Routes.regist} className={styles['link']}>
                     зарегистрируйтесь
                  </NavLink>
                  , чтобы оставлять комментарии
               </span>
            )}
         </div>
         <div
            className={classNames(
               styles['comments-container'],
               isHidden ? styles['comments-hidden'] : null
            )}>
            {comments === null
               ? null
               : comments!
                    .sort(function(a, b) {
                       return b.date.seconds - a.date.seconds;
                    })
                    .slice(0, isShowing)
                    .map((comment, index) => {
                       return (
                          <div className={styles['comment']} key={comment.id}>
                             <div className={styles['info']}>
                                <div className={styles['avatar']}>
                                   <img src={comment.userPhoto} alt="" />
                                </div>
                                <div className={styles['txt']}>
                                   <div className={styles['text-info']}>
                                      <NavLink to={'/'} className={styles['name']}>
                                         {comment.userName}
                                      </NavLink>
                                      <div className={styles['date']}>
                                         {formatDate(comment.date)}
                                      </div>
                                   </div>
                                   <div className={styles['like-info']}>
                                      <div className={styles['dislikes']}>
                                         <span className={styles['count']}>
                                            {comment.dislikes.length}
                                         </span>
                                         <div
                                            className={classNames(
                                               styles['like-img'],
                                               authUser !== null ? styles['like-btn'] : null
                                            )}
                                            onClick={() => changeDislike(comment.id)}>
                                            <img
                                               src={
                                                  navbarInfo === null
                                                     ? DislikeSvg
                                                     : comment.dislikes.indexOf(
                                                          navbarInfo.openInfo.login
                                                       ) !== -1
                                                     ? DislikedSvg
                                                     : DislikeSvg
                                               }
                                               alt=""
                                            />
                                         </div>
                                         {isLikingComment === null ? null : isLikingComment.id ===
                                              comment.id && isLikingComment.type === 'dislike' ? (
                                            <div className={styles['like-loader']}>
                                               <CircleSpinner size={16} color={'#C90E0E'} />
                                            </div>
                                         ) : null}
                                      </div>
                                      <div
                                         className={styles['likes']}
                                         onClick={() => changeLike(comment.id)}>
                                         <span className={styles['count']}>
                                            {comment.likes.length}
                                         </span>
                                         <div
                                            className={classNames(
                                               styles['like-img'],
                                               authUser !== null ? styles['like-btn'] : null
                                            )}>
                                            <img
                                               src={
                                                  navbarInfo === null
                                                     ? LikeSvg
                                                     : comment.likes.indexOf(
                                                          navbarInfo.openInfo.login
                                                       ) !== -1
                                                     ? LikedSvg
                                                     : LikeSvg
                                               }
                                               alt=""
                                            />
                                         </div>
                                         {isLikingComment === null ? null : isLikingComment.id ===
                                              comment.id && isLikingComment.type === 'like' ? (
                                            <div className={styles['like-loader']}>
                                               <CircleSpinner size={16} color={'#3FC90E'} />
                                            </div>
                                         ) : null}
                                      </div>
                                   </div>
                                </div>
                             </div>
                             <div className={styles['text']}>
                                <div className={styles['empty']} />
                                <div>{comment.text}</div>
                             </div>
                             <div className={styles['bottom']}>
                                {navbarInfo === null ? null : comment.userLogin ===
                                     navbarInfo.openInfo.login || isAdmin ? (
                                   <span
                                      className={styles['delete']}
                                      onClick={() => deleteCommentHandler(comment.id)}>
                                      Удалить
                                   </span>
                                ) : null}
                                {isDeletingComment === comment.id ? (
                                   <div className={styles['delete-loader']}>
                                      <CircleSpinner size={16} color={'#C90E0E'} />
                                   </div>
                                ) : null}
                             </div>
                          </div>
                       );
                    })}
         </div>
         {comments === null || isHidden ? null : comments.length <= 3 ? null : isShowing <
           comments.length ? (
            <LoadMore onClick={() => setIsShowing((prev) => prev + 3)} />
         ) : (
            <LoadMore onClick={() => setIsShowing(3)} reverse={true} />
         )}
      </div>
   );
};

Comments.defaultProps = {
   className: null,
   articleId: null
};

export default Comments;
