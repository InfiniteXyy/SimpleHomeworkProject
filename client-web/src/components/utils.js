import React from 'react';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const SlideTransition = props => {
  return <Slide direction="left" {...props} />;
};

const styles = {
  paper: {
    backgroundColor: '#fafafa'
  }
};

const FullScreenDialog = withStyles(styles)(props => {
  const { children, open, classes } = props;
  return (
    <Dialog
      {...props}
      classes={{ paper: classes.paper }}
      fullScreen
      open={open}
      transitionDuration={300}
      TransitionComponent={SlideTransition}
    >
      {children}
    </Dialog>
  );
});

FullScreenDialog.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired
};

const ConfirmDialog = props => {
  const { open, onConfirm, onCancel, title, content } = props;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      {content ? (
        <DialogContent style={{ minWidth: 230 }}>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      ) : (
        <div />
      )}

      <DialogActions>
        <Button color="primary" onClick={onCancel}>
          取消
        </Button>
        <Button color="primary" onClick={onConfirm}>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string
};

export { SlideTransition, FullScreenDialog, ConfirmDialog };
