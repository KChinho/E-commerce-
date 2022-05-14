<template>
 <div class="login_bg">
 	<div class="login">
 		<!--头部logo-->
 		<div class="login_img">
 			<img src="../assets/logo.png">
 		</div>
 		<!--表单区域-->
 	<el-form ref="loginformRes" class="form" :model="loginform" :rules="loginformrules">
      <el-form-item prop="username">
         <el-input type="text" v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
   <el-form-item prop="password" >
     <el-input type="password" v-model="loginform.password" prefix-icon="iconfont icon-3702mima"></el-input>
   </el-form-item>

  <el-form-item class="form_button" >
    <el-button  type="primary" @click="loginAjax">提交</el-button>
    <el-button type="info" @click="loginformRes">重置</el-button>
  </el-form-item>
</el-form>
 	</div>
 </div>
</template>
<script>
export default{
	data(){
       return {
       	//表单数据
       	loginform:{
          username:"admin",
          password:"123456"
       	},
       	//登录表单验证规则
       	loginformrules:{
       		username:[  { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入长度3到10之间的用户名', trigger: 'blur' }],
       		password:[
       		{required:true,message:"请输入密码",trigger: 'blur'},
       		{min:3,max:20,message:"请输入正确的密码",trigger: 'blur'}
       		]
       	}

       }
	},
	methods:{
		loginformRes:function(){
          this.$refs.loginformRes.resetFields()
		},
		loginAjax:function(){
			this.$refs.loginformRes.validate(async x=>{
			 if(!x) return ;
			 const {data: res}= await this.$http.post('login',this.loginform)
			 if(res.meta.status != 200) return this.$message.error("登录失败")
             
			  this.$message.success("登录成功")
             //将服务器传递来的toke 保存在本地
             console.log(res)
             window.sessionStorage.setItem("token",res.data.token)

             //编程式导航跳转页面
             this.$router.push("/home")
           

			})
		}
	}
}
</script>
<style lang="less" scoped>
.login_bg{width:100%;height:100%;background:#2b4b6b;}
.login{width:500px;height:360px;border-radius:3px;background-color:#fff;
position:absolute;left:50%;top:50%;transform: translate(-50%,-50%);

}
.login_img{width:140px;height:140px;border:1px solid #ccc;background:#fff;border-radius:50%;position:absolute;left:50%;top:0;
box-shadow:0px 0px 5px #ccc;
padding:10px;transform: translate(-50%,-50%);
 img{width:140px;height:140px;border-radius:50%;background:#eee;}
}

.form{
	width:400px;margin-top:100px;margin-left:52px;
	.el-form-item{
		margin-top:20px;margin-bottom:10px;
	}
	.el-input{height:50px;}

	.form_button{
		width:150px;
		margin-left:250px;
	}
}

	
</style>