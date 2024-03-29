import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { inject, observer } from 'mobx-react';
import './Setting.css';

import AccountIcon from '@material-ui/icons/AccountCircleRounded';
import SunIcon from '@material-ui/icons/WbSunnyRounded';
import ThemeIcon from '@material-ui/icons/ToysRounded';
import CodeIcon from '@material-ui/icons/CodeRounded';
import MoreIcon from '@material-ui/icons/MoreRounded';
import StackHeader from '../StackHeader';
import { SlideTransition } from '../utils';
import ProfileSetting from './ProfileSetting';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import About from './About';
import OpenSource from './OpenSource';
import ThemeDialog from './ThemeDialog';

const styles = theme => ({
  root: {
    paddingTop: 46,
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
  state = {
    dialogOpen: ''
  };

  toggleDialog = dialogOpen => () => {
    this.setState({ dialogOpen });
  };
  handleLogout = () => {
    this.props.authStore.logout();
  };

  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <div className={classes.root}>
          <StackHeader title="设置" handleClickLeft={handleClose} />
          <p className="list-subtitle">账号设置</p>
          <List className={classes.listContainer}>
            <ListItem className={classes.listItem} button onClick={this.toggleDialog('setting')}>
              <ListItemIcon>
                <AccountIcon />
              </ListItemIcon>
              <ListItemText primary="账号与安全" />
            </ListItem>
          </List>
          <p className="list-subtitle">基本设置</p>
          <List className={classes.listContainer}>
            <ListItem className={classes.listItem}>
              <ListItemIcon>
                <SunIcon />
              </ListItemIcon>
              <ListItemText primary="夜间模式" />
              <ListItemSecondaryAction>
                <Switch />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItem} button onClick={this.toggleDialog('theme')}>
              <ListItemIcon>
                <ThemeIcon />
              </ListItemIcon>
              <ListItemText primary="主题" />
            </ListItem>
          </List>

          <p className="list-subtitle">其它</p>
          <List className={classes.listContainer}>
            <ListItem className={classes.listItem} button onClick={this.toggleDialog('openSource')}>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary="开源库" />
            </ListItem>
            <ListItem className={classes.listItem} button onClick={this.toggleDialog('about')}>
              <ListItemIcon>
                <MoreIcon />
              </ListItemIcon>
              <ListItemText primary="关于简记" />
            </ListItem>
          </List>

          <Typography variant="overline" style={{ marginTop: 10, marginLeft: 16, color: '#bebebe' }}>
            Version 0.0.1 alpha
          </Typography>

          <div className="logout" onClick={this.handleLogout}>
            退出当前帐号
          </div>
        </div>
        <ProfileSetting open={this.state.dialogOpen === 'setting'} handleClose={this.toggleDialog('')} />
        <About open={this.state.dialogOpen === 'about'} handleClose={this.toggleDialog('')} />
        <OpenSource open={this.state.dialogOpen === 'openSource'} handleClose={this.toggleDialog('')} />
        <ThemeDialog open={this.state.dialogOpen === 'theme'} handleClose={this.toggleDialog('')} />
      </Dialog>
    );
  }
}

export default withStyles(styles)(Setting);
