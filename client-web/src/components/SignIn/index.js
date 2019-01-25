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

const styles = theme => ({
  root: {
    width: '100%'
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

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label.name}>
              <StepLabel>{label.name}</StepLabel>
              <StepContent>
                <Typography>{label.description}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button variant="contained" color="primary" onClick={this.handleNext} className={classes.button}>
                      签到
                    </Button>
                  </div>
                </div>
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
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(SignIn);
