<template>
  <div id="layout">
    <div id="content">
      <div id="floating-bar">
        <p class="inline">时间：</p>
        <c-date-picker v-model="timeValue" @change="change"  type="daterange" />
      </div>
      <div id="data-region">
        <div id="chart-region">
          <div class="tag" id="tag1"><p>多日趋势对比图</p></div>
          
          <line-chart ref="lineChart" id="line-chart"></line-chart>
        </div>
        <div id="table-region">
          <div class="tag" id="tag2"><p>多日数据汇总表</p></div>
          <data-table v-loading="loading" ref="table" id="table"></data-table>
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
      loading: false
    }
  },
  components: {
    'line-chart': LineChart,
    'data-table': Table
  },
  methods: {
    change(date) {
      // 用户进行清空操作时，value长度为0
      console.log(date);
      if (this.timeValue.length == 2){
        this.startDate = this.timeValue[0];
        this.endDate = this.timeValue[1];
        this.changeData(1);
        this.$axios.get('http://localhost:8080/visualization/getPvuv?endDate='+this.endDate+"&startDate="+this.startDate).then(res => {
          if (res.data) {
            this.changeData(0,res.data);
            
          }
          else {
            this.changeData(2,[],"没有获取到数据");
          }
        })
      }
    },
    changeData(state,data,msg){
      if (state == 1){
        this.loading = true;
      }
      else if(state == 2){
        alert(msg);
      }
      else{
        this.loading = false;
        this.$refs.table.dataSource = data;

        var pv = [];
        var uv = [];
        var interval = Math.floor((data.length -1)/ 15);
        console.log("interval = " + interval);
        var curIndex = interval;
        for (var record of data.reverse()) {
          var date = record["date"];
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
          
          
          pv.push({"date": showDate,"platform": "百度统计","number": record["baidupv"], "hintDate": date});
          pv.push({"date": showDate,"platform": "谷歌统计","number": record["googlepv"], "hintDate": date});
          pv.push({"date": showDate,"platform": "友盟统计","number": record["umengpv"], "hintDate": date});
          uv.push({"date": showDate,"platform": "百度统计","number": record["baiduuv"], "hintDate": date});
          uv.push({"date": showDate,"platform": "谷歌统计","number": record["googleuv"], "hintDate": date});
          uv.push({"date": showDate,"platform": "友盟统计","number": record["umenguv"], "hintDate": date});
        }
        this.$refs.lineChart.pvData = pv;
        this.$refs.lineChart.uvData = uv;
        this.$refs.lineChart.dataChanged();
        
      }

    }
  }
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
 
</style>