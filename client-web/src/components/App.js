import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Home from './Home';
import Group from './Group';
import Profile from './Profile';
import SignIn from './SignIn';
import Navigation from './Navigation';

import { withStyles } from '@material-ui/core/styles';
import Setting from './Profile/Setting';
import AddTodo from './Home/AddTodo';

const styles = {
  root: {
    marginBottom: 56,
    marginLeft: -8,
    marginRight: -8
  }
};

@withRouter
class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.root}>
          <Switch>
            <Route path="/setting" children={<Setting />} />
            <Route path="/todoAdd" children={<AddTodo />} />
            <Route
              path="*"
              children={
                <div>
                  <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/group" component={Group} />
                    <Route path="/signIn" component={SignIn} />
                    <Route path="/profile" component={Profile} />
                  </Switch>
                  <Navigation />
                </div>
              }
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
