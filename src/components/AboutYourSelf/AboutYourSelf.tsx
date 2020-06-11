import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import { changeAboutYourself } from '@actions/firebase';
import classNames from 'classnames';

import EditImg from '@img/user/edit.png';
import EditHoverImg from '@img/user/editHover.png';

import styles from './styles.module.scss';

type AboutYourSelfProps = {
   className?: string | null;
   info: string;
   isYourAccount: boolean;
   changeAboutYourself?: any;
   userInfoUpdating?: boolean;
};

const AboutYourSelf: React.FC<AboutYourSelfProps> = ({
   className,
   info,
   isYourAccount,
   changeAboutYourself,
   userInfoUpdating
}) => {
   const [isChanging, setIsChanging] = useState(false);
   const [imgUrl, setImgUrl] = useState(EditImg);
   const [editorValue, setEditorValue] = useState('');
   const [submitClicked, setSubmitClicked] = useState(false);
   const [symbolCount, setSymbolCount] = useState(0);

   // Изменение числа введеных букв при каждом изменении в input
   useEffect(() => {
      setSymbolCount(editorValue.length);
   }, [editorValue]);

   // Закрытие редактора после обновления информации о себе
   useEffect(() => {
      if (!userInfoUpdating && submitClicked) {
         setEditorValue(info);
         setIsChanging(false);
         setSubmitClicked(false);
      }
   }, [userInfoUpdating]);

   // Закрыть редактирование о себе
   const cancelEditor = () => {
      setEditorValue(info);
      setIsChanging(false);
   };
   // Открыть редактор
   const openEditor = () => {
      setEditorValue(info);
      setIsChanging(true);
      setImgUrl(EditImg);
   };
   // Сохранить новую информацию о себе, ждать обновления данных
   const saveNew = (e: any) => {
      e.preventDefault();
      setSubmitClicked(true);
      changeAboutYourself(editorValue);
   };
   return (
      <div className={classNames(styles['aboutContainer'], className)}>
         {/* Редактор информации "о себе" выводится если нажата кнопка и просматриваемый аккаунт принадлежит пользователю */}
         {isChanging && isYourAccount ? (
            <form className={styles['editor']} onSubmit={saveNew}>
               <textarea
                  value={editorValue}
                  onChange={(e) => {
                     if (e.target.value.length <= 150) setEditorValue(e.target.value);
                  }}
                  className={styles['input']}
                  placeholder="Расскажите о себе"
                  disabled={userInfoUpdating ? true : false}
               />
               <div className={styles['buttons']}>
                  <span className={styles['symbols']}>{symbolCount}/150 символов</span>
                  <button
                     onClick={userInfoUpdating ? undefined : cancelEditor}
                     className={classNames(styles['btn'], styles['close-btn'])}>
                     Отмена
                  </button>
                  <button type={'submit'} className={classNames(styles['btn'], styles['save-btn'])}>
                     {!userInfoUpdating ? 'Сохранить' : <CircleSpinner size={21} color="#ffffff" />}
                  </button>
               </div>
            </form>
         ) : (
            <div className={styles['text']}>
               <span className={styles['text__info']}>
                  {info === '' ? 'Расскажите о себе' : info}
               </span>
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

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      changeAboutYourself: (text: string) => dispatch(changeAboutYourself(text))
   };
};

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(AboutYourSelf);
