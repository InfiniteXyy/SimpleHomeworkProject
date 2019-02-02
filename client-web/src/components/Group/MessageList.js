import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import MoreIcon from '@material-ui/icons/ExpandMoreRounded';

import './MessageList.css';

const defaultValue = {
  avatar: 'https://i0.wp.com/ebus.ca/wp-content/uploads/2017/08/profile-placeholder.jpg?ssl=1'
};

const Message = props => {
  const { item } = props;
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
          <MoreIcon className="more-icon" />
        </div>
      </div>

      <div className="message-body">
        <p>{item.body}</p>
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

export { MessageList, Message };
