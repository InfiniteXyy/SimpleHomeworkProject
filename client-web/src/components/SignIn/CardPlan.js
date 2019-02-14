import React, { Component } from 'react';
import {
  CardContent,
  CardMedia,
  Collapse,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  withStyles
} from '@material-ui/core';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import Avatar from '@material-ui/core/Avatar';

import './CardPlan.css';

import classNames from 'classnames';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/ExpandMoreRounded';
import LessIcon from '@material-ui/icons/ExpandLessRounded';
import AddPlan from './AddPlan';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 46
  },
  numberCircle: {
    color: '#fff',
    backgroundColor: '#CECECE'
  },
  active: {
    backgroundColor: 'dodgerblue'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  detailContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16
  },
  card: {
    boxShadow: '0 6px 20px -10px rgba(0, 0, 0, .17);',
    marginTop: 16,
    borderRadius: 0
  },
  cardContent: {
    padding: '8px 0 0',
    '&:last-child': {
      paddingBottom: 12
    }
  },

  secondaryText: {
    color: '#9b9b9b'
  }
});

export const weekTitles = ['日', '一', '二', '三', '四', '五', '六'];

class DetailedCard extends React.Component {
  state = {
    showMore: false
  };
  toggleShowMore = () => {
    this.setState(prevState => {
      return { showMore: !prevState.showMore };
    });
  };
  render() {
    const { card, classes } = this.props;
    const { showMore } = this.state;
    const weekdaysStr = card.weekdays.map(i => '周' + weekTitles[i - 1]).join(' / ');
    return (
      <Card className={classes.card} elevation={0} key={card.id}>
        <CardHeader
          action={<IconButton onClick={this.toggleShowMore}>{showMore ? <LessIcon /> : <MoreIcon />}</IconButton>}
          title={card.title}
          titleTypographyProps={{ style: { color: '#4a4a4a', fontSize: 18 } }}
          subheader={`来自 ${card.creatorTitle} 的打卡`}
        />
        <Collapse in={showMore}>
          {card.coverImg ? <CardMedia className={classes.media} image={card.coverImg} /> : <div />}
          <CardContent classes={{ root: classes.cardContent }}>
            <div>
              <List disablePadding={true}>
                <ListItem>
                  <ListItemText primary="打卡天" />
                  <ListItemSecondaryAction>
                    <ListItemText classes={{ primary: classes.secondaryText }} primary={weekdaysStr} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="时间" />
                  <ListItemSecondaryAction>
                    <ListItemText classes={{ primary: classes.secondaryText }} primary={card.daytime} />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

DetailedCard = withStyles(styles)(DetailedCard);

@inject('cardStore')
@observer
class CardPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDay: props.cardStore.today,
      dialogOpen: ''
    };
  }

  toggleWeekday = index => () => {
    this.setState({ currentDay: index + 1 });
  };

  toggleDialog = title => () => {
    this.setState({ dialogOpen: title });
  };

  render() {
    const { classes, open, onClose, cardStore } = this.props;
    const { currentDay } = this.state;
    const { cards } = cardStore;
    if (cards === undefined) {
      return <div />;
    }
    return (
      <FullScreenDialog open={open}>
        <StackHeader
          title="设定打卡"
          handleClickLeft={onClose}
          rightTitle="添加"
          handleClickRight={this.toggleDialog('add')}
          rightEnabled={true}
        />
        <div className={classes.root}>
          <div className={classNames('week-titles', 'border-vert')}>
            {weekTitles.map((i, index) => (
              <div className={classNames('week-title-container')} key={i} onClick={this.toggleWeekday(index)}>
                <div className="week-title">{i}</div>
                <Avatar className={classNames([classes.numberCircle, { [classes.active]: currentDay === index + 1 }])}>
                  {
                    cards.filter(card => {
                      return card.weekdays.indexOf(index + 1) !== -1;
                    }).length
                  }
                </Avatar>
              </div>
            ))}
          </div>

          <div className={classes.detailContainer}>
            {cards
              .filter(card => {
                return card.weekdays.indexOf(currentDay) !== -1;
              })
              .map(card => (
                <DetailedCard card={card} key={card.id} />
              ))}
          </div>
        </div>
        <AddPlan open={this.state.dialogOpen === 'add'} handleClose={this.toggleDialog('')} />
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(CardPlan);
