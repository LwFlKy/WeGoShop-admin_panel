<template>
	<div v-loading="loading.all" class="shopDataReport">

		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span>条件选择</span>
		  </div>
		  <div class="toolbar">

			<el-row :gutter="20">
			  <el-col :span="8">
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
			  </el-col>
			  <el-col :span="6">
			  	<el-input v-model="searchText" placeholder="请输入要搜索的店铺名称"></el-input>
			  </el-col>

			</el-row>
		  </div>
		</el-card>

		<br>

		<el-card class="box-card">
		  <div slot="header"  v-loading="loading.totalData" class="clearfix">
		    <span>全平台核销数据</span>
		  </div>
		  <div class="text item">
		  	<div id="s_totalData" class='chart'></div>
		  	<div>总结算金额：￥{{total}}</div>
		  </div>
		</el-card>
		<br>
		<el-card class="box-card" v-loading="loading.shopData">
		  <div slot="header" class="clearfix">
		    <span>商户核销数据</span>
		  </div>
		  <div class="text item" v-loading="loading.shopDataChart">
		  	<div id="s_shopData" class='chart'></div>
		  </div>
		  <el-pagination
		    layout="prev, pager, next"
		    :total="pageLength"
		    @current-change="changePage">
		  </el-pagination>
		  <el-table
			:data="showingShopData"
			style="width: 100%">
			<el-table-column
			  prop="shop_id"
			  label="商户ID">
			</el-table-column>
			<el-table-column
			  prop="name"
			  label="商户名称">
			</el-table-column>
			<el-table-column
			  label="销售额">
				<template slot-scope="scope">
					￥{{parseFloat(scope.row.fee)}}
				</template>
			</el-table-column>
			<el-table-column>
				<template slot-scope="scope">
					<el-button type="text" @click="showShopChart(scope.row.data)" size="medium">
						查看图表
					</el-button>
				</template>
			</el-table-column>
		  </el-table>
		</el-card>
	</div>
</template>
<style type="text/css">
	.chart{
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
				total:0,
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
				shopData:[],
				chart:{},
				loading: {
					shopData:false,
					totalData:false,
					all:true,
					shopDataChart:false,
				},
				searchText:"",
				init:true,
				showingShopData:[],
				pageLength:0
			}
		},
		watch:{
			searchText: function() {
				this.getData([this.value6[0].toLocaleDateString(),this.value6[1].toLocaleDateString()],this.searchText)
			}
		},
		components:{
		},
		methods:{
			changePage(page){
				this.showingShopData = this.shopData[page-1]
			},
			initEcharts(){
				this.chart.totalData = echarts.init(document.getElementById('s_totalData'),'light');
				this.chart.totalData.setOption({
					    xAxis: {
					    	type:"category",
					    },
					    tooltip: {
					        trigger: 'axis',
					        formatter: function (params) {
					            params = params[0];
					            return [params.data.day +"<br />销量"+ params.data.fee];
					        },
					        axisPointer: {
					            animation: false
					        }
					    },
					    dataset:{
					    	dimensions: ['fee','day'],
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
				                x: 'day',
				                y: 'fee'
				            },
					    }]
					}
				)
				this.chart.shopData = echarts.init(document.getElementById('s_shopData'),'light');
				this.chart.shopData.setOption({
					    xAxis: {
					    	type:"category",
					    },
					    tooltip: {
					        trigger: 'axis',
					        formatter: function (params) {
					            params = params[0];
					            return [params.data.day +"<br />销售额"+ params.data.fee];
					        },
					        axisPointer: {
					            animation: false
					        }
					    },
					    dataset:{
					    	dimensions: ['fee','day'],
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
				                x: 'day',
				                y: 'fee'
				            },
					    }]
					}
				)
				this.loading.all = false
			},
			change(res){
				if (this.value6 !== null) {
					this.getData([this.value6[0].toLocaleDateString(),this.value6[1].toLocaleDateString()])
				}else{
					this.totalData.setOption({
						dataset:{
							source:[{}]
						}
					})
				}
			},
			jump () {
		       // 用 class="d_jump" 添加锚点
		       let jump = document.querySelectorAll('#s_shopData')
		       let total = jump[0].offsetTop-60
		       let distance = document.querySelectorAll('.el-scrollbar__wrap')[0].scrollTop
		       // 平滑滚动，时长500ms，每10ms一跳，共50跳
		       let step = total / 10
		       if (total > distance) {
		         smoothDown()
		       } else {
		         let newTotal = distance - total
		         step = newTotal / 10
		         smoothUp()
		       }
		       function smoothDown () {
		         if (distance < total) {
		           distance += step
		           document.querySelectorAll('.el-scrollbar__wrap')[0].scrollTop = distance
		           setTimeout(smoothDown, 10)
		         } else {
		           document.querySelectorAll('.el-scrollbar__wrap')[0].scrollTop = distance
		         }
		       }
		       function smoothUp () {
		         if (distance > total) {
		           distance -= step
		           document.querySelectorAll('.el-scrollbar__wrap')[0].scrollTop = distance
		           setTimeout(smoothUp, 10)
		         } else {
		           document.querySelectorAll('.el-scrollbar__wrap')[0].scrollTop = distance
		         }
		      } 
		    },
			getData(time,searchText = ""){
				this.postToServer("https://shop.funnything.net/admin/data/getVoucherData",{time:time,searchText:searchText},(res)=>{
					this.getTotalData(res.data.data)
					this.getShopData(res.data.data)
					this.init = false
				})
			},
			showShopChart(data){
				this.loading.shopDataChart = true
				let showingData = []
				let isGo = true
				for (var x = data.length - 1; x >= 0; x--) {
					for (var y = showingData.length - 1; y >= 0; y--) {
						if (showingData[y].day == data[x].end_time.split(' ')[0]) {
							showingData[y].fee = parseInt(showingData[y].fee) + parseInt(data[x].fee)
							isGo = false
						}
					}
					if (isGo) {
						showingData.push({day:data[x].end_time.split(' ')[0],fee:data[x].fee})
					}
					isGo = true
				}
				showingData.sort(function(a,b) {
			        if (a.day < b.day ) {
			            return -1;
			        } else if (a.day > b.day ) {
			            return 1;
			        } else {
			            if (a.day < b.day ) {
			                return 1;
			            } else if (a.day > b.day ) {
			                return -1;
			            }
			            return 0;
			        }
				})
				for (var i = showingData.length - 1; i >= 0; i--) {
					showingData[i].fee = parseFloat(showingData[i].fee)
				}
				if (showingData.length == 0) {
					showingData = [{}]
				}
				this.chart.shopData.setOption({
					dataset:{
						source:showingData
					}
				})
				this.jump()
				this.loading.shopDataChart = false
			},
			getTotalData(data){
				this.loading.totalData = true
				let showingData = []
				let isGo = true
				for (var x = data.length - 1; x >= 0; x--) {
					for (var y = showingData.length - 1; y >= 0; y--) {
						if (showingData[y].day == data[x].end_time.split(' ')[0]) {
							showingData[y].fee = parseInt(showingData[y].fee) + parseInt(data[x].fee)
							isGo = false
						}
					}
					if (isGo) {
						showingData.push({day:data[x].end_time.split(' ')[0],fee:data[x].fee})
					}
					isGo = true
				}
				showingData.sort(function(a,b) {
			        if (a.day < b.day ) {
			            return -1;
			        } else if (a.day > b.day ) {
			            return 1;
			        } else {
			            if (a.day < b.day ) {
			                return 1;
			            } else if (a.day > b.day ) {
			                return -1;
			            }
			            return 0;
			        }
				})
				this.total = 0
				for (var i = showingData.length - 1; i >= 0; i--) {
					showingData[i].fee = parseFloat(showingData[i].fee)
					this.total = parseInt(this.total + showingData[i].fee)
				}
				if (showingData.length == 0) {
					showingData = [{}]
				}
				this.chart.totalData.setOption({
					dataset:{
						source:showingData
					}
				})
				this.loading.totalData = false
			},
			getShopData(data){
				this.loading.shopData = true
				let showingData = []
				let isGo = true
				for (var x = data.length - 1; x >= 0; x--) {
					for (var y = showingData.length - 1; y >= 0; y--) {
						if (showingData[y].shop_id == data[x].shop_id) {
							showingData[y].fee = parseInt(showingData[y].fee) + parseInt(data[x].fee)
							showingData[y].data.push(data[x])
							isGo = false
						}
					}
					if (isGo) {
						showingData.push({shop_id:data[x].shop_id,name:data[x].name,fee:data[x].fee,data:[data[x]]})
					}
					isGo = true
				}
				showingData.sort(function(a,b) {
			        if (a.shop_id < b.shop_id ) {
			            return -1;
			        } else if (a.shop_id > b.shop_id ) {
			            return 1;
			        } else {
			            if (a.shop_id < b.shop_id ) {
			                return 1;
			            } else if (a.shop_id > b.shop_id ) {
			                return -1;
			            }
			            return 0;
			        }
				})
				this.pageLength = showingData.length
				let page = 0
				let temp = []
				temp.push([])
				for (var i = 0; i < showingData.length; i++) {
					temp[page].push(showingData[i])
					if ((i)%10 == 0) {
						page++
						temp.push([])
					}
				}
				showingData = temp
				this.shopData = showingData
				this.showingShopData = this.shopData[0]
				this.loading.shopData = false
			},

		},
		mounted:function() {
			this.initEcharts()
		}
	}
</script>