import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import LogOut from '@components/LogOut';
import AboutYourSelf from '@components/AboutYourSelf';
import Routes from '@config/routes';
import NewPhotoPopup from '@components/NewPhotoPopup';
import AlertPopup from '@components/AlertPopup';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

import { clearViewedUserInfo, getViewedUserInfo } from '@actions/firebase';

import styles from './style.module.scss';

import DefaultUserImg from '@img/user/defaultPhoto.png';
import UploadPhotoImg from '@img/user/uploadPhoto.png';

type UserProps = {
   match: any;
   auth: any;
   authUser: any;
   history: any;
   initialized: boolean;
   clearViewedUserInfo: any;
   getViewedUserInfo: any;
   viewedUserLoading: boolean;
   viewedUserInfo: any;
};

const UserPage: React.FC<UserProps> = ({
   match,
   auth,
   authUser,
   history,
   initialized,
   clearViewedUserInfo,
   getViewedUserInfo,
   viewedUserInfo,
   viewedUserLoading
}) => {
   const photoInput = useRef(null);

   const [checkYourAccount, setCheckYourAccount] = useState(false);

   const [loadingUserInfo, setLoadingUserInfo] = useState(true);

   const [showPhotoPopup, setShowPhotoPopup] = useState(false);

   const [showPhotoSizeError, setShowPhotoSizeError] = useState(false);

   const [photoFile, setPhotoFile] = useState<any>('');

   const isYourAccount = () => {
      if (auth.currentUser === null) setCheckYourAccount(false);
      (async () => {
         const idTokenResult = await auth.currentUser.getIdTokenResult();
         if (idTokenResult.claims.login === match.params.login) {
            if (!auth.currentUser.emailVerified) {
               history.push(Routes.verifyMail);
               setCheckYourAccount(false);
            } else setCheckYourAccount(true);
         } else {
            setCheckYourAccount(false);
         }
      })();
      // return auth.currentUser.getIdTokenResult().then((idTokenResult: any) => {
      //    if (idTokenResult.claims.login === match.params.login) {
      //       if (!auth.currentUser.emailVerified) {
      //          history.push(Routes.verifyMail);
      //       } else return true;
      //    } else {
      //       return false;
      //    }
      // });
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
               console.log(files[0].size);
               console.log('width: ' + newimg.width);
               console.log('height: ' + newimg.height);
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
         getViewedUserInfo(match.params.login);
      }
      // eslint-disable-next-line
   }, [initialized]);

   useEffect(() => {}, [checkYourAccount]);

   if (viewedUserLoading) return <CircleSpinner size={21} color="#f2cb04" />;

   return (
      <div className={styles['userContainer']}>
         <div className={styles['userContainer__contentContainer']}>
            <div className={styles['topInfo']}>
               <div className={styles['topInfo__photo']}>
                  <img src={DefaultUserImg} className={styles['image']} alt="" />
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
                        {viewedUserInfo.openInfo.name + ' ' + viewedUserInfo.openInfo.surname}
                     </span>
                     {checkYourAccount ? <LogOut /> : null}
                  </div>
                  <span className={styles['role']}>читатель</span>
                  {checkYourAccount || viewedUserInfo.openInfo.email !== null ? (
                     <div className={styles['mail']}>
                        <span className={styles['mark']}>Почта:</span>
                        <a
                           href={
                              'mailto:' + !checkYourAccount
                                 ? viewedUserInfo.openInfo.email
                                 : viewedUserInfo.secureInfo.email
                           }
                           className={styles['mail-link']}>
                           {!checkYourAccount
                              ? viewedUserInfo.openInfo.email
                              : viewedUserInfo.secureInfo.email}
                        </a>
                     </div>
                  ) : null}
                  <div className={styles['aboutYourSelf']}>
                     {!checkYourAccount && viewedUserInfo.openInfo.aboutYourself === '' ? null : (
                        <>
                           <span className={styles['mark']}>О себе:</span>
                           <AboutYourSelf
                              isYourAccount={checkYourAccount}
                              info={viewedUserInfo.openInfo.aboutYourself}
                           />
                        </>
                     )}
                  </div>
               </div>
            </div>
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
