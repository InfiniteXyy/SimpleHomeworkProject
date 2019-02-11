import React, { Component } from 'react';
import {
  Card,
  CircularProgress,
  Dialog,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  withStyles
} from '@material-ui/core';
import { FullScreenDialog, SlideTransition } from '../utils';
import StackHeader from '../StackHeader';

import SearchIcon from '@material-ui/icons/SearchRounded';
import IDIcon from '@material-ui/icons/FlagRounded';
import LocationIcon from '@material-ui/icons/LocationCityRounded';
import LocationOnIcon from '@material-ui/icons/LocationOnRounded';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import { inject, observer } from 'mobx-react';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';

const styles = {
  root: {
    paddingTop: 60
  },
  paddingGroup: {
    padding: '0 16px'
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
  tips: {
    color: '#9b9b9b',
    fontSize: 14,
    marginTop: 16
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
    boxSizing: 'border-box',
    marginRight: 16
  },
  inputInput: {
    margin: '0 16px',
    boxSizing: 'border-box'
  },
  search: {
    display: 'flex',
    alignItems: 'center'
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const GroupList = ({ data }) => {
  if (data.length === 0) {
    return <div className="empty-tip">无内容</div>;
  }
  return (
    <List>
      {data.map((item, index) => (
        <ListItem key={item.id}>
          <ListItemAvatar>
            <Avatar alt={item.creator.username} src={item.creator.image} />
          </ListItemAvatar>
          <ListItemText primary={item.title} secondary={`由 ${item.creator.username} 创建`} />
          <ListItemSecondaryAction>
            <div className={classNames('button', { blue: !item.hasJoined, gray: item.hasJoined })}>
              {item.hasJoined ? '已加入' : '加入'}
            </div>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

class JoinByID extends Component {
  render() {
    const { open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />
        <div style={styles.root}>
          <div style={styles.paddingGroup}>
            <div style={styles.bigTitle}>通过 ID 加入</div>
            <div style={styles.subTitle}>ID 是群组在创建时设置的唯一名称，请询问相关人员获得群组 ID</div>
            <TextField label="群组 ID" fullWidth style={{ marginTop: 20 }} />
            <Button style={{ marginTop: 40 }} variant="outlined" size="large" fullWidth color="primary">
              查询
            </Button>
          </div>
        </div>
      </FullScreenDialog>
    );
  }
}

const JoinByName = withStyles(styles)(props => {
  const { classes, open, handleClose, content, onChange, onSearch, data, isSearching } = props;

  return (
    <FullScreenDialog open={open} white>
      <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />
      <div style={styles.root}>
        <div style={styles.paddingGroup}>
          <div style={styles.bigTitle}>通过名称搜索</div>
          <div style={styles.subTitle}>请输入群组的名称</div>
          <div className={classes.search}>
            <InputBase
              value={content}
              placeholder="群组名称…"
              onChange={onChange}
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
            />
            <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isSearching ? (
                <CircularProgress size={22} />
              ) : (
                <div className="blue" onClick={onSearch}>
                  搜索
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <GroupList data={data} loading={isSearching} />
        </div>
      </div>
    </FullScreenDialog>
  );
});

class JoinByNear extends Component {
  render() {
    const { open, handleClose } = this.props;

    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />
        <div style={styles.root}>
          <div style={styles.paddingGroup}>
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

@inject('groupStore', 'commonStore')
@observer
class DialogJoinGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: '',
      content: ''
    };
  }

  toggleDialog = (type, title) => () => {
    if (!type) {
      this.setState({ dialogOpen: '' });
    } else {
      this.setState({ dialogOpen: title });
    }
  };

  handleChange = event => {
    this.setState({ content: event.target.value });
  };

  onSearch = (title = '', nameId = '') => () => {
    if (title === '' && nameId === '') {
      this.props.commonStore.toggleSnackbar('请先输入内容', 'info');
    } else {
      this.props.groupStore.searchGroup(title, nameId);
    }
  };

  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <Dialog open={open} fullScreen transitionDuration={300} TransitionComponent={SlideTransition}>
        <StackHeader title="" handleClickLeft={handleClose} leftTitle="取消" />

        <div className={classes.root}>
          <div className={classes.paddingGroup}>
            <div className={classes.bigTitle}>加入群组</div>
            <div className={classes.subTitle}>和班级同学或同好们共享消息</div>
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
            <div className={classes.tips}>加入群组无需经过管理员同意，但普通用户也不具有发消息权限</div>
          </div>
        </div>

        <JoinByID open={this.state.dialogOpen === 'id'} handleClose={this.toggleDialog(false)} />
        <JoinByName
          content={this.state.content}
          onChange={this.handleChange}
          onSearch={this.onSearch(this.state.content, '')}
          data={this.props.groupStore.searchedGroups}
          open={this.state.dialogOpen === 'name'}
          handleClose={this.toggleDialog(false)}
          isSearching={this.props.groupStore.isSearching}
        />
        <JoinByNear open={this.state.dialogOpen === 'near'} handleClose={this.toggleDialog(false)} />
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogJoinGroup);
