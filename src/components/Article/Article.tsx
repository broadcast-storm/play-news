import React, { useEffect } from 'react';

import draftToHtml from 'draftjs-to-html';
// eslint-disable-next-line
import htmlToDraft from 'html-to-draftjs';
// @ts-ignore
import toHtml from 'string-to-html';

import styles from './styles.module.scss';

type ArticleProps = {
   className?: string | null;
   content: any;
   isTest?: boolean;
};

const Article: React.FC<ArticleProps> = ({ className, content, isTest }) => {
   useEffect(() => {
      if (content !== null) {
         const result = document.getElementById('articleResult');
         if (result !== null) {
            result.innerHTML = '';
            result.append(toHtml(draftToHtml(content)));
         }
      }
      // eslint-disable-next-line
   }, []);
   return (
      <div>
         <div id="articleResult" className={styles['Article']}></div>
      </div>
   );
};

Article.defaultProps = {
   className: null,
   content: null,
   isTest: false
};

export default Article;
