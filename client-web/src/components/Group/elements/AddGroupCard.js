import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Card, CardMedia, List, ListItem, TextField } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { FullScreenDialog } from '../../utils';
import StackHeader from '../../StackHeader';
import classNames from 'classnames';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/CloseRounded';
import CheckIcon from '@material-ui/icons/CheckRounded';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  root: {
    width: '100%',
    paddingTop: 46,
    paddingBottom: 46
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  inputInput: {
    margin: 16,
    boxSizing: 'border-box',
    color: blue
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
    //padding: 10,
    //margin:5
  },
  text1: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10
  },
  cardContent: {
    margin: '0 16px',
    width: '50%'
  },
  chip: {
    margin: theme.spacing.unit / 2
  }
});

@inject('groupStore')
@observer
class AddGroupCard extends React.Component {
  state = {
    chipData: [
      { key: 1, label: '周日', select: false },
      { key: 2, label: '周一', select: false },
      { key: 3, label: '周二', select: false },
      { key: 4, label: '周三', select: false },
      { key: 5, label: '周四', select: false },
      { key: 6, label: '周五', select: false },
      { key: 7, label: '周六', select: false }
    ],
    title: '',
    place: '',
    time: '',
    description: '',
    coverImg: 'http://timeline.infinitex.cn/img/db/4ff8ac99a823d54d144e0502f9ae19.jpg'
  };

  handleDelete = data => () => {
    this.setState(state => {
      const chipData = state.chipData.map(i => {
        if (i === data) {
          return { ...data, select: !data.select };
        }
        return i;
      });
      return { chipData };
    });
  };

  handleSubmit = () => {
    const { title, time, place, chipData, coverImg, description } = this.state;
    this.props.groupStore
      .submitGroupCard(
        title,
        chipData
          .filter(i => i.select)
          .map(i => i.key)
          .join(','),
        time,
        description,
        place,
        coverImg
      )
      .then(() => {
        this.props.handleClose();
      });
  };

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  validate = () => {
    const { title, time } = this.state;
    return Boolean(title) && Boolean(time);
  };

  render() {
    const { classes, open, handleClose } = this.props;

    return (
      <FullScreenDialog open={open}>
        <StackHeader
          title="添加群打卡"
          handleClickLeft={handleClose}
          handleClickRight={this.handleSubmit}
          rightTitle="提交"
          rightEnabled={this.validate()}
        />
        <div className={classes.root + ' ' + classes.container}>
          <List>
            <ListItem>
              <TextField
                onChange={this.onChange('title')}
                value={this.state.title}
                label="名称"
                className={classes.padd}
                fullWidth
              />
            </ListItem>
            <ListItem>
              <TextField
                onChange={this.onChange('place')}
                value={this.state.place}
                label="地点"
                className={classes.padd}
                fullWidth
              />
            </ListItem>

            <ListItem>
              <TextField
                value={this.state.time}
                id="time"
                onChange={this.onChange('time')}
                label="时间"
                type="time"
                fullWidth
                className={classes.padd}
                InputLabelProps={{ shrink: true }}
              />
            </ListItem>
            <ListItem>
              <div>
                {this.state.chipData.map(data => {
                  return (
                    <Chip
                      key={data.key}
                      label={data.label}
                      color={data.select ? 'primary' : 'default'}
                      onDelete={this.handleDelete(data)}
                      deleteIcon={data.select ? <DeleteIcon /> : <CheckIcon />}
                      className={classNames(classes.chip)}
                    />
                  );
                })}
              </div>
            </ListItem>
            <ListItem>
              <TextField
                value={this.state.description}
                label="简介"
                onChange={this.onChange('description')}
                className={classes.padd}
                multiline
                fullWidth
              />
            </ListItem>
          </List>
          <div className={classes.text1}>点击下方添加标题图片</div>
          <Card classes={{ root: classes.cardContent }}>
            <CardMedia className={classes.media + ' ' + classes.padd} image={this.state.coverImg} title="photo" />
          </Card>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(AddGroupCard);
