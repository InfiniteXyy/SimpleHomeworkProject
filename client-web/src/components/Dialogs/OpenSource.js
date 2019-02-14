import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import StackHeader from '../StackHeader';
import { FullScreenDialog } from '../utils';

const styles = {
  root: {
    width: '100%',
    paddingTop: 46
  }
};

const data = [
  { name: 'Babel', link: 'https://babeljs.io/' },
  { name: 'craco', link: 'https://github.com/sharegate/craco' },
  { name: 'material-ui', link: 'https://material-ui.com/' },
  { name: 'classnames', link: 'https://github.com/JedWatson/classnames' },
  { name: 'history', link: 'https://github.com/ReactTraining/history' },
  { name: 'mobx', link: 'https://mobx.js.org/' },
  { name: 'mobx-react', link: 'https://github.com/mobxjs/mobx-react' },
  { name: 'mobx-react-router', link: 'https://github.com/alisd23/mobx-react-router' },
  { name: 'moment', link: 'https://momentjs.com/' },
  { name: 'react', link: 'https://reactjs.org/' },
  { name: 'react-dom', link: 'https://reactjs.org/' },
  { name: 'react-infinite-scroller', link: 'https://github.com/CassetteRocks/react-infinite-scroller' },
  { name: 'react-router-dom', link: 'https://github.com/ReactTraining/react-router' },
  { name: 'create-react-app', link: 'https://github.com/facebook/create-react-app' },
  { name: 'react-string-replace', link: 'https://github.com/iansinnott/react-string-replace' },
  { name: 'react-swipeable-views', link: 'https://github.com/oliviertassinari/react-swipeable-views' },
  { name: 'superagent', link: 'https://github.com/visionmedia/superagent' },
  { name: 'superagent-promise', link: 'https://github.com/lightsofapollo/superagent-promise' }
];

class OpenSource extends Component {
  render() {
    const { classes, handleClose, open } = this.props;
    return (
      <FullScreenDialog open={open} white>
        <StackHeader handleClickLeft={handleClose} title="开源库" />
        <div className={classes.root}>
          <List>
            {data.map(i => (
              <ListItem key={i.name} button>
                <ListItemText primary={i.name} secondary={i.link} />
              </ListItem>
            ))}
          </List>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(OpenSource);
