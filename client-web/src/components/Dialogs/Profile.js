import React from 'react';
import { Avatar, List, ListItem, ListItemSecondaryAction, ListItemText, withStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StackHeader from '../StackHeader';
import { FullScreenDialog } from '../utils';
import { MessageList } from '../Group/MessageList';
import { inject, observer } from 'mobx-react';
import { ROLES } from '../Group/GroupList';

const styles = {
  root: {
    paddingTop: 46,
    margin: '0 16px'
  },
  avatar: {
    height: 90,
    width: 90,
    marginTop: 50
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  container1: {
    width: 200,
    display: 'flex',
    justifyContent: 'space-around'
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  container3: {
    width: '100%',
    marginTop: 10
  },
  font1: {
    marginTop: 25,
    fontSize: 22,
    color: '#4a4a4a',
    fontWeight: 'bold'
  },
  font2: {
    marginTop: 28,
    fontSize: 16,
    color: '#4a4a4a'
  },
  font3: {
    fontSize: 12,
    color: '#9b9b9b',
    marginTop: 3
  },
  font4: {
    fontSize: 14,
    color: '#9b9b9b'
  },
  tabsRoot: {
    width: '100%',
    marginTop: 20
  },
  tabsContainer: {
    justifyContent: 'space-around'
  },
  tabRoot: {
    color: '#757575',
    fontSize: 14,
    fontWeight: 'bold'
  },
  tabsIndicator: {
    backgroundColor: '#89C3EB'
  },
  tabSelected: {
    color: '#4a4a4a',
    fontSize: 14,
    fontWeight: 'bold'
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EFEFEF'
  }
};

@inject('profileStore')
@observer
class Profile extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, open, handleClose } = this.props;
    const user = this.props.profileStore.userProfile;
    let main = <div />;
    if (user !== undefined) {
      const messageTab = <MessageList messages={user.messages.slice(0, 3)} />;
      const groupTab = (
        <List>
          {user.groups.map(i => (
            <ListItem key={i.joinAt} button>
              <ListItemText primary={i.group.title} />
              <ListItemSecondaryAction>
                <ListItemText classes={{ primary: classes.font4 }} primary={ROLES[i.tag]} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      );
      main = (
        <div className={classes.root}>
          <div className={classes.headerContainer}>
            <Avatar className={classes.avatar} src={user.image} />
            <div className={classes.font1}>{user.username}</div>
            <div className={classes.container1}>
              <div className={classes.container2}>
                <div className={classes.font2}>{user.messages.length}</div>
                <div className={classes.font3}>发布动态</div>
              </div>
              <div className={classes.container2}>
                <div className={classes.font2}>{user.groups.length}</div>
                <div className={classes.font3}>参与群组</div>
              </div>
            </div>
          </div>

          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator, flexContainer: classes.tabsContainer }}
          >
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="动态" />
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="群组" />
          </Tabs>
          <div className={classes.divider} />
          <div className={classes.container3}>{this.state.value === 0 ? messageTab : groupTab}</div>
        </div>
      );
    }

    return (
      <FullScreenDialog open={open} white>
        <StackHeader title="" handleClickLeft={handleClose} />
        {main}
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(Profile);
