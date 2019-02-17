import React from 'react';
import { Avatar, Card, CardActionArea, CardContent, CardHeader, CardMedia, withStyles } from '@material-ui/core';

import HumanIcon from '@material-ui/icons/PersonOutline';
import DateIcon from '@material-ui/icons/AccessTimeOutlined';

const styles = {
  root: {
    width: '100%',
    backgroundColor: '#fafafa',
    paddingBottom: '100px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  card: {
    margin: '20px 20px 0',
    boxShadow: '0 11px 20px -10px rgba(0, 0, 0, .17);'
  },
  cardTitle: {
    fontSize: 20,
    color: '#4a4a4a',
    fontWeight: 'bold'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9b9b9b'
  },
  cardDetail: {
    fontSize: 12,
    color: '#9b9b9b'
  },
  cardDetailContainer: {
    display: 'flex'
  },
  tipContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 16
  },
  icon: {
    height: 16,
    width: 16,
    marginRight: 8,
    color: '#757575'
  },
  chip: {
    margin: 16,
    padding: '0 16px',
    borderRadius: 16,
    height: 25,
    lineHeight: '25px',
    border: '1px solid #8B572A',
    color: '#8B572A',
    fontSize: 12,
    fontWeight: 'bold'
  }
};
class GroupCardList extends React.Component {
  render() {
    const { classes, handleDetail } = this.props;
    return (
      <div className={classes.root}>
        {[1, 2, 3].map(i => (
          <Card key={i.toString()} classes={{ root: classes.card }} elevation={0}>
            <CardHeader
              avatar={<Avatar>1</Avatar>}
              action={<div className={classes.chip}>参与</div>}
              title="晚自习"
              subheader="由 健身爱好者 创建"
              titleTypographyProps={{ className: classes.cardTitle }}
              subheaderTypographyProps={{ className: classes.cardSubtitle }}
            />
            <CardActionArea onClick={handleDetail()}>
              <CardMedia
                className={classes.media}
                image="http://timeline.infinitex.cn/img/c1/eb2b41496b21bf258ac976b4d31462.jpg"
              />
              <CardContent>
                <div className={classes.cardDetailContainer}>
                  <div className={classes.tipContainer}>
                    <HumanIcon className={classes.icon} />
                    <div className={classes.cardDetail}>50人参与</div>
                  </div>
                  <div className={classes.tipContainer}>
                    <DateIcon className={classes.icon} />
                    <div className={classes.cardDetail}>周一 ～ 周五 晚上 6:00</div>
                  </div>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(GroupCardList);
