import React, { useState } from 'react';
// @ts-ignore
import ImageCrop from 'react-image-crop-component';
import 'react-image-crop-component/style.css';
import styles from './styles.module.scss';
import classNames from 'classnames';

type NewPhotoPopupProps = {
   className?: string | null;
   isShow: boolean;
   photoFile: any;
   setPhotoFile: any;
   setShowPhotoPopup: any;
};

const NewPhotoPopup: React.FC<NewPhotoPopupProps> = ({
   isShow,
   photoFile,
   setShowPhotoPopup,
   setPhotoFile
}) => {
   const [croppedImg, setCroppedImg] = useState<any>(undefined);

   const cancelEditor = () => {
      setShowPhotoPopup(false);
      setPhotoFile('');
   };

   const onCropped = (e: any) => {
      let image = e.image;
      setCroppedImg(image);
      let image_data = e.data;
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
                        <button className={classNames(styles['btn'], styles['save-btn'])}>
                           Сохранить
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

NewPhotoPopup.defaultProps = {
   className: null,
   isShow: false,
   photoFile: null
};

export default NewPhotoPopup;
