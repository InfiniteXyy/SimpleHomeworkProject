import React, { Component } from 'react';
import { List, ListItemSecondaryAction, ListItemText, ListSubheader, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import ListItem from '@material-ui/core/ListItem';
import StackHeader from '../StackHeader';
import GroupCreateIcon from '@material-ui/icons/PlaylistAddRounded';
import GroupAddIcon from '@material-ui/icons/GroupAddRounded';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DialogCreateGroup from './DialogCreateGroup';
import DialogJoinGroup from './DialogJoinGroup';
import GroupHomePage from './GroupHomePage';

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
    height: 50,
    backgroundColor: 'white',
    borderTop: '0.75px solid #eeeeee'
  },
  list: {
    borderBottom: '0.75px solid #eeeeee',
    paddingBottom: 0
  },
  secondaryText: {
    color: '#9b9b9b'
  }
};

const roles = {
  creator: '群主'
};

@inject('routingStore', 'groupStore')
@observer
class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: '',
      payload: undefined
    };
  }

  toggleDialog = (type, title) => () => {
    if (!type) {
      this.setState({ dialogOpen: '' });
    } else {
      this.setState({ dialogOpen: title });
    }
  };

  openGroup = group => () => {
    this.setState({ dialogOpen: 'group', payload: group });
  };

  render() {
    const { classes, onClose, groups } = this.props;
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

          <List className={classes.list} subheader={<ListSubheader>我的群组</ListSubheader>}>
            {groups.map(i => (
              <ListItem style={styles.groupItem} button key={i.id} onClick={this.openGroup(i)}>
                <ListItemText primary={i.title} />
                <ListItemSecondaryAction>
                  <ListItemText classes={{ primary: classes.secondaryText }} primary={roles[i.tag]} />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>

        <DialogCreateGroup open={this.state.dialogOpen === 'create'} handleClose={this.toggleDialog(false)} />
        <DialogJoinGroup open={this.state.dialogOpen === 'join'} handleClose={this.toggleDialog(false)} />
        <GroupHomePage
          open={this.state.dialogOpen === 'group'}
          group={this.state.payload}
          handleClose={this.toggleDialog(false)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(GroupList);
