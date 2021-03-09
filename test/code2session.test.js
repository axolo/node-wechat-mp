'use strict';

const config = require('../config');
const WechatMp = require('../src');

const wechatMp = new WechatMp(config);

wechatMp.code2session({
  jsCode: process.argv[2],
}).then(res => {
  console.log(res);
});
