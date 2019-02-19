import React, { Component } from 'react';
import { Avatar, List, ListItemAvatar, ListItemText, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import ListItem from '@material-ui/core/ListItem';

import './GroupHomePage.css';
import { MessageList } from './MessageList';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';
import AddCardIcon from '@material-ui/icons/LibraryAddOutlined';
import AddMessage from './AddMessage';
import GroupCardList from './elements/GroupCardList';

const canEdit = {
  creator: true,
  admin: true
};
const styles = theme => ({
  root: {
    width: '100%',
    boxSizing: 'border-box',
    paddingTop: 94.75
  },
  tab: {
    position: 'fixed',
    top: 46,
    width: '100%',
    backgroundColor: 'white',
    borderBottom: 'solid 0.75px #eeeeee',
    zIndex: 100
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

@inject('groupStore', 'routingStore')
@observer
class GroupHomePage extends Component {
  reset = () => {
    this.setState({ value: 0 });
    this.props.groupStore.clearDetail();
  };

  state = {
    value: 0,
    dialogOpen: ''
  };

  toggleDialog = type => () => {
    this.setState({ dialogOpen: type });
  };

  handleChangeValue = value => {
    switch (value) {
      case 0:
        this.props.groupStore.loadMessage();
        return;
      case 1:
        this.props.groupStore.loadCards();
        return;
      case 2:
        this.props.groupStore.loadDetail();
        return;
      default:
        return;
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.handleChangeValue(value);
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
    this.handleChangeValue(index);
  };

  onEnter = () => {
    this.props.groupStore.toggleGroup(this.props.group);
    this.props.groupStore.loadMessage();
  };

  render() {
    const fabs = [
      {
        color: 'primary',
        icon: <AddIcon />,
        onClick: this.toggleDialog('message')
      },
      {
        color: 'primary',
        icon: <AddCardIcon />,
        onClick: this.toggleDialog('')
      }
    ];

    const { classes, open, group, groupStore, handleClose } = this.props;
    if (!group) return <div />;
    return (
      <FullScreenDialog open={open} onExited={this.reset} onEnter={this.onEnter}>
        <StackHeader handleClickLeft={handleClose} title={group.title} />
        <Tabs
          className={classes.tab}
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="最新消息" disableRipple />
          <Tab label="打卡任务" disableRipple />
          <Tab label="群组成员" disableRipple />
        </Tabs>
        <div className={classes.root}>
          <SwipeableViews index={this.state.value} onChangeIndex={this.handleChangeIndex}>
            <MessageList messages={groupStore.groupMessages} loadItems={groupStore.loadMore(group.id)} />
            <GroupCardList cards={groupStore.groupCards} />
            <MemberList detail={groupStore.groupDetail} />
          </SwipeableViews>
          {canEdit[group.tag] ? (
            fabs.map((fab, index) => (
              <Zoom
                key={index}
                in={this.state.value === index}
                timeout={100}
                unmountOnExit
                style={{
                  transitionDelay: `${this.state.value === index ? 100 : 0}ms`
                }}
              >
                <Fab className={classes.fab} color={fab.color} onClick={fab.onClick}>
                  {fab.icon}
                </Fab>
              </Zoom>
            ))
          ) : (
            <div />
          )}
        </div>

        <AddMessage open={this.state.dialogOpen === 'message'} handleClose={this.toggleDialog('')} />
      </FullScreenDialog>
    );
  }
}

const MemberList = props => {
  const { detail } = props;
  if (!detail) {
    return <div style={{ color: '#9b9b9b', textAlign: 'center', marginTop: 20, fontSize: 12 }}>加载中</div>;
  }
  return (
    <List className="list-root">
      {detail.members.map(i => (
        <ListItem className="list-item" key={i.username} style={styles.listItem}>
          <ListItemAvatar>
            <Avatar src={i.image} />
          </ListItemAvatar>
          <ListItemText primary={i.username} />
        </ListItem>
      ))}
    </List>
  );
};

export default withStyles(styles)(GroupHomePage);
