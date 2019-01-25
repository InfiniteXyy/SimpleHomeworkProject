import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import { inject, observer } from 'mobx-react';

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
@inject('authStore')
@observer
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: ''
    };
  }

  handleChange = target => event => {
    this.setState({ [target]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.authStore.setEmail(this.state.email);
    this.props.authStore.setPassword(this.state.password);
    this.props.authStore.setUsername(this.state.username);
    this.props.authStore.register();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.titleGroup}>
            <div className={classes.bigTitle}>注册</div>
            <div className={classes.subTitle}>欢迎来到简记作业</div>
          </div>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">邮箱</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus onChange={this.handleChange('email')} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">用户名</InputLabel>
              <Input id="username" name="username" onChange={this.handleChange('username')} />
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
              注册
            </Button>
            <div className={classes.bottomContainer}>
              <span className={classes.tips}>已经有账号了？</span>
              <span className={classes.textBtn} onClick={this.props.onClose}>
                立即登陆
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Register);
