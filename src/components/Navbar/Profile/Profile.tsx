import React from 'react';
import { NavLink } from 'react-router-dom';
import EmptyProfile from '@img/Navbar/empty-logo.png';
import styles from '@components/Navbar/styles.module.scss';

type ProfileProps = {
   imgUrl?: string;
};

const Profile: React.FC<ProfileProps> = ({ imgUrl }) => {
   return (
      <NavLink to={'/auth'} className={styles['nav-bar__profile']}>
         <img src={imgUrl} alt="Profile img" className={styles['profile__img']} />
      </NavLink>
   );
};

Profile.defaultProps = {
   imgUrl: EmptyProfile
};

export default Profile;
