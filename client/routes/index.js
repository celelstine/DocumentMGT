import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import App from '../components/Layout';
import Login from '../components/Login';
import Auth from '../components/auth';
import Documents from '../components/Documents';
import Document from '../components/Document';
import pageNotFound from '../components/pageNotFound';
import CreateDocument from '../components/CreateDocument';
import configureStore from '../store/configureStore';
import { requireAuth }from '../helper';

const store = configureStore();
const history = createBrowserHistory();

const routes = () => (
  <Provider store={store}>
   <HashRouter history={history}>
     <Switch>
      <Route exact path='/' component={Auth}/>
      <App  onEnter={requireAuth}>
        <Route path='/dashboard' component={Documents} />
        <Route path='/document/:documentId' component={Document} />
        <Route path='/document' component={Document} />
        <Route path='/createDocument/:documentId' component={CreateDocument} />
        <Route path='/createDocument' component={CreateDocument} />
      </App>
      <Route path='*' component={pageNotFound}/>
     </Switch>
   </HashRouter >
</Provider>
); 

export default routes;

