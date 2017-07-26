import React from 'react';
import PropTypes from 'prop-types';

function Connect(getInitData, getSubject, getSubscribe) {
  const getInitDataMethod = getInitData;
  const getSubjectMethod = getSubject;
  const getSubscribeMethod = getSubscribe;
  return function (WrappedComponent) {
    class ConnectedComponent extends React.Component {
      constructor(props) {
        super(props);
        const dataTree = this.props.$data;
        const initData = getInitDataMethod(dataTree);
        this.state = {
          initData,
        };
      }
      componentWillMount() {
        const subscribes = this.props.$subscribes;
        const targetSubscribe = getSubscribeMethod(subscribes);
        const setState = this.setState.bind(this);
        targetSubscribe.subscribe(newData => setState({ initData: newData }));
      }
      shouldComponentUpdate() {
        return true;
      }
      componentWillUnmount() {
        const subscribes = this.props.subscribes;
        const targetSubscribe = getSubscribeMethod(subscribes);
        targetSubscribe.unsubsrcibe();
      }
      render() {
        const subjects = this.props.$subjects;
        const targetSubject = getSubjectMethod(subjects);
        const initData = this.state;
        return (
          <WrappedComponent initData={initData} dispatch={targetSubject} />
        );
      }
    }
    ConnectedComponent.contextTypes = {
      $data: PropTypes.object,
      $subjects: PropTypes.object,
      $subscribes: PropTypes.object,
    };
    return ConnectedComponent;
  };
}

export default Connect;
