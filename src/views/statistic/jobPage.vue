<template>
    <section>
        <!--工具条-->  
        <div class="dateSpan">
            <span class="demonstration">日期：</span>
            <el-date-picker
              v-model="defaultStartDate"
              value-format=”yyyy-MM-dd”
              type="date"
              format="yyyy-MM-dd"
              @change="queryAgain"
              placeholder="选择日">
            </el-date-picker>
            <span class="demonstration">~</span>
            <el-date-picker
              v-model="defaultEndDate"
              value-format=”yyyy-MM-dd”
              type="date"
              format="yyyy-MM-dd"
              @change="queryAgain"
              placeholder="选择日">
            </el-date-picker>
             <el-checkbox v-model="selectAll" @change="queryAll()">全选</el-checkbox>
        </div> 
        <div>
            统计会员总数：{{totalMemers}}
        </div>
       
        <div> 
            <div id="chartMemberFirst" style="width:100%; height:400px;"></div>             
            <div id="chartMemberSecond" style="width:100%; height:400px;"></div>
        </div> 
    </section>
</template>

<script>
    import util from '../../common/js/util'

    import global_ from './global'
    //import NProgress from 'nprogress'
    import { getJob} from '../../api/api';
    // import moment from 'moment'
    import echarts from 'echarts' 
    var now = new Date();
   
    export default {
        data() {
            return {

                consumeList: [],
                listLoading: false,
                sels: [],//列表选中列
                totalMemers:0, 
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                
                defaultStartDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365),
                defaultEndDate: now,

                chartMemberFirst: null,
                chartMemberSecond: null,
                //有效数据
                member_data:[],  
                member_value:[],
                member_column:[], 
                // //无+不详数据
                // member_data_bak:[],
                // member_value_bak:[],
                // member_column_bak:[], 
                // //其他数据
                // member_data_bak2:[],
                // member_value_bak2:[],
                // member_column_bak2:[], 
                selectAll:false,
            }
        },
        methods: { 
            handleCurrentChange(val) {
                this.page = val;
                this.getConsume();
            },  
            selsChange: function (sels) {
                this.sels = sels;
            },
            drawColumnMember() {       
                console.log("drawColumnMember")    
                let para = {
                    Committeeid : global_.Committeeid,
                    Key : global_.key,
                    startDay:this.dateFormatter(this.defaultStartDate),
                    endDay:this.dateFormatter(this.defaultEndDate), 
                };
                
                let ret = ''
                for (let it in para) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(para[it]) + '&'
                }
                this.listLoading = true;
                // URIEncoding="UTF-8";
                getJob(ret).then((res) => {
                    // res = JSON.parse(res)
                    console.log(res.out_data);
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 
                    if(res.status>0){
                        // console.log()
                        this.$message.error("单位职务"+res.desc);
                        return;
                    } 
                    this.totalMemers = res.out_data['totalcount']; 
                    let temp = global_.operatorData(res.data,this.totalMemers);
                    this.member_data=temp['member_data'];
                    this.member_column=temp['member_column'];
                    this.member_value=temp['member_value']; 
 
                     // return
                     //页面
                    this.chartMemberFirst = echarts.init(document.getElementById('chartMemberFirst'));
                    //请求
                    this.chartMemberFirst.setOption({
                        title: {
                            text: '单位职务',
                            subtext: '',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: this.member_column
                        },
                        series: [
                            {
                                name: '单位职务',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: this.member_data,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color:global_.colorSelect,

                        toolbox: {

                        　　show: true,

                        　　feature: {

                        　　　　saveAsImage: {

                        　　　　show:true,

                        　　　　excludeComponents :['toolbox'],

                        　　　　pixelRatio: 2,
                                title:'下载'

                        　　　　}

                        　　}

                        }
                    }); 
                    //second
                    this.chartMemberSecond = echarts.init(document.getElementById('chartMemberSecond'));
                    
                    var names = this.member_column;
                    this.chartMemberSecond.setOption({
                        title: { text: '单位职务' },
                            toolboxoltip: {},
                            xAxis: {
                              data: names
                            },
                            yAxis: {},
                            series: [{
                              name: '单位职务',
                              type: 'bar',
                              data: this.member_value,
                              itemStyle: {
                                    normal: {
                　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = global_.colorSelect;
                                            return colorList[params.dataIndex]

                                        },             

                                    }
                                },
                            }],

                            toolbox: {

                            　　show: true,

                            　　feature: {

                            　　　　saveAsImage: {

                            　　　　show:true,

                            　　　　excludeComponents :['toolbox'],

                            　　　　pixelRatio: 2,
                                    title:'下载'

                            　　　　}

                        　　}

                        }
                    }); 
                    return ;
                });
            }, 
  
            queryAgain(){
                this.selectAll = false;
                this.drawColumnMember()

            },
            queryAll(){
                if(this.selectAll){
                    this.defaultStartDate = "";
                    this.defaultEndDate = "";
                }
                else{

                }
                this.drawColumnMember()
            },
            drawCharts() {
               
            },
        },
        mounted() {         
            this.drawColumnMember()
        },
        updated: function () {
        },
    }

</script>

<style scoped>

</style>