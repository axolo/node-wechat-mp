'use strict';

const WechatMp = require('../src');
const wechatMp = new WechatMp();

throw new wechatMp.Error('test WechatMp Error');
