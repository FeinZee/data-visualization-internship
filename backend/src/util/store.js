var fs = require("fs");
var request = require("sync-request");

const umengfile = "./src/util/umeng.csv";

// 百度api
const access_token = ""; // 百度统计个人access_token
const site_id = 0; //查询的站点代码


// 谷歌api
const {google} = require('googleapis');
const key = require('../config/key.json');
const VIEW_ID = "ga:xxxxxxxx";
process.env.HTTP_PROXY = 'http://proxyhost:port';  // proxy non-SSL requests


function getBaiduPvuvFromAPI(startTime, endTime) {
    const startDate = startTime.format("yyyyMMdd");
    const endDate = endTime.format("yyyyMMdd");
    let data = [];
    let uri = "https://openapi.baidu.com/rest/2.0/tongji/report/getData?access_token="+access_token
    +"&site_id="+site_id+"&method=overview/getTimeTrendRpt&start_date="+startDate+"&end_date=" + 
    endDate+"&metrics=pv_count,visitor_count";
    let res = request('get',uri);
    data = JSON.parse(res.getBody('utf-8')).result.items;
    const result = formatData(data,1);
    return result;

}

async function getGooglePvuvFromAPI(startTime, endTime) {
    // const startDate = startTime.format("yyyy-MM-dd");
    // const endDate = endTime.format("yyyy-MM-dd");
    const startDate = "2020-07-19";
    const endDate = "2020-09-10";

    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        [
          "https://www.googleapis.com/auth/analytics",
          "https://www.googleapis.com/auth/analytics.readonly",
        ],
        null
    );

    let options = {
        auth: jwtClient,
        ids: VIEW_ID,
        metrics: "ga:pageviews,ga:newUsers",
        dimensions: "ga:date",
        "start-date": startDate, //查询时间区间
        "end-date": endDate
      };
    
    const res = await google.analytics("v3").data.ga.get(options);
    console.log(res.data.rows)
    const result = formatData((res.data.rows),2);
    return result;

}

function getUmengPvuvFromFile() {
    let dataArray = [];
    let data = fs.readFileSync(umengfile);
    data = data.toString();
    let rows = new Array();
    rows = data.split("\r\n");
    for (var i = 6; i < rows.length-2; i++) {
        dataArray.push(rows[i].split(","));
    }
    const result = formatData(dataArray,3);
    return result;
}


/* 把不同的数据格式转化为：
   [[date,pv,uv],[],[],...]
*/
function formatData(data, platform) {
    let result = [];
    if (platform == 1) {
        //百度
        //输入格式[[[date],[date],...],[[pv,uv],[pv,uv],...],[],[]]
        const dates = data[0];
        const numbers = data[1];
        result = data[0].map(function(value) {
            return value;
        });

        result.forEach(function(value,item) {
            let pv = numbers[item][0];
            let uv = numbers[item][1];
            value.push(pv == '--' ? 0 : pv, uv == '--' ? 0 : uv);
        })
    }
    else if (platform == 2) {
        //谷歌
        //输入格式：[[date,pv,uv],[]...[]]
        result = data.map(function(value){
            value[1] = parseInt(value[1]);
            value[2] = parseInt(value[2]);
            return value;
        })
    }
    else if (platform == 3) {
        //友盟
        //输入格式：[[date,pv,uv],[]...[]]
        result = data.map(function(value){
            value[1] = parseInt(value[1]);
            value[2] = parseInt(value[2]);
            return value;
        })
        
    }
    return result;
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


module.exports = {
    getBaiduPvuvFromAPI,
    getGooglePvuvFromAPI,
    getUmengPvuvFromFile
}
