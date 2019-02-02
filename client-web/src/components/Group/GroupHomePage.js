import React, { Component } from 'react';
import { Dialog, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { SlideTransition } from '../utils';
import StackHeader from '../StackHeader';

const styles = theme => ({
  root: {
    width: '100%',
    paddingTop: 46
  },
  tab: {
    backgroundColor: 'white'
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

  render() {
    const { open, payload, handleClose, classes } = this.props;
    if (!payload) return <div />;
    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <div style={{ backgroundColor: '#fafafa' }}>
          <StackHeader handleClickLeft={handleClose} title={payload.title} />
          <div className={classes.root}>
            <Tabs
              className={classes.tab}
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="最新消息" disableRipple />
              <Tab label="打卡任务" disableRipple />
              <Tab label="群组成员" disableRipple />
            </Tabs>
            <SwipeableViews index={this.state.value} onChangeIndex={this.handleChangeIndex}>
              <TabContainer>Item One</TabContainer>
              <TabContainer>Item Two</TabContainer>
              <TabContainer>Item Three</TabContainer>
            </SwipeableViews>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(GroupHomePage);
