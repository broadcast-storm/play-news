import React, { useState } from 'react';
import { connect } from 'react-redux';
import { doSignOut } from '@actions/firebase';
import classNames from 'classnames';

import LogoutImg from '@img/user/logout.png';
import LogoutHoverImg from '@img/user/logoutHover.png';

import styles from './styles.module.scss';

type LogOutProps = {
   className?: string | null;
   doSignOut?: any;
};

const LogOut: React.FC<LogOutProps> = ({ className, doSignOut }) => {
   const [imgUrl, setImgUrl] = useState(LogoutImg);
   const [textStyle, setTextStyle] = useState(styles['logout__text']);
   return (
      <span
         onMouseEnter={() => {
            setImgUrl(LogoutHoverImg);
            setTextStyle(classNames(styles['logout__text'], styles['logout__text_hover']));
         }}
         onMouseLeave={() => {
            setImgUrl(LogoutImg);
            setTextStyle(styles['logout__text']);
         }}
         className={classNames(styles['logout'], className)}
         onClick={async () => {
            await doSignOut();
            window.location.reload(false);
         }}>
         <span className={textStyle}>Выход</span>
         <img src={imgUrl} alt="" className={styles['logout__image']} />
      </span>
   );
};

LogOut.defaultProps = {
   className: null
};

const mapDispatchToProps = (dispatch: any) => {
   return {
      doSignOut: () => dispatch(doSignOut())
   };
};

// @ts-ignore
export default connect(null, mapDispatchToProps)(LogOut);
