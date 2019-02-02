import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Checkbox, Dialog, Tabs, Typography, withStyles } from '@material-ui/core';
import Header from './Header';
import Badge from '@material-ui/core/Badge';
import moment from 'moment';
import SpeedDial from '@material-ui/lab/SpeedDial';

import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import TodoIcon from '@material-ui/icons/DescriptionRounded';
import TodoListIcon from '@material-ui/icons/ListRounded';

import AddTodo from './AddTodo';
import Slide from '@material-ui/core/Slide';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import HomeDrawer from './HomeDrawer';

const styles = theme => ({
  root: {
    margin: '4px 0',
    paddingTop: 46
  },
  listRoot: {
    backgroundColor: 'white',
    overflow: 'hidden',
    scrollbarWidth: 0,
    scrollbarColor: 'red'
  },
  todoItem: {
    backgroundColor: 'white',
    borderBottom: 'solid 0.5px #eeeeee',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 20
  },
  margin: {
    marginLeft: 24
  },
  itemCheckbox: {
    fontSize: 16
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  moreDetail: {
    minWidth: 150,
    textAlign: 'center',
    margin: '10px 20px',
    fontSize: 13,
    color: '#cccccc'
  },
  moreContainer: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  line: {
    height: 0.75,
    margin: '0 10px',
    width: '100%',
    background: '#eeeeee'
  },
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
  }
});

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

@inject('todoListStore', 'routingStore')
@observer
class Home extends Component {
  componentDidMount() {
    this.props.todoListStore.loadTodos();
  }

  constructor(props) {
    super(props);
    this.state = {
      addTodoOpen: false,
      addTodoListOpen: false,
      speedDialOpen: false,
      drawerOpen: false
    };
  }

  toggleDrawer = type => () => {
    this.setState({ drawerOpen: type });
  };

  handleClickList = id => () => {
    this.props.todoListStore.toggleList(id);
  };

  handleClickTodo = id => () => {};

  openAddTodo = () => {
    this.setState({ addTodoOpen: true, speedDialOpen: false });
  };

  closeAddTodo = () => {
    this.setState({ addTodoOpen: false });
  };

  openAddTodoList = () => {
    this.setState({ addTodoListOpen: true, speedDialOpen: false });
  };

  closeAddTodoList = () => {
    this.setState({ addTodoListOpen: false });
  };

  handleAddTodoList = title => {
    this.props.todoListStore.addTodoList(title);
  };

  render() {
    const { classes, todoListStore } = this.props;
    const tasks = todoListStore.currentTasks;
    return (
      <div>
        <Header onClick={this.toggleDrawer(true)} />
        <div className={classes.root}>
          <div className={classes.listRoot}>
            <Tabs variant="scrollable" scrollButtons="auto" value={todoListStore.currentListId}>
              {todoListStore.todoLists.map(item => {
                return (
                  <Tab
                    key={item.id}
                    disableRipple
                    value={item.id}
                    onClick={this.handleClickList(item.id)}
                    label={
                      <Badge badgeContent={item.tasks.length} color="primary">
                        {item.title}
                      </Badge>
                    }
                  />
                );
              })}
            </Tabs>
          </div>

          <div>
            {tasks.map(item => {
              const { finished, id, content, deadlineAt, createdAt, createdBy } = item;
              const deadline = deadlineAt ? moment(deadlineAt).format('M月D日 周dd H:mm 截止') : '无截止时间';
              return (
                <div className={classes.todoItem} key={item.id}>
                  <div className={classes.checkbox}>
                    <Checkbox value="finished" checked={finished} onChange={this.handleClickTodo(id)} />
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
          </div>
        </div>

        <div className={classes.moreContainer}>
          <div className={classes.line} />

          <Typography variant="body2" className={classes.moreDetail}>
            今天也是心情棒棒哒一天
          </Typography>
          <div className={classes.line} />
        </div>

        <SpeedDial
          className={classes.fab}
          icon={<SpeedDialIcon />}
          onClick={this.handleSpeedDialClick}
          open={this.state.speedDialOpen}
          direction="up"
          ariaLabel="action"
        >
          <SpeedDialAction
            key={'add todo'}
            classes={{ button: classes.toolButtonYellow }}
            icon={<TodoIcon />}
            tooltipTitle={'添加作业'}
            onClick={this.openAddTodo}
          />
          <SpeedDialAction
            classes={{ button: classes.toolButtonGreen }}
            key={'add todolist'}
            icon={<TodoListIcon />}
            tooltipTitle={'添加列表'}
            onClick={this.openAddTodoList}
          />
        </SpeedDial>

        <Dialog open={this.state.addTodoOpen} fullScreen transitionDuration={300} TransitionComponent={Transition}>
          <AddTodo onClose={this.closeAddTodo} />
        </Dialog>

        <HomeDrawer drawerOpen={this.state.drawerOpen} toggleDrawer={this.toggleDrawer} />

        <AddListDialog
          open={this.state.addTodoListOpen}
          handleClose={() => {
            this.setState({ addTodoListOpen: false });
          }}
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
