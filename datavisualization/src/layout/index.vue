<template>
  <div id="layout">
    <div id="content">
      <div id="floating-bar">
        <p class="inline">时间：</p>
        <c-date-picker v-model="timeValue" @change="change" :start-placeholder="timeValue[0]" :end-placeholder="timeValue[1]" type="daterange" />
      </div>
      <div id="data-region">
        <div id="chart-region">
          <div class="tag" id="tag1"><p>多日趋势对比图</p></div>
          <line-chart v-if="!error" v-loading:[loadingArgs]="loading" ref="lineChart" id="line-chart"></line-chart>
          <div v-else class="error-msg"><img class="vertical-middle"  src="../assets/warning.png"/><p class="vertical-middle inline">数据加载异常</p></div>
        </div>
        <div id="table-region">
          <div class="tag" id="tag2"><p>多日数据汇总表</p></div>
          <data-table v-if="!error" v-loading:[loadingArgs]="loading" ref="table" id="table"></data-table>
          <div v-else class="error-msg"><img class="vertical-middle"  src="../assets/warning.png"/><p class="vertical-middle inline">数据加载异常</p></div>
        </div>
      </div>
    </div>
    <div id="menu-container">
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
      error: false,
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
    getData(start,end){
      this.changeData(1);//告知视图:数据开始加载
      this.$axios.get('http://localhost:8080/visualization/getPvuv?endDate='+end+"&startDate="+start).then(res => {
        if (res.data) {
          this.changeData(0,res.data);
          
        }
        else {
          this.changeData(2,[],"没有获取到数据");
        }
      })
    },
    changeData(state,data,msg){
      if (state == 1){
        //加载状态
        this.loading = true;
        this.error = false;
      }
      else if(state == 2){
        //异常
        this.loading = false;
        this.error = true;
        alert(msg);
      }
      else{
        this.loading = false;
        this.error = false;
        this.$refs.table.dataSource = data;

        var pv = [];
        var uv = [];
        var interval = Math.floor((data.length -1)/ 15);
        console.log("interval = " + interval);
        var curIndex = interval;
        for (var record of data.reverse()) {
          var date = record["date"];
          var hintDate = date;
          var showDate = date;
          if (data.length >= 30){
            date = date.substring(5,date.length); //不显示年份
            showDate = date;
          }else{
            if (curIndex == interval) {
              curIndex = 0;
            }else{
              var index = date.lastIndexOf("-");
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
    var date = new Date();
    date.setTime(date.getTime()-24*3600*1000);
    var endDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    date.setTime(date.getTime()-24*3600*1000*7);
    var startDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    this.getData(startDate,endDate);
    this.timeValue[0] = startDate;
    this.timeValue[1] = endDate;
  },
}
</script>

<style scoped>
  #layout {
    display: flex;
    width: 100%;
  }
  #menu-container {
    position: fixed;
    top:0%;

  }
  #menu {
    height:100vh;

  }
  #content {
    flex:auto;
    background: #fafafa;
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
  #data-region {
    background: white;
    margin-top: 80px;
    margin-left: 70px;
    height: 1200px;
  }
  #chart-region {
    width: 95%;
    height:40%;
    padding:10px;
  }
  #table-region {
    width: 95%;
    height:50%;
    padding:10px;
    margin-top: 20px;
    justify-content: center;
  }
  .tag {
    height:50px;
    width:150px;
    color: white;
    background: #3488ff;
    margin:10px;
    border-radius: 8px;
    text-align: center;
  }
  #tag1 {
    position:absolute;
    right:30px;
  }
  #tag2 {
    position:absolute;
    left:90px;
  }
  #line-chart {
    top:30px;
  }
  #table {
    top:80px;
    width:80%;
    margin: 0 auto;
  }
  .error-msg {
    position: relative;
    top:50%;
    left:43%;
  }
  .vertical-middle {
    vertical-align: middle;
  }
 
</style>