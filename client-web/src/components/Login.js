import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import { inject, observer } from 'mobx-react';
import { Dialog, Slide } from '@material-ui/core';
import Register from './Register';

const styles = theme => ({
  root: {
    width: '100%'
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 5}px ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 10
  },
  bigTitle: {
    color: '#4A90E2',
    fontSize: 48,
    marginBottom: 16
  },
  subTitle: {
    color: '#9b9b9b',
    fontSize: 16
  },
  titleGroup: {
    width: '100%',
    marginBottom: 10
  },
  bottomContainer: {
    marginTop: 12,
    textAlign: 'center'
  },
  tips: {
    fontSize: 14,
    color: '#9b9b9b'
  },
  textBtn: {
    fontSize: 14,
    color: theme.palette.primary.main,
    marginLeft: 4
  }
});

function Transition(props) {
  return <Slide direction="right" {...props} />;
}

@inject('authStore', 'commonStore')
@observer
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      registerOpen: false
    };
  }

  handleRegisterOpen = () => {
    this.setState({
      registerOpen: true
    });
  };
  handleRegisterClose = () => {
    this.setState({
      registerOpen: false
    });
  };

  handleChange = target => event => {
    this.setState({ [target]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.authStore.setEmail(this.state.email);
    this.props.authStore.setPassword(this.state.password);
    this.props.authStore.login().catch(() => {
      this.props.commonStore.toggleSnackbar('用户名或密码输入错误！', 'error');
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.titleGroup}>
            <div className={classes.bigTitle}>欢迎</div>
            <div className={classes.subTitle}>登录以获得群组信息</div>
            <div className={classes.subTitle}>并在多设备上同步您的记录</div>
          </div>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">邮箱</InputLabel>
              <Input id="email" name="email" autoComplete="email" onChange={this.handleChange('email')} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">密码</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleChange('password')}
              />
            </FormControl>
            <Button
              type="submit"
              onClick={this.handleSubmit}
              fullWidth
              variant="outlined"
              size="large"
              color="primary"
              className={classes.submit}
            >
              登陆
            </Button>
            <div className={classes.bottomContainer}>
              <span className={classes.tips}>还没有账号？</span>
              <span className={classes.textBtn} onClick={this.handleRegisterOpen}>
                立即注册
              </span>
            </div>
          </form>
        </div>
        <Dialog
          open={this.state.registerOpen}
          onClose={this.handleRegisterClose}
          fullScreen
          transitionDuration={300}
          TransitionComponent={Transition}
        >
          <Register onClose={this.handleRegisterClose} />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
