import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, withStyles, Checkbox } from '@material-ui/core';
import Header from './Header';
import Badge from '@material-ui/core/Badge';
import moment from 'moment';
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  root: {
    margin: '4px 0',
    paddingTop: 46
  },
  lists: {
    height: 100,
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'white'
  },
  moreList: {
    borderRadius: 3,
    height: 60,
    width: 60,
    marginLeft: 24,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: '1px dashed #cccccc',
    fontSize: 20,
    color: '#caccca'
  },
  week: {
    borderRadius: 3,
    height: 60,
    width: 60,
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: 'solid 1px #caccca'
  },
  selectBar: {
    height: 35,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  todoItem: {
    height: 135,
    backgroundColor: 'white',
    borderBottom: 'solid 0.5px #eeeeee',
    display: 'flex',
    flexDirection: 'row'
  },
  checkbox: {},
  margin: {
    marginLeft: 24
  },
  itemCheckbox: {
    fontSize: 16
  },
  body: {
    marginTop: theme.spacing.unit
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  moreDetail: {
    minWidth: 80,
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
    margin: "0 10px",
    width: '100%',
    background: '#eeeeee'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2 + 56,
    right: theme.spacing.unit * 2
  }
});

const lists = [{ id: '1', title: '第一周' }, { id: '2', title: '第二周' }];

@inject('todoListStore', 'routingStore')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }

  handleMenuClick = type => () => {
    this.props.todoListStore.toggleShowAll(type);
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ menuOpen: false });
  };
  handleOpen = () => {
    this.setState({ menuOpen: true });
  };

  handleClickList = id => () => {
    this.props.todoListStore.toggleList(id);
  };

  handleClickTodo = id => () => {
    this.props.todoListStore.toggleTodo(id);
  };

  handleAddTodo = () => {
    this.props.routingStore.push('/todoAdd');
  };

  render() {
    let todos = this.props.todoListStore.todosInList;
    const { classes } = this.props;
    return (
      <div>
        <Header />
        <div className={classes.root}>
          <div className={classes.lists}>
            {lists.map(item => {
              const weekStyle =
                item.id === this.props.todoListStore.currentListId ? { border: 'solid 1px #2196f3' } : {};
              return (
                <Badge
                  key={item.id}
                  className={classes.margin}
                  badgeContent={this.props.todoListStore.todos.filter(i => i.listId === item.id && !i.finished).length}
                  color="primary"
                  onClick={this.handleClickList(item.id)}
                >
                  <div className={classes.week} style={weekStyle}>
                    {item.title}
                  </div>
                </Badge>
              );
            })}
            <div className={`${classes.moreList}`}>+</div>
          </div>
          <div className={classes.selectBar} onClick={this.handleOpen}>
            <p
              ref={el => {
                this.selectBar = el;
              }}
              style={{ fontSize: 14 }}
            >
              {this.props.todoListStore.showOnlyFinished ? '显示未完成' : '显示全部'}
            </p>
            <ExpandIcon fontSize="small" style={{ color: '#8b8b8b' }} />
          </div>
          <div>
            {todos.map(item => {
              const { finished, id, content, deadlineAt, createdAt, createdBy } = item;
              const deadline = moment(deadlineAt);
              return (
                <div className={classes.todoItem} key={item.id}>
                  <div className={classes.checkbox}>
                    <Checkbox value="finished" checked={finished} onChange={this.handleClickTodo(id)} />
                  </div>
                  <div className={classes.body}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      style={finished ? { textDecoration: 'line-through', color: "#9b9b9b" } : {}}
                    >
                      {content}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {`${deadline.format('M月D日 周dd H:mm 截止')}`}
                    </Typography>
                    <div className={classes.timeContainer}>
                      <Typography variant="body2">{createdBy}</Typography>
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
            没有更多啦
          </Typography>
          <div className={classes.line} />
        </div>

        <Menu anchorEl={this.selectBar} open={this.state.menuOpen} onClose={this.handleClose}>
          <MenuItem onClick={this.handleMenuClick(true)}>显示全部</MenuItem>
          <MenuItem onClick={this.handleMenuClick(false)}>显示未完成</MenuItem>
        </Menu>

        <Fab color="primary" className={classes.fab} onClick={this.handleAddTodo}>
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
