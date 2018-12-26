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
    import global_ from './global'
    // import moment from 'moment'
    import echarts from 'echarts'
    var now = new Date()
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
                
                defaultStartDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365),
                defaultEndDate: now,

                chartMemberFirst: null,
                chartMemberSecond: null,
               
                member_new:0,
                member_apply:0, 
                member_approval:0, 
                member_refuse:0, 
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
                getNewMember(ret).then((res) => {
                    // res = JSON.parse(res)
                    console.log(res.out_data);
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 

                    if(res.status>0){
                        // console.log()
                        this.$message.error(res.desc);
                        return;
                    }
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