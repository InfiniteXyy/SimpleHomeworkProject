import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import { inject, observer } from 'mobx-react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';

import TimerIcon from '@material-ui/icons/TimerRounded';
import TabIcon from '@material-ui/icons/TabRounded';
import ShopIcon from '@material-ui/icons/ShopRounded';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVertRounded';

import './SignIn.css';
import CardToday from './CardToday';
import CardPlan from './CardPlan';
import Shop from './Shop';

import classNames from 'classnames';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
  root: {},
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  },
  secondButton: {
    color: '#9b9b9b'
  }
});

@inject('cardStore')
@observer
class SignIn extends Component {
  state = {
    dialogOpen: ''
  };

  toggleDialog = type => () => {
    this.setState({ dialogOpen: type });
  };

  componentDidMount() {
    this.props.cardStore.loadCards();
  }

  render() {
    const { classes } = this.props;
    const percentage = 0;

    return (
      <div>
        <div className={classes.root}>
          <div className={classNames('preview', 'border-vert')}>
            <div className="card-btn-container">
              <div className="card-btn" onClick={this.toggleDialog('today')}>
                <TimerIcon color="primary" />
                <p>今日打卡</p>
              </div>
              <div className="card-btn" onClick={this.toggleDialog('plan')}>
                <TabIcon color="primary" />
                <p>设定打卡</p>
              </div>
              <div className="card-btn" onClick={this.toggleDialog('shop')}>
                <ShopIcon color="primary" />
                <p>成就商店</p>
              </div>
            </div>

            <div className="line-container">
              <div className="line">
                <div style={{ width: percentage + '%' }} />
              </div>
              <div className="line-detail">{`已完成${percentage}%`}</div>
            </div>
          </div>
        </div>
        <CardStep />

        <CardToday open={this.state.dialogOpen === 'today'} onClose={this.toggleDialog('')} />
        <CardPlan open={this.state.dialogOpen === 'plan'} onClose={this.toggleDialog('')} />
        <Shop open={this.state.dialogOpen === 'shop'} onClose={this.toggleDialog('')} />
      </div>
    );
  }
}

@inject('cardStore')
@observer
class CardStep extends Component {
  handleCheck = card => () => {
    card.isChecking = true;
    this.props.cardStore.check(card.id).then(() => {
      card.isChecking = false;
    });
  };

  render() {
    const { cardStore, classes } = this.props;
    const cards = cardStore.cards;
    if (cards === undefined) {
      return <div className="empty-tip">加载中 ...</div>;
    }

    const steps = cardStore.todayCards;

    if (steps.length === 0) {
      return <div className="empty-tip">今天没有计划</div>;
    }

    return (
      <Stepper
        activeStep={this.props.cardStore.currentStep}
        orientation="vertical"
        className={classNames('border-vert')}
      >
        {steps.map((card, index) => (
          <Step key={card.id}>
            <StepLabel>
              {card.title}
              <span style={{ color: '#9b9b9b', marginLeft: 10 }}>{card.daytime}</span>
            </StepLabel>
            <StepContent>
              <Card>
                <CardHeader title={card.title} subheader={`来自 ${card.creatorTitle} 的打卡`} />
                {card.coverImg ? <CardMedia className={classes.media} image={card.coverImg} /> : <div />}
                <CardActions>
                  {card.isChecking ? (
                    <CircularProgress size={22} style={{ padding: '4px 12px' }} />
                  ) : (
                    <Button size="small" color="primary" onClick={this.handleCheck(card)}>
                      打卡
                    </Button>
                  )}
                </CardActions>
              </Card>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    );
  }
}

CardStep = withStyles(styles)(CardStep);

export default withStyles(styles)(SignIn);
