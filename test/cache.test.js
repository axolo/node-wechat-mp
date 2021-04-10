'use strict';

const WechatMp = require('../src');
const config = require('./config');

const wechatMp = new WechatMp(config);

wechatMp.cache.set('now', Date.now());
wechatMp.cache.get('now').then(res => console.log(res));
