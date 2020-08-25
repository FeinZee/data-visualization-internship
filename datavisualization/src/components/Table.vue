<template>
    <c-table :height="400" bordered :columns="columns" :dataSource="dataSource">
    </c-table>
</template>

<script>
export default {
    name: 'Table',
    data(){
        return{
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
    }
}
</script>