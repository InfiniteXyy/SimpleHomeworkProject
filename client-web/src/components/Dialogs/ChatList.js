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
import { inject, observer } from 'mobx-react';
import moment from 'moment';

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

@inject('chatStore')
@observer
class ChatList extends React.Component {
  state = {
    pageOpen: ''
  };

  togglePage = (pageOpen, index) => () => {
    if (pageOpen) this.props.chatStore.togglePage(index);
    this.setState({ pageOpen });
  };

  render() {
    const { classes, handleClose, open } = this.props;
    let main;
    const chatPages = this.props.chatStore.chatPages;
    if (chatPages === undefined) {
      main = <div className="empty-tip">加载中...</div>;
    } else if (chatPages.length === 0) {
      main = <div className="empty-tip">空</div>;
    } else {
      main = chatPages.map((i, index) => {
        const lastBubble = i.bubbles[i.bubbles.length - 1];
        return (
          <React.Fragment key={index}>
            <ListItem button classes={{ root: classes.listItem }} onClick={this.togglePage('c', index)}>
              <ListItemAvatar>
                <Avatar src={i.avatar} />
              </ListItemAvatar>
              <ListItemText primary={i.person} secondary={lastBubble.content} />
              <ListItemSecondaryAction>
                <ListItemText classes={{ primary: classes.font1 }} primary={moment(lastBubble.createdAt).fromNow()} />
              </ListItemSecondaryAction>
            </ListItem>
            <li>
              <Divider classes={{ root: classes.divider }} variant="inset" />
            </li>
          </React.Fragment>
        );
      });
    }
    return (
      <FullScreenDialog open={open} white>
        <div className={classes.root}>
          <StackHeader title="消息" handleClickLeft={handleClose} />
          <List>{main}</List>
        </div>
        <ChatPage open={this.state.pageOpen !== ''} handleClose={this.togglePage('')} />
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ChatList);
