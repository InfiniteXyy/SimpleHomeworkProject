import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';

import moment from 'moment';
import { inject, observer } from 'mobx-react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MessageIcon from '@material-ui/icons/MessageRounded';
import PhotoIcon from '@material-ui/icons/PhotoRounded';

import classNames from 'classnames';

const styles = {
  listItem: {
    borderBottom: 'solid 0.75px #eeeeee',
    paddingTop: 16,
    paddingBottom: 16
  },
  list: {
    borderRight: 'solid 0.75px #eeeeee',
    backgroundColor: 'white'
  },
  progress: {
    padding: 12
  },
  finished: {
    color: '#9b9b9b',
    textDecoration: 'line-through'
  },
  unfinished: {
    color: '#4a4a4a'
  },
  primaryItem: {
    fontSize: 16,
    fontWeight: '500',
    transitionDuration: "0.4s"
  },
  smallIcon: {
    color: '#dedede',
    fontSize: 16,
    marginRight: 6
  },
  smallText: {
    fontSize: 12,
    color: '#9e9e9e'
  },
  smallContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 20
  },
  detailContainer: {
    marginTop: 10,
    display: 'flex'
  }
};

@inject('todoListStore', 'commonStore')
@observer
class TodoList extends Component {
  state = {
    drawerOpen: false
  };

  toggleDrawer = (type, payload = undefined) => () => {
    this.setState({ drawerOpen: type, payload });
  };

  handleToggleTodo = item => () => {
    if (item.finished) {
      this.toggleDrawer(true, item)();
    } else {
      this.toggleTodo(item)();
    }
  };

  toggleTodo = item => () => {
    item.isLoading = true;
    this.props.todoListStore.toggleTodo(item).then(() => {
      item.isLoading = false;
      this.setState({ drawerOpen: false });
    });
  };

  openTodoDetail = item => () => {
    this.props.todoListStore.openTodo(item);
  };

  render() {
    const { classes, tasks } = this.props;
    return (
      <div>
        <List disablePadding={true} classes={{ root: classes.list }}>
          {tasks.map(item => {
            const { finished, content, deadlineAt } = item;
            const deadline = deadlineAt ? moment(deadlineAt).format('M月D日 周dd H:mm 截止') : '无截止时间';
            return (
              <ListItem
                onClick={this.openTodoDetail(item)}
                alignItems="flex-start"
                classes={{ root: classes.listItem }}
                button
                key={item.id}
              >
                <ListItemText
                  classes={{
                    primary: classNames(classes.primaryItem, {
                      [classes.finished]: item.finished,
                      [classes.unfinished]: !item.finished
                    })
                  }}
                  primary={content}
                  secondary={
                    <React.Fragment>
                      {deadline}
                      <span className={classes.detailContainer}>
                        {item.imageUrl && (
                          <span className={classes.smallContainer}>
                            <PhotoIcon className={classes.smallIcon} />
                            <span className={classes.smallText}>1张照片</span>
                          </span>
                        )}
                        {item.remarks.length !== 0 && (
                          <span className={classes.smallContainer}>
                            <MessageIcon className={classes.smallIcon} />
                            <span className={classes.smallText}>{`${item.remarks.length}条备注`}</span>
                          </span>
                        )}
                      </span>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  {item.isLoading ? (
                    <CircularProgress size={24} className={classes.progress} />
                  ) : (
                    <Checkbox onChange={this.handleToggleTodo(item)} value="finished" checked={finished} />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>

        <Drawer anchor="bottom" open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div>
            <List subheader={<ListSubheader>此任务已完成，确定标记未完成吗？</ListSubheader>}>
              <ListItem button onClick={this.toggleTodo(this.state.payload)}>
                <ListItemText primary="标记为未完成" />
              </ListItem>
              <ListItem button onClick={this.toggleDrawer(false)}>
                <ListItemText primary="取消" />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(TodoList);
