const Base = require('./base.js');
const store = require('../util/store.js');

module.exports = class extends Base {
  async getPvuvAction() {
    let startDate = this.get('startDate');
    let endDate = this.get('endDate');
    let errCode = 0;
    let errMsg = '';
    if (!startDate) {
      errMsg += "缺少开始日期";
      errCode = 1;
    }
    if (!endDate) {
      errMsg += "缺少结束日期";
      errCode = 1;
    }
    
    if (errCode == 1){
      this.fail(errCode,errMsg);
    }else{
      try{
        let data = await this.model('pvuv').where(`to_days(date) <= to_days('${endDate}') AND to_days(date) >= to_days('${startDate}')`).order('date DESC').select();
        const resultData = data.map(function(value) {
          const {date: date, baidu_pv: baidupv, baidu_uv: baiduuv, google_pv: googlepv,
            google_uv: googleuv, umeng_pv: umengpv, umeng_uv: umenguv} = value;
          return {date,baidupv,baiduuv,googlepv,googleuv,umengpv,umenguv};
        })
        this.success(resultData);
      }catch(e){
        this.fail(e);
      }
      
    }
    
  }

  async storePvuvAction() {
    // 只能由定时任务调用，否则会拒绝
    if (!this.isCli) return this.fail(1000,'deny');
    
    try {
      //昨天
      let yesterday = new Date();
      yesterday.setTime(yesterday.getTime()-24*3600*1000);
      let dayBeforeYes = new Date();
      dayBeforeYes.setTime(dayBeforeYes.getTime() - 2*24*3600*1000);
      //baidu统计如果起始日期一致，将返回24小时的数据，所以此处从前天开始
      let platform = 1;
      const baiduData = store.getBaiduPvuvFromAPI(dayBeforeYes,yesterday);
      this.model('pvuv').addDataArray(baiduData,platform);
      
      
      //google
      platform = 2;
      const googleData = await store.getGooglePvuvFromAPI(yesterday,yesterday);
      this.model('pvuv').addDataArray(googleData,platform);
      
    }catch (e) {
     console.log(e);
    }  
  }
  
};
