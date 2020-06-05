import React from 'react';
import EditorJS from '@editorjs/editorjs';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';

type EditorProps = {
   className?: string | null;
};

const Editor: React.FC<EditorProps> = ({ className }) => {
   const editor = new EditorJS({
      holder: 'editorjs'
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
