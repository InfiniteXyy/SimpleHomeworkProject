import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';

import ListIcon from '@material-ui/icons/ListRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import EditIcon from '@material-ui/icons/EditRounded';
import Drawer from '@material-ui/core/Drawer';

import { SlideTransition } from '../utils';
import StackHeader from '../StackHeader';

@inject('todoListStore')
@observer
class ManageList extends Component {
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
    if (this.props.todoListStore.todoLists === undefined) return <div />;
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

export default ManageList;
