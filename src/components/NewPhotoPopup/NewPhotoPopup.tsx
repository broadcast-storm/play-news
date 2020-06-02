import React from 'react';
// @ts-ignore
import ImageCrop from 'react-image-crop-component';
import 'react-image-crop-component/style.css';
import styles from './styles.module.scss';
import classNames from 'classnames';

import DefaultUserImg from '@img/user/defaultPhoto.png';

type NewPhotoPopupProps = {
   className?: string | null;
   isShow: boolean;
   photoFile: any;
};

const NewPhotoPopup: React.FC<NewPhotoPopupProps> = ({ className, isShow, photoFile }) => {
   console.log(photoFile);
   if (!isShow) return null;

   const onCropped = (e: any) => {
      let image = e.image;
      let image_data = e.data;
      console.log(image);
      console.log(image_data);
   };

   return (
      <div className={styles['popupBack']}>
         <div className={styles['popup']}>
            <h3>Что-то</h3>
            {photoFile !== '' ? (
               <ImageCrop
                  src={photoFile}
                  setWidth={300}
                  setHeight={300}
                  square={true}
                  resize={false}
                  border={'dashed #ffffff 2px'}
                  onCrop={onCropped}
               />
            ) : null}
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
