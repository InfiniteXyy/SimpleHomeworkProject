import React, { Component } from 'react';
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, withStyles } from '@material-ui/core';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import SearchIcon from '@material-ui/icons/SearchRounded';
import DeleteIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  root: {
    paddingTop: 60
  },
  paddingGroup: {
    padding: '0 16px'
  },
  bigTitle: {
    color: '#4a4a4a',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subTitle: {
    color: '#757575',
    fontSize: 16,
    marginBottom: 16
  },
  bigButton: {
    width: '100%',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f1f1f1',
    boxSizing: 'border-box'
  },
  bigButtonText: {
    fontSize: 18,
    color: '#4a4a4a',
    fontWeight: 'bold'
  },
  icon: {
    marginRight: 20,
    color: '#9b9b9b'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

const getNext = (type, items) => {
  switch (type) {
    case 'page-week':
      let last = items[items.length - 1];
      return `第${Number(last[1]) + 1}周`;
    default:
      return '自定义列表';
  }
};

class ListPage extends Component {
  state = {
    items: ['第1周']
  };

  handleAdd = () => {
    const { payload } = this.props;
    this.setState(prev => {
      return { ...prev, items: [...prev.items, getNext(payload, prev.items)] };
    });
  };

  handleDelete = i => () => {
    this.setState(prev => {
      return { ...prev, items: prev.items.filter((value, index) => i !== index) };
    });
  };

  handleEdit = i => () => {};

  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader title="添加列表" handleClickLeft={handleClose} leftTitle="取消" rightTitle="全部添加" />
        <List className={classes.root}>
          {this.state.items.map((i, index) => {
            return (
              <ListItem key={index} button onClick={this.handleEdit(index)}>
                <ListItemText primary={i} />
                <ListItemSecondaryAction>
                  <IconButton onClick={this.handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
        <Fab className={classes.fab} color="primary" onClick={this.handleAdd}>
          <AddIcon />
        </Fab>
      </FullScreenDialog>
    );
  }
}

ListPage = withStyles(styles)(ListPage);

class AddListDialog extends Component {
  state = {
    dialogOpen: ''
  };

  toggleDialog = dialogOpen => () => {
    this.setState({ dialogOpen });
  };

  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open}>
        <StackHeader title="添加列表" handleClickLeft={handleClose} leftTitle="取消" />
        <div className={classes.root}>
          <div className={classes.paddingGroup}>
            <div className={classes.bigTitle}>添加列表</div>
            <div className={classes.subTitle}>根据你的偏好添加合适的列表</div>
            <div className={classes.bigButton} onClick={this.toggleDialog('page-custom')}>
              <SearchIcon fontSize="large" className={classes.icon} />
              <div className={classes.bigButtonText}>自定义列表</div>
            </div>
            <div className={classes.bigButton} onClick={this.toggleDialog('page-group')}>
              <SearchIcon fontSize="large" className={classes.icon} />
              <div className={classes.bigButtonText}>根据群组添加列表</div>
            </div>
            <div className={classes.bigButton} onClick={this.toggleDialog('page-week')}>
              <SearchIcon fontSize="large" className={classes.icon} />
              <div className={classes.bigButtonText}>根据周数添加列表</div>
            </div>
            <div className={classes.bigButton} onClick={this.toggleDialog('page-important')}>
              <SearchIcon fontSize="large" className={classes.icon} />
              <div className={classes.bigButtonText}>根据重要程度添加列表</div>
            </div>
          </div>
        </div>
        <ListPage
          payload={this.state.dialogOpen}
          open={this.state.dialogOpen.startsWith('page')}
          handleClose={this.toggleDialog('')}
        />
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(AddListDialog);
