import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Routes from '@config/routes';
import { Layout, Menu } from 'antd';

import styles from './styles.module.scss';

const Navbar: React.FC = () => {
   const [current, setCurrent] = useState('main');

   const { Header } = Layout;

   const handleClick = (e: any) => {
      setCurrent(e.key);
   };
   return (
      <Header>
         <div className={styles['logo']}>
            <span>React + TypeScript</span>
         </div>
         <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            theme={'dark'}
            style={{ lineHeight: '64px' }}>
            <Menu.Item key="main">
               <Link to={Routes.mainPage}>Главная</Link>
            </Menu.Item>
            <Menu.Item key="info">
               <Link to={Routes.infoPage}>О приложении</Link>
            </Menu.Item>
         </Menu>
      </Header>
   );
};

export default Navbar;
