



import Vue from 'vue'

import Element from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import { MessageBox } from 'element-ui';

Vue.use(Element)

Vue.config.lang = 'zh-cn'
Vue.use('zh-cn', zhLocale)
Vue.use('en', enLocale)



//配置消息提示框
import {message} from 'element-ui'
Vue.prototype.$message=message




