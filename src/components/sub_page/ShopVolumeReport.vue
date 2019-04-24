<template>
	<div class="shopVolumeReport">
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span>销量报表</span>
		  </div>
		  <div class="toolbar">
		  	<el-date-picker

		      v-model="value6"
		      @change="change"
		      type="daterange"
		      align="right"
		      unlink-panels
		      range-separator="至"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      :picker-options="pickerOptions2"
		      :default-value="new Date()">
		    </el-date-picker>
		  </div>
		  <div class="text item">
		  	<div id="s_totalVolume"></div>
		  </div>
		</el-card>
	</div>
</template>
<style type="text/css">
	#s_totalVolume{
		width: 100%;
		height: 300px;
	}
</style>
<script type="text/javascript">
	import yod from 'yod-mock'
	var Mock = require('mockjs')
	import echarts from 'echarts/lib/echarts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/dataZoom'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/chart/line'
	import 'echarts/lib/chart/scatter'

	export default{
		data(){
			return {
				pickerOptions2: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
				value6:[],
			}
		},
		components:{
		},
		methods:{
			initEcharts(){
				this.saleVolume = echarts.init(document.getElementById('s_totalVolume'),'light');
				this.saleVolume.setOption({
					    xAxis: {
					    	type:"category",
					    },
					    tooltip: {
					        trigger: 'axis',
					        formatter: function (params) {
					            params = params[0];
					            return [params.data.time +"<br />销量"+ params.data.fee];
					        },
					        axisPointer: {
					            animation: false
					        }
					    },
					    dataset:{
					    	dimensions: ['fee','time'],
					    	source: [
					    	{}
					    	]
					    },
						grid:{
							left:30,
							right:30,
							top:20,
							bottom:60
						},
					    yAxis: {
					        type: 'value',
					    },
					    dataZoom: [
				        {
				        	filterMode: 'empty',
				            show: true,
				            type: 'slider',
				            xAxisIndex: 0,
				        }
					    ],
					    series: [{
					        type: 'line',
							smooth: true,
				            encode: {
				                x: 'time',
				                y: 'fee'
				            },
					    }]
					}
				)
			},
			change(res){
				if (this.value6 !== null) {
					this.getData([this.value6[0].toLocaleDateString(),this.value6[1].toLocaleDateString()])
				}else{
					this.saleVolume.setOption({
						dataset:{
							source:[{}]
						}
					})
				}
			},
			getData(time){
				yod.type('Order',{
				        'fee': '@Int(50, 155)',
				        'time': "@Date('YYYY-MM-DD HH:mm:ss','"+time[0]+"', '"+time[1]+"')"
				})
				let data = yod('@Order.repeat(100)')
				data.sort(function(a,b) {
			        if (a.time < b.time ) {
			            return -1;
			        } else if (a.time > b.time ) {
			            return 1;
			        } else {
			            if (a.time < b.time ) {
			                return 1;
			            } else if (a.time > b.time ) {
			                return -1;
			            }
			            return 0;
			        }
				})
				this.saleVolume.setOption({
					dataset:{
						source:data
					}
				})
			},

		},
		mounted:function() {
			this.initEcharts()
			this.getData(["2018/5/21","2018/7/21"])
		}
	}
</script>