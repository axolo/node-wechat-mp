'use strict';

const WechatMp = require('../src');
const config = require('./config');

const wechatMp = new WechatMp(config);

wechatMp.code2session({
  jsCode: process.argv[2],
}).then(res => {
  console.log(res);
});
