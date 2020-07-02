import React from 'react';
import classNames from 'classnames';
import styles from './style.module.scss';

type Props = {
   className?: string;
};

const Loader: React.FC<Props> = ({ className }) => {
   return <div className={classNames(styles['spinner-container'], className)}></div>;
};

export default Loader;
