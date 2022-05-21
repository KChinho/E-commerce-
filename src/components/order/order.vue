<template>
	<div>
	<!--面包屑-->
	 <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
     </el-breadcrumb>
    <!--卡片视图--> 

  <el-card class="box-card">
  	<!--搜索框-->
   <el-row>
   	<el-col :span="8">
     <el-input placeholder="请输入内容" v-model="orderList.query" :clearable="true" class="input-with-select" >
    
    <el-button slot="append" icon="el-icon-search" @click="orderInputSogo"></el-button>
    </el-input>
   	</el-col>	
   </el-row>
   <!--表格区域-->
   <el-row>
   	  <el-table :data="tableDataOrder" style="width: 100%" border stripe>
   	  	<el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="order_number" label="订单编号">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100px">
      </el-table-column>
       <el-table-column prop="order_pay" label="是否付款" width="100px">
       	<template slot-scope="scope">
       		<el-tag type="success" v-if="scope.row.order_pay==1">已支付</el-tag>

            <el-tag type="danger" v-else-if="scope.row.order_pay==0">未支付</el-tag>
       	</template>
      </el-table-column>
       <el-table-column prop="is_send" label="是否发货" width="100px">
      </el-table-column>
       <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">
        	{{scope.row.create_time|dateFormat}}
        	
        </template>

      </el-table-column>
       <el-table-column  label="操作">
       	 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editConsigneeAddr"></el-button>
       	 <el-button type="success" icon="el-icon-location-outline" size="mini" @click="kuaidOrder"></el-button>
      </el-table-column>
   </el-table>

   </el-row>

   <!--分页-->
   <el-row>
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :page-sizes="[5, 10, 15]"
      :page-size="orderList.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-row>


  <!--编辑地址对话框-->
 <el-dialog  title="修改地址"
  :visible.sync="orderDialogVisible"
 @close="handleClose"
  width="50%"
  >
  
<el-form :model="orderRuleForm" :rules="orderRules" ref="orderForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市县" prop="addOrder1">
    <el-cascader
    v-model="orderRuleForm.addOrder1"
  :options="citydata"
    
   ></el-cascader>
  </el-form-item>

  <el-form-item label="详细地址" prop="addOrder2">
    <el-input v-model="orderRuleForm.addOrder2"></el-input>
  </el-form-item>
</el-form>


  <span slot="footer" class="dialog-footer">
    <el-button @click="orderDialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="orderDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>


 <!--物流信息对话框-->

 <el-dialog title="物流信息" :visible.sync="kuaidDialogVisible" width="50%"
  >
   <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in orderActivities"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
 
</el-dialog>






  </el-card>

	</div>

</template>

<script>
import citydata from './citydata.js';

import res from './data.js'

export default{
	data(){
		return{
		orderList:{
			//查询参数
			query:'',
			//当前页码
			pagenum:1,
			//每页显示条数
			pagesize:10,

		},
		//表格数据
		tableDataOrder:[],
		//总数据条数
		total:0,
		//修改地址对话框
		orderDialogVisible:false,
		//查看物流信息
		kuaidDialogVisible:false,
		orderActivities:[],
		//修改地址表单
		orderRuleForm:{
			addOrder1:[],
			addOrder2:"",
		},
		//验证规则
	     orderRules:{
	     	 addOrder1:[{required:true,message:"请选择地址",trigger: 'blur'}],
	     	 addOrder2:[{required:true,message:"请输入详细地址",trigger: 'blur'}]
	     },
	     citydata,

		}
	},
	created(){
		//页面加载就发起请求 获取该页面的数据
		this.getOrderList();

	},
	methods:{
		//该页面的数据
		async getOrderList(){
		 //发起请求
		const {data :res}=await this.$http.get("orders",{params:this.orderList})  
          if(res.meta.status !== 200) return this.$message.error('/获取数据失败')

           	

        this.tableDataOrder=res.data.goods;
        this.total=res.data.total;

		},
      //搜索框函数
      orderInputSogo(){

      },
      //分页功能触发事件 总条数
      handleSizeChange(newsize){
         this.orderList.pagesize=newsize;
         this.getOrderList();
      },
      //分页功能 当前页触发函数
      handleCurrentChange(x){
         this.orderList.pagenum=x;
         this.getOrderList();
      },
      //修改地址按钮触发
      editConsigneeAddr(){
      	this.orderDialogVisible=true

      },
      //对话框关闭市触发
      handleClose(){
      	console.log("cc")
      	this.$refs.orderForm.resetFields()
      },
      //订单物流信息触发
      async kuaidOrder(){
      	this.kuaidDialogVisible=true
        this.orderActivities=res

        console.log(this.orderActivities)

      }


	}
}
</script>
<style lang="less" scoped>
.el-pagination{margin-top:15px;}
</style>