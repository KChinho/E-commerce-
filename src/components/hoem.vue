<template>
 <div>

 	<el-button type="info" @click="logaout">退出</el-button>
 </div>
 
</template>

<script>
export default {
  data(){
  	return {

  	}
  },
  methods:{
  	logaout:function(){
  		//清空 sessionStorage 实现退出功能
  		window.sessionStorage.clear();
  		//跳转到登录页面
  		this.$router.push("/login")
  	}
  }
};
</script>
<style lang="less" scoped>
</style>
