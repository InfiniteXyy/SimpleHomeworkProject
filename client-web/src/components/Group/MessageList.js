import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import AlarmIcon from '@material-ui/icons/AlarmOutlined';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';

import { Card, CardContent, CardHeader, IconButton } from '@material-ui/core';
import reactStringReplace from 'react-string-replace';
import moment from 'moment';
import AddTodo from '../Home/AddTodo';
import withStyles from '@material-ui/core/styles/withStyles';

import StarIcon from '@material-ui/icons/StarBorderRounded';
import ReadIcon from '@material-ui/icons/AssistantPhotoOutlined';

const defaultValue = {
  avatar: 'https://i0.wp.com/ebus.ca/wp-content/uploads/2017/08/profile-placeholder.jpg?ssl=1'
};

const typeNames = {
  todo: '新的作业'
};

const styles = {
  card: {
    borderRadius: 8,
    border: 'solid 0.5px #E7E7E7',
    margin: '10px 10px 0'
  },
  cardContent: {
    padding: '0 16px',
    '&:last-child': {
      paddingBottom: 16
    }
  },
  icon: {},
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 13,
    color: '#6a6a6a',
    fontWeight: '400'
  },
  content: {
    fontSize: 14
  },
  highlight: {
    fontSize: 14,
    color: '#4A90E2'
  },
  detail1: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: '#4a4a4a'
  },
  detail2: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: '#757575',
    marginTop: 10
  },
  time: {
    fontSize: 12,
    color: '#9b9b9b'
  },
  font1: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 8
  },
  iconFlash: {
    color: '#757575',
    height: 16,
    width: 16
  },
  container1: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between'
  },
  container2: {
    display: 'flex'
  },
  payload: {
    marginTop: 16,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 16
  },
  assign: {
    width: 16,
    height: 16,
    color: '#8B572A',
    marginRight: 8
  },
  alarm: {
    width: 16,
    height: 16,
    color: '#417505',
    marginRight: 8
  }
};

const Message = withStyles(styles)(props => {
  const { item, handleLike, handleAdd, classes } = props;
  let { payload } = item;
  if (payload !== undefined && payload !== '' && payload !== null) {
    payload = JSON.parse(payload);
    payload.deadlineFormat = moment(payload.deadlineAt).format('截止时间：M月D日 周dd H:mm');
  }

  return (
    <Card classes={{ root: classes.card }} elevation={0}>
      <CardHeader
        avatar={<Avatar src={item.author.image === '' ? defaultValue.avatar : item.author.image} />}
        title={item.author.username}
        subheader={`来自 ${item.groupTitle}`}
        action={
          <IconButton>
            <StarIcon />
          </IconButton>
        }
        titleTypographyProps={{ className: classes.title }}
        subheaderTypographyProps={{ className: classes.subtitle }}
      />
      <CardContent classes={{ root: classes.cardContent }}>
        <div className={classes.content}>
          {reactStringReplace(item.body, /(#.*?#)/g, (match, i) => (
            <span key={i} className={classes.highlight}>
              {match}
            </span>
          ))}
        </div>
        {payload && (
          <div className={classes.payload} onClick={handleAdd}>
            <div className={classes.detail1}>
              <AssignmentIcon className={classes.assign} />
              {payload.content}
            </div>
            <div className={classes.detail2}>
              <AlarmIcon className={classes.alarm} />
              {payload.deadlineFormat}
            </div>
          </div>
        )}
        <div className={classes.container1}>
          <div className={classes.container2}>
            <ReadIcon className={classes.iconFlash} />
            <div className={classes.font1}>标记为已读</div>
          </div>
          <div className={classes.time}>{moment(item.createdAt).fromNow()}</div>
        </div>
      </CardContent>
    </Card>
  );
});

// const loader = (
//   <div className="empty-list" key="empty-list">
//     加载中
//   </div>
// );

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: '',
      payload: undefined
    };
  }

  toggleDrawer = (type, payload = undefined) => () => {
    if (!payload) this.setState({ drawerOpen: type });
    else
      this.setState({ payload }, () => {
        this.setState({ drawerOpen: type });
      });
  };

  render() {
    const { messages } = this.props;

    if (!messages) {
      return <div className="empty-tip">加载中 ...</div>;
    }

    if (messages.length === 0) {
      return <div className="empty-tip">空空如也</div>;
    }
    return (
      // <InfiniteScroll initialLoad={false} loadMore={loadItems} hasMore={false} loader={loader}>
      <div className="message-list-container">
        {messages.map(i => (
          <Message
            item={i}
            key={i.id}
            handleLike={this.toggleDrawer('message')}
            handleAdd={this.toggleDrawer('addTodo', i.payload)}
          />
        ))}

        <AddTodo
          open={this.state.drawerOpen === 'addTodo'}
          onClose={this.toggleDrawer('')}
          payload={this.state.payload}
        />
      </div>
      // </InfiniteScroll>
    );
  }
}

export { MessageList, Message };
