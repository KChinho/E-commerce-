<template>
 <div>
	<!--头部面包屑-->
	<el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

   <!--卡片视图-->
    <el-card class="box-card" >
     
     <el-row>
     	<el-col>
     	 <el-alert title="添加商品信息" type="info" show-icon center></el-alert>
     		<!--步骤条-->
         <el-steps :space="200" :active="addActive-0" finish-status="success" align-center>
           <el-step title="基本信息"></el-step>
           <el-step title="商品参数"></el-step>
           <el-step title="商品属性"></el-step>
           <el-step title="商品图片"></el-step>
           <el-step title="商品内容"></el-step>
           <el-step title="完成"></el-step>
         </el-steps>
     	</el-col>
     </el-row>
     <!--左侧-->
     <el-row>
     <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm"  class="demo-ruleForm" label-position="top">	
     <el-tabs :tab-position="'left'" v-model="addActive" :before-leave="addBeforeLeave"  @tab-click="addPrice" >
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
      	<el-input v-model="addRuleForm.goods_name" type="text"></el-input>
      </el-form-item>
       <el-form-item label="商品价格（元）" prop="goods_price">
      	<el-input v-model="addRuleForm.goods_price" type="number"></el-input>
      </el-form-item>
       <el-form-item label="商品数量" prop="goods_number">
      	<el-input v-model="addRuleForm.goods_number" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
      	<el-input v-model="addRuleForm.goods_weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="goods_cat">
      	 <el-cascader
    v-model="addRuleForm.goods_cat"
    :options="addOptions"
    :props=" catAddRules"
    expand-trigger='hover'
    @change="handleChange"></el-cascader>
 
 

      </el-form-item>


    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1" >
    <el-form-item :label="item.attr_name" v-for="(item,index) in getAddPrices" :key="index" >
     <el-checkbox-group v-model="item.attr_vals" >
    <el-checkbox :label="c" v-for="(c,i) in item.attr_vals" :key="i" border></el-checkbox>
   
  
  </el-checkbox-group>

    </el-form-item>	 


    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
      <el-form-item :label="item.attr_name" v-for="(item,index) in getAddPricescc" :key="index" >
        <el-input v-model="item.attr_vals"></el-input>
     </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
     <!--图片上传区域-->	
       <el-upload
  class="upload-demo"
  :action="addUploadURL"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :headers="addUploadHeaders"
  list-type="picture"
  :on-success="addUploadImgURL"
  >
  <el-button size="small" type="primary">点击上传</el-button>
  
</el-upload>

    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4"><quill-editor v-model="addRuleForm.goods_introduce"></quill-editor>
    	<el-button type="primary" class="elbuttonc" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
  </el-form>
     </el-row>
    </el-card> 
  <!--预览图片对话框-->
  <el-dialog
  title="提示"
  :visible.sync="imgPathVisible"
  width="50%"
  >
  <img :src="imgPathURL" style="width:100%">
  
</el-dialog>



 </div>
</template>
<script>
import _ from 'lodash'
 export default{

 	data() {
 		let addInputNumber =(rule, value, callback)=>{
         if(value <0){
         	callback(new Error('请输入正确的值，值不能为0，或负数'))
         }else{
        return callback();
         }

       


 	};
 		return{
           addActive:0,
           addRuleForm:{
           	//商品名称
           	goods_name:'',
           	goods_price:0,
           	goods_number:0,
           	goods_weight:0,
           	goods_cat:[],
           	pics:[],
           	goods_introduce:'',
           	attrs:[]
           },
            getAddPrices:[],
            getAddPricescc:[],
            imgPathVisible:false,
            imgPathURL:'',
           //上传照片列表
             addUploadHeaders:{
             	Authorization:window.sessionStorage.getItem('token')
             },
           addUploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
           addOptions:[],
          
           catAddRules:{
           	label:'cat_name',
           	value:'cat_id',
           	children:'children'
           },
           addRules:{
            goods_name:[
       		{required:true,message:"请输商品名称",trigger: 'blur'},
{min:1,max:20,message:"商品名称在3~20个字符之间",trigger: 'blur'}

       		],
       		goods_price:[
       		{required:true,message:"请输入商品价格",trigger: 'blur'}, { validator:addInputNumber, trigger: 'blur' }],
       		 goods_number:[
       		{required:true,message:"请输入商品数量",trigger: 'blur'}, { validator:addInputNumber, trigger: 'blur' }],
       		goods_weight:[
       		{required:true,message:"请输入商品重量",trigger: 'blur'}, { validator:addInputNumber, trigger: 'blur' }],goods_cat:[{required:true,message:"请输选择分类",trigger: 'blur'}]

           },
 		}
 	},
 	created(){
       this.getAddCategories();
 	},
 	methods:{
 		//获取商品分类数据列表
 		async getAddCategories(){
 		//发起请求
 		const{data :res}=await this.$http.get('categories');
 		if(res.meta.status!==200) return this.$message.error('数据获取失败')	
        this.addOptions=res.data
 			

 		},
 		//级联选择器触发时
 		handleChange(value) {
        if(this.addRuleForm.goods_cat.length !=3){
        return 	this.addRuleForm.goods_cat=[]
        }
      },
      //控制标签切换
      addBeforeLeave(activeName, oldActiveName){
     //切换的标签名 activeName
     //当前所在的  oldActiveName
     if(oldActiveName=='0' && this.addRuleForm.goods_cat.length!=3){
            
           this.$message.error("请选择商品分类在切换")
           return false
        }

      },
      //商品参数获取数据
     async addPrice(){

     	//动态数据列表
     	if( this.addActive=='1' && this.addRuleForm.goods_cat.length==3){
     		// tabs name为1  且   上面级联选择器数组要等于三才发起请求
     		
     	const {data :res}= await this.$http.get(`categories/${this.additc}/attributes`,{params:{ sel:'many' }})
     	  if(res.meta.status !==200) return this.$message.error(res.meta.msg)

           //将数据中的字符串转换成数组
      
          res.data.forEach(item=>{
             item.attr_vals=item.attr_vals.split(' ');
          })
      
         

     	    this.getAddPrices=res.data
       

     
     	}else if(this.addActive=='2' && this.addRuleForm.goods_cat.length==3){
           //静态数据列表
            const {data :res}= await this.$http.get(`categories/${this.additc}/attributes`,{params:{ sel:'only' }})
     	  if(res.meta.status !==200) return this.$message.error(res.meta.msg)

        this.getAddPricescc=res.data
      console.log( this.getAddPricescc)

     	}
 

     	
     },
     //点击缩略图的时候触发
     handlePreview(file){
      this.imgPathURL= file.response.data.url;
        this.imgPathVisible=true

     },
     //移除缩略图的时候触发
     handleRemove(file){
     	let filePath=file.response.data.tmp_path
      
    this.addRuleForm.pics.forEach((item,index)=>{
    	if(item.pic ===filePath){
    		this.addRuleForm.pics.splice(index,1)
    	}
    })

 },
     //上传成功后触发的时间
     addUploadImgURL(response){
       let prinfo={
       	pic:response.data.tmp_path
       }

       this.addRuleForm.pics.push(prinfo)

    
     },
     async add(){
     	//进行表单预验证
     	this.$refs.addRuleForm.validate(va=>{
     		if(!va) return this.$message.error('请填写完表格')
     			console.log("完成")
     	})
        

        /*addRuleForm
            getAddPrices:[],
            getAddPricescc:[],*/

       //实现深拷贝 
       // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addRuleForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.getAddPrices.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addRuleForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.getAddPricescc.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addRuleForm.attrs.push(newInfo)
        })
        form.attrs = this.addRuleForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
   
 //getAddPrices:[],
          //  getAddPricescc:[],
    
            //getAddPricescc:[],




     }
     

},
computed:{
	additc(){
		if(this.addRuleForm.goods_cat.length ==3){
			return this.addRuleForm.goods_cat[2]
		}
		return null
	}

}

 }

</script>
<style lang="less" scoped>

.el-steps{margin-top:15px;}
.el-tabs{
	margin-top:20px
}
.el-checkbox{
	margin-right:0px;
}
.el-card{min-height:500px;}
.elbuttonc{margin-top:20px;}

</style>