<template>
  <div id="layout">
    <div id="content">
      <div id="floating-bar">
        <p class="inline">时间：</p>
        <c-date-picker v-model="value" @change="change" set-cell-disabled type="daterange" />
      </div>
      <div id="data-region">
        <div id="chart-region">
          <div class="tag" id="tag1"><p>多日趋势对比图</p></div>
          
          <line-chart id="line-chart"></line-chart>
          <div id="chechbox">
            <c-radio-group v-model="isPv">
              <c-radio-button value="true">
                PV
              </c-radio-button>
              <c-radio-button value="false">
                UV
              </c-radio-button>
            </c-radio-group>
          </div>
        </div>
        <div id="table-region">
          <div class="tag" id="tag2"><p>多日数据汇总表</p></div>
          <data-table ref="table" id="table"></data-table>
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
      value: [],
      isPv:"true",
      startDate: "",
      endDate: ""
    }
  },
  components: {
    'line-chart': LineChart,
    'data-table': Table
  },
  methods: {
    change(date) {
      // 用户进行清空操作时，value长度为0
      if (date.target.value.length == 2){
        this.startDate = date.target.value[0];
        this.endDate = date.target.value[1];
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
    changeData(state,data,msg=""){
      console.log(msg);

      if (state != 0){
        alert(msg);
      }else{
        this.$refs.table.dataSource = data;
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
  #chechbox {
    position: absolute;
    right: 60px;
    margin:10px;
    z-index:1;
  }

 
</style>