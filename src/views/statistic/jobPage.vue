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
              @focus="clickAgain"
              placeholder="选择日">
            </el-date-picker>
            <span class="demonstration">~</span>
            <el-date-picker
              v-model="defaultEndDate"
              value-format=”yyyy-MM-dd”
              type="date"
              format="yyyy-MM-dd"
              @change="queryAgain"
              @focus="clickAgain"
              placeholder="选择日">
            </el-date-picker>
             <el-checkbox v-model="selectAll" @change="queryAll()">全选</el-checkbox>
            <!-- <i class="fa fa-arrow-down" aria-hidden="true" @click="download()" style="margin-left: 10px">111</i> --> 
            <a @click="download()" style="color: white;margin-left: 10px;cursor: pointer;background-color: #20a0ff;padding: 5px 10px;border-radius:5px">导出EXCEL</a>
        </div> 
        <div style="margin-top: 10px;margin-bottom: 10px">
            <span style="font-size: 20px;margin-right: 10px;font-weight: 4px">统计会员总数：{{totalMemers}}</span>
        </div>
       
        <div> 
            <div id="chartMemberFirst" style="width:100%; height:400px;"></div>             
            <div id="chartMemberSecond" style="width:100%; height:400px;"></div>
        </div>
         <el-table  :data="member_data" v-model="member_data" style="width: 100%;display: none" id="table_excel">
          <el-table-column  prop="name" label="职务" width="180">
          </el-table-column>
          <el-table-column  prop="value" label="人数" width="180">
          </el-table-column> 
        </el-table> 
    </section>
</template>

<script>
    import util from '../../common/js/util'

    import global_ from './global'
    //import NProgress from 'nprogress'
    import { getJob} from '../../api/api';
    // import moment from 'moment'
    import echarts from 'echarts' 
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
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
                selectTime:1,
            }
        },
        methods: { 
            download () {
                 /* generate workbook object from table */
                 var wb = XLSX.utils.table_to_book(document.querySelector("#table_excel"))
                 /* get binary string as output */
                 var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                 try {
                     FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '单位职务统计.xlsx')
                 } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                 return wbout
             }, 
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
                                    },
                                     normal:{ 
                                           label:{ 
                                              show: true, 
                                              formatter: '{b} : {c} ({d}%)' ,
                                              trigger:"axis"
                                           }, 
                                           labelLine :{show:true} 
                                     } 
                                }
                            }
                        ],
                        color:global_.colorSelect,

                        toolbox: {

                        　　show: true,

                        　　feature: {

                        　　　　saveAsImage: {
                                    name:"单位职务分布饼状图",

                        　　　　　　　show:true,

                        　　　　     excludeComponents :['toolbox'],

                        　　　　     pixelRatio: 2,
                                    title:'下载'

                        　　　　},
                                dataView:{
                                    show:true,
                                    title:"数据"
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
                                           label:{ 
                                              show: true, 
                                              position:'top'
                                           }              

                                    }
                                },
                            }],

                            toolbox: {

                            　　show: true,

                            　　feature: {

                            　　　　saveAsImage: {
                                        name:"单位职务分布柱状图",

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
                if(this.defaultStartDate>this.defaultEndDate){
                    this.$message.error("开始时间不能大于结束时间");
                    this.defaultStartDate=new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);
                    this.defaultEndDate = now; 
                    return;
                } 
                if(this.selectTime==1){
                    this.selectAll=false;
                    this.drawColumnMember()  
                }            
            },
            clickAgain(){ 
                 this.selectTime=1;
            },
            queryAll(){ 
                if(this.selectAll==true){
                    this.selectTime=0;
                    this.defaultStartDate=""; 
                    this.defaultEndDate = "";

                }
                else{
                    //取消了
                    this.defaultStartDate=new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);
                    this.defaultEndDate = now; 
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