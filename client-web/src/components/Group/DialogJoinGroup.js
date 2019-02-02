import React, { Component } from 'react';
import { Dialog, TextField, withStyles } from '@material-ui/core';
import { SlideTransition } from '../utils';
import StackHeader from '../StackHeader';

import SearchIcon from '@material-ui/icons/SearchRounded';
import IDIcon from '@material-ui/icons/FlagRounded';
import LocationIcon from '@material-ui/icons/LocationCityRounded';
import LocationOnIcon from '@material-ui/icons/LocationOnRounded';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';

const styles = {
  root: {
    padding: '60px 16px'
  },
  bigTitle: {
    color: '#4a4a4a',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subTitle: {
    color: '#757575',
    fontSize: 16,
    marginBottom: 16
  },
  bigButton: {
    width: '100%',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f1f1f1',
    boxSizing: 'border-box'
  },
  bigButtonText: {
    fontSize: 18,
    color: '#4a4a4a',
    fontWeight: 'bold'
  },
  icon: {
    marginRight: 20,
    color: '#9b9b9b'
  },
  inputRoot: {
    flex: 1,
    backgroundColor: 'RGBA(142,142,147,0.12)',
    borderRadius: 10,
    height: 36,
    boxSizing: 'border-box'
  },
  inputInput: {
    margin: '0 16px',
    boxSizing: 'border-box'
  },
  search: {
    display: 'flex'
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

class JoinByID extends Component {
  render() {
    const { open, handleClose } = this.props;

    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />
        <div style={styles.root}>
          <div style={styles.titleGroup}>
            <div style={styles.bigTitle}>通过 ID 加入</div>
            <div style={styles.subTitle}>ID 是群组在创建时设置的唯一名称，请询问相关人员获得群组 ID</div>
          </div>
          <div>
            <TextField label="群组 ID" fullWidth style={{ marginTop: 20 }} />
            <Button style={{ marginTop: 40 }} variant="outlined" size="large" fullWidth color="primary">
              查询
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}
class JoinByName extends Component {
  render() {
    const { classes, open, handleClose } = this.props;

    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />
        <div style={styles.root}>
          <div style={styles.titleGroup}>
            <div style={styles.bigTitle}>通过名称搜索</div>
            <div style={styles.subTitle}>请输入群组的名称</div>
          </div>

          <div className={classes.search}>
            <InputBase placeholder="搜索…" classes={{ root: classes.inputRoot, input: classes.inputInput }} />
          </div>
        </div>
      </Dialog>
    );
  }
}

JoinByName = withStyles(styles)(JoinByName);

class JoinByNear extends Component {
  render() {
    const { open, handleClose } = this.props;

    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />
        <div style={styles.root}>
          <div style={styles.titleGroup}>
            <div style={styles.bigTitle}>面对面加入</div>
            <div style={styles.subTitle}>简记作业将搜索附近正在创建的群组</div>
          </div>
          <div style={styles.center}>
            <LocationOnIcon style={{ width: 120, height: 120, color: '#eaeaea', marginTop: 10 }} />
          </div>
        </div>
      </Dialog>
    );
  }
}

class DialogJoinGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: ''
    };
  }

  toggleDialog = (type, title) => () => {
    if (!type) {
      this.setState({ dialogOpen: '' });
    } else {
      this.setState({ dialogOpen: title });
    }
  };

  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />

        <div className={classes.root}>
          <div className={classes.titleGroup}>
            <div className={classes.bigTitle}>加入群组</div>
            <div className={classes.subTitle}>和班级同学或同好们共享消息</div>
          </div>
          <div className={classes.bigButton} onClick={this.toggleDialog(true, 'name')}>
            <SearchIcon fontSize="large" className={classes.icon} />
            <div className={classes.bigButtonText}>通过名称搜索</div>
          </div>
          <div className={classes.bigButton} onClick={this.toggleDialog(true, 'id')}>
            <IDIcon fontSize="large" className={classes.icon} />
            <div className={classes.bigButtonText}>通过 ID 加入</div>
          </div>
          <div className={classes.bigButton} onClick={this.toggleDialog(true, 'near')}>
            <LocationIcon fontSize="large" className={classes.icon} />
            <div className={classes.bigButtonText}>面对面加入</div>
          </div>
        </div>

        <JoinByID open={this.state.dialogOpen === 'id'} handleClose={this.toggleDialog(false)} />
        <JoinByName open={this.state.dialogOpen === 'name'} handleClose={this.toggleDialog(false)} />
        <JoinByNear open={this.state.dialogOpen === 'near'} handleClose={this.toggleDialog(false)} />
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogJoinGroup);
