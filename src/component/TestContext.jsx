import PropTypes from 'prop-types';
import React from 'react';

function Button() {
  return (
    <button style={{ background: this.context.color }}>
      {this.props.children}
    </button>
  );
}
Button.contextTypes = {
  color: PropTypes.string,
};

function Message() {
  return (
    <div>
      {this.props.text} <Button>Delete</Button>
    </div>
  );
}

class MessageList extends React.Component {
  getChildContext() {
    return { color: 'purple' };
  }

  render() {
    const children = this.props.messages.map(message =>
      <Message text={message.text} />,
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string,
};
export default MessageList;
