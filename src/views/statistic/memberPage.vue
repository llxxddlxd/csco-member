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
            新增会员总数：{{totalNewMemers}}
            申请人数总数：{{totalApplyMemers}}
        </div>
       
        <div>
            <el-col>
            饼状图
            <div id="chartMemberFirst" style="width:100%; height:400px;"></div> 
            </el-col>
            <el-col> 
            柱状图
            <div id="chartMemberSecond" style="width:100%; height:400px;"></div>      
            </el-col>
       
        </div> 

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getNewMember} from '../../api/api';
    // import moment from 'moment'
    import echarts from 'echarts'

    export default {
        data() {
            return {
                consumeList: [],
                listLoading: false,
                sels: [],//列表选中列
                totalNewMemers:0,
                totalApplyMemers:0,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                
                defaultStartDate: '',
                defaultEndDate: '',

                chartMemberFirst: null,
                chartMemberSecond: null,
               
                member_new:0,
                member_apply:0, 
                member_approval:0, 
                member_refuse:0, 
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
                getNewMember(ret).then((res) => {
                    // res = JSON.parse(res)
                    console.log(res.out_data);
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 

                    this.totalNewMemers = res.out_data['new'];
                    this.totalApplyMemers= res.out_data["apply"];


                    this.member_approval= res.out_data["approval"].count;
                    this.member_refuse= res.out_data["refuse"].count;
                     
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
                            data: ['批准人数', '拒绝人数']
                        },
                        series: [
                            {
                                name: '会员类型',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: [
                                    { value: this.member_approval, name: '批准人数' },
                                    { value: this.member_refuse, name: '拒绝人数' }
                                ],
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
                    
                    var names = ["申请人数", "批准人数","拒绝人数"];
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
                          data: [this.totalApplyMemers,this.member_approval, this.member_refuse]
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