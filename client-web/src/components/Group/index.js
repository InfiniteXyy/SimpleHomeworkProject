import React from 'react';
import { Dialog, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { MessageList } from './MessageList';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import StarIcon from '@material-ui/icons/StarRounded';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import GroupList from './GroupList';
import { SlideTransition } from '../utils';
import LikeListDialog from './LikeListDialog';

const styles = {
  root: {
    width: '100%'
  },
  list: {
    marginBottom: 16
  },
  bigList: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5c5c5c'
  },
  listItem: {
    borderTop: '0.75px solid #eeeeee',
    borderBottom: '0.75px solid #eeeeee',
    height: 60,
    marginTop: 10,
    backgroundColor: 'white'
  },
  secondaryText: {
    color: '#9b9b9b'
  },
  subtitle: {
    marginLeft: 16,
    marginTop: 26,
    marginBottom: 9,
    fontSize: 14,
    fontWeight: '500',
    color: '#9b9b9b'
  }
};

@inject('messageStore', 'commonStore', 'groupStore')
@observer
class Group extends React.Component {
  componentDidMount() {
    this.props.messageStore.loadMessages();
    this.props.groupStore.loadGroups();
  }

  constructor(props) {
    super(props);
    this.state = {
      groupListOpen: false,
      likeListOpen: false
    };
  }

  handleCloseGroupList = () => {
    this.setState({ groupListOpen: false });
  };
  handleOpenGroupList = () => {
    this.setState({ groupListOpen: true });
  };

  toggleLikeList = (open = true) => () => {
    this.setState({ likeListOpen: open });
  };

  render() {
    const { messageStore, groupStore, classes } = this.props;
    const { groups } = groupStore;
    return (
      <div>
        <div className={classes.root}>
          <List className={classes.list} disablePadding>
            <ListItem button style={styles.listItem} onClick={this.handleSetting}>
              <ListItemIcon>
                <PeopleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.bigList }}
                primary="我的群组"
                onClick={this.handleOpenGroupList}
              />
              <ListItemSecondaryAction>
                <ListItemText classes={{ primary: classes.secondaryText }} primary={`${groups.length} 个`} />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem button style={styles.listItem} onClick={this.toggleLikeList()}>
              <ListItemIcon>
                <StarIcon color="primary" style={{ color: '#F5A623' }} />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.bigList }} primary="收藏" />
            </ListItem>
          </List>

          <p className={classes.subtitle}>最近消息</p>

          <MessageList messages={messageStore.messages} loadItems={messageStore.loadMore} />
        </div>

        <Dialog
          open={this.state.groupListOpen}
          onClose={this.handleCloseGroupList}
          fullScreen
          transitionDuration={300}
          TransitionComponent={SlideTransition}
        >
          <GroupList groups={groups} onClose={this.handleCloseGroupList} />
        </Dialog>

        <LikeListDialog open={this.state.likeListOpen} handleClose={this.toggleLikeList(false)} />
      </div>
    );
  }
}

export default withStyles(styles)(Group);
