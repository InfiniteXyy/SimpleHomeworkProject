import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowRightIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { inject, observer } from 'mobx-react';
import Header from './Header';

const styles = {
  root: {
    paddingTop: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'white',
    height: 180,
    width: 330,
    marginTop: 20,
    border: 'solid 0.5px #eeeeee',
    borderRadius: 8,
    boxShadow: '0px 6px 20px -15px rgba(190,190,190,1)'
  },
  list: {
    width: '100%',
    marginTop: 20
  },
  listItem: {
    background: 'white',
    borderTop: 'solid 0.5px #eaeaea',
    borderBottom: 'solid 0.5px #eaeaea'
  }
};

@inject('routingStore')
@observer
class Profile extends Component {
  handleSetting = () => {
    this.props.routingStore.push('/setting');
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header />
        <div className={classes.root}>
          <div className={classes.card} />
          <List className={classes.list}>
            <ListItem button style={styles.listItem} onClick={this.handleSetting}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="设置" />
              <ListItemSecondaryAction style={{ height: 20 }}>
                <ListItemIcon>
                  <ArrowRightIcon fontSize="small" />
                </ListItemIcon>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
