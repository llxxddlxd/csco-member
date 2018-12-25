<template>
    <section>
        <!--工具条-->  
        <div class="dateSpan">
            <span class="demonstration">日期：</span>
            <el-date-picker
              v-model="defaultStartDate"
              type="date"
              placeholder="选择日">
            </el-date-picker>
            <span class="demonstration">~</span>
            <el-date-picker
              v-model="defaultEndDate"
              type="date"
              placeholder="选择日">
            </el-date-picker>
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
    //import NProgress from 'nprogress'
    import { getMajor} from '../../api/api';
    // import moment from 'moment'
    import echarts from 'echarts'

    export default {
        data() {
            return {
                consumeList: [],
                listLoading: false,
                sels: [],//列表选中列
                totalMemers:0, 
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                
                defaultStartDate: '',
                defaultEndDate: '',

                chartMemberFirst: null,
                chartMemberSecond: null,
               
                member_data:[],
                member_value:[],
                member_column:[], 
            }
        },
        methods: { 
            formatDate: function(row, column){
                return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss")
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
                    Committeeid : 1,
                    Key : "79ECFB2F3F0C098B",
                    startDay:"2018",
                    endDay:"2019", 
                };
                
                let ret = ''
                for (let it in para) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(para[it]) + '&'
                }
                this.listLoading = true;
                // URIEncoding="UTF-8";
                getMajor(ret).then((res) => {
                    // res = JSON.parse(res)
                    console.log(res.out_data);
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 

                    this.totalMemers = res.out_data['totalcount'];
                    console.log(res.data)
                    for(var i = 0;i<7;i++){
                        this.member_column[i] = res.data[i].name;
                        this.member_value[i] = res.data[i].count;
                        var temp ={};
                        temp.value=res.data[i].count
                        temp.name=res.data[i].name
                        this.member_data[i] = temp;
                    }
                     
                     //页面
                    this.chartMemberFirst = echarts.init(document.getElementById('chartMemberFirst'));
                    //请求

                    this.chartMemberFirst.setOption({
                        title: {
                            text: '会员类型',
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
                                name: '会员类型',
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
                        ]
                    });
                    console.log(2222)


                    this.chartMemberSecond = echarts.init(document.getElementById('chartMemberSecond'));
                    
                    var names = this.member_column;
                    this.chartMemberSecond.setOption({
                      title: { text: '会员' },
                      tooltip: {},
                      xAxis: {
                          data: names
                      },
                      yAxis: {},
                      series: [{
                          name: '会员',
                          type: 'bar',
                          data: this.member_value
                        }]
                    });
                    console.log(2222)
                    return ;
                });
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