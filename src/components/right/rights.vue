<template>
 <div>
 	<!--头部屑-->
	<el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
    <!--表格-->
    
     <el-table :data="rightsList" style="width: 100%" border :stripe="true">
       <el-table-column type="index" >
       </el-table-column>
       <el-table-column prop="authName" label="权限说明" >
       </el-table-column>
       <el-table-column prop="path" label="访问路径" >
       </el-table-column>
       <el-table-column prop="level" label="权限层级" >
       	<template slot-scope="scope">
       		<el-tag type="success" v-if="scope.row.level==0">一级权限</el-tag>
            <el-tag type="info" v-else-if="scope.row.level==1">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>

       		
       	</template>
       </el-table-column>
   
      
     </el-table>
    	
    </el-card>
</div>
</template>
<script>
	export default{
		data(){
			return{
               rightsList:[]
			}
		},
		created(){
		//生命周期函数内  渲染页面时获取数据	
          this.getRightsList()
		},
		methods:{
			async getRightsList(){
              //获取权限列表页面的数据
             const {data :res}= await this.$http.get('rights/list');
             if(res.meta.status !==200) return this.$message.error('获取列表数据失败')
             this.rightsList=res.data
      


			}



		}



	}

</script>

<style lang="less" scoped>
	
</style>