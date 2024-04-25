import path from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import TransformPages from 'uni-read-pages-vite'

// 复制自定义静态资源目录
// 将项目中的 'images' 文件夹复制到打包后的输出目录中
function copyFile() {
	return {
		enforce: 'post',
		async writeBundle() {
			const targetDir = path.join(
				__dirname,
				'unpackage/dist',
				process.env.NODE_ENV === 'production' ? 'build' : 'dev',
				process.env.UNI_PLATFORM,
				'static'
			)

			// 确保目标文件夹存在
			await fs.ensureDir(targetDir)

			// 执行复制操作
			await fs.copy(path.resolve(__dirname, 'static'), targetDir)
		},
	}
}



// 发布时动态修改 manifest.json
// 在生产环境下修改 manifest.json 文件的内容，禁用 usingComponents 和 alwaysShowBeforeRender 等选项
function modifyManifest() {
	const manifestPath = './manifest.json'
	const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

	manifest['app-plus'].usingComponents = false
	manifest['app-plus'].splashscreen.alwaysShowBeforeRender = false
	manifest['mp-baidu'].usingComponents = false

	fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), {
		flag: 'w',
	})
}

// 导出 Vite 配置
export default defineConfig({
	// 使用 uni-app 插件
	plugins: [uni(), copyFile()],
	// 定义环境变量
	define: {
		'process.env.VUE_APP_TEST': JSON.stringify('test'),
		'process.env.BASE_URL': JSON.stringify('https://api.chatanywhere.com.cn'), 
		'ROUTES': new TransformPages(__dirname).routes, // 注入路由表
	},
})

// 如果是生产环境，执行 modifyManifest 函数
if (process.env.NODE_ENV === 'production') {
	modifyManifest()
}