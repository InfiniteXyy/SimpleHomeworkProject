import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import withStyles from '@material-ui/core/styles/withStyles';
import StackHeader from '../StackHeader';
import Dialog from '@material-ui/core/Dialog';
import { SlideTransition } from '../utils';
import { Button, Card, CardContent, CardHeader, CardMedia } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { weekTitles } from './CardPlan';
import CardActions from '@material-ui/core/CardActions';
import classNames from 'classnames';

import Blue from '@material-ui/core/colors/blue';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  root: {
    width: '100%',
    paddingTop: 46,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 20,
    boxSizing: 'border-box'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  card: {
    boxSizing: 'border-box',
    boxShadow: '0 11px 20px -10px rgba(0, 0, 0, .17);'
  },
  paper: {
    backgroundColor: '#fafafa'
  },
  selectionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  secondaryText: {
    color: '#9b9b9b'
  },
  subheader: {
    color: '#9b9b9b',
    marginTop: 8,
    fontSize: 14
  },
  selected: {
    backgroundColor: Blue['700']
  }
});

@inject('cardStore', 'commonStore')
@observer
class AddPlanDialog extends Component {
  state = {
    dateSelected: [false, false, false, false, false, false, false],
    time: '',
    title: '',
    timeDialogOpen: false
  };

  toggleTimeDialog = type => () => {
    this.setState({ timeDialogOpen: type });
  };

  toggleSelect = index => () => {
    this.setState(prev => ({
      dateSelected: prev.dateSelected.map((i, _index) => {
        if (index === _index) {
          return !i;
        }
        return i;
      })
    }));
  };

  handleChange = target => event => {
    this.setState({ [target]: event.target.value });
  };

  handleSubmit = () => {
    const { time, dateSelected, title } = this.state;
    const weekdays = dateSelected
      .map((i, index) => (i ? index : -1))
      .filter(i => i !== -1)
      .map(i => (i + 1).toString())
      .join(',');
    this.props.cardStore.createCard(title, '我', weekdays, time, '').then(() => {
      this.props.commonStore.toggleSnackbar('新建打卡成功');
      this.props.handleClose();
    });
  };

  validateForm = () => {
    if (this.state.title === '') return false;
    if (this.state.dateSelected.every(i => !i)) return false;
    return this.state.time !== '';
  };

  render() {
    const { open, handleClose, classes } = this.props;

    const formValidated = this.validateForm();

    const weekStr = this.state.dateSelected.every(i => !i)
      ? '请在下方设定日期'
      : this.state.dateSelected
          .map((i, index) => {
            return i ? '周' + weekTitles[index] : '';
          })
          .filter(i => i !== '')
          .join(' / ');

    const timeStr = this.state.time ? ' : ' + this.state.time : '';

    return (
      <Dialog
        classes={{ paper: classes.paper }}
        open={open}
        fullScreen
        transitionDuration={300}
        TransitionComponent={SlideTransition}
      >
        <StackHeader
          title="添加打卡"
          handleClickLeft={handleClose}
          leftTitle="取消"
          rightTitle="提交"
          rightEnabled={formValidated}
          handleClickRight={this.handleSubmit}
        />
        <div className={classes.root}>
          <Card classes={{ root: classes.card }}>
            <CardHeader
              title={
                <TextField
                  value={this.state.title}
                  onChange={this.handleChange('title')}
                  fullWidth
                  required
                  placeholder="请在此填写打卡标题"
                />
              }
              subheader={<div className={classes.subheader}>{weekStr + timeStr}</div>}
            />
            <CardMedia
              className={classes.media}
              image="http://timeline.infinitex.cn/img/db/4ff8ac99a823d54d144e0502f9ae19.jpg"
            />
            <CardContent>
              <div className={classes.selectionContainer}>
                {weekTitles.map((i, index) => (
                  <Avatar
                    key={i}
                    onClick={this.toggleSelect(index)}
                    className={classNames({ [classes.selected]: this.state.dateSelected[index] })}
                  >
                    {i}
                  </Avatar>
                ))}
              </div>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={this.toggleTimeDialog(true)}>
                设定时间
              </Button>
            </CardActions>
          </Card>
        </div>
        <TimeDialog
          open={this.state.timeDialogOpen}
          handleClose={this.toggleTimeDialog(false)}
          handleChange={this.handleChange('time')}
          defaultValue={this.state.time}
        />
      </Dialog>
    );
  }
}

class TimeDialog extends Component {
  render() {
    const { open, handleClose, handleChange, defaultValue } = this.props;
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>设置时间</DialogTitle>
        <DialogContent>
          <TextField
            label="时间"
            type="time"
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

export default withStyles(styles)(AddPlanDialog);
