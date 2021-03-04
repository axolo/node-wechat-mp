# node-wechat-mp

Wechat mini program SDK for Node.js.

## install

```bash
yarn install @axolo/node-wechat-mp
```

## example

Get auth seesion.

```js
'use strict';

const WechatMp = require('@axolo/node-wechat-mp');

const config = {
  appId: 'YOUR_WECHAT_MINIPROGRAM_APPID',
  appSecret: 'YOUR_WECHAT_MINIPROGRAM_APPSECRET',
};

const wechatMp = new WechatMp(config);

wechatMp.code2session({
  jsCode: 'WECHAT_MINIPROGRAM_JS_CODE',
}).then(res => {
  console.log(res);
});
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
yarn test WECHAT_MINIPROGRAM_JS_CODE
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
