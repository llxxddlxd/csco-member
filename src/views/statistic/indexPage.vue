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
        <el-checkbox v-model="selectAll" @change="queryAll">全选</el-checkbox>

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
        <div style="margin-top: 10px;margin-bottom: 10px">
            <span style="font-size: 20px;margin-right: 10px;font-weight: 4px">会员总数：{{totalMemers}}</span>
        </div>
        <div style="margin: 20px 0 20px 0">
            <el-col>
                  <el-radio-group v-model="radioTotal" @change="drawColumnTotal">
                    <el-radio :label="1">会员走势图</el-radio>
                    <el-radio :label="2">会员柱状图</el-radio> 
                  </el-radio-group> 
                    <a @click="download(1,'会员')" style="color: blue;margin-left: 10px;cursor: pointer;">保存excel</a>
            </el-col>
            <el-col :span="22" v-show="radioTotal==1">
                <div id="chartTotalFirst" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="21" v-show="radioTotal==2">
                <div id="chartTotalSecond" style="width:100%; height:400px;"></div>
            </el-col>

        </div>
        <div>
            <div  style="float:left;width:50%;margin-top: 20px;border: 1px solid #000;padding: 5px 0 0 5px">
                <el-col> 
                  <el-radio-group v-model="radioPay" @change="changePay">
                    <el-radio :label="1">缴费饼状图</el-radio>
                    <el-radio :label="2">缴费柱状图</el-radio> 
                  </el-radio-group> 
                    <a @click="download(2,'缴费')" style="color: blue;margin-left: 10px;cursor: pointer;">保存excel</a>
                </el-col>
                <el-col :span="24" v-show="radioPay==1">
                    <div id="chartPayFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="24" v-show="radioPay==2">
                    <div id="chartPaySecond" style="width:100%; height:400px;"></div>
                </el-col>
            </div>
            <div  style="float:right;width:48%;;margin-top: 20px;border: 1px solid #000;padding: 5px 0 0 5px">
                <el-col> 
                  <el-radio-group v-model="radioMember" @change="changeMember">
                    <el-radio :label="1">会员饼状图</el-radio>
                    <el-radio :label="2">会员柱状图</el-radio> 
                  </el-radio-group> 
                    <a @click="download(3,'会员')" style="color: blue;margin-left: 10px;cursor: pointer;">保存excel</a>
                </el-col>
                <el-col :span="24" v-show="radioMember==1">
                    <div id="chartMemberFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="23" v-show="radioMember==2">
                    <div id="chartMemberSecond" style="width:100%; height:400px;"></div>                
                </el-col>
            </div>  
        </div>
        <div style="margin: 20px 0 0px 0">
            <div style="float:left;width:50%;margin-top: 20px;border: 1px solid #000;padding: 5px 0 0 5px">
                <el-col> 

                  <el-radio-group v-model="radioEducation" @change="changeEducation">
                    <el-radio :label="1">教育饼状图</el-radio>
                    <el-radio :label="2">教育柱状图</el-radio> 
                  </el-radio-group> 
                    <a @click="download(4,'教育')" style="color: blue;margin-left: 10px;cursor: pointer;">保存excel</a>
                </el-col>

                <el-col :span="24" v-show="radioEducation==1">
                    <div id="chartEducationFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="24" v-show="radioEducation==2">
                    <div id="chartEducationSecond" style="width:100%; height:400px;"></div>
                </el-col>
            </div>
            <div style="float:right;width:48%;margin-top: 20px;border: 1px solid #000;padding: 5px 0 0 5px">
                <el-col> 
                  <el-radio-group v-model="radioNation" @change="changeNation">
                    <el-radio :label="1">民族饼状图</el-radio>
                    <el-radio :label="2">民族柱状图</el-radio> 
                  </el-radio-group> 
                    <a @click="download(5,'民族')" style="color: blue;margin-left: 10px;cursor: pointer;">保存excel</a>
                </el-col>
                <el-col :span="24" v-show="radioNation==1">
                    <div id="chartNationFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="24" v-show="radioNation==2">
                    <div id="chartNationSecond" style="width:100%; height:400px;"></div>
                </el-col>
            </div>
        </div>
        <div style="margin: 20px 0 0px 0" >
            <div style="float: left;width: 50%;margin-top: 20px;border: 1px solid #000;padding: 5px 0 0 5px">
                <el-col> 
                      <el-radio-group v-model="radioGender" @change="changeGender">
                        <el-radio :label="1">性别饼状图</el-radio>
                        <el-radio :label="2">性别柱状图</el-radio> 
                      </el-radio-group> 
                    <a @click="download(6,'性别')" style="color: blue;margin-left: 10px;cursor: pointer;">保存excel</a>
                </el-col>
                <el-col :span="23" v-show="radioGender==1">
                    <div id="chartGenderFirst" style="width:100%; height:400px;"></div>
                </el-col>
                <el-col :span="23" v-show="radioGender==2">
                    <div id="chartGenderSecond" style="width:100%; height:400px;"></div>
                </el-col>
            </div>
        </div > 
        
        <el-table  :data="first_data" v-model="first_data" style="width: 100%;display: true" id="table_excel1">
          <el-table-column  prop="name" label="会员" width="180">
          </el-table-column>
          <el-table-column  prop="value" label="人数" width="180">
          </el-table-column> 
        </el-table>
        <el-table  :data="pay_data" v-model="pay_data" style="width: 100%;display: none" id="table_excel2">
          <el-table-column  prop="name" label="缴费状态" width="180">
          </el-table-column>
          <el-table-column  prop="value" label="人数" width="180">
          </el-table-column> 
        </el-table> 
        <el-table  :data="member_data" v-model="member_data" style="width: 100%;display: none" id="table_excel3">
          <el-table-column  prop="name" label="会员类型" width="180">
          </el-table-column>
          <el-table-column  prop="value" label="人数" width="180">
          </el-table-column> 
        </el-table> 
        <el-table  :data="education_data" v-model="education_data" style="width: 100%;display: none" id="table_excel4">
          <el-table-column  prop="name" label="学历" width="180">
          </el-table-column>
          <el-table-column  prop="value" label="人数" width="180">
          </el-table-column> 
        </el-table> 
        <el-table  :data="nation_data" v-model="nation_data" style="width: 100%;display: none" id="table_excel5">
          <el-table-column  prop="name" label="民族" width="180">
          </el-table-column>
          <el-table-column  prop="value" label="人数" width="180">
          </el-table-column> 
        </el-table>  
        <el-table  :data="gender_hasPay" v-model="gender_hasPay" style="width: 100%;display: none" id="table_excel6">
          <el-table-column  prop="name" label="性别" width="180">
          </el-table-column>
          <el-table-column  prop="value" label="人数" width="180">
          </el-table-column> 
        </el-table> 
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
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
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

                radioTotal:1,
                radioPay:1,
                radioMember:1,
                radioEducation:1,
                radioNation:1,
                radioGender:1,

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

                first_data:[],
                pay_data:[],
                pay_unPay:0,
                pay_hasPay:0,
                member_unPay:0,
                member_hasPay:0,
                member_data:[],
                pay_data:[],
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
            download (value,name) {
                 /* generate workbook object from table */
                 var wb = XLSX.utils.table_to_book(document.querySelector("#table_excel"+value))
                 /* get binary string as output */
                 var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                 try {
                     FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name+'.xlsx')
                 } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                 return wbout
             }, 
            dimensionChange:function(){
                console.log('dimensionCHange')
                //切换选项卡，默认恢复到最初的统计：取消全选，加上时间范围
                // if(this.selectAll==true){
                //     if(this.defaultType == "year"){
                //         this.defaultStartYear = '';
                //         this.defaultEndYear = ''; 
                //     }
                //     else if(this.defaultType == "month"){                    
                //         this.defaultStartMonth = '';
                //         this.defaultEndMonth = ''; 

                //     }
                //     else{    
                //         this.defaultStartDate = '';
                //         this.defaultEndDate = ''; 
                //     }  
                // }
                // else{

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

                // }
                this.selectAll=false;
                this.drawCharts();

            },
            typeChange:function(value){  
                console.log('typeChange')
                  if(this.defaultType == "year"){
                        if(this.defaultStartYear>this.defaultEndYear){
                            this.$message.error("开始年份不能大于结束年份");
                            this.defaultStartYear= _defaultStartYear
                            this.defaultEndYear = _defaultEndYear
                            return;
                        } 
                    }
                    else if(this.defaultType == "month"){
                        if(this.defaultStartMonth>this.defaultEndMonth){
                            this.$message.error("开始月份不能大于结束月份");
                            this.defaultStartMonth=_defaultStartMonth
                            this.defaultEndMonth = _defaultEndMonth
                            return;
                        } 

                    }
                    else{
                        if(this.defaultStartDate>this.defaultEndDate){
                            this.$message.error("开始时间不能大于结束时间");
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
                console.log("clickAgain")
                 this.selectTime=1;
            },
            queryAll:function(){  
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
            changePay:function(){
                console.log('changePay');
                if(this.radioPay=="1")
                    this.drawColumnPayFirst()
                else
                    this.drawColumnPaySecond() 
            },
            changeMember:function(){
                console.log("changeMember")
                if(this.radioMember=="1")
                    this.drawColumnMemberFirst()
                else
                    this.drawColumnMemberSecond() 
            },
            changeEducation:function(){
                console.log("changeEducation")

                if(this.radioEducation=="1")
                    this.drawColumnEducationFirst()
                else
                    this.drawColumnEducationSecond() 
            },
            changeNation:function(){
                console.log("changeNation")

                if(this.radioNation=="1")
                    this.drawColumnNationFirst()
                else
                    this.drawColumnNationSecond() 
            },
            changeGender:function(){
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
            drawColumnTotal:function() {
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
                this.first_data = [];
                for(var i = 0;i<newData.length;i++){
                    var temp = Array();
                    temp['name'] = newColumn[i];
                    temp['value'] = newData[i];
                    this.first_data.push(temp);
                } 

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
                            data: newData,
                            itemStyle : { normal: {label : {show: true}}}
                        }, 
                    ],
                    toolbox: {
                    　　show: true,
                    　　feature: {
                    　　　　saveAsImage: {
                            name:"会员统计分布走势图",
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
                this.first_data = [];
                for(var i = 0;i<newData.length;i++){
                    var temp = Array();
                    temp['name'] = newColumn[i];
                    temp['value'] = newData[i];
                    this.first_data.push(temp);
                } 
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

                                    // },   ,
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
                                name:"会员统计分布柱状图",
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
                    // res = JSON.parse(res)

                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;

                    if(res.status>0){
                        this.$message.error("缴费"+res.desc);
                        return;
                    }
                    this.pay_data=[];
                    this.pay_unPay = res.outdata.unPay;
                    this.pay_hasPay = res.outdata.hasPay;
                    var temp = new Array();
                    temp['name'] = "未缴费";
                    temp['value'] = this.pay_unPay;
                    this.pay_data.push(temp);
                    var temp = new Array();
                    temp['name'] = "已缴费";
                    temp['value'] = this.pay_hasPay;
                    this.pay_data.push(temp);

                    
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
                            formatter: "{a} <br/>{b} : {c} ({d}%)",

                        },
                        legend: {
                            orient: 'vertical',
                            left: 'right',
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
                                    },
                                     normal:{ 
                                           label:{ 
                                              show: true, 
                                              formatter: '{b} : {c} ({d}%)' 
                                           }, 
                                           labelLine :{show:true} 
                                     } 
                                }
                            }
                        ],
                        color:global_.colorSelect,

                        toolbox: {

                        　　show: true,
                            left: 'left',

                        　　feature: {

                        　　　　saveAsImage: {
                            name:"缴费状态计分布饼状图",

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
                    // res = JSON.parse(res) 
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 
                    if(res.status>0){
                        this.$message.error("缴费"+res.desc);
                        return;
                    }
                    this.pay_unPay = res.outdata.unPay;
                    this.education_hasPay = res.outdata.hasPay; 


                    this.pay_data=[];
                    var temp = new Array();
                    temp['name'] = "未缴费";
                    temp['value'] = this.pay_unPay;
                    this.pay_data.push(temp);
                    var temp = new Array();
                    temp['name'] = "已缴费";
                    temp['value'] = this.education_hasPay;
                    this.pay_data.push(temp);
                    
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
                            name:"缴费状态计分布柱状图",

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
                    // res = JSON.parse(res)

                    if(res.status>0){
                        this.$message.error("会员"+res.desc);
                        return;
                    }
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false;


                    this.member_unPay = res.outdata['初级会员'];
                    this.member_hasPay = res.outdata['正式会员'];

                    this.member_data=[];
                    var temp = new Array();
                    temp['name'] = "初级会员";
                    temp['value'] = this.member_unPay;
                    this.member_data.push(temp);
                    var temp = new Array();
                    temp['name'] = "正式会员";
                    temp['value'] = this.member_hasPay;
                    this.member_data.push(temp);
                    
                     
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
                            left: 'right',
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
                                    },
                                     normal:{ 
                                           label:{ 
                                              show: true, 
                                              formatter: '{b} : {c} ({d}%)' 
                                           }, 
                                           labelLine :{show:true} 
                                     } 
                                }
                            }
                        ],
                        color:global_.colorSelect,

                        toolbox: {

                        　　show: true,
                            left: 'left',

                        　　feature: {

                        　　　　saveAsImage: {
                            name:"会员类型分布柱状图",

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


                    this.member_data=[];
                    var temp = new Array();
                    temp['name'] = "初级会员";
                    temp['value'] = this.member_unPay;
                    this.member_data.push(temp);
                    var temp = new Array();
                    temp['name'] = "正式会员";
                    temp['value'] = this.member_hasPay;
                    this.member_data.push(temp);
                    
                    
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
                            name:"会员类型分布饼状图",

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

                    // console.log(111111111)
                    // console.log(res)
                    // console.log(this.education_data)
                    // for(var i =res.data.length-1;i>=0;i--){
                    //     if((res.data.length-i)>=displayCount){
                    //         break;
                    //     }
                    //     var tep ={};var temp= []; 
                    //     tep.value = res.data[i].count;
                    //     tep.name = res.data[i].name;
                    //     this.education_data[i] = tep;
                    //     this.education_dataColumn[i] = tep['name'];
                    // }   

                    //为了页面展示，做了反转数据
                    // this.education_data = this.education_data.reverse() 
                    // let thisColor = [];
                    // for(var i = global_.colorSelect.length-1;i>=0;i--){
                    //     thisColor.push(global_.colorSelect[i])
                    // }

                    
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
                            left: 'right',
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
                                    },
                                     normal:{ 
                                           label:{ 
                                              show: true, 
                                              formatter: '{b} : {c} ({d}%)' 
                                           }, 
                                           labelLine :{show:true} 
                                     } 
                                }
                            }
                        ],
                        color:global_.colorSelect,

                        toolbox: {

                        　　show: true,
                            left:'left',
                        　　feature: {

                        　　　　saveAsImage: {
                            name:"学历状态分布病状图",

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
                      title: { text: '学历状态' },
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
                            name:"学历状态分布柱状图",

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
                            left: 'right',
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
                                    },
                                     normal:{ 
                                           label:{ 
                                              show: true, 
                                              formatter: '{b} : {c} ({d}%)' 
                                           }, 
                                           labelLine :{show:true} 
                                     } 
                                }
                            }
                        ],
                        color:global_.colorSelect,

                        toolbox: {

                        　　show: true,
                            left:'left',

                        　　feature: {

                        　　　　saveAsImage: {
                            name:"民族状态分布病状图",

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
                            name:"民族状态分布柱状图",

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
                            left: 'right',
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
                                    },
                                     normal:{ 
                                           label:{ 
                                              show: true, 
                                              formatter: '{b} : {c} ({d}%)' 
                                           }, 
                                           labelLine :{show:true} 
                                     } 
                                }
                            }
                        ],
                        color:global_.colorSelect,

                        toolbox: {

                        　　show: true,
                            left: 'left',

                        　　feature: {

                        　　　　saveAsImage: {
                            name:"性别分布饼状图",

                        　　　　show:true,

                        　　　　excludeComponents :['toolbox'],

                        　　　　pixelRatio: 2,
                                title:'下载'

                        　　　　}

                        　　}

                        }
                    });



                    // $('#export').on('click', function () {
                    //     alert('111');
                    //     var chartExportUrl = '/lang/EchartTest/Export';
                    //     var picBase64Info = myChart.getDataURL();//获取echarts图的base64编码，为png格式。

                    //     $('#chartForm').find('input[name="base64Info"]').val(picBase64Info);//将编码赋值给输入框                                               
                    //     $('#chartForm').submit();
                    // });
                    return ;
                });
            },
            // 性别柱状图
            drawColumnGenderSecond () { 
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
                                name:"性别分布柱状图",

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
            this.drawCharts();
        },
        updated: function () { 
        },


    }

</script>

<style scoped>

</style>