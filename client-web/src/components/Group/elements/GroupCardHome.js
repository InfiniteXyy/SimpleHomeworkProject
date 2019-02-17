import React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  withStyles,
  IconButton
} from '@material-ui/core';

import PlaceIcon from '@material-ui/icons/LocationOnOutlined';
import DateIcon from '@material-ui/icons/AccessTimeOutlined';
import { FullScreenDialog } from '../../utils';
import BackIcon from '@material-ui/icons/ChevronLeftRounded';

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
class GroupCardHome extends React.Component {
  render() {
    const { classes, open, handleClose } = this.props;
    return (
      <FullScreenDialog open={open}>
        <div className={classes.root}>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <BackIcon style={{ color: 'white' }} />
          </IconButton>
          <Card elevation={0} className={classes.card}>
            <CardMedia
              className={classes.media}
              image="http://timeline.infinitex.cn/img/c1/eb2b41496b21bf258ac976b4d31462.jpg"
            />
            <CardContent>
              <div className={classes.container1}>
                <div className={classes.title}>晚自习</div>
                <div className={classes.chip}>参与</div>
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
                <Avatar>1</Avatar>
              </ListItemAvatar>
              <ListItemText
                classes={{ primary: classes.itemPrimary, secondary: classes.itemSecondary }}
                primary="InfiniteX"
                secondary="创建于 2018年9月"
              />
            </ListItem>
          </List>
          <div className={classes.aboutContainer}>
            <div className={classes.aboutTitle}>简介</div>
            <div className={classes.line} />
            <p style={{ fontSize: 16, lineHeight: 1.6 }}>
              在任务大厅中可以看到当前比较热门的活动、
              比赛。同时大厅里有4个不同类型的任务列表，服务方根据自身的技能情况选择不同类型的任务，点击任务卡片可以查看任务详情，里面详细介绍了任务的报酬，设计类型，具体价格，任务简介，同时还能看到任务状态：发布情况，竞标情况，评论等等。遇到满意的任务还可以点击收藏，进一步关注。
            </p>
          </div>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(GroupCardHome);
