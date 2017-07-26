import React from 'react';
import PropTypes from 'prop-types';

class Provider extends React.Component {
  getChildContext() {
    const { data, subjects, subscribes } = this.props;
    return {
      $data: data,
      $subjects: subjects,
      $subscribes: subscribes,
    };
  }
  render() {
    return this.props.children;
  }
}
Provider.childContextTypes = {
  $data: PropTypes.object,
  $subjects: PropTypes.object,
  $subscribes: PropTypes.object,
};
