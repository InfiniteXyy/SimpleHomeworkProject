import React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    width: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    color: '#9a9a9a',
    backgroundColor: "white",
    fontWeight: 'bold',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 16,
    borderBottom: 'solid 0.75px #eeeeee'
  }
};

function Header(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Typography variant="h6">简记作业</Typography>
    </div>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
