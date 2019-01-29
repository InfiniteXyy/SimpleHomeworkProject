import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const styles = {
  header: {
    width: '100%',
    top: 0,
    position: 'fixed',
    color: '#9a9a9a',
    backgroundColor: 'white',
    height: 46
  },
  headerContainer: {
    height: '100%',
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: 'solid 0.75px #eeeeee'
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  verticalCenter: {
    display: 'flex',
    alignItems: 'center'
  }
};

const StackHeader = props => ({
  render() {
    const { classes, leftTitle, rightTitle, title, handleClickLeft, handleClickRight } = props;
    return (
      <div className={classes.header}>
        <div className={classes.headerContainer}>
          <div style={{ flex: 1 }} className={classes.verticalCenter}>
            <p className="btn" onClick={handleClickLeft}>
              {leftTitle ? leftTitle : '返回'}
            </p>
          </div>
          <div style={{ flex: 1 }} className={classes.center}>
            <Typography variant="subtitle1">{title}</Typography>
          </div>
          <div style={{ flex: 1 }} className={classes.center}>
            <p>{rightTitle ? rightTitle : null}</p>
          </div>
        </div>
      </div>
    );
  }
});

StackHeader.propTypes = {
  classes: PropTypes.object,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  handleClickLeft: PropTypes.func.isRequired,
  handleClickRight: PropTypes.func
};

export default withStyles(styles)(StackHeader);
