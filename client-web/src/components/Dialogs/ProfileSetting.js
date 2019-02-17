import React from 'react';
import { Avatar, List, ListItem, ListItemSecondaryAction, withStyles } from '@material-ui/core';
import RightIcon from '@material-ui/icons/ChevronRightRounded';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    paddingBottom: '100px',
    padding: '0 16px',
    marginTop: '46px'
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 34,
    width: 34,
    marginRight: 8
  },
  icon: {
    color: '#E3E3E3'
  },
  listItem: {
    borderBottom: 'solid 0.75px #e3e3e3',
    padding: '20px 0'
  },
  font1: {
    fontSize: 16,
    marginRight: 8,
    color: '#9b9b9b'
  },
  font2: {
    fontSize: 16,
    color: '#4a4a4a'
  }
};

@inject('userStore')
@observer
class ProfileSetting extends React.Component {
  render() {
    const { classes, open, handleClose } = this.props;
    const user = this.props.userStore.currentUser;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader title="个人设置" handleClickLeft={handleClose} />
        <div className={classes.root}>
          <List>
            <ListItem className={classes.listItem}>
              <div className={classes.font2}>更换头像</div>
              <ListItemSecondaryAction>
                <div className={classes.rightContainer}>
                  <Avatar className={classes.avatar} src={user.image} />
                  <RightIcon className={classes.icon} />
                </div>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItem}>
              <div className={classes.font2}>昵称</div>
              <ListItemSecondaryAction>
                <div className={classes.rightContainer}>
                  <div className={classes.font1}>{user.username}</div>
                  <RightIcon className={classes.icon} />
                </div>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItem}>
              <div className={classes.font2}>修改密码</div>
              <ListItemSecondaryAction>
                <div className={classes.rightContainer}>
                  <RightIcon className={classes.icon} />
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ProfileSetting);
