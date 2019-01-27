import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%'
  }
});

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

@inject('groupStore', 'routingStore')
@observer
class GroupHomePage extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleBack = () => {
    this.props.routingStore.goBack();
  };
  render() {
    return (
      <div>
        <button onClick={this.handleBack}>back</button>
        {`group id: ${this.props.match.params.id}`}
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="最新消息" />
            <Tab label="打卡任务" />
            <Tab label="群组成员" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer>Item One</TabContainer>
          <TabContainer>Item Two</TabContainer>
          <TabContainer>Item Three</TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles)(GroupHomePage);
