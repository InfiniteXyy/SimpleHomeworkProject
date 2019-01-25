import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import { Provider } from 'mobx-react';
import { Router } from 'react-router-dom';
import messageStore from './stores/messageStore';
import userStore from './stores/userStore';
import commonStore from './stores/commonStore';
import authStore from './stores/authStore';
import checkOutStore from './stores/checkOutStore';
import todoListStore from './stores/todoListStore';
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import Blue from '@material-ui/core/colors/blue';
import LightBlue from '@material-ui/core/colors/lightBlue';
import Yellow from '@material-ui/core/colors/yellow';
import 'moment/locale/zh-cn';

const theme = createMuiTheme({
  palette: {
    primary: Blue,
    secondary: LightBlue,
    action: Yellow
  },
  typography: {
    useNextVariants: true,
    body1: {
      fontSize: 14,
      color: '#4a4a4a',
      fontWeight: 'normal'
    },
    body2: {
      fontSize: 14,
      color: '#9B9B9B'
    }
  }
});

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);

const stores = {
  routingStore,
  messageStore,
  userStore,
  commonStore,
  authStore,
  checkOutStore,
  todoListStore
};

window.stores = stores;

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);
