import React from 'react';

import Navbar from '@components/Navbar';
import Routes from '@config/routes';
import { Route, Switch } from 'react-router-dom';
import Info from '@pages/Info';
import Main from '@pages/Main';
import News from '@pages/News';
import Footer from '@components/Footer';

const App: React.FC = () => {
   return (
      <>
            <Navbar />
            <div style={{ maxWidth: '1140px', margin: '70px auto 0 auto', minHeight:'30vh' }}>
               <Switch>
                  <Route exact path={Routes.mainPage} component={News} />
                  <Route path={Routes.infoPage} component={Info} />
               </Switch>
<<<<<<< Updated upstream
            </Content>
         </Layout>
=======
            </div>
         <Footer/>
>>>>>>> Stashed changes
      </>
   );
};

export default App;
