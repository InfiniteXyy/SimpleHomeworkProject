import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import moment from 'moment';
import { inject, observer } from 'mobx-react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  todoItem: {
    backgroundColor: 'white',
    borderBottom: 'solid 0.5px #eeeeee',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 20
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  progress: {
    padding: 12
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
      this.props.commonStore.toggleSnackbar('设置成功');
      this.setState({ drawerOpen: false });
    });
  };

  render() {
    const { classes, tasks } = this.props;
    return (
      <div>
        {tasks.map(item => {
          const { finished, content, deadlineAt, createdAt, createdBy } = item;
          const deadline = deadlineAt ? moment(deadlineAt).format('M月D日 周dd H:mm 截止') : '无截止时间';
          return (
            <div className={classes.todoItem} key={item.id}>
              <div>
                {item.isLoading ? (
                  <CircularProgress size={24} className={classes.progress} />
                ) : (
                  <Checkbox value="finished" checked={finished} onChange={this.handleToggleTodo(item)} />
                )}
              </div>
              <div className={classes.body}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={finished ? { textDecoration: 'line-through', color: '#9b9b9b' } : {}}
                >
                  {content}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {deadline}
                </Typography>
                <div className={classes.timeContainer}>
                  <Typography variant="body2">{createdBy ? createdBy : '我'}</Typography>
                  <Typography style={{ margin: '0 12px', fontWeight: 'lighter' }} variant="body2">
                    |
                  </Typography>
                  <Typography variant="body2">{moment(createdAt).fromNow()}</Typography>
                </div>
              </div>
            </div>
          );
        })}

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
