import React from 'react';
import { Card, CardActionArea, CardContent, CardHeader, CardMedia, withStyles } from '@material-ui/core';

import HumanIcon from '@material-ui/icons/PersonOutline';
import DateIcon from '@material-ui/icons/AccessTimeOutlined';
import GroupCardHome from './GroupCardHome';
import { inject, observer } from 'mobx-react';

import classNames from 'classnames';
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
    marginTop: 16,
    padding: '0 16px',
    borderRadius: 16,
    height: 25,
    lineHeight: '25px',
    color: '#8B572A',
    fontSize: 12,
    fontWeight: 'bold'
  },
  unjoined: {
    border: '1px solid #8B572A'
  }
};

@inject('groupStore')
@observer
class GroupCardList extends React.Component {
  state = {
    dialogOpen: false,
    payload: undefined
  };

  toggleDialog = (dialogOpen, payload) => () => {
    if (payload) this.setState({ dialogOpen, payload });
    else {
      this.setState({ dialogOpen });
    }
  };
  render() {
    const { classes, cards } = this.props;
    if (cards === undefined) {
      return <div className="empty-tip">加载中...</div>;
    }
    if (cards.length === 0) {
      return <div className="empty-tip">没有发布打卡任务...</div>;
    }
    return (
      <div className={classes.root}>
        {cards.map(i => {
          const hasJoined = this.props.groupStore.hasJoined(i.id);
          return (
            <Card key={i.id} classes={{ root: classes.card }} elevation={0}>
              <CardHeader
                action={
                  <div className={classNames(classes.chip, { [classes.unjoined]: !hasJoined })}>
                    {hasJoined ? '已参与' : '参与'}
                  </div>
                }
                title={i.title}
                subheader={`由 ${i.creator.username} 创建`}
                titleTypographyProps={{ className: classes.cardTitle }}
                subheaderTypographyProps={{ className: classes.cardSubtitle }}
              />
              <CardActionArea onClick={this.toggleDialog(true, i)}>
                <CardMedia className={classes.media} image={i.coverImg} />
                <CardContent>
                  <div className={classes.cardDetailContainer}>
                    <div className={classes.tipContainer}>
                      <HumanIcon className={classes.icon} />
                      <div className={classes.cardDetail}>{`${i.members.length}人参与`}</div>
                    </div>
                    <div className={classes.tipContainer}>
                      <DateIcon className={classes.icon} />
                      <div className={classes.cardDetail}>周一 ～ 周五 晚上 6:00</div>
                    </div>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}

        <GroupCardHome card={this.state.payload} open={this.state.dialogOpen} handleClose={this.toggleDialog(false)} />
      </div>
    );
  }
}

export default withStyles(styles)(GroupCardList);
