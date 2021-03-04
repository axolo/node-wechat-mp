'use strict';

const config = require('../config');
const WechatMp = require('../src');

const wechatMp = new WechatMp(config);
const jsCode = process.argv.slice(2)?.[0];

wechatMp.code2session({
  jsCode,
}).then(res => {
  console.log(res);
});
