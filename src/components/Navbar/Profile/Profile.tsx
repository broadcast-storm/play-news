import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import EmptyProfile from '@img/Navbar/empty-logo.png'
import styles from '@components/Navbar/styles.module.scss';

const Profile: React.FC = () => {
   const [imgUrl, setImgUrl] = useState(EmptyProfile);
   return (
      <NavLink to={'/'} className={styles['nav-bar__profile']}>
         <img src={imgUrl} alt="Profile img" className={styles['profile__img']}/>
      </NavLink>
   )
};

export default Profile;