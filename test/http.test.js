'use strict';

const WechatMp = require('../src');
const wechatMp = new WechatMp();

wechatMp.http({
  url: 'https://jsonplaceholder.typicode.com/users',
}).then(res => {
  console.log(res?.data);
}).catch(err => {
  console.error(err);
});
