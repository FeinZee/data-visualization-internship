var fs = require("fs");
var request = require("sync-request");

const umengfile = "./src/util/umeng.csv";
const access_token = ""; // 百度统计个人access_token
const site_id = 0; //查询的站点代码
const startDate = "20200720";
const endDate = "20200827";


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

function getGooglePvuvFromAPI() {
    let data = [];
    
    return data;
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


module.exports = {
    getBaiduPvuvFromAPI,
    getGooglePvuvFromAPI,
    getUmengPvuvFromFile
}
