import React from 'react';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';

import './MessageList.css';

const defaultValue = {
  avatar: 'https://i0.wp.com/ebus.ca/wp-content/uploads/2017/08/profile-placeholder.jpg?ssl=1'
};

const Message = props => {
  const { item } = props;
  return (
    <div className="message-container">
      <Avatar
        style={{ width: 32, height: 32, marginRight: 16 }}
        src={item.author.image === '' ? defaultValue.avatar : item.author.image}
      />
      <div className="right-container">
        <div className="message-header">
          <div>
            <strong>{item.author.username}</strong>
            <span>{`@${item.author.username}`}</span>
          </div>
          <span className="message-date">{moment(item.createdAt).fromNow()}</span>
        </div>
        <p>{item.body}</p>
        {item.imageUrl ? <img alt="img" style={{ maxHeight: 220 }} src={item.imageUrl} /> : null}
      </div>
    </div>
  );
};

const MessageList = props => {
  const { messages } = props;
  if (!messages) {
    return null;
  }

  if (messages.length === 0) {
    return <div className="empty-list">空空如也</div>;
  }

  return (
    <div>
      {messages.map(i => (
        <Message item={i} key={i.id} />
      ))}
    </div>
  );
};

export default MessageList;
