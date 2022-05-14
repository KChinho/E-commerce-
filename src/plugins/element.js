import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
//配置消息提示框
import {message} from 'element-ui'
Vue.prototype.$message=message


Vue.use(ElementUI, { locale })
