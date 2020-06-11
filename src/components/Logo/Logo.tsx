import React from 'react';
import { NavLink } from 'react-router-dom';
import Routes from '@config/routes';
import classNames from 'classnames';

import LogoUrl from '@img/Navbar/logo.png';

import styles from './styles.module.scss';

type LogoProps = {
   className?: string | null;
};

// Выводится логотип как ссылка на главную страницу
const Logo: React.FC<LogoProps> = ({ className }) => {
   return (
      <NavLink to={Routes.mainPage} className={classNames(styles['logo'], className)}>
         <img src={LogoUrl} alt="Play News Logo" className={styles['logo__img']} />
      </NavLink>
   );
};

Logo.defaultProps = {
   className: null
};

export default Logo;
