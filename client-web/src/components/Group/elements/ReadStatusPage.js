import React, { Component } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Tab, Tabs, withStyles } from '@material-ui/core';
import { FullScreenDialog } from '../../utils';
import StackHeader from '../../StackHeader';
import moment from './GroupCardHome';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    paddingTop: 46
  }
};

const UserList = ({ users }) => {
  if (users.length === 0) {
    return <div className="empty-tip">无用户...</div>;
  }
  return (
    <List>
      {users.map(user => {
        return (
          <ListItem key={user.username}>
            <ListItemAvatar>
              <Avatar src={user.image} />
            </ListItemAvatar>
            <ListItemText primary={user.username} />
          </ListItem>
        );
      })}
    </List>
  );
};

@inject('messageStore')
@observer
class ReadStatusPage extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes, open, handleClose } = this.props;
    const users = this.props.messageStore.readStatus;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader handleClickLeft={handleClose} title="消息情况" />
        <div className={classes.root}>
          <Tabs value={this.state.value} variant="fullWidth" onChange={this.handleChange}>
            <Tab label="已阅读" />
            <Tab label="未阅读" />
          </Tabs>
          {users ? (
            <div>
              {this.state.value === 0 ? (
                <UserList users={users.filter(i => i.read)} />
              ) : (
                <UserList users={users.filter(i => !i.read)} />
              )}
            </div>
          ) : (
            <div className="empty-tip">加载中...</div>
          )}
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ReadStatusPage);
