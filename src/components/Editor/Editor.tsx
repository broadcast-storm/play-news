import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Routes from '@config/routes';

import Resizer from 'react-image-file-resizer';

import classNames from 'classnames';

import Article from '@components/Article';
import ListItem from '@components/MainList/ListItem';
import NewsSlider from '@components/NewsSlider';
// Необходимые библиотеки для редактора статьи
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';

import { publishArticle } from '@actions/firebase';

// eslint-disable-next-line
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './styles.module.scss';

type EditorArticleProps = {
   className?: string | null;
};

const transliterate = (text: string) => {
   const translite_text = text
      .replace(/\u0020/g, '-')
      .replace(/\u0401/g, 'yo')
      .replace(/\u0419/g, 'i')
      .replace(/\u0426/g, 'ts')
      .replace(/\u0423/g, 'u')
      .replace(/\u041A/g, 'k')
      .replace(/\u0415/g, 'e')
      .replace(/\u041D/g, 'n')
      .replace(/\u0413/g, 'g')
      .replace(/\u0428/g, 'sh')
      .replace(/\u0429/g, 'sch')
      .replace(/\u0417/g, 'z')
      .replace(/\u0425/g, 'h')
      .replace(/\u042A/g, '')
      .replace(/\u0451/g, 'yo')
      .replace(/\u0439/g, 'i')
      .replace(/\u0446/g, 'ts')
      .replace(/\u0443/g, 'u')
      .replace(/\u043A/g, 'k')
      .replace(/\u0435/g, 'e')
      .replace(/\u043D/g, 'n')
      .replace(/\u0433/g, 'g')
      .replace(/\u0448/g, 'sh')
      .replace(/\u0449/g, 'sch')
      .replace(/\u0437/g, 'z')
      .replace(/\u0445/g, 'h')
      .replace(/\u044A/g, '')
      .replace(/\u0424/g, 'f')
      .replace(/\u042B/g, 'i')
      .replace(/\u0412/g, 'v')
      .replace(/\u0410/g, 'a')
      .replace(/\u041F/g, 'p')
      .replace(/\u0420/g, 'r')
      .replace(/\u041E/g, 'o')
      .replace(/\u041B/g, 'l')
      .replace(/\u0414/g, 'd')
      .replace(/\u0416/g, 'zh')
      .replace(/\u042D/g, 'e')
      .replace(/\u0444/g, 'f')
      .replace(/\u044B/g, 'i')
      .replace(/\u0432/g, 'v')
      .replace(/\u0430/g, 'a')
      .replace(/\u043F/g, 'p')
      .replace(/\u0440/g, 'r')
      .replace(/\u043E/g, 'o')
      .replace(/\u043B/g, 'l')
      .replace(/\u0434/g, 'd')
      .replace(/\u0436/g, 'zh')
      .replace(/\u044D/g, 'e')
      .replace(/\u042F/g, 'ya')
      .replace(/\u0427/g, 'ch')
      .replace(/\u0421/g, 's')
      .replace(/\u041C/g, 'm')
      .replace(/\u0418/g, 'i')
      .replace(/\u0422/g, 't')
      .replace(/\u042C/g, '')
      .replace(/\u0411/g, 'b')
      .replace(/\u042E/g, 'yu')
      .replace(/\u044F/g, 'ya')
      .replace(/\u0447/g, 'ch')
      .replace(/\u0441/g, 's')
      .replace(/\u043C/g, 'm')
      .replace(/\u0438/g, 'i')
      .replace(/\u0442/g, 't')
      .replace(/\u044C/g, '')
      .replace(/\u0431/g, 'b')
      .replace(/\u044E/g, 'yu')
      .replace(/[^\w-]/g, '');

   return translite_text;
};

const EditorArticle: React.FC<EditorArticleProps> = ({ className }) => {
   const dispatch = useDispatch();
   const mainPhotoInput = useRef(null);
   const { auth, viewedUserOpenInfo } = useSelector((state: any) => state.firebase);
   const [login, setLogin] = useState('');
   const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
   const [resultArticle, setResultArticle] = useState<any>('');
   const [showResult, setShowResult] = useState(false);
   const [header, setHeader] = useState('');
   const [annotation, setAnnotation] = useState('');
   const [photoUrl, setPhotoUrl] = useState<any>('');
   const [smallPhotoUrl, setSmallPhotoUrl] = useState<any>('');
   const [articleType, setArticleType] = useState('news');
   const [tags, setTags] = useState<any>([]);
   const [articleUrl, setArticleUrl] = useState('');
   const [resultUrl, setResultUrl] = useState('test');

   // При изменении текста в редакторе происходит преобразование текста в HTML код и выводится результат
   useEffect(() => {
      setResultArticle(convertToRaw(editorState.getCurrentContent()));
   }, [editorState]);

   useEffect(() => {
      setResultUrl(
         articleUrl +
            '--' +
            ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][
               new Date().getMonth()
            ] +
            '-' +
            (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()) +
            '-' +
            new Date().getFullYear()
      );
   }, [articleUrl]);

   useEffect(() => {
      (async () => {
         const idTokenResult = await auth.currentUser.getIdTokenResult();
         setLogin(idTokenResult.claims.login);
      })();
      // eslint-disable-next-line
   }, []);

   // Преобразование добавленой картинки в Base64
   const getFileBase64 = (file: any, callback: any) => {
      Resizer.imageFileResizer(
         // @ts-ignore
         file,
         640,
         360,
         'JPEG',
         70,
         0,
         (uri) => {
            return callback(uri);
         },
         'base64'
      );
   };

   // Функция добавления картинки
   const imageUploadCallback = (file: any) =>
      new Promise((resolve, reject) =>
         getFileBase64(file, (data: any) => resolve({ data: { link: data } }))
      );
   //Отправить написанную статью (редактору, если обычный пользователь и сразу на сайт, если редактор)
   const sendArticle = (e: any) => {
      e.preventDefault();
      let mainPhoto: any = null;
      let smallPhoto: any = null;

      Resizer.imageFileResizer(
         // @ts-ignore
         mainPhotoInput.current.files[0],
         1600,
         900,
         'JPEG',
         70,
         0,
         (blobMain) => {
            mainPhoto = blobMain;
            Resizer.imageFileResizer(
               // @ts-ignore
               mainPhotoInput.current.files[0],
               320,
               180,
               'JPEG',
               100,
               0,
               (blobSmall) => {
                  smallPhoto = blobSmall;
                  dispatch(
                     publishArticle(
                        resultArticle,
                        header,
                        annotation,
                        mainPhoto,
                        smallPhoto,
                        articleType,
                        tags,
                        resultUrl,
                        viewedUserOpenInfo.name + ' ' + viewedUserOpenInfo.surname,
                        login
                     )
                  );
               },
               'blob'
            );
         },
         'blob'
      );
   };

   const makeResult = async () => {
      // @ts-ignore
      if (mainPhotoInput !== null && mainPhotoInput.current.files[0] !== null) {
         Resizer.imageFileResizer(
            // @ts-ignore
            mainPhotoInput.current.files[0],
            1600,
            900,
            'JPEG',
            70,
            0,
            (uri) => {
               setPhotoUrl(uri);
            },
            'base64'
         );

         Resizer.imageFileResizer(
            // @ts-ignore
            mainPhotoInput.current.files[0],
            320,
            180,
            'JPEG',
            100,
            0,
            (uri) => {
               setSmallPhotoUrl(uri);
            },
            'base64'
         );
      }
      setShowResult(true);
      setResultUrl(
         articleUrl +
            '--' +
            ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][
               new Date().getMonth()
            ] +
            '-' +
            (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()) +
            '-' +
            new Date().getFullYear()
      );
   };

   const rejectFunc = () => {};

   const saveFunc = () => {};

   return (
      <div className={classNames(styles['editor-container'], className)}>
         <div className={styles['switch-btns']}>
            <button
               onClick={() => setShowResult(false)}
               className={classNames(styles['btn'], !showResult ? styles['btn-active'] : null)}>
               Редактор
            </button>
            <button
               onClick={makeResult}
               className={classNames(styles['btn'], showResult ? styles['btn-active'] : null)}>
               Результат
            </button>
         </div>
         <form
            onSubmit={sendArticle}
            className={classNames(styles['form'], showResult ? styles['form-hidden'] : null)}>
            <div>
               <input
                  type="text"
                  className={styles['input']}
                  required
                  placeholder={'Название статьи'}
                  value={header}
                  onChange={(e) => {
                     if (e.target.value.length <= 100) setHeader(e.target.value);
                  }}
               />
               <span className={styles['symbols']}>{header.length}/100 символов</span>
            </div>
            <select
               className={classNames(styles['input'], styles['article-type'])}
               required
               value={articleType}
               onChange={(e) => {
                  setArticleType(e.target.value);
               }}>
               <option value="news">Новость</option>
               <option value="articles">Статья</option>
               <option value="reviews">Обзор</option>
            </select>
            <div>
               <textarea
                  className={styles['input']}
                  required
                  placeholder={'Аннотация'}
                  value={annotation}
                  onChange={(e) => {
                     if (e.target.value.length <= 150) setAnnotation(e.target.value);
                  }}
               />
               <span className={styles['symbols']}>{annotation.length}/150 символов</span>
            </div>
            <br />
            <br />
            <div className={styles['mainPhotoInput']}>
               <label htmlFor="photo" className={styles['mainPhotoInput__label']}>
                  Прикрепить фото
               </label>
               <input
                  ref={mainPhotoInput}
                  id="photo"
                  type="file"
                  name="photo"
                  accept="image/x-png,image/jpeg"
                  className={styles['mainPhotoInput__input']}
                  required
               />
               <br />
               <br />
               <h4>Ссылка</h4>
               <div
                  className={styles['get-header-url']}
                  onClick={() => setArticleUrl(transliterate(header).toLowerCase())}>
                  Получить из названия
               </div>
               <div className={styles['url']}>
                  <span className={styles['url-static']}>https://play-news.ru/{articleType}/</span>
                  <input
                     type="text"
                     className={classNames(styles['input'], styles['input-url'])}
                     required
                     placeholder={'Ссылка'}
                     pattern="[0-9da-z-]{5,}"
                     title="ссылка (не менее 5 симоволов) может состоять только из: 0-9 a-z  -"
                     value={articleUrl}
                     onChange={(e) => {
                        if (e.target.value.length <= 100) setArticleUrl(e.target.value);
                     }}
                  />
                  <span className={styles['url-static']}>
                     --
                     {
                        [
                           'jan',
                           'feb',
                           'mar',
                           'apr',
                           'may',
                           'jun',
                           'jul',
                           'aug',
                           'sep',
                           'oct',
                           'nov',
                           'dec'
                        ][new Date().getMonth()]
                     }
                     -
                     {new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}
                     -{new Date().getFullYear()}
                  </span>
               </div>
            </div>
            <Editor
               editorState={editorState}
               toolbarClassName={styles['editor-toolbar']}
               wrapperClassName={styles['editor-wrapper']}
               editorClassName={styles['editor-input']}
               onEditorStateChange={setEditorState}
               toolbar={{
                  options: [
                     'inline',
                     'blockType',
                     'fontSize',
                     'fontFamily',
                     'list',
                     'colorPicker',
                     'link',
                     'embedded',
                     'emoji',
                     'image',
                     'history'
                  ],

                  inline: {
                     className: undefined,
                     component: undefined,
                     dropdownClassName: undefined,
                     options: [
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'superscript',
                        'subscript'
                     ]
                  },

                  blockType: {
                     options: ['Normal', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']
                  },

                  fontSize: {
                     options: [10, 11, 12, 14, 16, 18, 24, 30, 36]
                  },

                  list: {
                     className: undefined,
                     component: undefined,
                     options: ['unordered', 'ordered']
                  },

                  image: {
                     uploadCallback: imageUploadCallback,
                     previewImage: true,
                     alignmentEnabled: false,
                     component: undefined,
                     defaultSize: {
                        height: 'auto',
                        width: 'auto'
                     }
                  }
               }}
               placeholder={'Текст статьи'}
            />
            <h4>Теги</h4>
            <span>(выбрать несколько ctrl+лкм)</span>
            <br />
            <select
               multiple
               className={classNames(styles['input'], styles['article-type'])}
               required
               title="Выберите хотя бы один тег"
               onChange={(e) => {
                  var options = e.target.options;
                  var value = [];
                  for (var i = 0, l = options.length; i < l; i++) {
                     if (options[i].selected) {
                        value.push(options[i].value);
                     }
                  }
                  setTags(value);
               }}>
               <option value="pc">PC</option>
               <option value="xbox">Xbox</option>
               <option value="ps4">PS4</option>
               <option value="shooter">Шутеры</option>
               <option value="strategy">Стратегии</option>
               <option value="rpg">RPG</option>
               <option value="racing">Гонки</option>
               <option value="e3">E3</option>
               <option value="exclusive">Эксклюзивы</option>
               <option value="simulator">Симуляторы</option>
            </select>
            <div className={styles['main-buttons']}>
               <button onClick={rejectFunc} className={classNames(styles['btn'], styles['reject'])}>
                  Отмена
               </button>
               <button onClick={saveFunc} className={classNames(styles['btn'], styles['save'])}>
                  Сохранить
               </button>
               <button type="submit" className={classNames(styles['btn'], styles['submit'])}>
                  Опубликовать
               </button>
            </div>
         </form>
         {showResult ? (
            <div className={styles['result']}>
               <h2 className={styles['result-category']}>Ссылка</h2>
               <br />
               <span className={styles['url-static']}>
                  https://play-news.ru/{articleType}/{resultUrl}
               </span>
               <br />
               <br />
               <h2 className={styles['result-category']}>В ленте</h2>
               <br />
               <ListItem
                  news={{
                     id: resultUrl,
                     imgUrl: smallPhotoUrl,
                     header: header,
                     descrip: annotation,
                     date: new Date(),
                     author: viewedUserOpenInfo.name + ' ' + viewedUserOpenInfo.surname,
                     author_id: login,
                     type: articleType,
                     views: 0,
                     comments: 0,
                     likes: 0,
                     dislikes: 0
                  }}
               />
               <br />
               <h2 className={styles['result-category']}>Слайдер</h2>
               <br />
               <NewsSlider
                  isTest={true}
                  NewsArray={[
                     {
                        id: resultUrl,
                        imgUrl: smallPhotoUrl,
                        header: header,
                        descrip: annotation,
                        date: new Date(),
                        author: viewedUserOpenInfo.name + ' ' + viewedUserOpenInfo.surname,
                        author_id: login,
                        type: articleType,
                        views: 0,
                        comments: 0,
                        likes: 0,
                        dislikes: 0
                     }
                  ]}
               />
               <h2 className={styles['result-category']}>Статья</h2>
               <br />
               <Article
                  isTest={true}
                  content={resultArticle}
                  header={header}
                  date={new Date()}
                  author={viewedUserOpenInfo.name + ' ' + viewedUserOpenInfo.surname}
                  authorLink={Routes.userPage.replace(':login', login)}
                  likes={0}
                  dislikes={0}
                  commentsCount={0}
                  viewsCount={0}
                  photoUrl={photoUrl}
                  type={articleType}
                  tags={tags}
               />
            </div>
         ) : null}
      </div>
   );
};

EditorArticle.defaultProps = {
   className: null
};

export default EditorArticle;
