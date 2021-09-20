'use strict';

const crypto = require('crypto');
const cacheManager = require('cache-manager');
const axios = require('axios');
const WechatMpError = require('./error');

class WechatMp {
  constructor(config) {
    const defaultConfig = {
      error: WechatMpError,
      cache: cacheManager.caching({ store: 'memory', ttl: 7200 }),
      http: axios,
      appId: '', // Wechat miniprogram appId
      appSecret: '', // Wechat miniprogram appSecret
      url: {
        base: 'https://api.weixin.qq.com',
        token: 'https://api.weixin.qq.com/cgi-bin/token',
        code2session: 'https://api.weixin.qq.com/sns/jscode2session',
      },
    };
    this.config = {
      ...defaultConfig,
      ...config,
      url: {
        ...defaultConfig.url,
        ...config.url,
      },
    };
    this.Error = this.config.error;
    this.cache = this.config.cache;
    this.http = this.config.http;
  }

  /**
   * **获取当前用户会话信息**
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * @param {Object} options 请求参数
   * @return {Object} 当前用户会话，如：openid（用户唯一标志）、unionid（用户在开放平台的唯一标识符）
   * @memberof WechatSdk
   */
  async code2session(options = {}) {
    const { jsCode, grantType = 'authorization_code', method = 'GET' } = options;
    const url = this.config.url.code2session;
    const { appId, appSecret } = this.config;
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

  /**
   * **获取令牌**
   *
   * @param {Object} options 请求参数
   * @return {Object} 令牌
   * @see https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
   * @memberof WechatMp
   */
  async token(options = {}) {
    const { appId, appSecret } = this.config;
    const cache = await this.cache.get(appId);
    if (cache) return cache;
    const { grantType = 'client_credential', method = 'GET' } = options;
    const url = this.config.url.token;
    const params = { appid: appId, secret: appSecret, grant_type: grantType };
    const { data } = await this.http({ method, url, params });
    if (!data) throw new this.Error('get access token fail');
    if (data.errcode) throw new this.Error(JSON.stringify(data));
    const token = await this.cache.set(appId, data);
    return token;
  }

  /**
   * **请求微信API**
   *
   * @param {Object} options 请求参数，其中url为短格式
   * @return {Object} 请求返回
   * @memberof WechatMp
   */
  async request(options = {}) {
    if (!options.method) options.method = 'GET';
    options.url = this.config.url.base + options.url;
    const { access_token } = await this.token();
    const params = Object.assign({ access_token }, options.params);
    const { data } = await this.http({ ...options, params });
    if (!data) throw new this.Error('request fail');
    if (data.errcode) throw new this.Error(JSON.stringify(data));
    return data;
  }
}

module.exports = WechatMp;
