import React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/DehazeRounded';

const styles = {
  root: {
    width: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    color: '#9a9a9a',
    backgroundColor: 'white',
    fontWeight: 'bold',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
    boxSizing: "border-box",
    paddingLeft: 16,
    paddingRight: 16,
    borderBottom: 'solid 0.75px #eeeeee'
  }
};

function Header(props) {
  const { classes, onClick } = props;

  return (
    <div className={classes.root}>
      <Typography variant="h6">简记作业</Typography>
      <MenuIcon onClick={onClick} />
    </div>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
