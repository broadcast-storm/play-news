import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import EyeImg from '@img/news/eye.png';
import photoUrl from '@img/mock/news/image-1.png';

import styles from './styles.module.scss';

interface INews {
   id: string;
   imgUrl: string;
   header: string;
   descrip: string;
   date: string;
   author: string;
   author_id: string;
   type: string;
   views: number;
}

type ListItemProps = {
   className?: string | null;
   news: INews;
};

// Элемент дополнительного списка
const SideListItem: React.FC<ListItemProps> = ({ className, news }) => {
   return <div className={styles['side-item']}></div>;
};

SideListItem.defaultProps = {
   className: null
};

export default SideListItem;
