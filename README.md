# data-visualization-internship

### 前端

##### 运行

```
cd datavisualization
npm install
npm run serve
```

### 后端

##### 运行

```
cd backend
npm install
npm start
```

##### 运行前

```js
// src/config/adpter.js
// 需要填入自己的数据库信息
// 表结构见 需求分析与设计.md
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'visualization', //数据库名称
    prefix: '',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: '3306',
    user: '', //mysql user
    password: '', //mysql password
    dateStrings: true
  }
};
```

##### 获取数据

用thinkjs的crontab 每天获取昨日的百度&谷歌数据，写在`visualization/getPvuvAction`中

https://thinkjs.org/zh-cn/doc/3.0/crontab.html

百度 api 

```js
// src/controller/visualization.js  中的 storePvuvAction 调用 /src/util/store.js 中的方法

// src/util/store.js 
const access_token = ""; // 百度统计个人access_token
const site_id = 0; // 查询的站点代码
// 以上变量需替换成自己的内容

function getBaiduPvuvFromAPI() {
    let data = [];
    let uri = "https://openapi.baidu.com/rest/2.0/tongji/report/getData?access_token="+access_token
    +"&site_id="+site_id+"&method=overview/getTimeTrendRpt&start_date="+startDate+"&end_date=" + 
    endDate+"&metrics=pv_count,visitor_count";
    let res = request('get',uri);
    data = JSON.parse(res.getBody('utf-8')).result.items;
    const result = formatData(data,1);
    return result;
}
```

谷歌 api

```js
// backend/src/util/store.js
const key = require('../config/key.json'); //凭据密钥
const VIEW_ID = "ga:xxxxxxxx"; //数据视图
// 需要开代理访问的话要修改下面两句，否则的话注释掉即可
process.env.HTTPS_PROXY = 'http://proxyhost:port';
google.options({ proxy: 'http://proxyhost:port' });
```



### 前端后端连接

方法一  CORS

```js
// backend/src/controller/base.js

module.exports = class extends think.Controller {
  __before() {
    this.header("Access-Control-Allow-Origin", "http://localhost:8080");  
    // 目前默认前端访问8080端口，要根据需求修改此处
  }
};

```

方法二 vue-cli的devServer

```js
//datavisualization/vue.config.js
devServer: {
      proxy: {
        '/visualization': {
          target: "http://localhost:8360",
          changeOrigin: true
        }
      }
    }
```

### 在线demo

https://feinzee.github.io/data-visualization-internship/#/pvuv

### 