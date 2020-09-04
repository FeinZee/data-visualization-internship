<template>
    <c-table :height="height" bordered :columns="columns" :dataSource="sammarizedData">
    </c-table>
</template>

<script>
export default {
    name: 'Table',
    data(){
        return{
            height: 300,
            dataSource:[],
            columns:[
                { title:"日期",prop:"date" },
                {
                    title:"百度统计",
                    children:[
                        {title:"PV",prop:"baidupv"},
                        {title:"UV",prop:"baiduuv"}
                    ]
                },
                {
                    title:"谷歌统计",
                    children:[
                        {title:"PV",prop:"googlepv"},
                        {title:"UV",prop:"googleuv"}
                    ]
                },
                {
                    title:"友盟统计",
                    children:[
                        {title:"PV",prop:"umengpv"},
                        {title:"UV",prop:"umenguv"}
                    ]
                }
            ]
        }
    },
    computed: {
        sammarizedData: function(){
            if (this.dataSource.length == 0){
                return [];
            }

            let baidupv = 0,baiduuv = 0,googlepv = 0,googleuv = 0,umengpv = 0,umenguv = 0;
            const propertyArr = ["baidupv","baiduuv","googlepv","googleuv","umengpv","umenguv"];
            let dataArr = function (arr, propertyArr){
                let ans = [];
                for (let p of propertyArr) {
                    ans.push(arr.reduce( (acc, val) => acc + val[p],0));
                }
                return ans;
            }(this.dataSource,propertyArr);
            [baidupv,baiduuv,googlepv,googleuv,umengpv,umenguv] = dataArr;
            const totalData = {"date":"总计", baidupv, baiduuv, googlepv, googleuv, umengpv, umenguv };

            const length = this.dataSource.length;
            dataArr.forEach((val,index) => dataArr[index] = parseInt(val / length));
            [baidupv,baiduuv,googlepv,googleuv,umengpv,umenguv] = dataArr;
            const avgData = {"date":"日均", baidupv, baiduuv, googlepv, googleuv, umengpv, umenguv };

            return this.dataSource.concat(totalData).concat(avgData);
        }
    },
    watch: {
        dataSource(){
            if (this.dataSource.length <= 4){
                this.height = 48 * (4 + this.dataSource.length);
            }else{
                this.height = 480;
            }
        }

    }
}
</script>