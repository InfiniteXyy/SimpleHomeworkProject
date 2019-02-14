import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import SelectIcon from '@material-ui/icons/ChevronRight';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  root: {
    width: '100%',
    paddingTop: 46
  },
  list: {
    borderTop: '0.75px solid #eeeeee'
  },
  listItem: {
    height: 56,
    borderBottom: '0.75px solid #eeeeee'
  },
  avatar: {
    height: 24,
    width: 24
  },
  font1: {
    fontSize: 16,
    color: '#4a4a4a'
  },
  font2: {
    fontSize: 14,
    color: '#9b9b9b',
    marginRight: 16
  },
  icon: {
    color: '#9b9b9b'
  }
};

const data = [
  { name: '勿忘草', color: '#89c3eb' },
  { name: '柑子', color: '#f6ad49' },
  { name: '菖蒲', color: '#674196' },
  { name: '常磐', color: '#007b43' }
];

const selected = '#89c3eb';

class ThemeDialog extends Component {
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader title="主题" handleClickLeft={handleClose} />
        <div className={classes.root}>
          <List subheader={<ListSubheader>选择主题色</ListSubheader>} classes={{ root: classes.list }} disablePadding>
            {data.map(i => (
              <ListItem button key={i.name} classes={{ root: classes.listItem }}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: i.color }} />
                </ListItemAvatar>
                <ListItemText primary={i.name} classes={{ primary: classes.font1 }} />
                <ListItemSecondaryAction>
                  {i.color === selected ? (
                    <div className={classes.font2}>正在使用</div>
                  ) : (
                    <IconButton>
                      <SelectIcon className={classes.icon} />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ThemeDialog);
