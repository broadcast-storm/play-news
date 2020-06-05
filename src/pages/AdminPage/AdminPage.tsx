import React, { useState, useEffect } from 'react';
import LogOut from '@components/LogOut';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import Routes from '@config/routes';

import { Route, Switch, withRouter } from 'react-router-dom';

type AdminProps = {
   match: any;
   auth: any;
   initialized: boolean;
   history: any;
};

const AdminPage: React.FC<AdminProps> = ({ auth, match, initialized, history }) => {
   const [checkAdmin, setCheckAdmin] = useState(false);

   const isAdmin = () => {
      if (auth.currentUser === null) return history.push(Routes.mainPage);
      return auth.currentUser.getIdTokenResult().then((idTokenResult: any) => {
         if (
            idTokenResult.claims.loggedAsAdmin !== true ||
            idTokenResult.claims.admin !== true ||
            match.params.login !== idTokenResult.claims.login ||
            !auth.currentUser.emailVerified
         ) {
            history.push(Routes.mainPage);
         } else return true;
      });
   };

   useEffect(() => {
      if (initialized) {
         setCheckAdmin(isAdmin());
      }
      // eslint-disable-next-line
   }, [initialized]);

   if (!checkAdmin) return <CircleSpinner size={21} color="#f2cb04" />;

   return (
      <div>
         <div className="jumbotron bg-white">
            <div className="container">
               <h3 className="display-8">ADMIN {match.params.login}</h3>
               <LogOut />
               <p className="lead">
                  Стартовый шаблон веб-приложения на React.js с использованием Typescript и Ant
                  Design
               </p>
            </div>
         </div>
      </div>
   );
};

// @ts-ignore
const mapStateToProps = ({ firebase }) => {
   return {
      ...firebase
   };
};
// @ts-ignore
export default withRouter(connect(mapStateToProps, null)(AdminPage));
