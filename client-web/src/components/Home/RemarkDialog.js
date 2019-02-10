import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FullScreenDialog } from '../utils';
import StackHeader from '../StackHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemSecondaryAction, ListSubheader, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/CheckRounded';
import DeleteIcon from '@material-ui/icons/CloseRounded';
import { inject, observer } from 'mobx-react';
const styles = {
  root: {
    width: '100%',
    paddingTop: 46
  },
  list: {
    marginTop: 10
  },
  input: {
    width: '100%',
    boxSizing: 'border-box'
  }
};

@inject('commonStore')
@observer
class RemarkDialog extends Component {
  state = {
    content: ''
  };

  handleChange = title => event => {
    this.setState({ [title]: event.target.value });
  };

  handleAdd = () => {
    const { remarks, onChange } = this.props;
    if (remarks.indexOf(this.state.content) !== -1) {
      this.props.commonStore.toggleSnackbar('不允许重复的备注', 'error');
      return;
    }
    onChange([...remarks, this.state.content]);
    this.setState({ content: '' });
  };

  handleDelete = item => () => {
    const { remarks, onChange } = this.props;
    onChange(remarks.filter(i => i !== item));
  };

  render() {
    const { classes, open, handleClose, remarks } = this.props;
    return (
      <FullScreenDialog open={open} white={true}>
        <StackHeader title="备注" handleClickLeft={handleClose} />
        <div className={classes.root}>
          <div style={{ padding: '0 20px' }}>
            <TextField
              classes={{ root: classes.input }}
              placeholder="请在此输入内容"
              value={this.state.content}
              onChange={this.handleChange('content')}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.handleAdd}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
          <List subheader={<ListSubheader>{`${remarks.length}条备注`}</ListSubheader>} classes={{ root: classes.list }}>
            {remarks.length === 0 ? (
              <div className="empty-tip">还没有备注呢</div>
            ) : (
              remarks.map((i, index) => (
                <ListItem key={index.toString()}>
                  <ListItemIcon>
                    <div>{index + 1}</div>
                  </ListItemIcon>
                  <ListItemText primary={i} />
                  <ListItemSecondaryAction>
                    <ListItemIcon>
                      <IconButton onClick={this.handleDelete(i)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemIcon>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(RemarkDialog);
