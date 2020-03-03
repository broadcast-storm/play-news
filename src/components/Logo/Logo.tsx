import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoUrl from "@img/Navbar/logo.png";
import styles from './styles.module.scss';
import classNames from 'classnames';

type LogoProps = {
   className?: string | null
}

const Logo: React.FC<LogoProps>= ({className}) => {
   return (
      <NavLink to={'/'} className={classNames(styles['logo'], className)}>
         <img src={LogoUrl} alt="Play News Logo" className={styles['logo__img']}/>
      </NavLink>
   )
};

Logo.defaultProps = {
   className: null
};

export default Logo;