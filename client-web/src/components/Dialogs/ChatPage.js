import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import StackHeader from '../StackHeader';
import { FullScreenDialog } from '../utils';

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
  inputRoot: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 4,
    height: 36,
    boxSizing: 'border-box',
    margin: '8px 16px'
  },
  inputInput: {
    margin:  16,
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

class ChatPage extends React.Component {
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader title="消息" handleClickLeft={handleClose} />
        <div className={classes.root}>
          <div className={classes.container}>
            <div className={classes.bubble1 + ' ' + classes.bubble}>
              <div className={classes.font1}>我在干嘛</div>
              <div className={classes.font2}>1:55 PM</div>
            </div>
            <div className={classes.bubble2 + ' ' + classes.bubble}>
              <div className={classes.font1}>你在做项目</div>
              <div className={classes.font2}>1:55 PM</div>
            </div>
          </div>
        </div>
        <AppBar position="fixed" className={classes.appBar} elevation={0}>
          <InputBase placeholder="输入内容…" classes={{ root: classes.inputRoot, input: classes.inputInput }} />
        </AppBar>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(ChatPage);
