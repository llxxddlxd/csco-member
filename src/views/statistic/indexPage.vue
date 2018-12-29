<template>
    <section>
        <!--工具条-->
        类型：
        <el-select v-model="defaultType" 
              @change="dimensionChange" 
              placeholder="请选择统计维度">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select> 
        <el-checkbox v-model="selectAll" @change="queryAll()">全选</el-checkbox>

        <div class="yearSpan" v-if="defaultType=='year'">
            <span class="demonstration">日期：</span>
            <el-date-picker
              v-model="defaultStartYear"
              type="year"
              placeholder="选择年" 
              @change="typeChange"
              @focus="clickAgain"
              >
            </el-date-picker>
            <span class="demonstration">~</span>
            <el-date-picker
              v-model="defaultEndYear"
              type="year"
              placeholder="选择年"
              @change="typeChange"
              @focus="clickAgain"
              >
            </el-date-picker>
        </div>
        <div class="monthSpan" v-if="defaultType=='month'">
            <span class="demonstration">日期：</span>
            <el-date-picker
              v-model="defaultStartMonth"
              type="month"
              placeholder="选择月"
              @change="typeChange"
              @focus="clickAgain"
              >
            </el-date-picker>
            <span class="demonstration">~</span>
            <el-date-picker
              v-model="defaultEndMonth"
              type="month"
              placeholder="选择月"
              @change="typeChange"
              @focus="clickAgain"
              >
            </el-date-picker>
        </div>
        <div class="dateSpan" v-if="defaultType=='day'">
            <span class="demonstration">日期：</span>
            <el-date-picker
              v-model="defaultStartDate"
              type="date"
              placeholder="选择日"
              @change="typeChange"
              @focus="clickAgain"
              >
            </el-date-picker>
            <span class="demonstration">~</span>
            <el-date-picker
              v-model="defaultEndDate"
              type="date"
              placeholder="选择日"
              @change="typeChange"
              @focus="clickAgain"
              >
            </el-date-picker>
        </div> 
        <div>
            会员总数：{{totalMemers}}
        </div>
        <div>
            <el-col>
            <el-radio v-model="radioTotal" label="1" :change="drawColumnTotal()">会员走势图</el-radio>
            <el-radio v-model="radioTotal" label="2" :change="drawColumnTotal()">会员柱状图</el-radio>
            </el-col>
            <el-col :span="22" v-show="radioTotal==1">
                <div id="chartTotalFirst" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="21" v-show="radioTotal==2">
                <div id="chartTotalSecond" style="width:100%; height:400px;"></div>
            </el-col>

        </div>
        <div>
            <div  style="float:left;width:50%;">
                <el-col>
                <el-radio v-model="radioPay" label="1" :change="changePay()">缴费饼状图</el-radio>
                <el-radio v-model="radioPay" label="2" :change="changePay()">缴费柱状图</el-radio> 
                </el-col>
                <el-col :span="24" v-show="radioPay==1">
                    <div id="chartPayFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="24" v-show="radioPay==2">
                    <div id="chartPaySecond" style="width:100%; height:400px;"></div>
                </el-col>
            </div>
            <div  style="float:right;width:45%;">
                <el-col>
                <el-radio v-model="radioMember" label="1" :change="changeMember()">会员饼状图</el-radio>
                <el-radio v-model="radioMember" label="2" :change="changeMember()">会员柱状图</el-radio>
                </el-col>
                <el-col :span="24" v-show="radioMember==1">
                    <div id="chartMemberFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="24" v-show="radioMember==2">
                    <div id="chartMemberSecond" style="width:100%; height:400px;"></div>
                
                </el-col>
            </div>  
        </div>
        <div>
            <div style="float:left;width:50%;">
                <el-col>
                <el-radio v-model="radioEducation" label="1" :change="changeEducation()">教育饼状图</el-radio>
                <el-radio v-model="radioEducation" label="2" :change="changeEducation()">教育柱状图</el-radio>
                </el-col>

                <el-col :span="24" v-show="radioEducation==1">
                    <div id="chartEducationFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="24" v-show="radioEducation==2">
                    <div id="chartEducationSecond" style="width:100%; height:400px;"></div>
                </el-col>
            </div>
            <div style="float:right;width:45%;">
                <el-col>
                <el-radio v-model="radioNation" label="1" :change="changeNation()">民族饼状图</el-radio>
                <el-radio v-model="radioNation" label="2" :change="changeNation()">民族柱状图</el-radio>
                </el-col>
                <el-col :span="24" v-show="radioNation==1">
                    <div id="chartNationFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="24" v-show="radioNation==2">
                    <div id="chartNationSecond" style="width:100%; height:400px;"></div>
                </el-col>
            </div>
        </div>
        <el-col >
            <el-col>
            <el-radio v-model="radioGender" label="1" :change="changeGender()">性别饼状图</el-radio>
            <el-radio v-model="radioGender" label="2" :change="changeGender()">性别柱状图</el-radio>
            </el-col>
            <el-col :span="12" v-show="radioGender==1">
                <div id="chartGenderFirst" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12" v-show="radioGender==2">
                <div id="chartGenderSecond" style="width:100%; height:400px;"></div>
            </el-col>
        </el-col > 
        

        <!--工具条-->
<!--         <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col> -->

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getIndexContent ,getPayStatus,getMemeberStatus
        ,getEducationStatus,getNationStatus,getGenderStatus
        ,getMemberByYear,getMemberByMonth,getMemberByDay} from '../../api/api';
    // import moment from 'moment'
    import echarts from 'echarts'
    import global_ from './global'
    var now = new Date();

    var _defaultStartYear = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365 * 3)  //3年
    var _defaultEndYear = now  
 
    var _defaultStartMonth = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);//12 months
    var _defaultEndMonth = now;
  
    var _defaultStartDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 90); //90 days
    var _defaultEndDate = now
  
    var displayCount = 7;
    export default {
        data() {
            return {
                filters: {
                    phone: '',
                    name: ''
                },
                consumeList: [],
                listLoading: false,
                sels: [],//列表选中列
                totalMemers:0,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                //查看界面数据
                editForm: {
                    id: 0,
                    count: '',
                    pay: '',
                    type: '',
                    create_time: '', 
                },
                options: [{
                  value: 'year',
                  label: '按年统计'
                }, {
                  value: 'month',
                  label: '按月统计'
                }, {
                  value: 'day',
                  label: '按天统计'
                }],
                defaultType: 'month',
                defaultStartYear: _defaultStartYear,
                defaultEndYear: _defaultEndYear,
                defaultStartMonth: _defaultStartMonth,
                defaultEndMonth: _defaultEndMonth,
                defaultStartDate: _defaultStartDate,
                defaultEndDate: _defaultEndDate,

                radioTotal:"1",
                radioPay:"1",
                radioMember:"1",
                radioEducation:"1",
                radioNation:"1",
                radioGender:"1",

                chartTotalFirst: null,
                chartTotalSecond: null,
                chartPayFirst: null,
                chartPaySecond: null,
                chartMemberFirst: null,
                chartMemberSecond: null,
                chartEducationFirst: null,
                chartEducationSecond: null,
                chartNationFirst: null,
                chartNationSecond: null,
                chartGenderFirst: null,
                chartGenderSecond: null,

                pay_unPay:0,
                pay_hasPay:0,
                member_unPay:0,
                member_hasPay:0,
                education_dataColumn:[],
                education_data:[],
                nation_dataColumn:[],
                nation_data:[],
                gender_unPay:[],
                gender_hasPay:[],
                selectAll:false,
                selectTime:1,
            }
        },
        methods: {
            dimensionChange:function(){
                if(this.selectAll==true){
                    if(this.defaultType == "year"){
                        this.defaultStartYear = '';
                        this.defaultEndYear = ''; 
                    }
                    else if(this.defaultType == "month"){                    
                        this.defaultStartMonth = '';
                        this.defaultEndMonth = ''; 

                    }
                    else{    
                        this.defaultStartDate = '';
                        this.defaultEndDate = ''; 
                    }  
                }
                else{

                    if(this.defaultType == "year"){
                        this.defaultStartYear = _defaultStartYear;
                        this.defaultEndYear = _defaultEndYear; 
                    }
                    else if(this.defaultType == "month"){                    
                        this.defaultStartMonth = _defaultStartMonth;
                        this.defaultEndMonth = _defaultEndMonth; 

                    }
                    else{    
                        this.defaultStartDate = _defaultStartDate;
                        this.defaultEndDate = _defaultEndDate; 

                    }     
                }
                this.drawCharts();

            },
            typeChange:function(value){  
                  if(this.defaultType == "year"){
                        if(this.defaultStartYear>this.defaultEndYear){
                            this.defaultStartYear= _defaultStartYear
                            this.defaultEndYear = _defaultEndYear
                            return;
                        } 
                    }
                    else if(this.defaultType == "month"){
                        if(this.defaultStartMonth>this.defaultEndMonth){
                            this.defaultStartMonth=_defaultStartMonth
                            this.defaultEndMonth = _defaultEndMonth
                            return;
                        } 

                    }
                    else{
                        if(this.defaultStartDate>this.defaultEndDate){
                            this.defaultStartDate=_defaultStartDate
                            this.defaultEndDate = _defaultEndDate
                            return;
                        } 
                    }


                if(this.selectTime==1){
                    this.selectAll=false;
                    this.drawCharts();
                }           
            },
            clickAgain(){ 
                 this.selectTime=1;
            },
            queryAll(){  
                console.log('queryAll')
                if(this.selectAll){
                    this.selectTime=0;
                    if(this.defaultType == "year"){
                        this.defaultStartYear = "";
                        this.defaultEndYear= "";
                    }
                    else if(this.defaultType == "month"){
                        this.defaultStartMonth = "";
                        this.defaultEndMonth = "";

                    }
                    else{
                        this.defaultStartDate = "";
                        this.defaultEndDate = "";
                    }
                }
                else{ 
                    if(this.defaultType == "year"){
                        this.defaultStartYear = _defaultStartYear;
                        this.defaultEndYear= _defaultEndYear;
                    }
                    else if(this.defaultType == "month"){
                        this.defaultStartMonth = _defaultStartMonth;
                        this.defaultEndMonth = _defaultEndMonth;

                    }
                    else{
                        this.defaultStartDate = _defaultStartDate,
                        this.defaultEndDate = _defaultEndDate;
                    }

                }
                //改变来时间控件／全选，全部查询
                this.drawCharts();
            },

            drawCharts() {
                console.log("drawCharts")  
                this.drawColumnTotal()
                this.changePay();
                this.changeMember();
                this.changeEducation();
                this.changeNation();
                this.changeGender();        
               
            },
            changePay(){
                console.log('changePay')
                if(this.radioPay=="1")
                    this.drawColumnPayFirst()
                else
                    this.drawColumnPaySecond() 
            },
            changeMember(){
                console.log("changeMember")
                if(this.radioMember=="1")
                    this.drawColumnMemberFirst()
                else
                    this.drawColumnMemberSecond() 
            },
            changeEducation(){
                console.log("changeEducation")

                if(this.radioEducation=="1")
                    this.drawColumnEducationFirst()
                else
                    this.drawColumnEducationSecond() 
            },
            changeNation(){
                console.log("changeNation")

                if(this.radioNation=="1")
                    this.drawColumnNationFirst()
                else
                    this.drawColumnNationSecond() 
            },
            changeGender(){
                console.log("changeGender")

                if(this.radioGender=="1")
                    this.drawColumnGenderFirst()
                else
                    this.drawColumnGenderSecond() 
            },


            formatDate: function(row, column){
                return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss")
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getConsume();
            },
            //获取列表
            getConsume() {
                let para = {
                    page: this.page,
                    phone: this.filters.phone,
                    name: this.filters.name
                };
                this.listLoading = true;
                getConsumeList(para).then((res) => {
                    this.total = res.data.data.count;
                    this.consumeList = res.data.data.rows;
                    this.listLoading = false;
                });
            },
            //显示查看界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            drawColumnTotal() {
                console.log("drawColumnTotal")
                if(this.defaultType == "year"){
                    this.queryDataTotalByYear();
                }
                else if(this.defaultType == "month"){
                    this.queryDataTotalByMonth();
                }
                else{
                    this.queryDataTotalByDate();
                }
                
            },
            queryDataTotalByYear(){
                console.log("queryDataTotalByYear")
                let para = {
                    Committeeid : global_.Committeeid,
                    Key : global_.key,
                    startYear:this.dateFormatter(this.defaultStartYear,'year'),
                    endYear:this.dateFormatter(this.defaultEndYear,'year'), 
                };   
                
                let ret = ''
                for (let it in para) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(para[it]) + '&'
                }
                this.listLoading = true;
                // URIEncoding="UTF-8";
                getMemberByYear(ret).then((res) => {
                    // res = JSON.parse(res)
                    this.listLoading = false;

                    if(res.status>0){
                        this.$message.error("会员数"+res.desc);
                        return;
                    }
                    this.totalMemers = res.out_data.totalcount;   
                    var newData= [];
                    var newColumn= [];
                    for(var i=0;i<res.data.length;i++){
                        newColumn[i] = res.data[i].year;
                        newData[i] = res.data[i].memberCount;
                    }
                    if(this.radioTotal=='1'){
                        this.drawTotalFirst(newColumn,newData);  
                    }
                    else{
                        this.drawTotalSecond(newColumn,newData);  
                    }
                });
                
            },
            queryDataTotalByMonth(){ 
                let para = {
                    Committeeid : global_.Committeeid,
                    Key : global_.key,
                    startMonth:this.dateFormatter(this.defaultStartMonth,'month'),
                    endMonth:this.dateFormatter(this.defaultEndMonth,'month'), 
                }; 
                
                let ret = ''
                for (let it in para) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(para[it]) + '&'
                }
                this.listLoading = true;
                // URIEncoding="UTF-8";
                getMemberByMonth(ret).then((res) => {
                    // res = JSON.parse(res) 
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;

                    if(res.status>0){
                        this.$message.error("会员数"+res.desc);
                        return;
                    }
                    this.totalMemers = res.out_data.totalcount;   
                    var newData= [];
                    var newColumn= [];
                    for(var i=0;i<res.data.length;i++){
                        newColumn[i] = res.data[i].yearMonth;
                        newData[i] = res.data[i].memberCount;
                    }
                    if(this.radioTotal=='1'){
                        this.drawTotalFirst(newColumn,newData);  
                    }
                    else{
                        this.drawTotalSecond(newColumn,newData);  
                    }
                });
                
            },
            queryDataTotalByDate(){
                console.log("queryDataTotalByDate")
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
                getMemberByDay(ret).then((res) => {
                    // res = JSON.parse(res)

                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;

                    if(res.status>0){
                        this.$message.error("会员数"+res.desc);
                        return;
                    }

                    this.totalMemers = res.out_data.totalcount;   
                    var newData= [];
                    var newColumn= [];
                    for(var i=0;i<res.data.length;i++){
                        newColumn[i] = res.data[i].day;
                        newData[i] = res.data[i].memberCount;
                    }
                    if(this.radioTotal=='1'){
                        this.drawTotalFirst(newColumn,newData);  
                    }
                    else{
                        this.drawTotalSecond(newColumn,newData);  
                    }
                });

            },
            drawTotalFirst:function(newColumn,newData){

                this.chartLine = echarts.init(document.getElementById('chartTotalFirst'));
                this.chartLine.setOption({
                    title: {
                        text: '会员统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['会员统计']
                    },
                    grid: {
                        left: '2%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: newColumn
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '人数',
                            type: 'line',
                            stack: '总量',
                            data: newData
                        }, 
                    ],
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
            },

            drawTotalSecond:function(newColumn,newData){  
                this.chartTotalSecond = echarts.init(document.getElementById('chartTotalSecond'));
                    var names = newColumn;
                    this.chartTotalSecond.setOption({
                      title: { text: '会员统计' },
                      tooltip: {},
                      xAxis: {  
                          type : 'category',
                          data: names
                      },
                      yAxis: {},
                      series: [{
                          name: '人数',
                          type: 'bar',
                          data: newData,
                          itemStyle: {
                                normal: {
            　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                                    // color: function(params) {
                                    //     // build a color map as your need.
                                    //     var colorList = global_.colorSelect;
                                    //     return colorList[params.dataIndex]

                                    // },             

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
            },

            //缴费的－饼状图
            drawColumnPayFirst() {           
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
                getPayStatus(ret).then((res) => {
                    console.log("getPayStatus")
                    // res = JSON.parse(res)

                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;

                    if(res.status>0){
                        this.$message.error("缴费"+res.desc);
                        return;
                    }
                    this.pay_unPay = res.outdata.unPay;
                    this.pay_hasPay = res.outdata.hasPay;

                    
                     //页面
                    this.chartPayFirst = echarts.init(document.getElementById('chartPayFirst'));
                    //请求

                    this.chartPayFirst.setOption({
                        title: {
                            text: '缴费状态',
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
                            data: ['未缴费', '已缴费']
                        },
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: [
                                    { value: this.pay_unPay, name: '未缴费' },
                                    { value: this.pay_hasPay, name: '已缴费' }
                                ],
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

                    return ;
                });
            },
            // 缴费柱状图
            drawColumnPaySecond () {
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
                getPayStatus(ret).then((res) => {
                    console.log("getPayStatus")
                    // res = JSON.parse(res) 
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 
                    if(res.status>0){
                        this.$message.error("缴费"+res.desc);
                        return;
                    }
                    this.pay_unPay = res.outdata.unPay;
                    this.education_hasPay = res.outdata.hasPay; 
                    
                    this.chartPaySecond = echarts.init(document.getElementById('chartPaySecond'));
                    var names = ["未缴费", "已缴费"];
                    this.chartPaySecond.setOption({
                      title: { text: '缴费状态' },
                      tooltip: {},
                      xAxis: {
                          // show:false,   
                          data: names
                      },
                      yAxis: {
                           // axisLine:{
                           //      show:false,         
                           // },  
                       },
                      series: [{
                          name: '销量',
                          type: 'bar',
                          data: [this.pay_unPay, this.education_hasPay],
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

            //会员－饼状图
            drawColumnMemberFirst() {           
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
                getMemeberStatus(ret).then((res) => {
                    console.log("drawColumnMemberFirst")
                    // res = JSON.parse(res)

                    if(res.status>0){
                        this.$message.error("会员"+res.desc);
                        return;
                    }
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;


                    this.member_unPay = res.outdata['初级会员'];
                    this.member_hasPay = res.outdata['正式会员']
                     
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
                            data: ['初级会员', '正式会员']
                        },
                        series: [
                            {
                                name: '会员类型',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: [
                                    { value: this.member_unPay, name: '初级会员' },
                                    { value: this.member_hasPay, name: '正式会员' }
                                ],
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
                    return ;
                });
            },
            // 会员柱状图
            drawColumnMemberSecond () {
                console.log("drawColumnMemberSecond")
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
                getMemeberStatus(ret).then((res) => {
                    // res = JSON.parse(res)
                                        // this.totalcount = this.form.totalcount;
                    this.listLoading = false;
                    if(res.status>0){
                        this.$message.error("会员"+res.desc);
                        return;
                    }
                    this.member_unPay = res.outdata['初级会员'];
                    this.member_hasPay = res.outdata['正式会员'];
                    
                    this.chartMemberSecond = echarts.init(document.getElementById('chartMemberSecond'));
                    
                    var names = ["初级会员", "正式会员"];
                    this.chartMemberSecond.setOption({
                      title: { text: '会员类型' },
                      tooltip: {},
                      xAxis: {
                          // show:false,   
                          data: names
                      },
                      yAxis: {
                           // axisLine:{
                           //      show:false,         
                           // },  
                       },
                      series: [{
                          name: '会员类型',
                          type: 'bar',
                          data: [this.member_unPay, this.member_hasPay],
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

            // 学历饼状图
            drawColumnEducationFirst() {           
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
                getEducationStatus(ret).then((res) => {
                    console.log("chartEducationFirst")
                    // res = JSON.parse(res)
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;
                    if(res.status>0){
                        this.$message.error("学历"+res.desc);
                        return;
                    }
                    // return;
                    for(var i =0;i<res.data.length;i++){
                        if(i>=displayCount){
                            break;
                        }
                        var tep ={};var temp= []; 
                        tep.value = res.data[i].count;
                        tep.name = res.data[i].name;
                        this.education_data[i] = tep;
                        this.education_dataColumn[i] = tep['name'];
                    }   
                    
                     //页面
                    this.chartEducationFirst = echarts.init(document.getElementById('chartEducationFirst'));
                    //请求

                    this.chartEducationFirst.setOption({
                        title: {
                            text: '学历状态',
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
                            data: this.education_dataColumn
                        },
                        series: [
                            {
                                name: '人数',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: this.education_data,
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
                    return ;
                });
            },
            // 学历柱状图
            drawColumnEducationSecond () {
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
                getEducationStatus(ret).then((res) => {
                    console.log("drawColumnEducationSecond")
                    // res = JSON.parse(res) 
                    if(res.status>0){
                        this.$message.error("学历"+res.desc);
                        return;
                    }
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;
                     for(var i =0;i<res.data.length;i++){    
                        if(i>=displayCount){
                            break;
                        }
                        this.education_data[i] = res.data[i].count;
                        this.education_dataColumn[i] = res.data[i].name;
                    }  
                    
                    
                    this.chartEducationSecond = echarts.init(document.getElementById('chartEducationSecond'));
                    var names = this.education_dataColumn;
                    this.chartEducationSecond.setOption({
                      title: { text: '缴费状态' },
                      tooltip: {},
                      xAxis: {
                          // show:false,   
                          data: names
                      },
                      yAxis: {
                           // axisLine:{
                           //      show:false,         
                           // }, 
                         },
                      series: [{
                          name: '人数',
                          type: 'bar',
                          data: this.education_data,
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
            // 民族饼状图
            drawColumnNationFirst() {           
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
                getNationStatus(ret).then((res) => {
                    console.log("drawColumnNationFirst")
                    // res = JSON.parse(res)
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;
                    console.log(res);
                    if(res.status>0){
                        this.$message.error("民族"+res.desc);
                        return;
                    }
                    // return;
                    for(var i =0;i<res.data.length;i++){  
                        if(i>=displayCount){
                            break;
                        }
                        var tep ={};var temp= [];
                        tep.value = res.data[i].count;
                        tep.name = res.data[i].name;
                        this.nation_data[i] = tep;
                        this.nation_dataColumn[i] = tep['name'];
                    }  
                    
                     //页面
                    this.chartNationFirst = echarts.init(document.getElementById('chartNationFirst'));
                    //请求

                    this.chartNationFirst.setOption({
                        title: {
                            text: '民族状态',
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
                            data: this.nation_dataColumn
                        },
                        series: [
                            {
                                name: '人数',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: this.nation_data,
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
                    return ;
                });
            },
            // 民族柱状图
            drawColumnNationSecond () {
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
                getNationStatus(ret).then((res) => {
                    console.log("drawColumnNationSecond")
                    // res = JSON.parse(res)
                    if(res.status>0){
                        this.$message.error("民族"+res.desc);
                        return;
                    }
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;
                     for(var i =0;i<res.data.length;i++){    
                        if(i>=displayCount){
                            break;
                        }
                        this.nation_data[i] = res.data[i].count;
                        this.nation_dataColumn[i] = res.data[i].name;
                    }   
                    
                    
                    this.chartNationSecond = echarts.init(document.getElementById('chartNationSecond'));
                    var names = this.nation_dataColumn;
                    this.chartNationSecond.setOption({
                      title: { text: '民族状态' },
                      tooltip: {},
                      xAxis: {
                          // show:false,   
                          data: names
                      },
                      yAxis: {
                           // axisLine:{
                           //      show:false,         
                           // },  
                       },
                      series: [{
                          name: '人数',
                          type: 'bar',
                          data: this.nation_data,
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


            //性别－饼状图
            drawColumnGenderFirst() {          
                    console.log("drawColumnGenderFirst") 
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
                getGenderStatus(ret).then((res) => {
                    // res = JSON.parse(res)
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 
                    if(res.status>0){
                        this.$message.error("性别"+res.desc);
                        return;
                    }
                    for(var i=0;i<2;i++){
                        this.gender_unPay[i] = res.data[i].name;
                        var tmp = {};
                        tmp.value = res.data[i].count;
                        tmp.name = res.data[i].name;
                        this.gender_hasPay[i] = tmp;

                    } 
                     
                     //页面
                    this.chartGenderFirst = echarts.init(document.getElementById('chartGenderFirst'));
                    //请求

                    this.chartGenderFirst.setOption({
                        title: {
                            text: '性别',
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
                            data: this.gender_unPay
                        },
                        series: [
                            {
                                name: '性别',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: this.gender_hasPay,
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
                    return ;
                });
            },
            // 性别柱状图
            drawColumnGenderSecond () {
                console.log("drawColumnGenderSecond")
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
                getGenderStatus(ret).then((res) => {
                    // res = JSON.parse(res)
                    if(res.status>0){
                        this.$message.error("性别"+res.desc);
                        return;
                    }
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;
                    for(var i=0;i<2;i++){
                        this.gender_unPay[i] = res.data[i].name;
                        
                        this.gender_hasPay[i] = res.data[i].count;

                    } 
                    this.chartGenderSecond = echarts.init(document.getElementById('chartGenderSecond'));
                    
                    // var names = ["初级会员", "正式会员"];
                    this.chartGenderSecond.setOption({
                      title: { text: '性别' },
                      tooltip: {},
                      xAxis: { 
                          // show:false,   
                          data: this.gender_unPay
                      },
                      yAxis: {
                           // axisLine:{
                           //      show:false,         
                           // },  
                       },
                      series: [{
                          name: '性别',
                          type: 'bar',
                          data: this.gender_hasPay,
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
        },
        mounted() {
            console.log("mounted")
            this.drawColumnTotal();
        },
        updated: function () { 
        },


    }

</script>

<style scoped>

</style>