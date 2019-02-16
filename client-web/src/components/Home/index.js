import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Dialog, Tabs, withStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import SpeedDial from '@material-ui/lab/SpeedDial';

import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import TodoIcon from '@material-ui/icons/DescriptionRounded';
import TodoListIcon from '@material-ui/icons/ListRounded';

import AddTodo from './AddTodo';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import TodoList from './TodoList';
import TodoDetail from './TodoDetail';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2 + 56,
    right: theme.spacing.unit * 2
  },
  toolButtonGreen: {
    backgroundColor: '#417505',
    color: 'white',
    '&:hover': {
      backgroundColor: '#417505'
    }
  },
  toolButtonYellow: {
    backgroundColor: '#F5A623',
    color: 'white',
    '&:hover': {
      backgroundColor: '#F5A623'
    }
  },
  root: {
    marginTop: 10,
    height: '100%',
    boxSizing: 'border-box',
    borderTop: '0.75px solid #eeeeee'
  }
});

@inject('todoListStore', 'routingStore')
@observer
class Home extends Component {
  componentDidMount() {
    this.props.todoListStore.loadTodos();
  }

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: '',
      speedDialOpen: false,
      curListId: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ curListId: value, speedDialOpen: false });
  };

  handleChangeIndex = index => {
    this.setState({ curListId: index, speedDialOpen: false });
  };

  toggleDialog = title => () => {
    this.setState({ dialogOpen: title, speedDialOpen: false });
  };

  handleAddTodoList = title => {
    this.props.todoListStore.addTodoList(title);
  };

  render() {
    const { classes } = this.props;
    const listsData = this.props.todoListStore.todoLists;
    let list;
    if (listsData === undefined) {
      list = <div className="empty-tip">加载中 ...</div>;
    } else {
      const todoLists = listsData.filter(i => !i.archived);
      if (todoLists.length === 0) {
        list = <div className="empty-tip">请先添加一个列表</div>;
      } else {
        list = (
          <div className={classes.root}>
            <Tabs
              style={{ backgroundColor: 'white' }}
              variant="scrollable"
              scrollButtons="auto"
              value={this.state.curListId}
              onChange={this.handleChange}
            >
              {todoLists.map((item, index) => {
                return (
                  <Tab
                    key={item.id}
                    value={index}
                    disableRipple
                    label={
                      <Badge badgeContent={item.tasks.filter(i => !i.finished).length} color="primary">
                        {item.title}
                      </Badge>
                    }
                  />
                );
              })}
            </Tabs>
            <SwipeableViews
              index={this.state.curListId}
              onChangeIndex={this.handleChangeIndex}
              containerStyle={{ height: '100%' }}
              style={{ height: '100%' }}
            >
              {todoLists.map(item => (
                <TodoList key={item.id} tasks={item.tasks} />
              ))}
            </SwipeableViews>
          </div>
        );
      }
    }

    return (
      <div>
        {list}
        <SpeedDial
          className={classes.fab}
          icon={<SpeedDialIcon />}
          onClick={this.handleSpeedDialClick}
          open={this.state.speedDialOpen}
          direction="up"
          ariaLabel="action"
        >
          <SpeedDialAction
            key="add todo"
            classes={{ button: classes.toolButtonYellow }}
            icon={<TodoIcon />}
            tooltipTitle="添加作业"
            onClick={this.toggleDialog('todo')}
          />
          <SpeedDialAction
            classes={{ button: classes.toolButtonGreen }}
            key="add todolist"
            icon={<TodoListIcon />}
            tooltipTitle="添加列表"
            onClick={this.toggleDialog('todoList')}
          />
        </SpeedDial>

        <TodoDetail open={this.props.todoListStore.todoOpen} />

        <AddTodo open={this.state.dialogOpen === 'todo'} onClose={this.toggleDialog('')} />

        <AddListDialog
          open={this.state.dialogOpen === 'todoList'}
          handleClose={this.toggleDialog('')}
          handleAdd={this.handleAddTodoList}
        />
      </div>
    );
  }

  handleSpeedDialClick = () => {
    this.setState(prev => {
      return { ...prev, speedDialOpen: !prev.speedDialOpen };
    });
  };
}

class AddListDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  clickAdd = () => {
    this.props.handleAdd(this.state.value);
    this.props.handleClose();
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { open, handleClose } = this.props;

    return (
      <Dialog open={open}>
        <DialogTitle id="form-dialog-title">添加新的列表</DialogTitle>
        <DialogContent>
          <TextField autoFocus style={{ width: 230 }} label="列表名" fullWidth onChange={this.handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={this.clickAdd} color="primary">
            添加
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Home);
