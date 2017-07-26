import React from 'react';
import Rx from 'rxjs/Rx';

const Subject = Rx.Subject;

// 将Model中的信息更改为用Provider的方式注入。
function Connect(model) {
  const { initData } = model;
  const { dataChangeMethod } = model;
  const ownSubject = new Subject();
  // next 先触发这个。
  const outerSubscribe = dataChangeMethod(ownSubject, initData);
  return function (Component) {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      componentWillMount() {
        this.state.initData = initData;
        const setState = this.setState.bind(this);
        // map 之后触发subscribe
        outerSubscribe.subscribe(() => setState({ initData }));
      }
      shouldComponentUpdate() {
        return true;
      }
      render() {
        const data = this.state.initData;
        return (
          <Component initData={data} dispatch={ownSubject} />
        );
      }
    };
  };
}

function Model(models) {
  // 从Model里面读取data
  function getData(model) {
    const data = {};
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        data[key] = model[key].data;
      }
    }
    return data;
  }
  // 从model里面读取subscribes
  function getSubscribes(model) {
    const subscribes = [];
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        const subscribe = model[key].subscribe;
        for (let index = 0; index < subscribe.length; index += 1) {
          subscribes.push(subscribe[index]);
        }
      }
    }
    return subscribes;
  }
  // 根据data的数据结构，构造相应的subject
  function makeSubject(dataModel) {
    const subject = {};
    function mapObjectToSubject(model, subj) {
      const modelWaitToMap = model;
      const subjectWaitToMap = subj;
      subjectWaitToMap._subject = new Subject();
      // 递归调用，添加_subject到对象。
      if (typeof modelWaitToMap === 'object' && !Array.isArray(modelWaitToMap)) {
        for (const key in modelWaitToMap) {
          if (modelWaitToMap.hasOwnProperty(key)) {
            subjectWaitToMap[key] = {};
            mapObjectToSubject(modelWaitToMap[key], subjectWaitToMap[key]);
          }
        }
      }
    }
    mapObjectToSubject(dataModel, subject);
    return subject;
  }
  // 根据data数据结构，构造相应结构的subscribes
  function makeSubscribeModel(data) {
    const rawData = data;
    const subscribeModel = {};
    function makeStructure(dataRaw, structure) {
      const struc = structure;
      if (typeof dataRaw === 'object' && !Array.isArray(dataRaw)) {
        for (const key in dataRaw) {
          if (dataRaw.hasOwnProperty(key)) {
            struc[key] = {};
            makeStructure(dataRaw[key], struc[key]);
          }
        }
      }
    }
    makeStructure(rawData, subscribeModel);
    return subscribeModel;
  }
  // 调用收集好的subscribes,在对应的对象下增加_subscribe
  function mapSubscribeToStructure(subscribes, subject, data, structure) {
    function getObject(keys, object) {
      let targetObject = object;
      for (let index = 0; index < keys.length; index += 1) {
        targetObject = targetObject[keys[index]];
      }
      return targetObject;
    }
    const keyRegular = /([^/]+)/g;
    for (let index = 0; index < subscribes.length; index += 1) {
      const subscribe = subscribes[index];
      const { key, method } = subscribe;
      const keys = key.match(keyRegular);
      const targetData = getObject(keys, data);
      const targetSubject = getObject(keys, subject)._subject;
      const targetSubscribe = getObject(keys, structure);
      targetSubscribe._subscribe = method(targetSubject, targetData);
    }
  }
  const subscribes = getSubscribes(models);
  const data = getData(models);
  const subject = makeSubject(data);
  const structure = makeSubscribeModel(data);
  mapSubscribeToStructure(subscribes, subject, data, structure);
  return {
    data,
    subjects: subject,
    subscribes: structure,
  };
}
const subModel1 = {
  // 定义
  data: {
    country: {
      name: 'china',
      area: 960,
    },
    continent: 'asia',
    people: [5, 6, 7],
  },
  subscribe: [
    {
      // 根据Key来设定订阅方法。
      key: 'subModel1/country/name',
      // method方法接受两个对象，subject对象是特定key值的subject,
      // data 对象是data数据中，特定key对象。
      // 每个subject只接受一个方法。
      method: (subject, data) => subject.map(() => data),
    },
  ],
};
const mainModel = {
  subModel1,
};
// subscribes和subjects根据data数据结构来形成。
// 获取subscribe的方法 subscribes[key1][key2]._subscribe
// 获取subject的方法 subjects[key1][key2]._subject
const { subjects, subscribes } = Model(mainModel);
console.log(subjects);
console.log(subscribes);
subscribes.subModel1.country.name._subscribe.subscribe(x => console.log(x));
subjects.subModel1.country.name._subject.next('send a message');

export default Connect;
