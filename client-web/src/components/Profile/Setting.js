import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { inject, observer } from 'mobx-react';
import './Setting.css';

import AccountIcon from '@material-ui/icons/AccountCircleRounded';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import SunIcon from '@material-ui/icons/WbSunnyRounded';
import ThemeIcon from '@material-ui/icons/ToysRounded';
import CodeIcon from '@material-ui/icons/CodeRounded';
import MoreIcon from '@material-ui/icons/MoreRounded';
import { ListItemIcon } from '@material-ui/core';

const styles = theme => ({
  root: {
    paddingTop: 38,
    width: '100%',
    backgroundColor: '#fafafa',
    height: '100%'
  },
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
    justifyContent: 'space-between'
  },
  listContainer: {
    padding: 0,
    background: 'white',
    marginTop: 12,
    borderBottom: 'solid 1px #f1f1f1'
  },
  listItem: {
    borderTop: 'solid 1px #f1f1f1',
    backgroundColor: 'white'
  }
});

@inject('routingStore', 'authStore')
@observer
class Setting extends Component {
  handleBack = () => {
    this.props.onClose();
  };

  handleLogout = () => {
    this.props.authStore.logout();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.headerContainer}>
            <p className="btn" onClick={this.handleBack}>
              返回
            </p>
            <Typography variant="subtitle1">设置</Typography>
            <p className="btn" onClick={this.handleBack}>
              关于
            </p>
          </div>
        </div>
        <p className="list-subtitle">账号设置</p>
        <List className={classes.listContainer}>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary="账号与安全" />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="学期设置" />
          </ListItem>
        </List>
        <p className="list-subtitle">基本设置</p>
        <List className={classes.listContainer}>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <SunIcon />
            </ListItemIcon>
            <ListItemText primary="夜间模式" />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <ThemeIcon />
            </ListItemIcon>
            <ListItemText primary="主题" />
          </ListItem>
        </List>

        <p className="list-subtitle">其它</p>
        <List className={classes.listContainer}>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary="开源库" />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <MoreIcon />
            </ListItemIcon>
            <ListItemText primary="关于简记" />
          </ListItem>
        </List>

        <Typography variant="overline" style={{ marginTop: 10, marginLeft: 16, color: '#bebebe' }}>
          Version 0.0.1 alpha
        </Typography>

        <div className="logout" onClick={this.handleLogout}>退出当前帐号</div>
      </div>
    );
  }
}

export default withStyles(styles)(Setting);
