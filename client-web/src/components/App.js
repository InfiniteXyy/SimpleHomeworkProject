import React, { Component } from 'react';
import { Route, Router, Switch, withRouter } from 'react-router-dom';
import Home from './Home';
import Group from './Group';
import Profile from './Profile';
import SignIn from './SignIn';
import Navigation from './Navigation';

import { withStyles } from '@material-ui/core/styles';
import Login from './Login';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    marginBottom: 56,
    marginLeft: -8,
    marginRight: -8
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
    if (this.props.commonStore.token) {
      this.props.userStore.pullUser().finally(() => {
        this.props.commonStore.setAppLoaded();
      });
    }
  }

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

      return (
        <div>
          <div className={classes.root}>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/group" component={Group} />
              <Route path="/signIn" component={SignIn} />
              <Route path="/profile" component={Profile} />
            </Switch>
            <Navigation />
          </div>
        </div>
      );
    }

    return <div />;
  }
}

export default withStyles(styles)(App);
