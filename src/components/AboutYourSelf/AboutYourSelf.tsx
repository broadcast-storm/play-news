import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { doSignOut } from '@actions/firebase';
import classNames from 'classnames';

import EditImg from '@img/user/edit.png';
import EditHoverImg from '@img/user/editHover.png';

import styles from './styles.module.scss';

type AboutYourSelfProps = {
   className?: string | null;
   info: string;
   isYourAccount: boolean;
};

const AboutYourSelf: React.FC<AboutYourSelfProps> = ({ className, info, isYourAccount }) => {
   const [isChanging, setIsChanging] = useState(false);
   const [imgUrl, setImgUrl] = useState(EditImg);
   const [editorValue, setEditorValue] = useState('');
   const [symbolCount, setSymbolCount] = useState(0);

   useEffect(() => {
      setSymbolCount(editorValue.length);
   }, [editorValue]);

   const cancelEditor = () => {
      setEditorValue(info);
      setIsChanging(false);
   };

   const openEditor = () => {
      setEditorValue(info);
      setIsChanging(true);
      setImgUrl(EditImg);
   };

   const saveNew = (e: any) => {
      e.preventDefault();
      setEditorValue(info);
      setIsChanging(false);
   };
   return (
      <div className={styles['aboutContainer']}>
         {isChanging && isYourAccount ? (
            <form className={styles['editor']} onSubmit={saveNew}>
               <textarea
                  value={editorValue}
                  onChange={(e) => {
                     if (e.target.value.length <= 150) setEditorValue(e.target.value);
                  }}
                  className={styles['input']}
                  placeholder="Расскажите о себе"
               />
               <div className={styles['buttons']}>
                  <span className={styles['symbols']}>{symbolCount}/150 символов</span>
                  <button
                     onClick={cancelEditor}
                     className={classNames(styles['btn'], styles['close-btn'])}>
                     Отмена
                  </button>
                  <button type={'submit'} className={classNames(styles['btn'], styles['save-btn'])}>
                     Сохранить
                  </button>
               </div>
            </form>
         ) : (
            <div className={styles['text']}>
               <span className={styles['text__info']}>{info}</span>
               {isYourAccount ? (
                  <img
                     src={imgUrl}
                     alt=""
                     onMouseEnter={() => {
                        setImgUrl(EditHoverImg);
                     }}
                     onMouseLeave={() => {
                        setImgUrl(EditImg);
                     }}
                     onClick={openEditor}
                     className={styles['text__image']}
                  />
               ) : null}
            </div>
         )}
      </div>
   );
};

AboutYourSelf.defaultProps = {
   className: null,
   isYourAccount: false
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      doSignOut: () => dispatch(doSignOut())
   };
};

// @ts-ignore
export default connect(null, mapDispatchToProps)(AboutYourSelf);
