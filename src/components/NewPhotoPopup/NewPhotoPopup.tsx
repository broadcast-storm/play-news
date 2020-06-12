import React, { useState, useEffect } from 'react';
import { CircleSpinner } from 'react-spinners-kit';
import { connect } from 'react-redux';
import { uploadUserPhoto } from '@actions/firebase';
// @ts-ignore
import ImageCrop from 'react-image-crop-component';
import classNames from 'classnames';

import 'react-image-crop-component/style.css';
import styles from './styles.module.scss';

type NewPhotoPopupProps = {
   className?: string | null;
   isShow: boolean;
   photoFile: any;
   setPhotoFile: any;
   setShowPhotoPopup: any;
   uploadUserPhoto?: any;
   userInfoUpdating?: boolean;
};

const NewPhotoPopup: React.FC<NewPhotoPopupProps> = ({
   isShow,
   photoFile,
   setShowPhotoPopup,
   setPhotoFile,
   uploadUserPhoto,
   userInfoUpdating
}) => {
   const [croppedImg, setCroppedImg] = useState<any>(undefined);

   const [submitClicked, setSubmitClicked] = useState(false);
   // Очистка формы обновления фото при ее закрытии
   useEffect(() => {
      if (!userInfoUpdating && submitClicked) {
         setShowPhotoPopup(false);
         setPhotoFile('');
         setCroppedImg(undefined);
         setSubmitClicked(false);
      }
      // eslint-disable-next-line
   }, [userInfoUpdating]);

   // Функция закрытия
   const cancelEditor = () => {
      setShowPhotoPopup(false);
      setPhotoFile('');
      setCroppedImg(undefined);
   };

   // Функция превращения Base64 картинки в файл Blob
   function b64toBlob(dataURI: any) {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/jpeg' });
   }

   // Загрузка фото (с превращением Base64 в Blob)
   const uploadPhoto = () => {
      if (croppedImg !== undefined) {
         var blob = b64toBlob(croppedImg);
         uploadUserPhoto(blob);
         setSubmitClicked(true);
      }
   };
   // При обрезке фото показать результат
   const onCropped = (e: any) => {
      let image = e.image;
      setCroppedImg(image);
   };

   if (!isShow) return null;

   return (
      <div className={styles['popupBack']}>
         <div className={styles['popup']}>
            <h3>Обрежьте фотографию</h3>
            {photoFile !== '' ? (
               <div className={styles['pictures']}>
                  <div className={styles['editor']}>
                     <ImageCrop
                        src={photoFile}
                        maxWidth={256}
                        maxHeight={256}
                        square={true}
                        resize={true}
                        border={'dashed #ffffff 2px'}
                        onCrop={onCropped}
                     />
                  </div>
                  <div className={styles['result']}>
                     {croppedImg === undefined ? (
                        <div className={styles['croppedImg-default']} />
                     ) : (
                        <img src={croppedImg} alt="" className={styles['croppedImg']} />
                     )}

                     <div className={styles['buttons']}>
                        <button
                           onClick={cancelEditor}
                           className={classNames(styles['btn'], styles['close-btn'])}>
                           Отмена
                        </button>
                        <button
                           className={classNames(styles['btn'], styles['save-btn'])}
                           onClick={uploadPhoto}>
                           {!userInfoUpdating ? (
                              'Сохранить'
                           ) : (
                              <CircleSpinner size={21} color="#ffffff" />
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className={styles['pictures']}>
                  <div className={styles['editor_default']}></div>
                  <div className={styles['result']}>
                     <div className={styles['croppedImg-default']} />
                     <div className={styles['buttons']}>
                        <button
                           onClick={cancelEditor}
                           className={classNames(styles['btn'], styles['close-btn'])}>
                           Отмена
                        </button>
                        <button className={classNames(styles['btn'], styles['save-btn'])}>
                           Сохранить
                        </button>
                     </div>
                  </div>
               </div>
            )}
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
      uploadUserPhoto: (imageBlob: any) => dispatch(uploadUserPhoto(imageBlob))
   };
};

NewPhotoPopup.defaultProps = {
   className: null,
   isShow: false,
   photoFile: null
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPhotoPopup);
