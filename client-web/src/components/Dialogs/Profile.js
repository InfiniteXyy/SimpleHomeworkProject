import React from 'react';
import { Avatar, withStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StackHeader from '../StackHeader';
import { FullScreenDialog } from '../utils';

const styles = {
  root: {
    paddingTop: 46,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 16px',
    boxSizing: 'border-box'
  },
  avatar: {
    height: 90,
    width: 90,
    marginTop: 50
  },
  container1: {
    width: 200,
    display: 'flex',
    justifyContent: 'space-around'
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  font1: {
    marginTop: 25,
    fontSize: 22,
    color: '#4a4a4a',
    fontWeight: 'bold'
  },
  font2: {
    marginTop: 28,
    fontSize: 16,
    color: '#4a4a4a'
  },
  font3: {
    fontSize: 12,
    color: '#9b9b9b',
    marginTop: 3
  },
  tabsRoot: {
    width: '100%',
    marginTop: 20
  },
  tabsContainer: {
    justifyContent: 'space-around'
  },
  tabRoot: {
    color: '#757575',
    fontSize: 14,
    fontWeight: 'bold'
  },
  tabsIndicator: {
    backgroundColor: '#89C3EB'
  },
  tabSelected: {
    color: '#4a4a4a',
    fontSize: 14,
    fontWeight: 'bold'
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EFEFEF'
  }
};
class Profile extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader title="" handleClickLeft={handleClose} />
        <div className={classes.root}>
          <Avatar
            className={classes.avatar}
            src="http://timeline.infinitex.cn/img/02/97e88c79a15cab3bd3262066d4d49b.jpg"
          />
          <div className={classes.font1}>InfiniteX</div>
          <div className={classes.container1}>
            <div className={classes.container2}>
              <div className={classes.font2}>17</div>
              <div className={classes.font3}>参与群组</div>
            </div>
            <div className={classes.container2}>
              <div className={classes.font2}>3</div>
              <div className={classes.font3}>创建群组</div>
            </div>
          </div>

          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator, flexContainer: classes.tabsContainer }}
          >
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="动态" />
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="群组" />
          </Tabs>
          <div className={classes.divider} />
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(Profile);
