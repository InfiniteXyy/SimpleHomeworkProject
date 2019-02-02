import React, { Component } from 'react';
import { Dialog, withStyles } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import StackHeader from '../StackHeader';
import { SlideTransition } from '../utils';
import Button from '@material-ui/core/Button';

const styles = {
  bigTitle: {
    color: '#4a4a4a',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subTitle: {
    color: '#757575',
    fontSize: 16
  },
  buttonContainer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: 56,
    padding: 30,
    marginBottom: 50,
    boxSizing: 'border-box'
  },
  formContainer: {
    padding: '60px 16px'
  }
};

class DialogCreateGroup extends Component {
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />

        <div className={classes.formContainer}>
          <div className={classes.titleGroup}>
            <div className={classes.bigTitle}>创建群组</div>
            <div className={classes.subTitle}>团队成员可以共享打卡任务，群组创建者可以发布任务消息</div>
          </div>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="title">群组名称</InputLabel>
              <Input id="title" name="title" />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="id">群组号</InputLabel>
              <Input id="id" name="id" />
            </FormControl>
          </form>
        </div>
        <div className={classes.buttonContainer}>
          <Button variant="outlined" size="large" type="submit" onClick={this.handleSubmit} fullWidth color="primary">
            立即创建
          </Button>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogCreateGroup);
