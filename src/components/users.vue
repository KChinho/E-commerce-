<template>
 <div>
 	<!--头部面包屑-->
	<el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
    <!--搜索框-->	
     <el-row :gutter="20">
      <el-col :span="10"><div class="grid-content bg-purple">
      	 <el-input placeholder="请输入内容" v-model="queryIofn.query"  clearable @clear="getdataUser">
      	 <el-button slot="append" icon="el-icon-search" @click="sousuo()"></el-button>
         </el-input>
         </div>
     </el-col>
      <el-col :span="4"><div class="grid-content bg-purple">
      	<el-button type="primary" @click="dialogVisible=true"> 添加用户</el-button>
       </div>
     </el-col>
    </el-row>

    <!--表格-->
      <el-table :data="userList" style="width: 100%" stripe border>
      	  <el-table-column type="index" ></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮件"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
       
        label="状态">
      <template slot-scope="scope">
      	
      	<el-switch v-model="scope.row.mg_state" @change="userStatePut(scope.row)"></el-switch>
   
      </template>

      </el-table-column>
      <el-table-column
      
        label="操作">
        <template slot-scope="scope">
        <!--添加-->
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="eidetUserData(scope.row)"></el-button>
         <!--分配管理-->
         <el-button type="danger" icon="el-icon-delete" size="mini"
           @click="deleteUserData(scope.row.id)"
         ></el-button>

         <el-tooltip   content="分配管理" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
         </el-tooltip>
          

          </template>   



      </el-table-column>
    </el-table>

   <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryIofn.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryIofn.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    
     </el-card>
  <!--对话框-->
  <el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%"
  @close="addFormClose()"
  >
  <!--主体内容-->
 <el-form :model="addRuleForm" status-icon :rules="addRules" ref="addRuleFormRef" label-width="100px">
  <el-form-item label="用户名" prop="username">
    <el-input type="text" v-model="addRuleForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="text" v-model="addRuleForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input type="text" v-model="addRuleForm.email"></el-input>
  </el-form-item>
   <el-form-item label="电话" prop="mobile">
    <el-input type="text" v-model="addRuleForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <!--按钮-->
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addVisible()">确 定</el-button>
  </span>
</el-dialog>

<!--修改用户信息-->
<el-dialog
  title="修改信息"
  :visible.sync="eidetDialogVisible"
  width="50%"
  @close="eidetFormClose"
  >

<!--主体内容-->
 <el-form :model="eidetRuleForm" status-icon :rules="eidetRules" ref="eidtRuleFormcc" label-width="100px" >
  <el-form-item label="用户名" prop="username">
    <el-input type="text" v-model="eidetRuleForm.username" autocomplete="off" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input type="text" v-model="eidetRuleForm.email" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="电话号码" prop="mobile">
    <el-input type="text" v-model="eidetRuleForm.mobile" autocomplete="off" ></el-input>
  </el-form-item>
</el-form>


  <span slot="footer" class="dialog-footer">
    <el-button @click="eidetDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="eidetUserVisible">确 定</el-button>
  </span>
</el-dialog>



</div>
</template>
<script>
	export default {
		data(){
			//邮箱验证规则
		let emailRules = (rule, value, callback) => {
				
				const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				
				if(regEmail.test(value)) return callback()
			    callback(new Error('请输入正确的邮箱'))
			};
		let mobileRules=(rule, value, callback) => {
               
            var tel = /^0\d{2,3}-?\d{7,8}$/;
             var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
         if(value.length == 11){//手机号码
          if(phone.test(value)) {
            
            return callback();
        }
      }else if(value.length == 12 && value.indexOf("-") != -1 ){//电话号码
        if(tel.test(value)) {
          
          return  callback();
        }
      }
                 
      callback(new Error('请输入正确的电话号码'))
	};
			return {
             queryIofn:{
               query:'',
               pagenum:1,
               //每页显示多少条数据
               pagesize:2
             },
             //用户列表数据
             userList:[],
             //用户总数据
             total:0,
             dialogVisible:false,
             eidetDialogVisible:false,
             addRuleForm:{
             	username:'',
             	password:'',
             	email:'',
             	mobile:''
             },
       addRules:{
             	username:[
             	{ required: true, message: '请输入用户名', trigger: 'blur' },
             	{ min:3,max:15, message: '用户名在3~15字符之间', trigger: 'blur' }
             	],
             	password:[
             	{ required: true, message: '请输入密码', trigger: 'blur' },
             	{ min:3,max:15, message: '密码在3~15字符之间', trigger: 'blur' }
             	],
             	email:[
             	{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { validator:emailRules, trigger: 'blur' }
             	],
             	mobile:[
             	{ required: true, message: '请输入电话号码', trigger: 'blur' },
             	{  validator:mobileRules, trigger: 'blur' } 
             	]
             },
             eidetRuleForm:{
              email:'',
              mobile:'',
              username:''
             },
             eidetRules:{email:[
             	{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { validator:emailRules, trigger: 'blur' }
             	],
             	mobile:[
             	{ required: true, message: '请输入电话号码', trigger: 'blur' },
             	{  validator:mobileRules, trigger: 'blur' } 
             	]
            }


			}
			
},
		created(){
			//生命周期函数 一渲染页面就加载 下面的用户数据方法
			this.getdataUser()
		},
		methods: {
			getdataUser:async function(){
				//获取用户数据方法
			const { data: res}=await this.$http.get('users',{params:this.queryIofn})
			 if(res.meta.status !== 200) return this.$message.error('数据加载失败');
               this.userList= res.data.users
               this.total= res.data.total
            },
            handleSizeChange(news){
            	this.queryIofn.pagesize=news
            	this.getdataUser()
            },
            handleCurrentChange(a){
              this.queryIofn.pagenum=a
              this.getdataUser()
            },
            //用户状态更新
            async userStatePut(a){
            	
              const {data :res}=await this.$http.put(`users/${a.id}/state/${a.mg_state}`)
              if(res.meta.status !==200){
              	return  a.mg_state = !a.mg_state
              }
              this.$message.success('用户状态更新成功')

            },
            sousuo(){
            	this.getdataUser();
            },
            addFormClose(){
            	 this.$refs.addRuleFormRef.resetFields()
            },
            //效验函数 并发起添加请求
             addVisible(){
            this.$refs.addRuleFormRef.validate(async x=>{
                     if(!x) return 
                //效验通过 现在添加用户    
             const {data: res}= await this.$http.post('users',this.addRuleForm)	
             if(res.meta.status !== 201) return this.$message.error('添加失败')
             	this.$message.success('添加用户成功')
                this.dialogVisible=false;
                this.getdataUser();
            })

            },
            //修改用户信息
            eidetUserData(a){
            	this.eidetDialogVisible=true;
            	//将值赋值给 eidetRuleForm
               this.eidetRuleForm.username=a.username;
               this.eidetRuleForm.email=a.email;
               this.eidetRuleForm.mobile=a.mobile;
               this.eidetRuleForm.id=a.id;


            },
            eidetFormClose(){
            	this.$refs.eidtRuleFormcc.resetFields()
            	
            },
            //效验函数 并发起添加请求
            eidetUserVisible(){
            	this.$refs.eidtRuleFormcc.validate(async x=>{
                   if(!x) return
                   //效验通过 发送请求
                   const {data :res}=await this.$http.put('users/'+this.eidetRuleForm.id,{
                   	    email:this.eidetRuleForm.email,
                   	    mobile:this.eidetRuleForm.mobile
                   })
                   
                  if(res.meta.status !== 200) return this.$message.error('修改失败')
                   	
                this.$message.success('修改成功')
                this.eidetDialogVisible=false;
                this.getdataUser();	

            	})
        
            },
            //删除单个数据
            async deleteUserData(a){
              
           const cm= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(e=> e)
         
          if(cm !== 'confirm') return
          const {data :res}=await this.$http.delete('users/'+a)
          if(res.meta.status !== 200) return this.$message.error('删除失败')
             this.$message.success('删除成功')
             this.getdataUser();	


         }

		}

	}
</script>
<style lang="less" scoped></style>