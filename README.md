# node-wechat-mp

Wechat mini program SDK for Node.js.

## install

```bash
yarn install @axolo/node-wechat-mp
```

## api

### code2session(params)

see [code2Session]

|  params   |        description        |
| --------- | ------------------------- |
| jsCode    | code of wx.login() result |
| grantType | authorization_code        |
| method    | GET                       |

return `Promise` of auth session

### decrypt(params)

see [signature]

|    params     |            description            |
| ------------- | --------------------------------- |
| sessionKey    | sessionKey of auth.code2session() |
| encryptedData | encrypted data                    |
| iv            | iv                                |

return `Object` of decrypted data

## example

decrypt data.

```js
'use strict';

const WechatMp = require('@axolo/node-wechat-mp');

const config = {
  appId: 'YOUR_WECHAT_MINIPROGRAM_APPID',
  appSecret: 'YOUR_WECHAT_MINIPROGRAM_APPSECRET',
};

const wechatMp = new WechatMp(config);

const decrypted = wechatMp.decrypt({
  sessionKey: 'session_key of code2session()',
  encryptedData: 'base64 encrypted data',
  iv: 'base64 iv',
});

console.log(decrypted);
```

## test

### config

Add git ignored `config.json` to project directory as:

```json
{
  "appId": "YOUR_WECHAT_MINIPROGRAM_APPID",
  "appSecret": "YOUR_WECHAT_MINIPROGRAM_APPSECRET"
}
```

### run

See Wechat miniprogram [code2Session] to get js_code.

```bash
node test/code2session.test.js WECHAT_MINIPROGRAM_JS_CODE
```

### result

Success output like this:

```js
{
  session_key: 'WechatMiniprogram==',
  openid: 'WechatMiniprogramOpenid',
  unionid: 'WechatMiniprogramUnionid'
}
```

[code2Session]: https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
[signature]: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html
