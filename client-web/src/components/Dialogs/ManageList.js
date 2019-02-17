import React, { Component } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Fade,
  IconButton,
  LinearProgress,
  withStyles
} from '@material-ui/core';
import UpIcon from '@material-ui/icons/ExpandLessRounded';
import DownIcon from '@material-ui/icons/ExpandMoreRounded';
import MenuIcon from '@material-ui/icons/DehazeRounded';
import CalendarIcon from '@material-ui/icons/DateRangeOutlined';
import TaskIcon from '@material-ui/icons/CheckCircleOutlined';
import StackHeader from '../StackHeader';
import { FullScreenDialog } from '../utils';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import EditIcon from '@material-ui/icons/EditRounded';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    padding: '0 16px',
    marginTop: 46
  },
  icon: {
    color: '#757575',
    height: 16,
    width: 16
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 12,
    display: 'flex',
    alignItems: 'center'
  },
  icon3: {
    color: '#757575',
    height: 16,
    width: 16,
    marginRight: 12
  },
  card: {
    boxShadow: '0 6px 25px -10px rgba(0,0,0,0.46)',
    borderRadius: 0,
    marginTop: 20
  },
  cardHeader: {
    padding: 0
  },
  avatar: {
    marginRight: 0
  },
  font1: {
    fontSize: 16,
    color: '#4a4a4a',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  font2: {
    fontSize: 14,
    color: '#4a4a4a'
  },
  font3: {
    fontSize: 12,
    color: '#9b9b9b',
    marginLeft: 6
  },
  font4: {
    fontSize: 14,
    color: '#757575'
  },
  container1: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 8
  },
  container2: {
    paddingTop: 0,
    display: 'flex',
    justifyContent: 'space-between',
    '&:last-child': {
      paddingBottom: 16
    }
  },
  progress: {
    height: 3,
    backgroundColor: '#eaeaea'
  },
  progressMain: {
    backgroundColor: '#89C3EB'
  }
};

class TodoListCard extends Component {
  state = {
    expanded: false
  };

  toggleExpand = () => {
    this.setState(prev => {
      return { expanded: !prev.expanded };
    });
  };
  render() {
    const i = this.props.todoList;
    const classes = this.props.classes;
    const { tasks } = i;
    const finishedStatus = tasks.length === 0 ? '无任务' : `${tasks.filter(i => i.finished).length} / ${tasks.length}`;
    const finishedRate = (tasks.filter(i => i.finished).length / tasks.length) * 100;
    return (
      <Card classes={{ root: classes.card }}>
        <CardHeader
          classes={{ root: classes.cardHeader, avatar: classes.avatar }}
          avatar={
            <IconButton onClick={this.toggleExpand}>
              {this.state.expanded ? <UpIcon className={classes.avatar} /> : <DownIcon className={classes.avatar} />}
            </IconButton>
          }
          action={
            <div className={classes.iconContainer}>
              <Fade in={!this.state.expanded}>
                <div className={classes.font3}>{finishedStatus}</div>
              </Fade>
              <IconButton>
                <MenuIcon className={classes.icon} />
              </IconButton>
            </div>
          }
          title={
            <div className={classes.font1}>
              {i.title}
              {i.archived && <span className={classes.font3}>已归档</span>}
            </div>
          }
        />
        <Collapse in={this.state.expanded}>
          <CardContent className={classes.container2}>
            <div>
              <div className={classes.container1}>
                <CalendarIcon className={classes.icon3} />
                <div className={classes.font2}>2018年9月25日</div>
              </div>
              <div className={classes.container1}>
                <TaskIcon className={classes.icon3} />
                <div className={classes.font2}>{finishedStatus}</div>
              </div>
            </div>
          </CardContent>
        </Collapse>
        <LinearProgress
          classes={{ root: classes.progress, barColorPrimary: classes.progressMain }}
          variant="determinate"
          value={finishedRate}
        />
      </Card>
    );
  }
}

TodoListCard = withStyles(styles)(TodoListCard);

@inject('todoListStore')
@observer
class ManageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerFor: '',
      drawerOpen: false
    };
  }
  toggleDrawer = (type, list) => () => {
    this.setState({
      drawerFor: type ? list : '',
      drawerOpen: type
    });
  };

  render() {
    const { open, handleClose, classes } = this.props;
    let listsComponent;
    const todoLists = this.props.todoListStore.todoLists;
    if (todoLists === undefined) listsComponent = <div />;
    else {
      listsComponent = todoLists.map((i, index) => <TodoListCard key={index} todoList={i} />);
    }

    return (
      <FullScreenDialog open={open}>
        <StackHeader title="清单列表" handleClickLeft={handleClose} rightTitle="添加" />
        <div className={classes.root}>{listsComponent}</div>

        <Drawer anchor="bottom" open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div>
            <List subheader={<ListSubheader>{this.state.drawerFor.title}</ListSubheader>}>
              <ListItem button>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary="编辑" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="删除" />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ManageList);
