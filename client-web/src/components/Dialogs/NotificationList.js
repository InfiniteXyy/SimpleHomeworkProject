import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import { inject, observer } from 'mobx-react';
import { NotificationCard } from '../Notification';

const styles = {
  root: {
    paddingTop: 46,
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    marginTop: 20
  }
};

@inject('commonStore')
@observer
class NotificationList extends Component {
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open}>
        <StackHeader handleClickLeft={handleClose} title="通知列表" />
        <div className={classes.root}>
          {this.props.commonStore.allTasks.map((i, index) => (
            <div className={classes.container} key={index}>
              <NotificationCard notification={i} />
            </div>
          ))}
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(NotificationList);
