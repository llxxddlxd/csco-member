<template>
    <section class="chart-container">


    <el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" style="margin:10px;width:20%;min-width:100px;">
    
		<el-form-item label="统计会员总数">
		</el-form-item	>

		</el-form-item	>
	</el-form>
        <el-row>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
    
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
// http://meeting.csco.org.cn/api/muser.asmx
	import {getContent} from '../../api/api';

    export default {
        data() {
            return {
                chartColumn: null,

           		form: {
                       totalcount:"100",
                       Committeeid:"1",
                       Key:"79ECFB2F3F0C098B",
                       startDay:"",
                       endDay:"",
				}

            }
        },
        
        
        methods: {
               //获取
			getList() {
				let para = {
                    Committeeid : 1,
                    Key : "79ECFB2F3F0C098B",
                    startYear:"1",
                    endYear:"2",
                    // startDay:'2018',
                    // endDay:'1',
                    // province:"北京",
				};
                let ret = ''
                for (let it in para) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(para[it]) + '&'
                }
				this.listLoading = true;
                // URIEncoding="UTF-8";
				getContent(ret).then((res) => {
                    console.log("aaaaaaaaaaa")
                    res = JSON.parse(res)
                    console.log(res);
                    // this.totalcount = this.form.totalcount;
					this.listLoading = false;
                    console.log(res);
                    return;
				});
		},
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                var names = ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"];
                var number = [5, 20, 36, 10, 10, 20];
                this.chartColumn.setOption({
                  title: { text: 'Column Chart' },
                  tooltip: {},
                  xAxis: {
                      data: names
                  },
                  yAxis: {},
                  series: [{
                      name: '销量',
                      type: 'bar',
                      data: number,
                    }]
                });
            },

        
            drawCharts() {
                this.drawColumnChart()
                this.getList()
            },
        },

        mounted: function () {
            
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }

    .el-col {
        padding: 30px 20px;
    }
</style>
