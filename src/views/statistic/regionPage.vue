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
        </div> 
        <div style="margin-top: 10px;margin-bottom: 10px">
            <span style="font-size: 20px;margin-right: 30px;font-weight: 4px">统计会员总数：{{totalMemers}}</span>
            <span style="font-size: 20px">统计理事单位总数：{{totalCompany}}</span>
        </div> 
        <div class="echarts">
            <div style="float: left; width: 100%;;margin-left: 30%;font-size: 16px;margin-top: 20px">会员地域分布</div>
            <div :style="{height:'400px',width:'70%',float:'left'}" ref="myEchart"></div>
            <div style="float:right;">
                <i class="fa fa-arrow-down" aria-hidden="true"  @click="download(1)"></i>
                <el-table  :data="memberTableData" style="width: 100%" id="memberId">
                  <el-table-column  prop="city" label="地区" width="180">
                  </el-table-column>
                  <el-table-column  prop="count" label="会员人数" width="180">
                  </el-table-column> 
                </el-table>
            </div>
        </div>
 
        <div class="echarts">
            <div style="float: left;width: 100%;margin-left: 30%;font-size: 16px;margin-top: 20px">理事单位地域分布</div>
            <div :style="{height:'400px',width:'70%',float:'left'}" ref="myEchartCompany"></div>
            <!-- <i class="el-icon-delete"></i> -->
            <div style="float:right;">
                <i class="fa fa-arrow-down" aria-hidden="true" @click="download(2)"></i>
                <el-table  :data="companyTableData" style="width: 100%" id="companyId">
                  <el-table-column  prop="city" label="地区" width="180">
                  </el-table-column>
                  <el-table-column  prop="count" label="理事单位" width="180">
                  </el-table-column> 
                </el-table>
            </div>
        </div> 


        <div style="float:left;width:50%;">
            <el-col :span="24" >
                <div id="chartMemberFirst" style="width:100%; height:400px;"></div>
            </el-col>
        </div>
        <div  style="float:right;width:45%;">
            <el-col :span="24">
                <div id="chartMemberSecond" style="width:100%; height:400px;"></div>
            </el-col>
        </div>
    </section>
   

</template>

<script>
    import util from '../../common/js/util'
    import  '../../common/js/china.js'
    import  '../../common/js/echarts.min.js'
    //import NProgress from 'nprogress'
    import { getMemberByProvince,getCompanyByProvince} from '../../api/api';
    // import moment from 'moment'
    import echarts from 'echarts'
    import global_ from './global'
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    let  now =new Date()
    var _this = {}  
    var resMemeber=[]
    var resCompany=[]
    export default {
 
        props: ["userJson"],

        beforeCreate(){
            _this = this;
          },
        data() {
            return {
                listLoading: false,
                totalMemers:0, 
                totalCompany:0, 
                memberTableData:[],
                companyTableData:[],
                // retopMemberData:[],
                // retopCompanyData:[],
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                selectAll:false,
                defaultStartDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365),
                defaultEndDate: now,
                selectTime:1,

                chartMemberFirst: null,
                chartMemberSecond: null,

                //初始数据
                initData:global_.operatorChinaData()

            }
        },
        methods: {  
            download:function(value){
                if(value==1){
                    this.exportExcel("#memberId","会员统计.xlsx")
                }
                else{
                    this.exportExcel("#companyId","理事统计.xlsx")

                }
            } ,
            exportExcel (value,name) {
                 /* generate workbook object from table */
                 var wb = XLSX.utils.table_to_book(document.querySelector(value))
                 /* get binary string as output */
                 var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                 try {
                     FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name)
                 } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                 return wbout
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
                    this.echartsMapMember();
                    this.echartsMapCompany(); 
                }            
            },
            clickAgain(){ 
                 this.selectTime=1;
            },

 
            queryAll(){ 
                if(this.selectAll){
                    this.selectTime=0;
                    this.defaultStartDate = "";
                    this.defaultEndDate = "";
                }
                else{
                    this.defaultStartDate=new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);
                    this.defaultEndDate = now;
                }

                this.echartsMapMember();
                this.echartsMapCompany(); 
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getConsume();
            },  
            selsChange: function (sels) {
                this.sels = sels;
            }, 
            
            echartsMapMember:function(value){

                console.log("echartsMapMember")    
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
                getMemberByProvince(ret).then((res) => {
                    // res = JSON.parse(res)
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 
                    var realData =[];
                    let j = 0;
                    if(res.status>0){
                        console.log(res)
                        this.$message.error("会员"+res.desc);
                        realData = this.initData;
                    }   
                    else{
                        // console.log(res.out_data);
                        resMemeber = res.data;
                        this.totalMemers = res.out_data['total']; 
                        // console.log(res.data) 

                        // for (var i = 0;i<=10; i++) {
                        for (var i = 0;i<=res.data.length - 1; i++) {
                            // console.log(res.data[i])
                            if(res.data[i].name!="不详"){

                                var temp={};
                                temp.value=res.data[i].count;
                                var name = res.data[i].name;
                                temp.name=name.replace("省","");

                                var cityArray = res.data[i].cityArray;
                                for(var value in cityArray){
                                    for(var one in cityArray[value]){
                                        if(one=='不详'){ //如果等于不详，减去所占数据
                                            temp.value =temp.value- parseInt(cityArray[value][one])

                                        }
                                    }
                                }
                                realData[j]= temp;
                                j++;
                                
                                if(res.data[i].name == "北京"){
                                    _this.memberTableData= [];
                                    let memberTableData= new Array();
                                    // console.log(_this.memberTableData ); 
                                    var cityArray = res.data[i].cityArray;
                                    for(var value in cityArray){
                                        for(var one in cityArray[value]){
                                            console.log(one)
                                            var temp2 ={};
                                            if(one!='不详'){
                                                temp2.count =cityArray[value][one]; 
                                                temp2.city =one;  
                                                memberTableData.push(temp2);
                                            } 
                                        }
                                    }
                                    _this.memberTableData= memberTableData ;   
                                }

                            }
                        }  

                    }
                    // console.log( "xkdkdkdkdkddkdkdk")
                    console.log( resMemeber.length)

                    let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置   
                    myChart.on('click', function (param) {
                        // alert(param.name);
                        res.data = resMemeber;
                        console.log(res.data)
                        console.log(res.data.length)
                        _this.memberTableData= [];
                        let memberTableData= new Array();
                        console.log(_this.memberTableData );
                        for(var i = 0;i<res.data.length;i++){
                            var dataName =res.data[i].name.replace("省","");
                            if(param.name==dataName){
                                var cityArray = res.data[i].cityArray;
                                for(var value in cityArray){
                                    for(var one in cityArray[value]){
                                        console.log(one)
                                        var temp ={};
                                        if(one!='不详'){
                                            temp.count =cityArray[value][one]; 
                                            temp.city =one;  
                                            memberTableData.push(temp);
                                        }
                                        else{ 
                                            realData[j-1].value =realData[j-1].value- parseInt(cityArray[value][one])

                                        }
                                    }
                                }
                                _this.memberTableData= memberTableData ;  
                                break;
                            }
                        }
                    });
 
                    var option = {
                        title : {
                            // text: '订单量',
                            // subtext: '纯属虚构',
                            x:'center'
                        },
                        tooltip : { //提示框组件。
                            trigger: 'item' //数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                        },
                        legend: {
                            orient: 'horizontal', //图例的排列方向
                            x:'left', //图例的位置
                            data:['会员统计']
                        },

                        visualMap: {//颜色的设置  dataRange
                            x: 'left',
                            y: 'center',
                            splitList: [
                                {start: 1500},
                                {start: 900, end: 1500},
                                {start: 310, end: 1000},
                                {start: 200, end: 300},
                                {start: 10, end: 200, label: '10 到 200（自定义label）'},
                                {start: 5, end: 5, label: '5（自定义特殊颜色）', color: '#077FBA'},
                                {end: 10}
                            ],
            //            min: 0,
            //            max: 2500,
            //            calculable : true,//颜色呈条状
                            text:['高','低'],// 文本，默认为数值文本
                            // color: ['#E0022B', '#E09107', '#A3E00B']
                            color: ['#C1D3E3', '#077FBA', '#C9514C']
                        },
                        toolbox: {//工具栏
                            show: false,
                            orient : 'vertical',//工具栏 icon 的布局朝向
                            x: 'right',
                            y: 'center',
                            feature : {//各工具配置项。
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},//数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
                                restore : {show: true},//配置项还原。
                                saveAsImage : {show: true}//保存为图片。
                            }
                        },
                        roamController: {//控制地图的上下左右放大缩小 图上没有显示
                            show: true,
                            x: 'right',
                            mapTypeControl: {
                                'china': true
                            }
                        },
                        series : [
                            {
                                name: '会员数',
                                type: 'map',
                                mapType: 'china',
                                roam: false,//是否开启鼠标缩放和平移漫游
                                itemStyle:{//地图区域的多边形 图形样式
                                    normal:{//是图形在默认状态下的样式
                                        label:{
                                            show:false,//是否显示标签
                                            textStyle: {
                                                color: "rgb(249, 249, 249)"
                                            }
                                        }
                                    },
                                    emphasis:{//是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                                        label:{show:true}
                                    }
                                },
                                top:"3%",//组件距离容器的距离
                                data:
                                realData
                                // [
                                //     {name: '北京',value: Math.round(Math.random()*2000)},
                                //     {name: '天津',value: Math.round(Math.random()*2000)},
                                 
                                // ]
                            }
                        ]
                    }; 
                    myChart.setOption(option);  
                    //绘制柱状图跟饼图 
                    this.drawCharts(realData); 
                    return ;
                });
            }, 
            
            //理事分布
            echartsMapCompany:function(value){
                console.log("getCompanyByProvince")    
                let para = {
                  
                    Committeeid : global_.Committeeid,
                    Key : global_.key,
                    startDay:this.dateFormatter(this.defaultStartDate),
                    endDay:this.dateFormatter(this.defaultEndDate), 
                };
                
                let ret = '';
                for (let it in para) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(para[it]) + '&'
                }
                this.listLoading = true;
                // URIEncoding="UTF-8";
                getCompanyByProvince(ret).then((res) => {
                    // res = JSON.parse(res)
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 

                    var realData =[];
                        let j = 0;
                    if(res.status>0){
                        console.log("getCompanyByProvince error"); 
                        this.$message.error("理事"+res.desc);
                        realData = this.realData;
                    }
                    else{
                        console.log(32339999999999999)
                        console.log(res.data);
                        resCompany = res.data;
                        this.totalCompany = res.out_data["total"];
                        // console.log(res.data)
                        
                        // for (var i = 0;i<=10; i++) {
                        for (var i = 0;i<=res.data.length - 1; i++) {
                            // console.log(res.data[i])
                            if(res.data[i].name!="不详"){

                                var temp={};
                                temp.value=res.data[i].count;
                                var name = res.data[i].name;
                                temp.name=name.replace("省","");
                                 var cityArray = res.data[i].cityArray;
                                for(var value in cityArray){
                                    for(var one in cityArray[value]){
                                        if(one=='不详'){ //如果等于不详，减去所占数据
                                            temp.value =temp.value- parseInt(cityArray[value][one])

                                        }
                                    }
                                }
                                realData[j]= temp;

                                j++;
                                if(res.data[i].name == "北京"){
                                    _this.memberTableData= [];
                                    let memberTableData= new Array();
                                    var cityArray = res.data[i].cityArray; 
                                    for(var value in cityArray){
                                        for(var one in cityArray[value]){
                                            var temp2 ={};
                                            if(one!='不详'){
                                                temp2.count =cityArray[value][one]; 
                                                temp2.city =one;  
                                                memberTableData.push(temp2);
                                            }  
                                        }
                                    }
                                    _this.companyTableData= memberTableData ; 
                                }

     

                            }
                        }

                    }
                     
                    let myChart = echarts.init(this.$refs.myEchartCompany); //这里是为了获得容器所在位置 
                    console.log(3434343434343434)
                    console.log(res.data)
                    myChart.on('click', function (param) {
                        // alert(param.name);
                        _this.companyTableData=[];
                        res.data = resCompany;
                        console.log(res.data)
                        let memberTableData= new Array(); 
                        for(var i = 0;i<res.data.length;i++){
                            var dataName =res.data[i].name.replace("省","");
                            if(param.name==dataName){
                                var cityArray = res.data[i].cityArray;
                                for(var value in cityArray){
                                    console.log(value);
                                    for(var one in cityArray[value]){
                                        console.log(one)
                                        var temp ={}; 
                                        if(one!='不详'){
                                            temp.count =cityArray[value][one]; 
                                            temp.city =one;  
                                            memberTableData.push(temp);
                                        }
                                        else{ 
                                            realData[j-1].value =realData[j-1].value- parseInt(cityArray[value][one])

                                        }
                                    }
                                }
                                _this.companyTableData= memberTableData ;  
                                break;


 
                            }
                        } 
                    });

                var option = {
                    title : {
                        // text: '订单量',
                        // subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : { //提示框组件。
                        trigger: 'item' //数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                    },
                    legend: {
                        orient: 'horizontal', //图例的排列方向
                        x:'left', //图例的位置
                        data:['理事统计']
                    },

                    visualMap: {//颜色的设置  dataRange
                        x: 'left',
                        y: 'center',
                        splitList: [
                            {start: 1500},
                            {start: 900, end: 1500},
                            {start: 310, end: 1000},
                            {start: 200, end: 300},
                            {start: 10, end: 200, label: '10 到 200（自定义label）'},
                            {start: 5, end: 5, label: '5（自定义特殊颜色）', color: '#077FBA'},
                            {end: 10}
                        ],
        //            min: 0,
        //            max: 2500,
        //            calculable : true,//颜色呈条状
                        text:['高','低'],// 文本，默认为数值文本
                        // color: ['#E0022B', '#E09107', '#A3E00B']
                        color: ['#C1D3E3', '#077FBA', '#C9514C']
                    },
                    toolbox: {//工具栏
                        show: false,
                        orient : 'vertical',//工具栏 icon 的布局朝向
                        x: 'right',
                        y: 'center',
                        feature : {//各工具配置项。
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},//数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
                            restore : {show: true},//配置项还原。
                            saveAsImage : {show: true}//保存为图片。
                        }
                    },
                    roamController: {//控制地图的上下左右放大缩小 图上没有显示
                        show: true,
                        x: 'right',
                        mapTypeControl: {
                            'china': true
                        }
                    },
                    series : [
                        {
                            name: '理事',
                            type: 'map',
                            mapType: 'china',
                            roam: false,//是否开启鼠标缩放和平移漫游
                            itemStyle:{//地图区域的多边形 图形样式
                                normal:{//是图形在默认状态下的样式
                                    label:{
                                        show:false,//是否显示标签
                                        textStyle: {
                                            color: "rgb(249, 249, 249)"
                                        }
                                    }
                                },
                                emphasis:{//是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                                    label:{show:true}
                                }
                            },
                            top:"3%",//组件距离容器的距离
                            data:realData
                        }
                    ]
                };
                myChart.setOption(option); 
                      
                    return ;
                });


            },
            drawCharts(data) {
                return;
                console.log(data)
                let temp1 = global_.operatorChinaDataForEchart(data);
                this.member_data=temp1['member_data'];
                this.member_column=temp1['member_column'];
                this.member_value=temp1['member_value']; 
                console.log(this.member_value)
                console.log(this.member_column)
                console.log(this.member_data)
                //底部俩图
                this.chartMemberFirst = echarts.init(document.getElementById('chartMemberFirst'));
                this.chartMemberFirst.setOption({
                    title: {
                        text: '会员地域饼状图',
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
                            name: '会员地域饼状图',
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
                                name:"会员地域分布饼状图",

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
                    title: { text: '会员地域柱状图' },
                        toolboxoltip: {},
                        xAxis: {
                          data: names
                        },
                        yAxis: {},
                        series: [{
                          name: '会员地域柱状图',
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
                                    name:"会员地域分布柱状图",

                            　　　　show:true,

                            　　　　excludeComponents :['toolbox'],

                            　　　　pixelRatio: 2,
                                    title:'下载'

                        　　　　}

                    　　}

                    }
                }); 
            },
        },
        mounted() {          
            console.log("mounted")
            console.log(this.defaultStartDate)
            this.echartsMapMember();
            this.echartsMapCompany();
        },
        updated: function () {
        },
    }


//     myChart.on('mouseover', function (params) {
//         var dataIndex = params.dataIndex;
//         // console.log(params);
//     });

//     function initEcharts(pName){
//         var myChart1 = echarts.init(document.getElementById('china-map'));
//         var option = {
//             title : {
//                 // text: '订单量',
//                 // subtext: '纯属虚构',
//                 x:'center'
//             },
//             tooltip : {//提示框组件。
//                 trigger: 'item'//数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
//             },
//             legend: {
//                 show: false,
//                 orient: 'horizontal',//图例的排列方向
//                 x:'left',//图例的位置
//                 data:['订单量']
//             },

//             visualMap: {//颜色的设置  dataRange
//                 x: 'left',
//                 y: 'center',
//                 // splitList: [
//                 //     {start: 1500},
//                 //     {start: 900, end: 1500},
//                 //     {start: 310, end: 1000},
//                 //     {start: 200, end: 300},
//                 //     {start: 10, end: 200, label: '10 到 200（自定义label）'},
//                 //     {start: 5, end: 5, label: '5（自定义特殊颜色）', color: '#077FBA'},
//                 //     {end: 10}
//                 // ],
// //            min: 0,
// //            max: 2500,
//                 calculable : true,//颜色呈条状
//                 text:['高','低'],// 文本，默认为数值文本
//                 // color: ['#E0022B', '#E09107', '#A3E00B']
//                 color: ['#C54B47','#E87A5C', '#E4C559', '#8FB95C','#59B0CA','#037AB5','#C2CCD5']
//             },
//             toolbox: {//工具栏
//                 show: true,
//                 orient : 'vertical',//工具栏 icon 的布局朝向
//                 x: 'right',
//                 y: 'center',
//                 feature : {//各工具配置项。
//                     mark : {show: true},
//                     dataView : {show: true, readOnly: false},//数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
//                     restore : {show: true},//配置项还原。
//                     saveAsImage : {show: true}//保存为图片。
//                 }
//             },
//             roamController: {//控制地图的上下左右放大缩小 图上没有显示
//                 show: true,
//                 x: 'right',
//                 mapTypeControl: {
//                     'china': true
//                 }
//             },
//             series : [
//                 {
//                     name: '订单量',
//                     type: 'map',
//                     mapType: pName,
//                     roam: false,//是否开启鼠标缩放和平移漫游
//                     itemStyle:{//地图区域的多边形 图形样式
//                         normal:{//是图形在默认状态下的样式
//                             label:{
//                                 show:false,//是否显示标签
//                                 textStyle: {
//                                     color: "rgb(249, 249, 249)"
//                                 }
//                             }
//                         },
//                         emphasis:{//是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
//                             label:{show:false}
//                         }
//                     },
//                     top:"3%",//组件距离容器的距离

//                 }
//             ]
//         };
//         myChart1.setOption(option);
//         myChart1.on('click', function (param) {
//             initChina();
//         });
//     }


//     //定义全国省份的数组
//     var provinces = ['shanghai', 'hebei','shanxi','neimenggu','liaoning','jilin','heilongjiang','jiangsu','zhejiang','anhui','fujian','jiangxi','shandong','henan','hubei','hunan','guangdong','guangxi','hainan','sichuan','guizhou','yunnan','xizang','shanxi1','gansu','qinghai','ningxia','xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen', 'taiwan'];

//     var provincesText = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林','黑龙江',  '江苏', '浙江', '安徽', '福建', '江西', '山东','河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门', '台湾'];




    // //展示对应的省
    // // showprovince（province[i],provinceText[i])改成这样，function（pName,Chinese_）{}
    // function  showProvince(pName, Chinese_){

    //     //这写省份的js都是通过在线构建工具生成的，保存在本地，需要时加载使用即可，最好不要一开始全部直接引入。
    //     loadBdScript('$'+pName+'JS','js/province/'+pName+'.js',function(){

    //         //初始化echarts:具体代码参考上面初始化中国地图即可，这里不再重复。
    //         initEcharts(Chinese_) ;

    //     });
    // }

    // //加载对应的JS
    // function loadBdScript(scriptId, url, callback) {
    //     var script = document.createElement("script")
    //     script.type = "text/javascript";
    //     if (script.readyState){  //IE
    //         script.onreadystatechange = function(){
    //             if (script.readyState == "loaded" || script.readyState == "complete"){
    //                 script.onreadystatechange = null;
    //                 callback();
    //             }
    //         };
    //     } else {  //Others
    //         script.onload = function(){
    //             callback();
    //         };
    //     }
    //     script.src = url;
    //     script.id = scriptId;
    //     document.getElementsByTagName("head")[0].appendChild(script);
    // };


</script>

<style scoped>

</style>