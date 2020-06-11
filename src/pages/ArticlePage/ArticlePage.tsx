import React from 'react';

import styles from './style.module.scss';

const ArticlePage: React.FC = () => {
   return (
      <div>
         <div className="jumbotron bg-white">
            <div className="container">
               <h3 className="display-8">Текст статьи</h3>
               <p className="lead">(В разработке)</p>
            </div>
         </div>
      </div>
   );
};

export default ArticlePage;
