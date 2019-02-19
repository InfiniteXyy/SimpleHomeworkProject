import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';

const styles = {
  root: {
    width: '100%'
  }
};

class AddGroupCard extends Component {
  render() {
    const { classes } = this.props;
    return <div/>;
  }
}

export default withStyles(styles)(AddGroupCard);
