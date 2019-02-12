import React, { Component } from 'react';
import { IconButton, ListItem, ListItemSecondaryAction, withStyles } from '@material-ui/core';
import { ConfirmDialog, FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import List from '@material-ui/core/List';
import { inject, observer } from 'mobx-react';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/CheckCircleOutlined';

const styles = {
  root: {
    width: '100%',
    marginTop: 56,
    padding: '0 10px',
    boxSizing: 'border-box',
    backgroundColor: 'white'
  }
};

@inject('cardStore')
@observer
class CardToday extends Component {
  state = {
    drawerOpen: false
  };

  toggleDrawer = drawerOpen => {
    this.setState({ drawerOpen });
  };

  handleDelete = log => () => {
    this.toggleDrawer(true);
    this.setState({ payload: log });
  };

  onDelete = () => {
    this.props.cardStore.deleteLog(this.state.payload);
    this.toggleDrawer(false);
  };

  render() {
    const { classes, open, onClose, cardStore } = this.props;

    return (
      <FullScreenDialog open={open}>
        <StackHeader title="今日打卡" handleClickLeft={onClose} />
        <div className={classes.root}>
          <List>
            {cardStore.todayCards.map(i => {
              const log = cardStore.cardLogs.find(log => log.cardId === i.id);
              return (
                <ListItem key={i.id}>
                  <ListItemText primary={i.title} secondary={`由 ${i.creatorTitle} 创建`} />
                  <ListItemSecondaryAction>
                    {log ? (
                      <IconButton onClick={this.handleDelete(log)}>
                        <CheckIcon color="primary" />
                      </IconButton>
                    ) : (
                      <ListItemText primary={i.daytime} />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div style={{ margin: 20, color: '#9b9b9b', fontSize: 14 }}>通过点击右侧图标来取消打卡</div>

        <ConfirmDialog
          title="取消打卡"
          content="如果时间已经过了，你将无法再次打卡"
          open={this.state.drawerOpen}
          onCancel={() => this.toggleDrawer(false)}
          onConfirm={this.onDelete}
        />
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(CardToday);
