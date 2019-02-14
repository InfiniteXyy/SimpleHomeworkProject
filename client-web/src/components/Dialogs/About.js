import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';

const styles = {
  root: {
    textAlign: 'center'
  },
  font1: {
    fontSize: 24,
    color: '#4a4a4a',
    marginTop: 230,
    fontWeight: 'bold'
  },
  font2: {
    fontSize: 14,
    color: '#9B9B9B',
    marginTop: 6
  },
  font3: {
    fontSize: 16,
    color: '#757575',
    marginTop: 35
  }
};

class About extends Component {
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open}>
        <StackHeader title="关于" handleClickLeft={handleClose} />
        <div className={classes.root}>
          <div className={classes.font1}>简记作业</div>
          <div className={classes.font2}>v0.0.1 alpha</div>
          <div className={classes.font3}>Developed by InfiniteX</div>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(About);
