import React, { Component } from 'react';
import { Dialog, withStyles } from '@material-ui/core';
import { SlideTransition } from '../utils';
import StackHeader from '../StackHeader';

const styles = {
  root: {
    width: '100%',
    paddingTop: 46
  }
};

class CardToday extends Component {
  render() {
    const { classes, open, onClose } = this.props;
    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <div>
          <StackHeader title="今日打卡" handleClickLeft={onClose} />
          <div className={classes.root} />
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(CardToday);
