'use strict';

const WechatMpError = require('./error');

class WechatMp {
  constructor(config) {
    this.config = config;
    this.Error = WechatMpError;
  }
}

module.exports = WechatMp;
