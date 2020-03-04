import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';

type ListItemProps = {
   className?: string | null,
   news: any
}

const ListItem: React.FC<ListItemProps>= ({className, news}) => {

   return (
      <div>
         item {news.id}
      </div>
   )
};

ListItem.defaultProps = {
   className: null
};

export default ListItem;