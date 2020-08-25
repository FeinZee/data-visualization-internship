import Mock from 'mockjs'

function getParameters(url){
    var index = url.lastIndexOf("?");
    var remain = url.substring(index+1,url.length);
    var arr = remain.split('&');
    var params = {};
    for (var i = 0; i < arr.length; i++) {
        var pair = arr[i].split('=');
        params[pair[0]] = pair[1];
        
    }
    return params;
}

Mock.mock(RegExp('http://localhost:8080/visualization/getPvuv'+'.*'), 'get', (options) => {
    var params = getParameters(options.url);
    let endBase = +new Date(params["endDate"]);
    let startBase = new Date(params["startDate"]);
    if (!endBase || !startBase) {
        alert("请求参数出错");
    }
    var data = [];
    for (let i = 0;;i++){
        var obj = {};
        var ans = new Date((endBase));
        endBase -= 1000 * 3600 * 24;
        
        if (ans.getTime() < startBase) {
            break;
        }
        obj.date = [ans.getFullYear(), ans.getMonth() + 1, ans.getDate()].join("-");
        obj.baidupv = Math.floor(Math.random()*65536);
        obj.baiduuv = Math.floor(Math.random()*65536);
        obj.googlepv = Math.floor(Math.random()*65536);
        obj.googleuv = Math.floor(Math.random()*65536);
        obj.umengpv = Math.floor(Math.random()*65536);
        obj.umenguv = Math.floor(Math.random()*65536);
        data.push(obj);
    }
   
    return data;
})

