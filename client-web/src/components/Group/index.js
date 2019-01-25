import React from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import MessageList from './MessageList';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import StarIcon from '@material-ui/icons/StarRounded';
import ArrowRightIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';

const styles = {
  root: {
    width: '100%',
    paddingTop: 96
  },
  appbar: {
    width: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    backgroundColor: 'white',
    zIndex: 100,
    paddingBottom: 16,
    borderBottom: 'solid 0.75px #aaaaaa'
  },
  header: {
    color: '#9a9a9a',
    fontWeight: 'bold',
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 16
  },
  search: {
    padding: '0 16px 0',
    display: 'flex'
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
  list: {
    marginTop: 16,
    marginBottom: 16,
    padding: 0
  },
  bigList: {
    fontSize: 16,
    fontWeight: '500',
    color: "#5c5c5c"
  },
  listItem: {
    borderTop: 'solid 1px #f1f1f1',
    borderBottom: 'solid 1px #f1f1f1',
    height: 60,
    marginTop: 10,
    backgroundColor: 'white'
  },
  subtitle: {
    marginLeft: 16,
    marginTop: 26,
    marginBottom: 9,
    fontSize: 14,
    fontWeight: '500',
    color: '#9b9b9b'
  }
};

@inject('messageStore')
@observer
class Group extends React.Component {
  componentDidMount() {
    this.props.messageStore.loadMessages();
  }

  render() {
    const { messageStore, classes } = this.props;
    return (
      <div>
        <div className={classes.appbar}>
          <div className={classes.header}>
            <Typography variant="h6">群组</Typography>
          </div>

          <div className={classes.search}>
            <InputBase placeholder="搜索…" classes={{ root: classes.inputRoot, input: classes.inputInput }} />
          </div>
        </div>

        <div className={classes.root}>
          <List className={classes.list}>
            <ListItem button style={styles.listItem} onClick={this.handleSetting}>
              <ListItemIcon>
                <PeopleIcon color="primary" />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.bigList }} primary="我的群组" />
              <ListItemSecondaryAction style={{ height: 20 }}>
                <ListItemIcon>
                  <ArrowRightIcon fontSize="small" />
                </ListItemIcon>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem button style={styles.listItem} onClick={this.handleSetting}>
              <ListItemIcon>
                <StarIcon color="primary" style={{ color: '#F5A623' }} />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.bigList }} primary="收藏" />
              <ListItemSecondaryAction style={{ height: 20 }}>
                <ListItemIcon>
                  <ArrowRightIcon fontSize="small" />
                </ListItemIcon>
              </ListItemSecondaryAction>
            </ListItem>
          </List>

          <p className={classes.subtitle}>最近消息</p>

          <MessageList messages={messageStore.messages} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Group);
