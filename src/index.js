'use strict';

const axios = require('axios');
const WechatMpError = require('./error');

class WechatMp {
  constructor(config) {
    const defaultConfig = {
      appId: '', // Wechat miniprogram appId
      appSecret: '', // Wechat miniprogram appSecret
      code2sessionUrl: 'https://api.weixin.qq.com/sns/jscode2session',
      http: axios,
      error: WechatMpError,
    };
    this.config = { ...defaultConfig, ...config };
    this.http = this.config.http;
    this.Error = this.config.error;
  }

  /**
   * **获取当前用户会话信息**
   *
   * 小程序
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * @param {Object} { jsCode, grantType } 请求参数
   * @return {Object} 当前用户会话，如：openid（用户唯一标志）、unionid（用户在开放平台的唯一标识符）
   * @memberof WechatSdk
   */
  async code2session({ jsCode, grantType = 'authorization_code', method = 'GET' }) {
    const { code2sessionUrl: url, appId, appSecret } = this.config;
    const params = { appid: appId, secret: appSecret, js_code: jsCode, grant_type: grantType };
    const { data } = await this.http({ method, url, params });
    if (!data) throw new this.Error('get auth session fail');
    if (data.errcode) throw new this.Error(JSON.stringify(data));
    return data;
  }
}

module.exports = WechatMp;
