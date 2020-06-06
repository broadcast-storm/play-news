import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import LogOut from '@components/LogOut';
import AboutYourSelf from '@components/AboutYourSelf';
import Routes from '@config/routes';
import NewPhotoPopup from '@components/NewPhotoPopup';
import AlertPopup from '@components/AlertPopup';
import UserMenu from '@components/UserMenu';
import EditorArticle from '@components/Editor';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import classNames from 'classnames';

import { clearViewedUserInfo, getViewedUserInfo } from '@actions/firebase';

import styles from './style.module.scss';

import DefaultUserImg from '@img/user/defaultPhoto.png';
import UploadPhotoImg from '@img/user/uploadPhoto.png';

type UserProps = {
   location: any;
   match: any;
   auth: any;
   authUser: any;
   history: any;
   initialized: boolean;
   clearViewedUserInfo: any;
   getViewedUserInfo: any;
   viewedUserLoading: boolean;
   viewedUserOpenInfo: any;
   viewedUserSecureInfo: any;
   viewedUserPhoto: any;
};

const UserPage: React.FC<UserProps> = ({
   location,
   match,
   auth,
   authUser,
   history,
   initialized,
   clearViewedUserInfo,
   getViewedUserInfo,
   viewedUserLoading,
   viewedUserOpenInfo,
   viewedUserSecureInfo,
   viewedUserPhoto
}) => {
   const photoInput = useRef(null);

   const [isRedactor, setIsRedactor] = useState(false);

   const [checkYourAccount, setCheckYourAccount] = useState(false);

   const [showPhotoPopup, setShowPhotoPopup] = useState(false);

   const [showPhotoSizeError, setShowPhotoSizeError] = useState(false);

   const [photoFile, setPhotoFile] = useState<any>('');

   const isYourAccount = () => {
      if (auth.currentUser === null) {
         history.push(Routes.loginPage);
         setCheckYourAccount(false);
      } else {
         (async () => {
            const idTokenResult = await auth.currentUser.getIdTokenResult();
            if (idTokenResult.claims.login === match.params.login) {
               if (!auth.currentUser.emailVerified) {
                  history.push(Routes.verifyMail);
                  setCheckYourAccount(false);
               } else {
                  setCheckYourAccount(true);
                  if (idTokenResult.claims.redactor || idTokenResult.claims.admin)
                     setIsRedactor(true);
               }
            } else {
               setCheckYourAccount(false);
            }
            getViewedUserInfo(match.params.login);
         })();
      }
   };

   const getPhotoFromInput = (evt: any) => {
      // @ts-ignore
      var tgt = evt.target || window.event!.srcElement,
         files = tgt.files;
      if (FileReader && files && files.length) {
         const fr = new FileReader();
         const newimg = new Image();
         fr.onload = function() {
            newimg.onload = function() {
               if (
                  files[0].size < 2500000 &&
                  newimg.width <= 1280 &&
                  newimg.height <= 1280 &&
                  newimg.width >= 512 &&
                  newimg.height >= 512
               )
                  setPhotoFile(fr.result);
               else setShowPhotoSizeError(true);
               // @ts-ignore
               photoInput.current.value = '';
            };
            // @ts-ignore
            newimg.src = fr.result;
            // @ts-ignore
         };
         fr.readAsDataURL(files[0]);
      }
   };

   useEffect(() => {
      if (initialized) {
         isYourAccount();
      }
      // eslint-disable-next-line
   }, [initialized]);

   useEffect(() => {}, [checkYourAccount]);

   if (viewedUserLoading)
      return (
         <div className={styles['userContainer']}>
            <div
               className={classNames(styles['userContainer__contentContainer'], styles['loader'])}>
               <CircleSpinner size={40} color="#f2cb04" />{' '}
            </div>
         </div>
      );

   return (
      <div className={styles['userContainer']}>
         <div className={styles['userContainer__contentContainer']}>
            <div className={styles['topInfo']}>
               <div className={styles['topInfo__photo']}>
                  <img
                     src={viewedUserPhoto !== null ? viewedUserPhoto : DefaultUserImg}
                     className={styles['image']}
                     alt=""
                  />
                  {checkYourAccount ? (
                     <>
                        <label
                           className={styles['uploadPhotoBtn']}
                           htmlFor="newPhoto"
                           onClick={() => setShowPhotoPopup(true)}>
                           <input
                              id="newPhoto"
                              type="file"
                              className={styles['input']}
                              accept="image/jpeg,image/png"
                              // @ts-ignore
                              onChange={getPhotoFromInput}
                              ref={photoInput}
                           />
                           <img src={UploadPhotoImg} alt="" className={styles['icon']} />
                        </label>
                        <NewPhotoPopup
                           photoFile={photoFile}
                           isShow={showPhotoPopup}
                           setPhotoFile={setPhotoFile}
                           setShowPhotoPopup={setShowPhotoPopup}
                        />
                        <AlertPopup
                           status="Alert"
                           isShow={showPhotoSizeError}
                           messageText="Фото (jpg или png) не должно превышать размер в 2 Мб, а разрешение не менее 512x512 и не более 1280x1280"
                           setShowAlert={(close: boolean) => {
                              setShowPhotoPopup(false);
                              setPhotoFile('');
                              setShowPhotoSizeError(close);
                           }}
                        />
                     </>
                  ) : null}
               </div>

               <div className={styles['topInfo__text']}>
                  <div className={styles['top']}>
                     <span className={styles['name']}>
                        {viewedUserOpenInfo.name + ' ' + viewedUserOpenInfo.surname}
                     </span>
                     {checkYourAccount ? <LogOut /> : null}
                  </div>
                  <span className={styles['role']}>
                     {viewedUserOpenInfo.userType === 'admin'
                        ? 'Админ'
                        : viewedUserOpenInfo.userType === 'redactor'
                        ? 'Редактор'
                        : viewedUserOpenInfo.userType === 'user'
                        ? 'Читатель'
                        : null}
                  </span>
                  {checkYourAccount || viewedUserOpenInfo.email !== null ? (
                     <div className={styles['mail']}>
                        <span className={styles['mark']}>Почта:</span>
                        <a
                           href={
                              'mailto:' + !checkYourAccount
                                 ? viewedUserOpenInfo.email
                                 : viewedUserSecureInfo.email
                           }
                           className={styles['mail-link']}>
                           {!checkYourAccount
                              ? viewedUserOpenInfo.email
                              : viewedUserSecureInfo.email}
                        </a>
                     </div>
                  ) : null}
                  <div className={styles['aboutYourSelf']}>
                     {!checkYourAccount && viewedUserOpenInfo.aboutYourself === '' ? null : (
                        <>
                           <span className={styles['mark']}>О себе:</span>
                           <AboutYourSelf
                              isYourAccount={checkYourAccount}
                              info={viewedUserOpenInfo.aboutYourself}
                           />
                        </>
                     )}
                  </div>
               </div>
            </div>
            <UserMenu
               isYourAccount={checkYourAccount}
               isRedactor={isRedactor}
               login={match.params.login}
               className={styles['menu']}
            />
            <Switch>
               <Route
                  exact
                  path={Routes.userPageScreens.editor.replace(':login', match.params.login)}
                  render={() => <EditorArticle className={styles['editor']} />}
               />
            </Switch>
         </div>
      </div>
   );
};

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      getViewedUserInfo: (login: string) => dispatch(getViewedUserInfo(login)),
      clearViewedUserInfo: () => dispatch(clearViewedUserInfo())
   };
};

// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserPage));
