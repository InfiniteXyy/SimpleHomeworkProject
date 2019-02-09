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
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MoreIcon from '@material-ui/icons/MoreHorizRounded';

import classNames from 'classnames';
const styles = {
  listItem: {
    borderBottom: 'solid 0.75px #eeeeee',
    paddingBottom: 20,
    paddingTop: 20
  },
  list: {
    backgroundColor: 'white'
  },
  progress: {
    padding: 12
  },
  finished: {
    textDecoration: 'line-through',
    color: '#9b9b9b'
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
              <ListItem classes={{ root: classes.listItem }} button key={item.id} onClick={this.handleToggleTodo(item)}>
                {item.isLoading ? (
                  <CircularProgress size={24} className={classes.progress} />
                ) : (
                  <Checkbox value="finished" checked={finished} />
                )}
                <ListItemText
                  classes={{ primary: classNames({ [classes.finished]: item.finished }) }}
                  primary={content}
                  secondary={deadline}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={this.openTodoDetail(item)}>
                    <MoreIcon />
                  </IconButton>
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
