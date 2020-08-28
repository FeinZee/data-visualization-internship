<template>
    <c-table :height="height" bordered :columns="columns" :dataSource="sammarizedData">
    </c-table>
</template>

<script>
export default {
    name: 'Table',
    data(){
        return{
            height: 250,
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
            let totalData = {};
            totalData.date = "总计";
            let avgDate = {};
            avgDate.date = "日均";
            let baidupv = 0,baiduuv = 0,googlepv = 0,googleuv = 0,umengpv = 0,umenguv = 0;
            for (let record of this.dataSource){
                baidupv += record.baidupv;
                baiduuv += record.baiduuv;
                googlepv += record.googlepv;
                googleuv += record.googleuv;
                umengpv += record.umengpv;
                umenguv += record.umenguv;
            }
            const length = this.dataSource.length;
            totalData.baidupv = baidupv;
            totalData.baiduuv = baiduuv;
            totalData.googlepv = googlepv;
            totalData.googleuv = googleuv;
            totalData.umengpv = umengpv;
            totalData.umenguv = umenguv;
            avgDate.baidupv = parseInt(baidupv / length);
            avgDate.baiduuv = parseInt(baiduuv / length);
            avgDate.googlepv = parseInt(googlepv / length);
            avgDate.googleuv = parseInt(googleuv / length);
            avgDate.umengpv = parseInt(umengpv / length);
            avgDate.umenguv = parseInt(umenguv / length);
            return this.dataSource.concat(totalData).concat(avgDate);
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