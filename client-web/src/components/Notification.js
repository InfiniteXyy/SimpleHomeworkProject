import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Divider, IconButton } from '@material-ui/core';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import { inject, observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import moment from 'moment';

const styles = {
  content: {
    backgroundColor: 'transparent',
    paddingBottom: 20
  },
  message: {
    flex: 1
  },
  card: {
    boxShadow: '0 0 20px -10px RGBA(0,0,0,0.6)',
    width: '100%',
    textAlign: 'start'
  },
  cardContent: {
    paddingTop: 11,
    '&:last-child': {
      paddingBottom: 16
    }
  },
  divider: {
    backgroundColor: '#EAEAEA',
    height: 0.75
  },
  title: {
    fontSize: 16,
    color: '#4a4a4a',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#9b9b9b'
  },
  font1: {
    fontSize: 12,
    color: '#9b9b9b',
    marginBottom: 6
  },
  font2: {
    fontSize: 14,
    color: '#4a4a4a'
  },
  font3: {
    fontSize: 12,
    color: '#757575'
  },
  container1: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  tip: {
    backgroundColor: '#89C3EB',
    width: 90,
    height: 30,
    borderRadius: '10px 0 0 10px',
    marginRight: -8,
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  font4: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 10px 0'
  },
  icon: {
    backgroundColor: 'RGBA(100,100,100,0.38)',
    '&:hover': {
      backgroundColor: 'RGBA(100,100,100,0.38)'
    },
    marginTop: 12
  }
};

class NotificationCard extends React.Component {
  render() {
    const Type = {
      card: '打卡',
      task: '任务'
    };
    const { classes, notification } = this.props;
    if (notification === undefined) return <div />;
    const time = moment(notification.time);
    return (
      <Card classes={{ root: classes.card }} elevation={0}>
        <CardHeader
          title={notification.title}
          subheader={Type[notification.type]}
          titleTypographyProps={{ className: classes.title }}
          subheaderTypographyProps={{ className: classes.subtitle }}
          action={
            notification.time && (
              <div className={classes.tip}>
                <div className={classes.font4}>{time.fromNow()}</div>
              </div>
            )
          }
        />
        <Divider className={classes.divider} />
        <CardContent className={classes.cardContent}>
          {notification.time && <div className={classes.font1}>{notification.days || time.format('周dd')}</div>}
          {notification.time && <div className={classes.font2}>{time.format('H:mm')}</div>}
          <div className={classes.container1}>
            <div className={classes.font2}>{notification.place || '无位置信息'}</div>
            <div className={classes.font3}>{`来自 ${notification.origin} ${
              notification.type === 'card' ? '的打卡' : '列表'
            }`}</div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    time: PropTypes.any,
    title: PropTypes.string,
    place: PropTypes.string,
    type: PropTypes.oneOf(['card', 'task']),
    origin: PropTypes.string,
    days: PropTypes.string
  }).isRequired
};

NotificationCard = withStyles(styles)(NotificationCard);

export { NotificationCard };

@inject('commonStore')
@observer
class NotificationBar extends React.Component {
  render() {
    const { handleClose, classes, commonStore } = this.props;

    return (
      <SnackbarContent
        elevation={0}
        classes={{ root: classes.content, message: classes.message }}
        message={
          <div className={classes.container}>
            {<NotificationCard notification={commonStore.allTasks[0]} />}
            <IconButton className={classes.icon} onClick={handleClose}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          </div>
        }
      />
    );
  }
}

NotificationBar = withStyles(styles)(NotificationBar);

@inject('commonStore')
@observer
class Notification extends React.Component {
  toggle = open => () => {
    this.props.commonStore.toggleNotification(open);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Snackbar
          transitionDuration={300}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={this.props.commonStore.notificationOpen}
        >
          <NotificationBar handleClose={this.toggle(false)} />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(Notification);
