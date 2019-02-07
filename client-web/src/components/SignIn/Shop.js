import React, { Component } from 'react';
import {
  Button,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  withStyles
} from '@material-ui/core';
import { SlideTransition } from '../utils';
import StackHeader from '../StackHeader';

import PlayIcon from '@material-ui/icons/FeaturedPlayListRounded';

import classNames from 'classnames';

const styles = {
  root: {
    width: '100%',
    paddingTop: 46
  },
  paper: {
    backgroundColor: '#fafafa'
  }
};

class Shop extends Component {
  render() {
    const { classes, open, onClose } = this.props;
    return (
      <Dialog
        classes={{ paper: classes.paper }}
        open={open}
        fullScreen
        transitionDuration={300}
        TransitionComponent={SlideTransition}
      >
        <div>
          <StackHeader title="成就商店" handleClickLeft={onClose} />
          <div className={classes.root}>
            <List subheader={<ListSubheader>主题类</ListSubheader>}>
              <ListItem className={classNames('border-vert', 'background-white')}>
                <ListItemIcon>
                  <PlayIcon />
                </ListItemIcon>
                <ListItemText primary="夜间模式" />
                <ListItemSecondaryAction>
                  <Button>购入</Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Shop);
