'use strict';

const WechatMp = require('../src');
const config = require('./config');

const wechatMp = new WechatMp(config);

wechatMp.request({
  url: '/user/info',
  params: {
    openid: config.openid,
  },
}).then(res => {
  console.log(res);
});
