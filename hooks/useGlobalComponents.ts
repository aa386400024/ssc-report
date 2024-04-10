import { App } from 'vue';

import CustomGap from '@/components/base/gap.vue'  // 注意路径可能需要调整

export default function registerGlobalComponents(app: App) {
  // 注册全局组件
  app.component('custom-gap', CustomGap)
	console.log(app, 'component')
  // 注册其他全局组件...
}
