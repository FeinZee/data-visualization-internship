<template>
  <s-chart :data="lineData" :data-fields="dataFields">
    <s-line
      :data="lineData"
      :data-fields="dataFields"
      :css-point="pointStyle"
    />
    <s-axis :attrs="{orient:'left'}" :css-axis="false" :css-scale="false" />
    <s-axis :attrs="{orient:'bottom'}" />
    <s-legend
      :attrs="{align: ['center', 'bottom']}"
      :css-icon="{borderRadius:10}"
      :css-text="{fontSize:12}"
    />
    <s-tooltip :attrs="tooltipAttrs" />
    <div id="chechbox">
      <c-radio-group v-model="PVUV" size="small">
        <c-radio-button value="PV">
          PV
        </c-radio-button>
        <c-radio-button value="UV">
          UV
        </c-radio-button>
      </c-radio-group>
    </div>
  </s-chart>
</template>

<script>
  export default {
    name: 'LineChart',
    data: function() {
      let self = this;
      return {
        PVUV: "PV",
        lineData: [],
        pvData: [],
        uvData: [],
        tooltipAttrs: {
          title: function(data) {
            // data是某一列的数据点
            return data[0].hintDate + '\t' + self.PVUV + "值";
          },
          formatter: data => `${data.platform} ${data.number}`
        },
        dataFields: {
          row: 'platform',
          value: 'number',
          text: 'date'
        },
        pointStyle: { strokeColor: '#fff' }
      }
    },
    methods: {
      dataChanged(){
        if (this.PVUV === "PV") {
          this.lineData = this.pvData;
        }else{
          this.lineData = this.uvData;
        }
      }
    },
    watch: {
      PVUV(){
        this.dataChanged();
      }
    }
  }
</script>

<style scoped>
#chechbox {
    position: absolute;
    right: 60px;
    bottom: -20px;
    margin:10px;
    z-index:2;
  }
</style>
