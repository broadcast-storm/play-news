import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

// Необходимые библиотеки для редактора статьи
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// eslint-disable-next-line
import htmlToDraft from 'html-to-draftjs';
// @ts-ignore
import toHtml from 'string-to-html';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './styles.module.scss';

type EditorArticleProps = {
   className?: string | null;
};

const EditorArticle: React.FC<EditorArticleProps> = ({ className }) => {
   const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
   const [resultArticle, setResultArticle] = useState<any>('');

   // При изменении текста в редакторе происходит преобразование текста в HTML код и выводится результат
   useEffect(() => {
      setResultArticle(toHtml(draftToHtml(convertToRaw(editorState.getCurrentContent()))));
   }, [editorState]);

   // Обновление (очистка) выводимого резульата
   useEffect(() => {
      if (resultArticle !== null) {
         const result = document.getElementById('articleResult');
         if (result !== null) {
            result.innerHTML = '';
            result.append(resultArticle);
         }
      }
   }, [resultArticle]);

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
         <form onSubmit={sendArticle} className={styles['form']}>
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
                  image: {
                     uploadCallback: imageUploadCallback,
                     previewImage: true
                  }
               }}
               placeholder={'Текст статьи'}
            />
         </form>
         <h2>Результат</h2>
         <br />
         <div id="articleResult" className={styles['Article']}></div>
      </div>
   );
};

EditorArticle.defaultProps = {
   className: null
};

export default EditorArticle;
