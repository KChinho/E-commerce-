<template>
 <div>
 	<!--头部面包屑-->
	<el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
    <!--搜索-->	
     <el-row>
      <el-col :span="8">
      	<el-input placeholder="请输入内容" v-model="getGoodsData.query" :clearable="true" class="input-with-select">
    
    <el-button slot="append" icon="el-icon-search" @click="goodsInputSogo"></el-button>
  </el-input>
      </el-col>
      <el-col :span="4">
      	<el-button type="primary" @click="addGoods">添加商品</el-button>
      </el-col>
     </el-row>
    <!--表格区域-->
    <el-row>
    <el-table :data="goodsTableData" style="width: 100%" stripe border>
    	 <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称"  >
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="90">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"  width="90">
      </el-table-column>
      <el-table-column  label="创建时间" prop="add_time" width="120">
        <template slot-scope="scope">
         {{scope.row.add_time|dateFormat}}	
         </template>

      </el-table-column>
      <el-table-column label="操作" width="180" >
       <template slot-scope="scope">
      	<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
      	<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
       </template>
      </el-table-column>

    
     
    </el-table>
    </el-row>

    <!--分页区域-->
    <el-row>
    <el-pagination
      @size-change="goodSizeChange"
      @current-change="goodsCurrentChange"
      :current-page="getGoodsData.pagenum"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="getGoodsData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-row>


    </el-card>
</div>
</template>
<script>
   export default{
   	data(){
   		return{
   		
       
         //表格数据
         getGoodsData:{
         	 //搜索框
         	query:'',
         	//第几页
         	pagenum:1,
         	//当前页显示多少条数据
         	pagesize:10,
         },
         //表格渲染的数据
         goodsTableData:[],
         //分页数据
         total:0,
         
   		}
   	},
   	created(){
   	 //生命周期内获取表单数据
   	 this.getGoodsTableData()	

   	},
   	methods:{
   		//获取表格数据方法
   		async getGoodsTableData(){
   			//请求数据   
   	   const {data :res}=await this.$http.get('goods',{params:this.getGoodsData})
       if(res.meta.status !==200) return this.$message.error(res.meta.msg)
        //将数据赋值给上面的空数组
        this.goodsTableData=res.data.goods;
        this.total=res.data.total
        

   		},
   		//pageSize 改变时会触发
   		goodSizeChange (a){
   			this.getGoodsData.pagesize=a;
   			this.getGoodsTableData()

   		},
   		//	currentPage 改变时会触发
   		goodsCurrentChange(a){
         this.getGoodsData.pagenum=a
         this.getGoodsTableData();

   		},
   		//搜索框
   		goodsInputSogo(){
   			this.getGoodsTableData()	
   		},
   		//根据用户id 删除商品信息
   		async deleteGoods(id){
   	    const {data :res}=await this.$http.delete('goods/'+id)
   	    if(res.meta.status!==200) return this.$message.error('删除失败')
         //删除成功后需要提示用户 不重新刷新页面
         this.$message.success('删除成功')
         this.getGoodsTableData()

   		},
   		addGoods(){
   			this.$router.push('/goods/add')
   		}



   	}
   }	

</script>
<style lang="less" scoped>
.el-col-4{
	margin-left:20px !important;
}	
.el-pagination{margin-top:10px;}
</style>