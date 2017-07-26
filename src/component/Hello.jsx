import React from 'react';
import { Button } from 'antd';
import Connect from './Connect';

function List(props) {
  const list = props.list;
  const listeItem = list.map(item => <div>{item}</div>);
  return (
    <div>
      {listeItem}
    </div>
  );
}


class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
  }
  addItem() {
    const { dispatch } = this.props;
    dispatch.next('you click me??');
  }
  render() {
    const { initData } = this.props;
    return (
      <div>
        <Button onClick={this.addItem}>click me to add person</Button>
        <List list={initData} />
      </div>
    );
  }
}
const todoListModel = {
  initData: ['abc', 'def'],
  dataChangeMethod: (subject, initData) => subject.map(message => initData.push(message)),
};

export default Connect(todoListModel)(TodoList);
