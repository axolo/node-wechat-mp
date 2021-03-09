'use strict';

const config = require('../config');
const WechatMp = require('../src');

const wechatMp = new WechatMp(config);

const decrypted = wechatMp.decrypt({
  sessionKey: process.argv[2],
  encryptedData: process.argv[3],
  iv: process.argv[4],
});

console.log(decrypted);
