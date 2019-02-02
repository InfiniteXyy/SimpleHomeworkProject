import React, { Component } from 'react';
import { List, ListItemText, ListSubheader, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import ListItem from '@material-ui/core/ListItem';
import StackHeader from '../StackHeader';
import GroupCreateIcon from '@material-ui/icons/PlaylistAddRounded';
import GroupAddIcon from '@material-ui/icons/GroupAddRounded';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DialogCreateGroup from './DialogCreateGroup';
import DialogJoinGroup from './DialogJoinGroup';

const styles = {
  root: {
    paddingTop: 40
  },
  listItem: {
    borderTop: 'solid 1px #f1f1f1',
    borderBottom: 'solid 1px #f1f1f1',
    marginTop: 10,
    backgroundColor: 'white'
  },
  groupItem: {
    backgroundColor: 'white',
    borderTop: 'solid 1px #f1f1f1'
  },
  list: {
    borderBottom: 'solid 1px #f1f1f1',
    paddingBottom: 0
  }
};

@inject('groupStore', 'routingStore')
@observer
class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: ''
    };
  }

  toggleDialog = (type, title) => () => {
    if (!type) {
      this.setState({ dialogOpen: '' });
    } else {
      this.setState({ dialogOpen: title });
    }
  };

  handleGroupDetail = id => () => {
    this.props.routingStore.push(`/group/${id}`);
  };
  render() {
    const { classes, onClose } = this.props;
    return (
      <div style={{ backgroundColor: '#fafafa', height: '100%' }}>
        <StackHeader title="群组列表" handleClickLeft={onClose} />
        <div className={classes.root}>
          <List>
            <ListItem button style={styles.listItem} onClick={this.toggleDialog(true, 'join')}>
              <ListItemIcon>
                <GroupAddIcon color="primary" />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.bigList }} primary="加入群组" />
            </ListItem>

            <ListItem button style={styles.listItem} onClick={this.toggleDialog(true, 'create')}>
              <ListItemIcon>
                <GroupCreateIcon color="primary" />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.bigList }} primary="创建群组" />
            </ListItem>
          </List>

          <List className={classes.list} subheader={<ListSubheader>管理的群组</ListSubheader>}>
            {this.props.groupStore.groups.map(i => (
              <ListItem style={styles.groupItem} button key={i.id} onClick={this.handleGroupDetail(i.id)}>
                <ListItemText primary={i.title} />
              </ListItem>
            ))}
          </List>
          <List className={classes.list} subheader={<ListSubheader>加入的群组</ListSubheader>}>
            {this.props.groupStore.groups.map(i => (
              <ListItem style={styles.groupItem} button key={i.id} onClick={this.handleGroupDetail(i.id)}>
                <ListItemText primary={i.title} />
              </ListItem>
            ))}
          </List>
        </div>

        <DialogCreateGroup open={this.state.dialogOpen === 'create'} handleClose={this.toggleDialog(false)} />
        <DialogJoinGroup open={this.state.dialogOpen === 'join'} handleClose={this.toggleDialog(false)} />
      </div>
    );
  }
}

export default withStyles(styles)(GroupList);
