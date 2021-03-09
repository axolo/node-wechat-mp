'use strict';

const crypto = require('crypto');
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

  /**
   * **解密数据**
   *
   * @param {Object} params { appId, sessionKey, encryptedData, iv }
   * @return {Object} 解密后的数据
   * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html
   * @memberof WechatService
   */
  decrypt(params) {
    const { sessionKey, encryptedData, iv } = params;
    const sessionKeyBuffer = Buffer.from(sessionKey, 'base64');
    const encryptedDataBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyBuffer, ivBuffer);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    let decoded = decipher.update(encryptedDataBuffer, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);
    if (decoded.watermark?.appid !== this.config.appId) {
      throw new this.Error('invalid appId');
    }
    return decoded;
  }
}

module.exports = WechatMp;
