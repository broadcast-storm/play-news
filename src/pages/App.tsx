import React from 'react';

import Navbar from '@components/Navbar';
import Routes from '@config/routes';
import { Route, Switch } from 'react-router-dom';
import Info from '@pages/Info';
import Main from '@pages/Main';
import { Layout } from 'antd';
import Footer from '@components/Footer';

const App: React.FC = () => {
   const { Content } = Layout;
   return (
      <>
         <Layout>
            <Navbar />
            <Content style={{ padding: '0 50px' }}>
               <Switch>
                  <Route exact path={Routes.mainPage} component={Main} />
                  <Route path={Routes.infoPage} component={Info} />
               </Switch>
            </Content>
         </Layout>
         <Footer/>
      </>
   );
};

export default App;
