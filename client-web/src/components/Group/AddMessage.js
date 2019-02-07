import React from 'react';
import { Chip, Dialog, Fade, List, withStyles } from '@material-ui/core';
import StackHeader from '../StackHeader';
import { SlideTransition } from '../utils';

import NoteAddIcon from '@material-ui/icons/EventNoteOutlined';
import PhotoIcon from '@material-ui/icons/PhotoOutlined';

import './AddMessage.css';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import moment from 'moment';
import { DeadlineDialog } from '../Home/AddTodo';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    width: '100%',
    paddingTop: 46
  },
  paper: {
    backgroundColor: '#fafafa'
  },
  listItemSecondary: {
    color: '#9b9b9b'
  },
  listItem: {}
};

@inject('groupStore', 'commonStore')
@observer
class AddMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      todoContent: '',
      deadlineAt: '',
      hasTodo: false,
      dialogOpen: ''
    };
  }

  toggleDialog = title => () => {
    this.setState({ dialogOpen: title });
  };

  handleChangeInput = key => event => {
    this.setState({ [key]: event.target.value });
  };

  toggleTodo = type => () => {
    this.setState({ hasTodo: type });
  };

  handleSubmit = () => {
    const { content, todoContent, deadlineAt, hasTodo } = this.state;
    const payload = hasTodo
      ? JSON.stringify({
          type: 'todo',
          content: todoContent,
          deadlineAt
        })
      : '';
    this.props.groupStore.submitMessage(content, payload).then(() => {
      this.props.commonStore.toggleSnackbar('发送消息成功');
      this.props.handleClose();
    });
  };

  reset = () => {
    this.setState({
      content: '',
      todoContent: '',
      deadlineAt: '',
      hasTodo: false,
      dialogOpen: ''
    });
  };

  render() {
    const { classes, open, handleClose } = this.props;
    const chipProps = this.state.hasTodo
      ? {
          onDelete: this.toggleTodo(false),
          variant: 'default',
          label: '删除任务'
        }
      : {
          variant: 'outlined',
          label: '添加任务'
        };

    return (
      <Dialog
        onExited={this.reset}
        classes={{ paper: classes.paper }}
        open={open}
        fullScreen
        transitionDuration={300}
        TransitionComponent={SlideTransition}
      >
        <StackHeader
          title="推送信息"
          handleClickLeft={handleClose}
          leftTitle="取消"
          rightTitle="发送"
          rightEnabled={Boolean(this.state.content)}
          handleClickRight={this.handleSubmit}
        />
        <div className={classes.root}>
          <div className="message-input-box-container">
            <textarea
              placeholder="在此输入推送内容"
              className="message-input-box"
              maxLength={70}
              value={this.state.content}
              onChange={this.handleChangeInput('content')}
            />
            <div className="input-image">
              <PhotoIcon />
            </div>
            <Chip
              {...chipProps}
              onClick={this.toggleTodo(true)}
              color="primary"
              icon={<NoteAddIcon fontSize="small" />}
            />
          </div>
          <Fade in={this.state.hasTodo} timeout={300}>
            <div className="payload-box-container">
              <textarea
                placeholder="任务内容"
                className="payload-box"
                maxLength={70}
                value={this.state.todoContent}
                onChange={this.handleChangeInput('todoContent')}
              />
              <List>
                <ListItem button onClick={this.toggleDialog('deadline')}>
                  <ListItemText primary="截止时间" />
                  <ListItemSecondaryAction>
                    <ListItemText
                      classes={{ primary: classes.listItemSecondary }}
                      primary={
                        this.state.deadlineAt ? moment(this.state.deadlineAt).format('M月D日 周dd H:mm') : '无截止时间'
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              <DeadlineDialog
                open={this.state.dialogOpen === 'deadline'}
                handleClose={this.toggleDialog('')}
                handleChange={this.handleChangeInput('deadlineAt')}
                defaultValue={this.state.deadlineAt}
              />
            </div>
          </Fade>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddMessage);
