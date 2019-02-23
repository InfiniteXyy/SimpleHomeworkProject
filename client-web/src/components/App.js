import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Home from './Home';
import Group from './Group';
import SignIn from './SignIn';
import Navigation from './Navigation';

import { withStyles } from '@material-ui/core/styles';
import Login from './Login';
import { inject, observer } from 'mobx-react';
import GroupHomePage from './Group/GroupHomePage';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContent from './Snackbar';

import './App.css';
import Header from './Header';
import Notification from './Notification';

const styles = {
  root: {
    margin: -8,
    paddingTop: 48,
    paddingBottom: 48
  }
};

@inject('userStore', 'commonStore')
@withRouter
@observer
class App extends Component {
  componentWillMount() {
    if (!this.props.commonStore.token) {
      this.props.commonStore.setAppLoaded();
    }
  }

  componentDidMount() {
    if (this.props.commonStore.token && !this.props.userStore.currentUser) {
      this.props.userStore.pullUser().then(() => {
        this.props.commonStore.setAppLoaded();
      });
    }
  }

  handleCloseSnackbar = () => {
    this.props.commonStore.toggleSnackbar('', '', false);
  };

  render() {
    const { classes } = this.props;
    if (this.props.commonStore.appLoaded) {
      if (!this.props.userStore.currentUser) {
        return (
          <div className={classes.root}>
            <Login />
          </div>
        );
      }

      const { snackbarPayload, snackbarOpen } = this.props.commonStore;

      return (
        <div>
          <div className={classes.root}>
            <Switch>
              <Route path="/group/:id" component={GroupHomePage} exact />
              <Route path="*">
                <div>
                  <Header />
                  <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/group" component={Group} />
                    <Route path="/signIn" component={SignIn} />
                  </Switch>
                  <Navigation />
                </div>
              </Route>
            </Switch>
          </div>

          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={this.handleCloseSnackbar}
          >
            <MySnackbarContent
              variant={snackbarPayload.type}
              message={snackbarPayload.content}
              onClose={this.handleCloseSnackbar}
            />
          </Snackbar>
          <Notification />
        </div>
      );
    }

    return <div />;
  }
}

export default withStyles(styles)(App);
