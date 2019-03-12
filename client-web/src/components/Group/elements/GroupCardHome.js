import React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  withStyles
} from '@material-ui/core';

import PlaceIcon from '@material-ui/icons/LocationOnOutlined';
import DateIcon from '@material-ui/icons/AccessTimeOutlined';
import { FullScreenDialog } from '../../utils';
import BackIcon from '@material-ui/icons/ChevronLeftRounded';
import moment from 'moment';

const styles = {
  root: {
    width: '100%',
    backgroundColor: '#fafafa',
    paddingBottom: '100px'
  },
  media: {
    height: 200
  },
  card: {
    borderRadius: 0
  },
  chip: {
    padding: '0 16px',
    borderRadius: 16,
    height: 25,
    lineHeight: '25px',
    border: '1px solid #8B572A',
    color: '#8B572A',
    fontSize: 12,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a4a4a'
  },
  container1: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  container2: {
    marginTop: 6,
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    color: '#757575',
    width: 16,
    height: 16,
    marginRight: 8
  },
  secondaryText: {
    fontSize: 14,
    color: '#9b9b9b'
  },
  list: {
    backgroundColor: 'white',
    marginTop: 1
  },
  itemPrimary: {
    color: '#4a4a4a',
    fontWeight: '500',
    fontSize: 18
  },
  itemSecondary: {
    color: '#9b9b9b',
    fontSize: 14
  },
  aboutContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 16
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a4a4a'
  },
  line: {
    backgroundColor: '#EAEAEA',
    height: 1,
    margin: '8px 0',
    width: '100%'
  },
  closeButton: {
    top: 10,
    left: 10,
    position: 'fixed',
    backgroundColor: 'rgba(151, 151, 151, 0.3)',
    '&:hover': {
      backgroundColor: 'rgba(151, 151, 151, 0.3)'
    }
  }
};

const UserList = ({ users }) => (
  <List>
    {users.map(user => {
      let textProps = {};
      if (user.finished) {
        textProps = { secondary: moment(user.finished).fromNow() };
      }
      return (
        <ListItem key={user.username}>
          <ListItemAvatar>
            <Avatar src={user.image} />
          </ListItemAvatar>
          <ListItemText primary={user.username} {...textProps} />
        </ListItem>
      );
    })}
  </List>
);

class GroupCardHome extends React.Component {
  state = {
    tabIndex: 0
  };

  handleChange = (event, value) => {
    this.setState({ tabIndex: value });
  };

  render() {
    const { classes, open, handleClose, card, hasJoined } = this.props;
    let main;
    if (card === undefined) main = <div />;
    else {
      const finished = card.members.filter(i => i.finished !== '');
      const unfinished = card.members.filter(i => i.finished === '');
      main = (
        <div className={classes.root}>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <BackIcon style={{ color: 'white' }} />
          </IconButton>
          <Card elevation={0} className={classes.card}>
            <CardMedia className={classes.media} image={card.coverImg} />
            <CardContent>
              <div className={classes.container1}>
                <div className={classes.title}>{card.title}</div>
                <div className={classes.chip}>{hasJoined ? '参与' : '未参与'}</div>
              </div>
              <div className={classes.container2}>
                <DateIcon className={classes.icon} />
                <div className={classes.secondaryText}>周二～周五 晚上6:00</div>
              </div>
              <div className={classes.container2}>
                <PlaceIcon className={classes.icon} />
                <div className={classes.secondaryText}>教书院 218</div>
              </div>
            </CardContent>
          </Card>
          <List className={classes.list}>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={card.creator.image} />
              </ListItemAvatar>
              <ListItemText
                classes={{ primary: classes.itemPrimary, secondary: classes.itemSecondary }}
                primary={card.creator.username}
              />
            </ListItem>
          </List>
          <div className={classes.aboutContainer}>
            <div className={classes.aboutTitle}>简介</div>
            <div className={classes.line} />
            <p style={{ fontSize: 16, lineHeight: 1.6 }}>{card.description}</p>
          </div>
          <div className={classes.aboutContainer}>
            <div className={classes.aboutTitle}>成员今日</div>
            <div className={classes.line} />
            <Tabs value={this.state.tabIndex} onChange={this.handleChange}>
              <Tab label={`已完成(${finished.length})`} />
              <Tab label={`未完成(${unfinished.length})`} />
            </Tabs>
            <div>{this.state.tabIndex === 0 ? <UserList users={finished} /> : <UserList users={unfinished} />}</div>
          </div>
        </div>
      );
    }
    return <FullScreenDialog open={open}>{main}</FullScreenDialog>;
  }
}

export default withStyles(styles)(GroupCardHome);
