import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import StackHeader from '../StackHeader';
import { FullScreenDialog } from '../utils';

import classNames from 'classnames';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { CircularProgress } from '@material-ui/core';

const styles = {
  root: {
    paddingTop: 46
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    height: 56,
    backgroundColor: 'white'
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 16
  },
  inputRoot: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 4,
    height: 36,
    boxSizing: 'border-box',
    margin: '8px 16px'
  },
  inputInput: {
    margin: 16,
    boxSizing: 'border-box'
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  bubble: {
    padding: '6px 16px',
    borderRadius: 16,
    margin: 10,
    display: 'flex',
    alignItems: 'flex-end'
  },
  bubble1: {
    backgroundColor: 'RGB(244, 244, 244)',
    alignSelf: 'flex-start'
  },
  bubble2: {
    backgroundColor: 'RGB(91, 144, 196)',
    alignSelf: 'flex-end',
    color: 'white'
  },
  font1: {},
  font2: {
    opacity: 0.6,
    fontSize: 12,
    marginLeft: 8,
    fontStyle: 'italic'
  }
};

@inject('chatStore')
@observer
class ChatPage extends React.Component {
  state = {
    content: '',
    isSending: false
  };
  handleChange = event => {
    this.setState({ content: event.target.value });
  };

  onSend = () => {
    if (this.state.content === '') return;
    this.setState({ isSending: true });
    this.props.chatStore.handleSend(this.state.content).then(() => {
      this.setState({ isSending: false, content: '' });
    });
  };
  render() {
    const { classes, open, handleClose } = this.props;
    const payload = this.props.chatStore.currentPage;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader title={payload ? payload.person : ''} handleClickLeft={handleClose} />
        <div className={classes.root}>
          <div className={classes.container}>
            {payload &&
              payload.bubbles.map((i, index) => {
                return (
                  <div
                    key={index}
                    className={classNames(
                      { [classes.bubble1]: i.type === 'reply', [classes.bubble2]: i.type !== 'reply' },
                      classes.bubble
                    )}
                  >
                    <div className={classes.font1}>{i.content}</div>
                    <div className={classes.font2}>{moment(i.createdAt).format('H:mm')}</div>
                  </div>
                );
              })}
          </div>
        </div>
        <AppBar position="fixed" className={classes.appBar} elevation={0}>
          <div className={classes.search}>
            <InputBase
              value={this.state.content}
              placeholder="输入内容…"
              onChange={this.handleChange}
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
            />
            <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {this.state.isSending ? (
                <CircularProgress size={22} />
              ) : (
                <div
                  className={classNames({ blue: this.state.content !== '', gray: this.state.content === '' })}
                  onClick={this.onSend}
                >
                  发送
                </div>
              )}
            </div>
          </div>
        </AppBar>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ChatPage);
