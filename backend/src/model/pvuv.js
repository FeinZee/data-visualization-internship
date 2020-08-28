module.exports = class extends think.Model {

    async addDataArray(dataArray, platform){
        console.log("在平台"+ platform + "添加数据");
        for (let item of dataArray) {
            let data = await this.where({date: item[0]}).find();
            let pvuv = {};
            if (platform == 1) {
                pvuv["baidu_pv"] = item[1];
                pvuv["baidu_uv"] = item[2];
            }else if (platform == 2) {
                pvuv["google_pv"] = item[1];
                pvuv["google_uv"] = item[2];
            }
            else if (platform == 3) {
                pvuv["umeng_pv"] = item[1];
                pvuv["umeng_uv"] = item[2];
            }

            if(think.isEmpty(data)) {
                // 内容为空时的处理
                console.log("为空");
                let obj = {};
                obj.date = item[0];
                Object.assign(obj,pvuv);
                this.add(obj);
                
            }else{
                console.log("不空");
                this.where({date: item[0]}).update(pvuv);
            }
        }   
    }

    whereEarlier(endDate){
        return this.where('to_days(date) <= to_days('+endDate+')').select();
    }
    
    whereLater(startDate){
        return this.where('to_days(date) >= to_days('+startDate+')').select();
    }
};
