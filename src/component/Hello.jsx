import React from 'react';
import { Button } from 'antd';
import Rx from 'rxjs/Rx';

const Subject = Rx.Subject;
const listSubject = new Subject();
const initListData = ['abc', 'def'];
const outerSubscribe = listSubject.map(message => initListData.push(message));
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
    this.state = {};
  }
  componentWillMount() {
    const listData = initListData;
    this.state.list = listData;
    const setState = this.setState.bind(this);
    outerSubscribe.subscribe(() => setState({ list: initListData }));
  }
  shouldComponentUpdate() {
    return true;
  }
  addItem() {
    console.log(this);
    listSubject.next('u clicke me???');
  }
  render() {
    const list = this.state.list;
    return (
      <div>
        <Button onClick={this.addItem}>click me to add item</Button>
        <List list={list} />
      </div>
    );
  }
}

export default TodoList;
