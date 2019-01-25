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
  listSecondaryText: {
    color: '#9b9b9b',
    fontSize: '123'
  },
  dialog: {
    flex: 1
  }
});

class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      relatedGroupId: '',
      belongToList: '',
      alarmAt: '',
      deadlineAt: '',
      tags: [],
      dialogOpen: false
    };
  }

  validateForm = () => {
    const { content, deadlineAt } = this.state;
    if (!content) return false;
    return deadlineAt;
  };

  handleChangeContent = event => {
    this.setState({ content: event.target.value });
  };

  handleChangeDeadline = event => {
    this.setState({ deadlineAt: event.target.value });
    window.temp = this.state.deadlineAt;
  };

  handleBack = () => {
    this.props.onClose();
  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    const { classes } = this.props;
    return (
      <div style={{ backgroundColor: '#fafafa', flex: 1 }}>
        <div className={classes.header}>
          <div className={classes.headerContainer}>
            <p className="btn" onClick={this.handleBack}>
              取消
            </p>
            <Typography variant="subtitle1">新建任务</Typography>
            <p className={`${this.validateForm() ? 'btn' : 'disabled'}`}>添加</p>
          </div>
        </div>
        <div className={classes.root}>
          <div className="input-box-container">
            <textarea
              placeholder="请在此填写任务内容"
              className="input-box"
              maxLength={70}
              onChange={this.handleChangeContent}
            />
          </div>
          <div className="camera-container">
            <CameraIcon color="primary" />
          </div>
        </div>
        <List className={classes.list}>
          <ListItem button className={classes.listItem} onClick={this.handleSetting}>
            <ListItemText primary="关联群组" />
            <ListItemSecondaryAction>
              <ListItemText primary="无" />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button className={classes.listItem} onClick={this.handleSetting}>
            <ListItemText primary="添加到列表" />
            <ListItemSecondaryAction>
              <ListItemText primary="默认列表" />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <List className={classes.list}>
          <ListItem button className={classes.listItem} onClick={this.handleOpenDialog}>
            <ListItemText primary="截止时间" />
            <ListItemSecondaryAction>
              <ListItemText
                primary={
                  this.state.deadlineAt ? moment(this.state.deadlineAt).format('M月D日 周dd H:mm') : '无截止时间'
                }
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button className={classes.listItem} onClick={this.handleSetting}>
            <ListItemText primary="提醒" />
            <ListItemSecondaryAction>
              <ListItemText primary="截止前一周" />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <List className={classes.list}>
          <ListItem button className={classes.listItem} onClick={this.handleSetting}>
            <ListItemText primary="备注" />
            <ListItemSecondaryAction style={{ height: 20 }}>
              <ListItemIcon>
                <SMSIcon fontSize="small" color="disabled" />
              </ListItemIcon>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <p className="tips">只有任务的发起者有权限修改任务备注</p>
        <Dialog className={classes.dialog} open={this.state.dialogOpen} onClose={this.handleCloseDialog}>
          <DialogTitle id="form-dialog-title">设置截止时间</DialogTitle>
          <DialogContent>
            <TextField
              label="截止时间"
              type="datetime-local"
              style={{ width: 230 }}
              fullWidth
              defaultValue={this.state.deadlineAt}
              onChange={this.handleChangeDeadline}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              重置
            </Button>
            <Button onClick={this.handleCloseDialog} color="primary">
              关闭
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddTodo);
