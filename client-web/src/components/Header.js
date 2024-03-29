import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/DehazeRounded';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import MailIcon from '@material-ui/icons/MailRounded';
import SettingIcon from '@material-ui/icons/SettingsRounded';
import ListAltIcon from '@material-ui/icons/ListAltRounded';
import ProfileIcon from '@material-ui/icons/PersonRounded';
import NotifyIcon from '@material-ui/icons/NotificationsRounded';
import Divider from '@material-ui/core/Divider';
import { inject, observer } from 'mobx-react';
import ManageList from './Dialogs/ManageList';
import Setting from './Dialogs/Setting';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import Profile from './Dialogs/Profile';
import ChatList from './Dialogs/ChatList';
import NotificationList from './Dialogs/NotificationList';

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
    boxSizing: 'border-box',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottom: 'solid 0.75px #eeeeee'
  }
};

@inject('userStore', 'routingStore', 'profileStore', 'chatStore')
@observer
class Header extends React.Component {
  state = {
    dialogOpen: '',
    drawerOpen: false
  };

  toggleDrawer = drawerOpen => () => {
    this.setState({ drawerOpen });
  };
  toggleDialog = title => () => {
    if (title === 'profile') {
      this.props.profileStore.toggleProfile(this.props.userStore.currentUser.username);
    }
    if (title === 'chat') {
      this.chatRefresh = setInterval(() => {
        this.props.chatStore.loadBubbles();
      }, 3000);
    }
    if (title === '') {
      clearInterval(this.chatRefresh);
    }
    this.setState({ dialogOpen: title });
  };

  render() {
    const { classes, routingStore } = this.props;
    const { currentUser } = this.props.userStore;
    const { location } = routingStore;

    const TitleNames = {
      '/': '简记作业',
      '/group': '群组',
      '/signIn': moment().format('M月D日 dddd')
    };

    return (
      <div>
        <div className={classes.root}>
          <Typography variant="h6">{TitleNames[location.pathname]}</Typography>
          <MenuIcon onClick={this.toggleDrawer(true)} />
        </div>

        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div style={{ width: 250 }}>
            <div style={{ paddingLeft: 16, paddingBottom: 16 }}>
              <Avatar src={currentUser.image} style={{ height: 60, width: 60, margin: '16px 0' }} />
              <Typography variant="subtitle1">{currentUser.username}</Typography>
              <Typography variant="body2">{currentUser.email}</Typography>
            </div>
            <Divider />
            <List>
              <ListItem button onClick={this.toggleDialog('profile')}>
                <ListItemIcon>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText primary="个人主页" />
              </ListItem>
              <ListItem button onClick={this.toggleDialog('manageList')}>
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="管理清单" />
              </ListItem>
              <ListItem button onClick={this.toggleDialog('notify')}>
                <ListItemIcon>
                  <NotifyIcon />
                </ListItemIcon>
                <ListItemText primary="最近通知" />
              </ListItem>
              <ListItem button onClick={this.toggleDialog('chat')}>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="私信" />
              </ListItem>
              <ListItem button onClick={this.toggleDialog('setting')}>
                <ListItemIcon>
                  <SettingIcon />
                </ListItemIcon>
                <ListItemText primary="设置" />
              </ListItem>
            </List>
          </div>
        </Drawer>

        <ManageList open={this.state.dialogOpen === 'manageList'} handleClose={this.toggleDialog('')} />
        <Setting open={this.state.dialogOpen === 'setting'} handleClose={this.toggleDialog('')} />
        <Profile open={this.state.dialogOpen === 'profile'} handleClose={this.toggleDialog('')} />
        <ChatList open={this.state.dialogOpen === 'chat'} handleClose={this.toggleDialog('')} />
        <NotificationList open={this.state.dialogOpen === 'notify'} handleClose={this.toggleDialog('')} />
      </div>
    );
  }
}

export default withStyles(styles)(Header);
