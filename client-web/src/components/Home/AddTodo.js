import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CameraIcon from '@material-ui/icons/CameraAltRounded';
import './AddTodo.css';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { ListItemIcon } from '@material-ui/core';

import SMSIcon from '@material-ui/icons/SmsRounded';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { inject, observer } from 'mobx-react';
import { FullScreenDialog } from '../utils';
import RemarkDialog from './RemarkDialog';

const styles = theme => ({
  root: {
    paddingTop: 38,
    width: '100%'
  },
  header: {
    width: '100%',
    top: 0,
    position: 'fixed',
    color: '#9a9a9a',
    backgroundColor: 'white',
    height: 46
  },
  headerContainer: {
    height: '100%',
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listItem: {
    borderTop: 'solid 1px #f1f1f1'
  },
  list: {
    padding: 0,
    background: 'white',
    marginTop: 16,
    borderBottom: 'solid 1px #f1f1f1'
  },
  listItemSecondary: {
    color: '#9b9b9b'
  }
});

@inject('todoListStore', 'commonStore')
@observer
class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      noticeAt: '',
      deadlineAt: '',
      linkListId: '',
      remarks: [],
      dialogOpen: false
    };
  }

  validateForm = () => {
    const { content, linkListId } = this.state;
    if (!content) return false;
    return linkListId;
  };

  handleChange = type => event => {
    this.setState({ [type]: event.target.value });
  };

  handleChangeList = (event, value) => {
    this.setState({ linkListId: value });
  };

  onChangeRemarks = remarks => {
    this.setState({ remarks });
  };

  handleAdd = () => {
    const { content, deadlineAt, linkListId, remarks } = this.state;
    const { isEdit } = this.props;
    const _remarks = remarks.join('\n');
    if (!isEdit) {
      this.props.todoListStore.addTodo(linkListId, content, deadlineAt, _remarks).then(() => {
        this.props.onClose();
        this.props.commonStore.toggleSnackbar('添加成功');
      });
    } else {
      this.props.todoListStore.updateTodo(linkListId, content, deadlineAt, _remarks).then(() => {
        this.props.onClose();
        this.props.commonStore.toggleSnackbar('编辑成功');
      });
    }
  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: 0 });
  };

  handleOpenDialog = id => () => {
    this.setState({ dialogOpen: id });
  };

  handlePayload = () => {
    this.props.todoListStore.loadTodos();
    let { payload } = this.props;

    if (!payload) {
      return;
    }
    if (typeof payload === 'string') payload = JSON.parse(payload);
    this.setState({
      content: payload.content,
      deadlineAt: payload.deadlineAt,
      linkListId: payload.listId ? payload.listId.toString() : '',
      remarks: payload.remarks || []
    });
  };

  reset = () => {
    this.setState({
      content: '',
      noticeAt: '',
      deadlineAt: '',
      linkListId: '',
      remarks: [],
      dialogOpen: false
    });
  };

  render() {
    const { classes, open, onClose, isEdit } = this.props;
    return (
      <FullScreenDialog open={open} onEnter={this.handlePayload} onExited={this.reset}>
        <div style={{ backgroundColor: '#fafafa', flex: 1 }}>
          <div className={classes.header}>
            <div className={classes.headerContainer}>
              <p className="btn" onClick={onClose}>
                取消
              </p>
              <Typography variant="subtitle1">{isEdit ? '编辑任务' : '新建任务'}</Typography>
              <p onClick={this.handleAdd} className={`${this.validateForm() ? 'btn' : 'disabled'}`}>
                {isEdit ? '保存' : '添加'}
              </p>
            </div>
          </div>
          <div className={classes.root}>
            <div className="input-box-container">
              <textarea
                placeholder="请在此填写任务内容"
                className="input-box"
                maxLength={70}
                value={this.state.content}
                onChange={this.handleChange('content')}
              />
            </div>
            <div className="camera-container">
              <CameraIcon style={{ color: '#9b9b9b' }} />
            </div>
          </div>
          <List className={classes.list}>
            <ListItem button className={classes.listItem} onClick={this.handleOpenDialog(2)}>
              <ListItemText primary="添加到列表 *" />
              <ListItemSecondaryAction>
                <ListItemText
                  classes={{ primary: classes.listItemSecondary }}
                  primary={
                    this.state.linkListId
                      ? this.props.todoListStore.todoLists.filter(i => i.id.toString() === this.state.linkListId)[0]
                          .title
                      : '无'
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <List className={classes.list}>
            <ListItem button className={classes.listItem} onClick={this.handleOpenDialog(1)}>
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
            <ListItem button className={classes.listItem} onClick={this.handleSetting}>
              <ListItemText primary="提醒" />
              <ListItemSecondaryAction>
                <ListItemText classes={{ primary: classes.listItemSecondary }} primary="截止前一周" />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <List className={classes.list}>
            <ListItem button className={classes.listItem} onClick={this.handleOpenDialog(3)}>
              <ListItemText primary="备注" />
              <ListItemSecondaryAction style={{ height: 20 }}>
                {this.state.remarks.length === 0 ? (
                  <ListItemIcon>
                    <SMSIcon fontSize="small" color="disabled" />
                  </ListItemIcon>
                ) : (
                  <ListItemText
                    classes={{ primary: classes.listItemSecondary }}
                    primary={`${this.state.remarks.length}条备注`}
                  />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <p className="tips">你可以随时添加或删除备注</p>
          <DeadlineDialog
            open={this.state.dialogOpen === 1}
            handleClose={this.handleCloseDialog}
            defaultValue={this.state.deadlineAt}
            handleChange={this.handleChange('deadlineAt')}
          />
          <ListDialog
            open={this.state.dialogOpen === 2}
            handleClose={this.handleCloseDialog}
            handleChange={this.handleChangeList}
            options={this.props.todoListStore.todoLists}
            selectedValue={this.state.linkListId}
          />
          <RemarkDialog
            open={this.state.dialogOpen === 3}
            handleClose={this.handleCloseDialog}
            remarks={this.state.remarks}
            onChange={this.onChangeRemarks}
          />
        </div>
      </FullScreenDialog>
    );
  }
}

export class DeadlineDialog extends Component {
  render() {
    const { open, handleClose, handleChange, defaultValue } = this.props;
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>设置截止时间</DialogTitle>
        <DialogContent>
          <TextField
            label="截止时间"
            type="datetime-local"
            style={{ width: 230 }}
            fullWidth
            defaultValue={defaultValue}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class ListDialog extends Component {
  render() {
    const { open, handleClose, handleChange, options, selectedValue } = this.props;

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>设置添加到列表</DialogTitle>
        <DialogContent>
          <RadioGroup style={{ width: 230 }} value={selectedValue.toString()} onChange={handleChange}>
            {options.map(option => (
              <FormControlLabel
                value={option.id.toString()}
                key={option.id.toString()}
                control={<Radio />}
                label={<Typography variant="subtitle1">{option.title}</Typography>}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddTodo);
