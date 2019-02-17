import React from 'react';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  withStyles
} from '@material-ui/core';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import ChatPage from './ChatPage';

const styles = {
  root: {
    paddingTop: 46
  },
  font1: {
    color: '#9b9b9b',
    fontSize: 12
  },
  divider: {
    backgroundColor: '#eaeaea'
  },
  listItem: {
    paddingTop: 16,
    paddingBottom: 16
  }
};

class ChatList extends React.Component {
  state = {
    pageOpen: ''
  };

  togglePage = pageOpen => () => {
    this.setState({ pageOpen });
  };
  render() {
    const { classes, handleClose, open } = this.props;
    return (
      <FullScreenDialog open={open} white>
        <div className={classes.root}>
          <StackHeader title="消息" handleClickLeft={handleClose} />
          <List>
            {[1, 2, 3, 4].map(i => (
              <React.Fragment key={i}>
                <ListItem button classes={{ root: classes.listItem }} onClick={this.togglePage('123')}>
                  <ListItemAvatar>
                    <Avatar src="https://i0.wp.com/ebus.ca/wp-content/uploads/2017/08/profile-placeholder.jpg?ssl=1" />
                  </ListItemAvatar>
                  <ListItemText primary="三千焱炎火" secondary="在吗" />
                  <ListItemSecondaryAction>
                    <ListItemText classes={{ primary: classes.font1 }} primary="下午8:00" />
                  </ListItemSecondaryAction>
                </ListItem>
                <li>
                  <Divider classes={{ root: classes.divider }} variant="inset" />
                </li>
              </React.Fragment>
            ))}
          </List>
        </div>
        <ChatPage open={this.state.pageOpen !== ''} handleClose={this.togglePage('')} />
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ChatList);
