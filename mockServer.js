let express = require('express');   //引入express
let Mock = require('mockjs');       //引入mock

let app = express();        //实例化express

app.get('/visualization/getPvuv',function(req, res){
    // let i = 0;
    let endBase = +new Date(req.query.endDate);
    let startBase = new Date(req.query.startDate);
    console.log(req.query)
    res.json(Mock.mock({
        "summarizedData": function() {
            var bags = []
            for (let i = 0;;i++){
                var obj = {}
                var ans = new Date((endBase));
                endBase -= 1000 * 3600 * 24;
                
                if (ans.getTime() < startBase) {
                    break;
                }
                obj.date = [ans.getFullYear(), ans.getMonth() + 1, ans.getDate()].join("-");
                obj.baiduPv = Math.floor(Math.random()*65536);
                obj.baiduUv = Math.floor(Math.random()*65536);
                obj.googlePv = Math.floor(Math.random()*65536);
                obj.googleUv = Math.floor(Math.random()*65536);
                obj.umengPv = Math.floor(Math.random()*65536);
                obj.umengUv = Math.floor(Math.random()*65536);
                
                bags.push(obj)
            }
            return bags;
        }
    }))
})

app.listen('8090', () => {
    console.log('监听端口 8090')
})