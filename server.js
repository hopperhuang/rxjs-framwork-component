const express = require('express');

const app = express();
// 所有静态资源都要从dist来请求,定义静态资源入口为dist文件夹。
// 也就是说，当网页访问localhost:3000/assets.a.js的时候，实际访问的是localhost:3000/dist/assets.a.js
app.use(express.static('dist'));
// 先拦截ajax对后端数据的请求
// 再拦截对所有其他页面的请求。
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
