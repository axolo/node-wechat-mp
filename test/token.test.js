'use strict';

const WechatMp = require('../src');
const config = require('./config');

const wechatMp = new WechatMp(config);

wechatMp.token().then(res => {
  console.log(res);
});
