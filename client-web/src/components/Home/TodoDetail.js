import React, { Component } from 'react';
import { ConfirmDialog, FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import { inject, observer } from 'mobx-react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TimelapseIcon from '@material-ui/icons/TimelapseRounded';
import UserIcon from '@material-ui/icons/PersonRounded';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/EditOutlined';
import AddTodo from './AddTodo';

const styles = {
  root: {
    width: '100%',
    paddingTop: 56
  },
  secondaryText: {
    color: '#9b9b9b'
  },
  finished: {
    textDecoration: 'line-through',
    color: '#9b9b9b'
  },
  progress: {
    padding: 12
  }
};

@inject('todoListStore')
@observer
class TodoDetail extends Component {
  state = {
    drawerOpen: false,
    alertOpen: false,
    editOpen: false
  };

  toggleDrawer = drawerOpen => () => {
    this.setState({ drawerOpen });
  };
  close = () => {
    this.props.todoListStore.closeTodo();
  };

  toggleTodo = () => {
    const item = this.props.todoListStore.currentTodo;
    item.isLoading = true;
    this.props.todoListStore.toggleTodo(item).then(() => {
      item.isLoading = false;
      this.setState({ drawerOpen: false });
    });
  };

  toggleAlert = (type, callback) => () => {
    this.setState({ alertOpen: type, drawerOpen: false }, callback);
  };

  toggleEdit = type => () => {
    this.setState({ editOpen: type, drawerOpen: false });
  };

  onDelete = () => {
    const item = this.props.todoListStore.currentTodo;
    this.props.todoListStore.deleteTodo(item).then(() => {
      this.toggleAlert(false, this.close)();
    });
  };

  reset = () => {
    this.setState({
      drawerOpen: false,
      alertOpen: false
    });
  };

  render() {
    const { classes, open } = this.props;
    const task = this.props.todoListStore.currentTodo;
    if (task === undefined) return null;
    return (
      <FullScreenDialog open={open} onExited={this.reset}>
        <StackHeader
          title="任务"
          handleClickLeft={this.close}
          rightTitle="更多"
          rightEnabled
          handleClickRight={this.toggleDrawer(true)}
        />
        <div className={classes.root}>
          <Card elevation={0} className="border-vert">
            <CardHeader
              avatar={
                task.isLoading ? (
                  <CircularProgress size={24} className={classes.progress} />
                ) : (
                  <Checkbox checked={task.finished} onChange={this.toggleTodo} />
                )
              }
              title={
                <Typography variant="h6" className={classNames({ [classes.finished]: task.finished })}>
                  {task.content}
                </Typography>
              }
            />
            <CardContent>
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <TimelapseIcon className="green" />
                  </ListItemIcon>
                  <ListItemText primary="截止时间" />
                  <ListItemSecondaryAction>
                    <ListItemText
                      classes={{ primary: classes.secondaryText }}
                      primary={task.deadlineAt ? moment(task.deadlineAt).format('M月D日 周dd H:mm 截止') : '无截止时间'}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <UserIcon className="brown" />
                  </ListItemIcon>
                  <ListItemText primary="创建者" />
                  <ListItemSecondaryAction>
                    <ListItemText
                      classes={{ primary: classes.secondaryText }}
                      primary={task.createdBy ? task.createdBy : '我'}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <div style={{ marginTop: 12 }} className={classNames('border-vert', 'background-white')}>
            <List subheader={<ListSubheader>备注</ListSubheader>}>
              {task.remarks.length === 0 ? (
                <div className="empty-tip">没有备注</div>
              ) : (
                task.remarks.map((i, index) => (
                  <ListItem key={index.toString()}>
                    <ListItemIcon>
                      <div>{index + 1}</div>
                    </ListItemIcon>
                    <ListItemText primary={i} />
                  </ListItem>
                ))
              )}
            </List>
          </div>
        </div>

        <Drawer open={this.state.drawerOpen} anchor="bottom" onClose={this.toggleDrawer(false)}>
          <List>
            <ListItem button onClick={this.toggleEdit(true)}>
              <ListItemIcon>
                <EditIcon className="gray" />
              </ListItemIcon>
              <ListItemText primary="修改任务" />
            </ListItem>
            <ListItem button onClick={this.toggleAlert(true)}>
              <ListItemIcon>
                <DeleteIcon className="gray" />
              </ListItemIcon>
              <ListItemText primary="删除" />
            </ListItem>
          </List>
        </Drawer>

        <ConfirmDialog
          open={this.state.alertOpen}
          onConfirm={this.onDelete}
          onCancel={this.toggleAlert(false)}
          title="删除任务"
          content={`你确定要删除这条任务吗，这将无法复原`}
        />

        <AddTodo open={this.state.editOpen} onClose={this.toggleEdit(false)} payload={task} isEdit />
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(TodoDetail);
