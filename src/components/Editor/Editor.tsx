import React, { useState, useEffect, useRef } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// @ts-ignore
import toHtml from 'string-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';

type EditorArticleProps = {
   className?: string | null;
};

const EditorArticle: React.FC<EditorArticleProps> = ({ className }) => {
   const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
   const [resultArticle, setResultArticle] = useState<any>('');

   useEffect(() => {
      setResultArticle(toHtml(draftToHtml(convertToRaw(editorState.getCurrentContent()))));
   }, [editorState]);

   useEffect(() => {
      if (resultArticle !== null) {
         const result = document.getElementById('articleResult');
         if (result !== null) {
            result.innerHTML = '';
            result.append(resultArticle);
         }
      }
   }, [resultArticle]);

   const getFileBase64 = (file: any, callback: any) => {
      var reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
         console.log(reader.result);
         return callback(reader.result);
      };
      // TODO: catch an error
      reader.onerror = (error) => {};
   };

   const imageUploadCallback = (file: any) =>
      new Promise((resolve, reject) =>
         getFileBase64(file, (data: any) => resolve({ data: { link: data } }))
      );

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
         <div id="articleResult" className={styles['Article']}></div>
      </div>
   );
};

EditorArticle.defaultProps = {
   className: null
};

export default EditorArticle;
