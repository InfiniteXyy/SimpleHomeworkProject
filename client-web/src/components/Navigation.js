import React from 'react';
import { inject, observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SubjectIcon from '@material-ui/icons/Subject';
import DateRangeIcon from '@material-ui/icons/DateRange';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    left: 0,
    bottom: 0,
    background: 'white',
    borderTop: 'solid 0.75px #eeeeee'
  },
  actionButton: {
    minWidth: 56
  }
};

@inject('routingStore')
@observer
class Navigation extends React.Component {
  handleChange = (event, value) => {
    this.props.routingStore.replace(value);
  };

  render() {
    const { classes, routingStore } = this.props;
    const { location } = routingStore;
    return (
      <BottomNavigation value={location.pathname} onChange={this.handleChange} showLabels className={classes.root}>
        <BottomNavigationAction value="/" className={classes.actionButton} label={'作业'} icon={<DashboardIcon />} />
        <BottomNavigationAction value="/group" className={classes.actionButton} label={'群组'} icon={<SubjectIcon />} />
        <BottomNavigationAction
          value="/signIn"
          className={classes.actionButton}
          label={'打卡'}
          icon={<DateRangeIcon />}
        />
      </BottomNavigation>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navigation);
