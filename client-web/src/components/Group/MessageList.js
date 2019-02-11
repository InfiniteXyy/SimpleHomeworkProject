import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/PlaylistAddRounded';
import AlarmIcon from '@material-ui/icons/AlarmOutlined';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';

import './MessageList.css';
import { Divider } from '@material-ui/core';
import reactStringReplace from 'react-string-replace';

import classNames from 'classnames';
import moment from 'moment';
import AddTodo from '../Home/AddTodo';
import StarIcon from '@material-ui/icons/StarBorderRounded';

const defaultValue = {
  avatar: 'https://i0.wp.com/ebus.ca/wp-content/uploads/2017/08/profile-placeholder.jpg?ssl=1'
};

const typeNames = {
  todo: '新的作业'
};
const Message = props => {
  const { item, handleLike, handleAdd } = props;
  let { payload } = item;
  if (payload !== undefined && payload !== '' && payload !== null) {
    payload = JSON.parse(payload);
    payload.deadlineFormat = moment(payload.deadlineAt).format('M月D日 周dd H:mm 截止');
  }

  const bottomContainer = payload ? (
    <div>
      <Divider />
      <div className="message-payload">
        <div className="payload-type">
          {typeNames[payload.type]}
          <AddIcon className="more-icon" onClick={handleAdd} />
        </div>
        <div className="payload-content">
          <AssignmentIcon className={classNames('brown', 'icon')} />
          {payload.content}
        </div>
        <div className="payload-content">
          <AlarmIcon className={classNames('green', 'icon')} />
          {payload.deadlineFormat}
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
  return (
    <div className="message-container">
      <div className="message-header">
        <Avatar
          style={{ height: 44, width: 44 }}
          src={item.author.image === '' ? defaultValue.avatar : item.author.image}
        />
        <div className="header-right">
          <div className="author-name">{item.author.username}</div>
          <div className="author-from">来自 {item.groupTitle}</div>
        </div>

        <div className="more-icon-container">
          <StarIcon className="more-icon" onClick={handleLike} />
        </div>
      </div>

      <div className="message-body">
        <p>
          {reactStringReplace(item.body, /(#.*?#)/g, (match, i) => (
            <span key={i} className="highlight">
              {match}
            </span>
          ))}
        </p>
      </div>
      {bottomContainer}
    </div>
  );
};

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
      return <div className="empty-list">加载中 ...</div>;
    }

    if (messages.length === 0) {
      return <div className="empty-list">空空如也</div>;
    }
    return (
      // <InfiniteScroll initialLoad={false} loadMore={loadItems} hasMore={false} loader={loader}>
      <div>
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
