import React, { Component } from 'react';
import { Button, List, ListItemText, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import ListItem from '@material-ui/core/ListItem';

const styles = {
  header: {
    width: '100%',
    top: 0,
    position: 'fixed',
    color: '#9a9a9a',
    backgroundColor: 'white',
    height: 46,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row'
  },
  root: {
    marginTop: 40
  }
};

@inject('groupStore', 'routingStore')
@observer
class GroupList extends Component {
  handleGroupDetail = id => () => {
    this.props.routingStore.push(`/group/${id}`);
  };
  render() {
    const { classes, onClose } = this.props;
    return (
      <div>
        <div className={classes.header}>
          <Button onClick={onClose}>back</Button>
        </div>
        <div className={classes.root}>
          <List>
            {this.props.groupStore.groups.map(i => (
              <ListItem button key={i.id} onClick={this.handleGroupDetail(i.id)}>
                <ListItemText primary={i.title} />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GroupList);
