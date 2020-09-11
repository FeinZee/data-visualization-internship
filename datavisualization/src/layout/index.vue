<template>
  <div id="layout">
    <div id="floating-bar">
      <p class="inline">时间：</p>
      <c-date-picker v-model="timeValue" @change="change" :start-placeholder="timeValue[0]" 
      :end-placeholder="timeValue[1]" type="daterange" :setCellDisabled="setCellDisabledDate"/>
    </div>
    <section id="chart-region">
      <h4 class="tag" id="tag1"><p>多日趋势对比图</p></h4>
      <line-chart v-loading:[loadingArgs]="loading" ref="lineChart" id="line-chart"></line-chart>
    </section>
    <section id="table-region">
      <h4 class="tag" id="tag2"><p>多日数据汇总表</p></h4>
      <data-table v-loading:[loadingArgs]="loading" ref="table" id="table"></data-table>
    </section>
    <c-menu id="menu" mode="vertical" theme="dark" :collapsed="collapsed" active-name="1">
      <c-menu-item name="1">
        <c-icon-data-trend />
        PVUV
      </c-menu-item>     
      <c-menu-item name="2" disabled>
        <c-icon-more />
        其他
      </c-menu-item>
    </c-menu>
  </div>
</template>


<script>
import LineChart from "../components/LineChart.vue"
import Table from "../components/Table.vue"
export default {
  name: "Layout",
  data() {
    return {
      collapsed: true,
      timeValue: [],
      startDate: "",
      endDate: "",
      loading: false,
      loadingArgs: {
          text: '数据正在加载中，请稍后'
        }
    }
  },
  components: {
    'line-chart': LineChart,
    'data-table': Table
  },
  methods: {
    change() {
      // 用户进行清空操作时，value长度为0
      if (this.timeValue.length == 2){
        this.getData(this.timeValue[0],this.timeValue[1]);
      }
    },
    setCellDisabledDate(value){
      return value < new Date("2020-07-19") || value >= new Date()-24*3600*1000;
    },
    openNotification(placement,myTitle,msg,myType) {
      this.$notification({
        title: myTitle,
        type: myType,
        description: msg,
        placement,
        duration: 10*1000
      })
    },
    getData(start,end){
      this.changeData(1);//告知视图:数据开始加载
     
      this.$axios.get('visualization/getPvuv?endDate='+end+"&startDate="+start).then(res => {
        console.log(res);
        if (res.data.errno == 0) {
          this.changeData(0,res.data.data);
        }
        else {
          //有异常
          this.changeData(2,[],res.data.errmsg);
        }
      }).catch(info => {
        this.changeData(2,[],info);
      })
     
      
    },
    changeData(state,data){
      if (state == 1){
        //加载状态
        this.loading = true;
      }
      else if(state == 2){
        //异常
        this.loading = false;
        this.$refs.table.dataSource = [];
        this.$refs.lineChart.pvData = [];
        this.$refs.lineChart.uvData = [];
        this.$refs.lineChart.dataChanged();
        this.openNotification('top-left','提示','暂无数据,请尝试重新选择起始时间或刷新页面！','info');
      }
      else{
        this.loading = false;
        this.$refs.table.dataSource = data;
        if (data.length == 0) {
          this.openNotification('top-left','提示','暂无数据,请尝试重新选择起始时间！','info');
        }
        let pv = [];
        let uv = [];
        const interval = Math.floor((data.length -1)/ 15);
        let curIndex = interval;
        for (let record of data.reverse()) {
          let date = record["date"];
          const hintDate = date;
          let showDate = date;
          if (data.length >= 30){
            date = date.substring(5,date.length); //不显示年份
            showDate = date;
          }else{
            if (curIndex == interval) {
              curIndex = 0;
            }else{
              const index = date.lastIndexOf("-");
              showDate = date.substring(index+1,date.length);
              curIndex++;
            }
          }
          
          
          pv.push({"date": showDate,"platform": "百度统计","number": record["baidupv"], "hintDate": hintDate});
          pv.push({"date": showDate,"platform": "谷歌统计","number": record["googlepv"], "hintDate": hintDate});
          pv.push({"date": showDate,"platform": "友盟统计","number": record["umengpv"], "hintDate": hintDate});
          uv.push({"date": showDate,"platform": "百度统计","number": record["baiduuv"], "hintDate": hintDate});
          uv.push({"date": showDate,"platform": "谷歌统计","number": record["googleuv"], "hintDate": hintDate});
          uv.push({"date": showDate,"platform": "友盟统计","number": record["umenguv"], "hintDate": hintDate});
        }
        this.$refs.lineChart.pvData = pv;
        this.$refs.lineChart.uvData = uv;
        this.$refs.lineChart.dataChanged();
        
      }

    }
  },
  mounted: function(){
    // let date = new Date();
    // date.setTime(date.getTime()-24*3600*1000);
    // const endDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    // date.setTime(date.getTime()-24*3600*1000*6);
    // const startDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    const endDate = "2020-08-22";
    const startDate = "2020-08-15";
    this.getData(startDate,endDate);
    this.timeValue[0] = startDate;
    this.timeValue[1] = endDate;
  },
}
</script>

<style scoped>
  #layout {
    display: flex;
    flex: auto;
    flex-direction: column;
    width: 100%;
    background: #fafafa;
  }
  
  #menu {
    height:100vh;
    position: fixed;
    top:0%;
  }

  #floating-bar {
    background: white;
    line-height: 60px;
    width: 100%;
    position: fixed;
    top:0%;
    padding-left:20px;
    padding-right: 20px;
    margin-left: 50px;
    border-bottom-color: rgb(230, 230, 230);
    border-bottom-width: 1px;
    border-bottom-style: solid;
    z-index: 2;
  
  }
  .inline {
    display: inline;
    padding-left: 10px;
  }
  
  #chart-region {
    width: 95%;
    background: white;
    margin-top: 80px;
    margin-left: 100px;
    height:480px;
    padding-bottom: 40px;
    display: flex;
    flex-direction: column;
  }
  #table-region {
    width: 95%;
    height:600px;
    background: white;
    margin-left: 100px;
    padding:30px;
    display: flex;
    flex-direction: column;
  }
  .tag {
    height:50px;
    width:150px;
    color: white;
    background: #3488ff;
    margin:10px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
  }
  #tag1 {
    align-self: flex-end;
  }
  #tag2 {
  }
  #line-chart {
    top:30px;
    height:100%;
  }
  #table {
    top:30px;
    width:80%;
    margin: 0 auto;
  }
  .error-msg {
    position: relative;
    top:30%;
    left:43%;
  }
  .vertical-middle {
    vertical-align: middle;
  }
 
</style>