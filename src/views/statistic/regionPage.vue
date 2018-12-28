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
            统计理事总数：{{totalCompany}}
        </div> 
        <div class="echarts">
            <div :style="{height:'400px',width:'80%'}" ref="myEchart"></div>
            <el-table  :data="memberTableData" style="width: 100%">
              <el-table-column  prop="city" label="地区" width="180">
              </el-table-column>
              <el-table-column  prop="count" label="会员人数" width="180">
              </el-table-column> 
            </el-table>
        </div>
 
        <div class="echarts">
            <div :style="{height:'400px',width:'80%'}" ref="myEchartCompany"></div>
            <el-table  :data="companyTableData" style="width: 100%">
              <el-table-column  prop="city" label="地区" width="180">
              </el-table-column>
              <el-table-column  prop="count" label="理事人数" width="180">
              </el-table-column> 
            </el-table>
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
    let  defaultNow =new Date()
    var _this = {} 
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
                defaultStartDate: new Date(defaultNow.getTime() - 1000 * 60 * 60 * 24 * 365),
                defaultEndDate: defaultNow,

            }
        },
        methods: {  
            queryAgain(){
                console.log("queryAgain")
                // this.selectAll = false;
                this.echartsMapMember();
                this.echartsMapCompany(); 

            },
            queryAll(){
                console.log("queryAll")
                if(this.selectAll){
                    this.defaultStartDate = "";
                    this.defaultEndDate = "";
                }
                else{

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
                    if(res.status>0){ 
                        console.log(res)
                        this.$message.error("会员"+res.desc);
                        return;
                    }
                    console.log(res.out_data);
 
                    this.totalMemers = res.out_data['total']; 
                    // console.log(res.data) 
                    var realData =[];
                    let j = 0;
                    // for (var i = 0;i<=10; i++) {
                    for (var i = 0;i<=res.data.length - 1; i++) {
                        // console.log(res.data[i])
                        if(res.data[i].name!="不详"){

                            var temp={};
                            temp.value=res.data[i].count;
                            var name = res.data[i].name;
                            temp.name=name.replace("省","");
                            realData[j]= temp;
                            j++;
                            if(res.data[i].name == "北京"){
                                _this.memberTableData= [];
                                let memberTableData= new Array();
                                console.log(_this.memberTableData ); 
                                var cityArray = res.data[i].cityArray;
                                for(var value in cityArray){
                                    for(var one in cityArray[value]){
                                        console.log(one)
                                        var temp ={};
                                        temp.count =cityArray[value][one]; 
                                        temp.city =one;  
                                        memberTableData.push(temp);
                                    }
                                }
                                _this.memberTableData= memberTableData ;   
                            }

                        }
                    }  
                    let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置   
                    myChart.on('click', function (param) {
                        // alert(param.name);
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
                                        temp.count =cityArray[value][one]; 
                                        temp.city =one;  
                                        memberTableData.push(temp);
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

                    return ;
                    });
            }, 
            echartsMapCompany:function(value){
                  console.log("getCompanyByProvince")    
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
                getCompanyByProvince(ret).then((res) => {
                    // res = JSON.parse(res)
                    // this.totalcount = this.form.totalcount;
                    this.listLoading = false; 
                    if(res.status>0){
                        console.log("getCompanyByProvince error");
                        console.log(res)
                        this.$message.error("理事"+res.desc);
                        return;
                    }
                    console.log(res.out_data);
                    this.totalCompany = res.out_data["total"];
                    // console.log(res.data)
                    
                    var realData =[];
                    let j = 0;
                    // for (var i = 0;i<=10; i++) {
                    for (var i = 0;i<=res.data.length - 1; i++) {
                        // console.log(res.data[i])
                        if(res.data[i].name!="不详"){

                            var temp={};
                            temp.value=res.data[i].count;
                            var name = res.data[i].name;
                            temp.name=name.replace("省","");
                            realData[j]= temp;
                            j++;
                            if(res.data[i].name == "北京"){
                                _this.memberTableData= [];
                                let memberTableData= new Array();
                                console.log(_this.memberTableData ); 
                                var cityArray = res.data[i].cityArray; 
                                for(var value in cityArray){
                                    console.log(value);
                                    for(var one in cityArray[value]){
                                        console.log(one)
                                        var temp ={};
                                        temp.count =cityArray[value][one]; 
                                        temp.city =one; 
                                        memberTableData.push(temp);
                                    }
                                }
                                _this.companyTableData= memberTableData ; 
                            }
                        }
                    }
                     
                let myChart = echarts.init(this.$refs.myEchartCompany); //这里是为了获得容器所在位置 
                    
                    myChart.on('click', function (param) {
                        // alert(param.name);
                        _this.companyTableData=[];
                        console.log(res.data.length)
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
                                        temp.count =cityArray[value][one]; 
                                        temp.city =one; 
                                        memberTableData.push(temp);
                                    }
                                }
                                _this.companyTableData= memberTableData ; 
                                console.log(_this.companyTableData );
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
            drawCharts() {
               
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