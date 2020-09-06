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

  storePvuvAction() {
    let platform = this.get('platform');
    if (!platform) {
      this.body = "缺少平台信息";
    }
    try {
      if (platform == 1) {
        //百度统计
        const baiduData = store.getBaiduPvuvFromAPI();
        this.model('pvuv').addDataArray(baiduData,platform);
        this.body = baiduData;
        
      }
      else if (platform == 2) {
        //谷歌统计
        const googleData = store.getGooglePvuvFromAPI();
        this.body = googleData;
      }
      else if (platform == 3) {
        //友盟统计
        const umengData = store.getUmengPvuvFromFile();
        this.body = umengData;
        this.model('pvuv').addDataArray(umengData,platform);
      }else{
        this.body = "平台信息错误";
      }
    }catch(e){
      this.body = e;
      this.fail(e);
    }
  }
};
