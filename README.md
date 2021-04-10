# node-wechat-mp

Wechat mini program SDK for Node.js.

## install

```bash
yarn install @axolo/node-wechat-mp
```

## api

### constructor(config)

config params

|      param       |                               description                                |
| ---------------- | ------------------------------------------------------------------------ |
| appId            | Wechat miniprogram appId, required                                       |
| appSecret        | Wechat miniprogram appSecret, required                                   |
| error            | error class, default `WechatMpError`                                     |
| cache            | token cache, default [cache-manager] single `memory` caching, ttl `7200` |
| http             | http client, default [axios]                                             |
| url              | request url of api                                                       |
| url.base         | base url, default https://api.weixin.qq.com/cgi-bin                      |
| url.token        | get token, default  https://api.weixin.qq.com/cgi-bin/token              |
| url.code2session | code2Session, default https://api.weixin.qq.com/sns/jscode2session       |

### code2session(params)

see [code2Session]

|  param    |        description        |
| --------- | ------------------------- |
| jsCode    | code of wx.login() result |
| grantType | authorization_code        |
| method    | GET                       |

return `Promise` of auth session

### decrypt(params)

see [signature]

|    param      |            description            |
| ------------- | --------------------------------- |
| sessionKey    | sessionKey of auth.code2session() |
| encryptedData | encrypted data                    |
| iv            | iv                                |

return `Object` of decrypted data

### token(options)

get [access token] from caching or request

|       param       |                  description                   |
| ----------------- | ---------------------------------------------- |
| options.method    | http method, default `GET`                     |
| options.grantType | OAuth2 grant type, default `client_credential` |

return `Object` of access token

### request(options)

request wechat api with access token by short url without base url

| params  |                 description                 |
| ------- | ------------------------------------------- |
| options | usage like [axios], but aliases NOT support |

return response data of wechat api

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

Add git ignored `test/config.json` as:

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
[access token]: https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
[cache-manager]: https://github.com/BryanDonovan/node-cache-manager
[axios]: https://github.com/axios/axios
