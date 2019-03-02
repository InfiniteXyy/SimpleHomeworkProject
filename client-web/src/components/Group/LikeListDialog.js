import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import { MessageList } from './MessageList';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    paddingTop: 46,
    width: '100%'
  }
};

@inject('messageStore')
@observer
class LikeListDialog extends Component {
  load = () => {
    this.props.messageStore.loadLikeMessages();
  };
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open} onEntered={this.load}>
        <StackHeader handleClickLeft={handleClose} title="收藏" />
        <div className={classes.root}>
          <MessageList messages={this.props.messageStore.likeMessages} />
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(LikeListDialog);
