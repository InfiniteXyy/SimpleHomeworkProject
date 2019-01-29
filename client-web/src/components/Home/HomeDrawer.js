import React, { Component } from 'react';
import { Dialog, ListItemSecondaryAction, ListSubheader, Typography, withStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import InboxIcon from '@material-ui/icons/InboxRounded';
import MailIcon from '@material-ui/icons/MailRounded';
import ListAltIcon from '@material-ui/icons/ListAltRounded';
import Divider from '@material-ui/core/Divider';
import { SlideTransition } from '../utils';
import { inject, observer } from 'mobx-react';
import todoListStore from '../../stores/todoListStore';
import StackHeader from '../StackHeader';

import ListIcon from '@material-ui/icons/ListRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import EditIcon from '@material-ui/icons/EditRounded';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  root: {}
};

@inject('userStore')
class HomeDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: ''
    };
  }

  toggleDialog = (title, type) => () => {
    if (type) {
      this.setState({ dialogOpen: title });
    } else {
      this.setState({ dialogOpen: '' });
    }
  };

  render() {
    const { classes, drawerOpen, toggleDrawer } = this.props;
    const { currentUser } = this.props.userStore;
    return (
      <div className={classes.root}>
        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
          <div style={{ width: 250 }}>
            <div style={{ paddingLeft: 16, paddingBottom: 16 }}>
              <Avatar src={currentUser.image} style={{ height: 60, width: 60, margin: '16px 0' }} />
              <Typography variant="subtitle1">{currentUser.username}</Typography>
              <Typography variant="body2">{currentUser.email}</Typography>
            </div>
            <Divider />
            <List>
              <ListItem button onClick={this.toggleDialog('manageList', true)}>
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="管理清单" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="我的私信" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="收集箱" />
              </ListItem>
            </List>
          </div>
        </Drawer>

        <DialogManageList
          open={this.state.dialogOpen === 'manageList'}
          handleClose={this.toggleDialog('manageList', false)}
        />
      </div>
    );
  }
}

@inject('todoListStore')
@observer
class DialogManageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerFor: '',
      drawerOpen: false
    };
  }
  toggleDrawer = (type, list) => () => {
    this.setState({
      drawerFor: type ? list : '',
      drawerOpen: type
    });
  };

  render() {
    const { open, handleClose } = this.props;
    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="清单列表" handleClickLeft={handleClose} />
        <div style={{ paddingTop: 40 }}>
          <List>
            {this.props.todoListStore.todoLists.map(i => {
              return (
                <ListItem button key={i.id}>
                  <ListItemText primary={i.title} />
                  <ListItemSecondaryAction>
                    <ListItemIcon>
                      <ListIcon style={{ color: '#757575' }} onClick={this.toggleDrawer(true, i)} />
                    </ListItemIcon>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
        <Drawer anchor="bottom" open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div>
            <List subheader={<ListSubheader>{this.state.drawerFor.title}</ListSubheader>}>
              <ListItem button>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary="编辑" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="删除" />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HomeDrawer);
