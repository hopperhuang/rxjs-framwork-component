import React from 'react';
import ReactDOM from 'react-dom';
// AppContainer 是一个 HMR 必须的包裹(wrapper)组件
import { AppContainer } from 'react-hot-loader';

import App from './component/Hello';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};
render(App);

// 模块热替换的 API
// 设置 devServer: { hot: true } 使得 webpack 会暴露 module.hot API 给我们的代码
// 因此，我们可以使用 module.hot 钩子函数，来对指定资源启用 HMR（这里是 App.js）。
// 这里最重要的 API 是 module.hot.accept，它指定了如何处理对特定依赖的更改。
// 每当 src/components/App.js 或它的依赖文件发生改变，module.hot.accept 都将触发 render 方法。
// render 方法甚至会在 App.css 改变时触发，这是因为 App.css 包含在 App.js 中。
if (module.hot) {
  module.hot.accept('./component/Hello', () => {
    render(App);
  });
}
