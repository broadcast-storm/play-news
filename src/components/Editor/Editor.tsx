import React from 'react';
import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import LinkTool from '@editorjs/link';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';

type EditorProps = {
   className?: string | null;
};

const Editor: React.FC<EditorProps> = ({ className }) => {
   const editor = new EditorJS({
      holder: 'editorjs',
      autofocus: true,
      tools: {
         header: {
            class: Header,
            shortcut: 'CMD+SHIFT+H',
            config: {
               levels: [1, 2, 3, 4],
               defaultLevel: 3
            }
         },
         linkTool: {
            class: LinkTool,
            config: {
               endpoint: 'https://www.w3.org/TR/2020/WD-fetch-metadata-20200110/'
            }
         }
      }
   });

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
            <div className={styles['editor']} id={'editorjs'} />
            <input
               type="text"
               className={styles['input']}
               required
               placeholder={'Название статьи'}
            />
         </form>
      </div>
   );
};

Editor.defaultProps = {
   className: null
};

export default Editor;
