import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { inject, observer } from 'mobx-react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment';

import TimerIcon from '@material-ui/icons/TimerRounded';
import TabIcon from '@material-ui/icons/TabRounded';
import ShopIcon from '@material-ui/icons/ShopRounded';

import './SignIn.css';
const styles = theme => ({
  root: {
    paddingTop: 40
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
  header: {
    width: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    color: '#9a9a9a',
    backgroundColor: 'white',
    fontWeight: 'bold',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 16,
    borderBottom: 'solid 0.75px #eeeeee'
  },
  secondButton: {
    color: '#9b9b9b'
  }
});

@inject('checkOutStore')
@observer
class SignIn extends Component {
  handleNext = () => {
    this.props.checkOutStore.nextStep();
  };

  handleReset = () => {
    this.props.checkOutStore.resetStep();
  };

  render() {
    const { classes, checkOutStore } = this.props;
    const steps = checkOutStore.courseSteps;
    const activeStep = checkOutStore.currentStep;
    const percentage = Math.floor((activeStep / steps.length) * 100);

    return (
      <div>
        <div className={classes.header}>
          <Typography variant="h6">{moment().format('M月d日 dddd')}</Typography>
        </div>
        <div className={classes.root}>
          <div className="preview">
            <div className="card-btn-container">
              <div className="card-btn">
                <TimerIcon color="primary" />
                <p>今日打卡</p>
              </div>
              <div className="card-btn">
                <TabIcon color="primary" />
                <p>设定计划</p>
              </div>
              <div className="card-btn">
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
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label.name}>
                <StepLabel>{label.name}</StepLabel>
                <StepContent>
                  <Card className={classes.card}>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {label.name}
                        </Typography>
                        <Typography component="p">{label.description}</Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button size="small" color="primary" onClick={this.handleNext}>
                        完成
                      </Button>
                      <Button size="small" classes={{ text: classes.secondButton }}>
                        跳过
                      </Button>
                    </CardActions>
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>今天的课程全部结束啦！</Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                再来一次
              </Button>
            </Paper>
          )}
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(SignIn);
