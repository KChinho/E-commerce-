<template>

 <div>
 	<!--头部屑-->
	<el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
       <el-row>
         <el-col :span="24">
           <el-button type="primary" @click="addRolesData">添加角色</el-button>
         </el-col>
       </el-row>

      <el-table :data="rolesList" style="width: 100%" border :stripe="true">
       
       <el-table-column type="expand" >
        <template slot-scope="scope">
         <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id">
           <el-col :span="6" :class="index1===0 ?'':'bobutton'">
             <el-tag type="primary"   closable @close="rolesTagDelete(scope.row,item1.id)">{{item1.authName}}</el-tag>
             <i class="el-icon-caret-right"></i>
           </el-col>
           <el-col :span="18">
             <el-row v-for="(itme2,index2) in item1.children" :key="itme2.id">
               <el-col :span="8"  :class="index2===0 ?'':'bobutton'">
                  <el-tag type="success"  closable @close="rolesTagDelete(scope.row,item2.id)" >{{itme2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
               </el-col>
               <el-col :span="16" >
                 <el-tag type="danger"   v-for="(item3,index3) in itme2.children" :key="item3.id"  closable @close="rolesTagDelete(scope.row,item3.id)">{{item3.authName}}</el-tag>
               </el-col>

             </el-row>
           </el-col>

         </el-row>
      </template>


      
       </el-table-column>
       <el-table-column type="index" >
       </el-table-column>
       <el-table-column prop="roleName" label="角色名称" >
       </el-table-column>
       <el-table-column prop="roleDesc" label="角色描述" >
       </el-table-column>
       <el-table-column label="操作" width="500px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="edeitForm(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteFormRoles(scope.row)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting"  size="mini" @click="distributionRoles(scope.row)">分配管理</el-button>
        </template>
       </el-table-column>

      </el-table> 

    </el-card>
<!--分配管理权限对话框-->
<el-dialog title="分配管理权限"
  :visible.sync="RolesDialogVisible" width="50%"  
  >

 <el-tree :data="RolesDialogData" :props="defaultProps"  :default-expand-all="true" show-checkbox  node-key="id"
 :default-checked-keys="rolestreeid" ref="treeRef"
  />
  


  <span slot="footer" class="dialog-footer">
    <el-button @click="RolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRolestree">确 定</el-button>
  </span>
</el-dialog>


<!--添加角色-->

  <el-dialog
  title="添加用户"
  :visible.sync="rolesVisible"
  width="50%"
  @close="addFormRoles()"
  >
  <!--主体内容-->
 <el-form :model="addRolesForm" status-icon :rules="addRoles" ref="addRolesFormRef" label-width="100px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input type="text" v-model="addRolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input type="text" v-model="addRolesForm.roleDesc"></el-input>
  </el-form-item>


</el-form>
  <!--按钮-->
  <span slot="footer" class="dialog-footer">
    <el-button @click="rolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRolesVisible()">确 定</el-button>
  </span>
</el-dialog>

<!--编辑角色-->

<el-dialog
  title="编辑用户"
  :visible.sync="edeitRolesVisible"
  width="50%"
  
  >
  <!--主体内容-->
 <el-form :model="edeitRolesForm" status-icon :rules="addRoles" ref="edeitRolesFormRef" label-width="100px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input type="text" v-model="edeitRolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input type="text" v-model="edeitRolesForm.roleDesc"></el-input>
  </el-form-item>


</el-form>
  <!--按钮-->
  <span slot="footer" class="dialog-footer">
    <el-button @click="edeitRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="edeitRolesV()">确 定</el-button>
  </span>
</el-dialog>






</div>
</template>
<script>
export default {
	data(){
      return {
      	rolesList:[],
        RolesDialogVisible:false,
        RolesDialogData:[],
        defaultProps: {
          label: 'authName',
          achildren: 'children',
        },
        rolestreeid:[],
        rolestreeccid:'',
        addRolesForm:{
          roleName:'',
          roleDesc:''
        },
        edeitRolesForm:{
          
          roleName:'',
          roleDesc:''
        },
        edeitRolesFormId:'',
        rolesVisible:false,
        addRoles:{
          roleName:[{ required: true, message: '请角色名称', trigger: 'blur' },
              { min:1,max:15, message: '用户名在3~15字符之间', trigger: 'blur' }],
            roleDesc:[{ required: true, message: '请输角色描述', trigger: 'blur' },
              { min:1,max:15, message: '用户名在3~15字符之间', trigger: 'blur' }]  
        },
        edeitRolesVisible:false,


      }
	},
	created(){
		//加载数据
		this.getRolesList();

	},
	methods:{
		async getRolesList(){
           const{data :res}=await this.$http.get("roles");
           if(res.meta.status !==200) return this.$message.error('数据加载失败')
           this.rolesList=res.data
              

		},
    //tag标签点击删除时触发
    async rolesTagDelete(s,iid){
     //弹框确定是否要取消该功能
     const cm= await this.$confirm('此操作将取消该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      //判断用户点击的是取消 还是确定 
     if(cm !=='confirm') return this.$message.success('已经取消删除')
      //用户确定取消该权限  发送请求 删除数据
    const {data :res}=await this.$http.delete(`roles/${s.id}/rights/${iid}`)
    //删除数据失败
    if(res.meta.status !==200) return this.$message.error('删除权限失败')
    //删除权限成功
    this.$message.success('删除成功')
    //新返回的数据  渲染页面              
     s.children=res.data
 
    },
    //分配管理权限
    async distributionRoles(role){
       this.rolestreeid=[];
       //弹出分配管理权限对话框
        this.RolesDialogVisible=true;

       //保存id  
       this.rolestreeccid=role.id 
       
       //根据 ID 查询数据
       const {data :res}=await this.$http.get('rights/tree') 
       if(res.meta.status!==200) return;
        this.RolesDialogData=res.data;
        this.rolestree(role,this.rolestreeid)


        
      },
    
      //回调函数遍历出 所有拥有三级节点的元素并保存成一个数组
    rolestree(node, arry) {
      if (!node.children) {
        return arry.push(node.id)
      }
      node.children.forEach(item => {
        this.rolestree(item, arry)
      })
    },
    async addRolestree(){
      //先获取出勾中的 选项ID
    const cmst=this.$refs.treeRef.getCheckedKeys() 
    const mmg=this.$refs.treeRef.getHalfCheckedKeys()
    const mm=cmst.concat(mmg).join(',')
    //在发送 AJAX请求
  const {data :res}=await this.$http.post(`roles/${this.rolestreeccid}/rights`,{
    rids:mm
  })
   if(res.meta.status!==200) return this.$message.error("更新失败")
     this.getRolesList();
   this.$message.success("更新成功")
   
    this.RolesDialogVisible=false;


    },
    //添加用户完毕触发方法
    async addRolesVisible(){
    //发送添加角色请求
    const {data :res}=await this.$http.post('roles',this.addRolesForm)
    if(res.meta.status !==200) return this.$message.error("添加角色失败")
     this.rolesVisible=true
     this.getRolesList();

    },
    //请空表单数据的
    addFormRoles(){
      this.$refs.addRolesFormRef.resetFields()
    },
    //添加用户
    addRolesData(){
      this.rolesVisible=true
    },
    //编辑
    edeitForm(x){
     this.edeitRolesVisible=true;
     this.edeitRolesFormId=x.id;
     this.edeitRolesForm.roleName=x.roleName;
     this.edeitRolesForm.roleDesc=x.roleDesc;
    },
   async edeitRolesV(){
        //发送编辑用户请求
       const  {data :res}= await this.$http.put("roles/"+this.edeitRolesFormId,this.edeitRolesForm)
         if(res.meta.status !==200) return this.$message.error("编辑角色失败")
         this.$message.success('编辑角色成功')
         this.edeitRolesVisible=false;
         this.getRolesList();
    },
    //删除用户
    async deleteFormRoles(x){
       const cm= await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
      //判断用户点击的是取消 还是确定 
     if(cm !=='confirm') return this.$message.success('已经取消删除');
     
     const {data :res}=await this.$http.delete("roles/"+x.id);
     if(res.meta.status !==200) return this.$message.error("删除角色失败")
      this.$message.success('删除角色成功')
       this.getRolesList();
    }
    

	}
 }



</script>
<style lang="less" scope>
  .bobutton{
    border:1px solid #eee;
  }
 .el-col-6 {display:flex;
  align-items:center;
}
.el-col-8{display:flex;
  align-items:center;
}
.el-tag {margin:5px;}
</style>