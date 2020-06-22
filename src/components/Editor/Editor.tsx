import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import Article from '@components/Article';
// Необходимые библиотеки для редактора статьи
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';

// eslint-disable-next-line
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './styles.module.scss';

type EditorArticleProps = {
   className?: string | null;
};

const EditorArticle: React.FC<EditorArticleProps> = ({ className }) => {
   const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
   const [resultArticle, setResultArticle] = useState<any>('');
   const [showResult, setShowResult] = useState(false);

   // При изменении текста в редакторе происходит преобразование текста в HTML код и выводится результат
   useEffect(() => {
      setResultArticle(convertToRaw(editorState.getCurrentContent()));
   }, [editorState]);

   // Преобразование добавленой картинки в Base64
   const getFileBase64 = (file: any, callback: any) => {
      var reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
         return callback(reader.result);
      };
      // TODO: catch an error
      reader.onerror = (error) => {};
   };

   // Функция добавления картинки
   const imageUploadCallback = (file: any) =>
      new Promise((resolve, reject) =>
         getFileBase64(file, (data: any) => resolve({ data: { link: data } }))
      );
   //Отправить написанную статью (редактору, если обычный пользователь и сразу на сайт, если редактор)
   const sendArticle = (e: any) => {
      e.preventDefault();
   };

   return (
      <div className={classNames(styles['editor-container'], className)}>
         <div>
            <button onClick={() => setShowResult(false)}>Редактор</button>
            <button onClick={() => setShowResult(true)}>Результат</button>
         </div>
         <form
            onSubmit={sendArticle}
            className={classNames(styles['form'], showResult ? styles['form-hidden'] : null)}>
            <input
               type="text"
               className={styles['input']}
               required
               placeholder={'Название статьи'}
            />
            <input type="text" className={styles['input']} required placeholder={'Аннотация'} />
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
                     defaultSize: {
                        height: 'auto',
                        width: 'auto'
                     }
                  }
               }}
               placeholder={'Текст статьи'}
            />
         </form>
         {showResult ? (
            <div style={{ width: '75%', border: '1px solid black' }}>
               <Article content={resultArticle} />
            </div>
         ) : null}
      </div>
   );
};

EditorArticle.defaultProps = {
   className: null
};

export default EditorArticle;
