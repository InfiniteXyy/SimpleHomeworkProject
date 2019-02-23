import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, Card, CardContent, CardHeader, Divider, IconButton } from '@material-ui/core';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import { inject, observer } from 'mobx-react';

const styles = {
  content: {
    backgroundColor: 'transparent',
    paddingBottom: 20
  },
  message: {
    flex: 1
  },
  card: {
    width: '100%',
    boxShadow: '0 4px 35px -9px RGBA(0,0,0,0.4)'
  },
  cardContent: {
    paddingTop: 11,
    '&:last-child': {
      paddingBottom: 16
    }
  },
  divider: {
    backgroundColor: '#EAEAEA',
    height: 0.5
  },
  title: {
    fontSize: 12,
    color: '#9b9b9b'
  },
  subtitle: {
    fontSize: 16,
    color: '#4a4a4a',
    fontWeight: 'bold'
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
    marginTop: 20,
    backgroundColor: 'RGBA(100,100,100,0.38)',
    '&:hover': {
      backgroundColor: 'RGBA(100,100,100,0.38)',
    }
  }
};

class NotificationBar extends React.Component {
  render() {
    const { handleClose, classes, title, subheader, listTitle, detail1, detail2, from, tip } = this.props;

    return (
      <SnackbarContent
        elevation={0}
        classes={{ root: classes.content, message: classes.message }}
        message={
          <div className={classes.container}>
            <Card classes={{ root: classes.card }} elevation={0}>
              <CardHeader
                avatar={
                  <Avatar src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545813735003&di=3b5a0719596b35f441e4ef77e341830a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201801%2F20%2F20180120022654_U2ESz.jpeg" />
                }
                title={subheader}
                subheader={title}
                titleTypographyProps={{ className: classes.title }}
                subheaderTypographyProps={{ className: classes.subtitle }}
                action={
                  tip && (
                    <div className={classes.tip}>
                      <div className={classes.font4}>{tip}</div>
                    </div>
                  )
                }
              />
              <Divider className={classes.divider} />
              <CardContent className={classes.cardContent}>
                <div className={classes.font1}>{listTitle}</div>
                <div className={classes.font2}>{detail1}</div>
                <div className={classes.container1}>
                  <div className={classes.font2}>{detail2}</div>
                  <div className={classes.font3}>{from}</div>
                </div>
              </CardContent>
            </Card>
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
          <NotificationBar
            tip="7小时后"
            detail1="下午6:00"
            detail2="理科大楼 B222"
            from="来自 计算机网络 群组"
            listTitle="周三 / 周五 / 周六"
            title="晚自习"
            subheader="打卡"
            handleClose={this.toggle(false)}
          />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(Notification);
