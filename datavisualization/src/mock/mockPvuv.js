import Mock from 'mockjs'
import randomPositiveInt from '../util/util.js'

function getParameters(url){
    const index = url.lastIndexOf("?");
    const remain = url.substring(index+1,url.length);
    const arr = remain.split('&');
    let params = {};
    arr.forEach(function(value){
        const pair = value.split('=');
        params[pair[0]] = pair[1];
    })
    return params;
}


Mock.mock(RegExp('http://localhost:8080/visualization/getPvuv'+'.*'), 'get', (options) => {
    const params = getParameters(options.url);
    let endBase = +new Date(params["endDate"]);
    const startBase = new Date(params["startDate"]);
    if (!endBase || !startBase) {
        alert("请求参数出错");
    }
    let data = [];
    let ans = new Date(endBase);
    while(ans.getTime() >= startBase) {
        let obj = {};
        obj.date = [ans.getFullYear(), ans.getMonth() + 1, ans.getDate()].join("-");
        obj.baidupv = randomPositiveInt(65536);
        obj.baiduuv = randomPositiveInt(65536);
        obj.googlepv = randomPositiveInt(65536);
        obj.googleuv = randomPositiveInt(65536);
        obj.umengpv = randomPositiveInt(65536);
        obj.umenguv = randomPositiveInt(65536);
        data.push(obj);

        endBase -= 1000 * 3600 * 24;
        ans = new Date((endBase));
        
    }
   
    return data;
})

