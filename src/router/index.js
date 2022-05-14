import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/login.vue'
import home from '../components/hoem.vue'

Vue.use(VueRouter);

const routes = [
  { path:'', redirect:'/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'home', component: home }

];





const router = new VueRouter({
  routes,
});

// 为路由对象，添加 beforeEach 导航守卫

router.beforeEach((to,from,next)=>{
//to 将要访问的路径
//from 代表从哪个路径跳转而来
//next 是一个函数，表示方形
//next() 放行  next('/login')	强制跳转

 if(to.path ==='/login') return next();
 const token=window.sessionStorage.getItem("token");

 if(!token) return next("/login")
 	next();

})


export default router;
