'use strict';

const config = require('../config');
const WechatMp = require('../src');

const wechatMp = new WechatMp(config);

console.log(wechatMp);
