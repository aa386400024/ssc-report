<template>
	<view>
	</view>
</template>

<script lang="uts">
	import PDFView from 'com.github.barteksc.pdfviewer.PDFView';
	import FitPolicy from 'com.github.barteksc.pdfviewer.util.FitPolicy';
	import OnTapListener from 'com.github.barteksc.pdfviewer.listener.OnTapListener';
	import OnPageChangeListener from 'com.github.barteksc.pdfviewer.listener.OnPageChangeListener';
	import PdfDocument from 'com.shockwave.pdfium.PdfDocument';

	import File from "java.io.File";
	import View from "android.view.View";
	import Call from "okhttp3.Call";
	import Callback from "okhttp3.Callback";
	import OkHttpClient from "okhttp3.OkHttpClient";
	import Request from "okhttp3.Request";
	import Response from "okhttp3.Response";
	import IOException from "java.io.IOException";
	import MotionEvent from "android.view.MotionEvent";
	import List from "kotlin.collections.List";

	function coverBookmark(list ?: List<PdfDocument.Bookmark>) : Array<any> {
		let bookList : Array<any> = new Array<any>();
		list?.forEach(function (bookmark : PdfDocument.Bookmark) {
			const item = {
				"title": bookmark.getTitle(),
				"pageNum": bookmark.getPageIdx(),
				"children": coverBookmark(bookmark.getChildren())
			}
			bookList.add(item);
		})
		return bookList;
	}

	class MyOnTapListener implements OnTapListener {
		comp : UTSComponent<PDFView>
		constructor(comp : UTSComponent<PDFView>) {
			super();
			this.comp = comp
		}

		override onTap(motionEvent : MotionEvent) : boolean {
			this.comp.$emit("tap")
			return false;
		}
	}


	class MyOnPageChangeListener implements OnPageChangeListener {
		comp : UTSComponent<PDFView>
		constructor(comp : UTSComponent<PDFView>) {
			super();
			this.comp = comp
		}

		override onPageChanged(page : Int, pageCount : Int) : void {
			this.comp.$emit("pagechanged", { "page": page, "pageCount": pageCount })
		}
	}

	class MyCallback implements Callback {
		private comp : UTSComponent<PDFView>
		private defaultPage : number
		private password : string
		private swipeHorizontal : boolean

		constructor(comp : UTSComponent<PDFView>, defaultPage : number, password : string, swipeHorizontal : boolean) {
			super();
			this.comp = comp
			this.defaultPage = defaultPage;
			this.password = password;
			this.swipeHorizontal = swipeHorizontal;
		}

		override onFailure(_call : Call, e : IOException) : void {
			this.comp.$emit("error", { "errMsg": e })
		}

		override onResponse(_call : Call, response : Response) : void {
			let is = response.body()?.byteStream();
			let configurator = this.comp.$el!.fromStream(is);
			configurator.defaultPage(this.defaultPage.toInt())
			// 渲染风格（就像注释，颜色或表单）
			configurator.enableAnnotationRendering(true)
			// 改善低分辨率屏幕上的渲染
			configurator.enableAntialiasing(true)
			configurator.pageFitPolicy(FitPolicy.BOTH)
			configurator.autoSpacing(true)
			configurator.enableAntialiasing(true)
			configurator.password(this.password)
			configurator.swipeHorizontal(this.swipeHorizontal)
			configurator.onTap(new MyOnTapListener(this.comp));
			//设置翻页监听
			configurator.onPageChange(new MyOnPageChangeListener(this.comp));
			configurator.load();
		}
	}

	export default {
		name: "pdf-reader",
		emits: ["tap", "pagechanged", "pagecategory", "error"],
		props: {
			/**
			 * 是否隐藏PDF
			 */
			"hidden": {
				type: Boolean,
				default: false
			}
		},
		/**
		 * 组件内部变量声明
		 */
		data() {
			return {}
		},
		/**
		 * 属性变化监听器实现
		 */
		watch: {
			"hidden": {
				handler(newValue : boolean) {
					if (this.$el != null) {
						if (newValue) {
							this.$el!.visibility = View.GONE
						} else {
							this.$el!.visibility = View.VISIBLE
						}
					}
				},
				immediate: false
			},
		},
		expose: ['openFile', 'openFileByPage', 'openFileByPageAndDirection', 'openFilePassword', 'openFilePasswordByPage', 'openFilePasswordByPageAndDirection', 'getPageSize', 'getCategory', 'jumpTo'],
		methods: {
			openFile(path : string) {
				let _defaultPage = 0;
				let _swipeHorizontal = false;
				this.openFileAll(path, _defaultPage, _swipeHorizontal, "")
			},
			openFileByPage(path : string, defaultPage : number) {
				let _swipeHorizontal = false;
				this.openFileAll(path, defaultPage, _swipeHorizontal, "")
			},
			openFileByPageAndDirection(path : string, defaultPage : number, swipeHorizontal : boolean) {
				this.openFileAll(path, defaultPage, swipeHorizontal, "")
			},
			openFilePassword(path : string, password : string) {
				let _defaultPage = 0;
				let _swipeHorizontal = false;
				this.openFileAll(path, _defaultPage, _swipeHorizontal, password)
			},
			openFilePasswordByPage(path : string, password : string, defaultPage : number) {
				let _swipeHorizontal = false;
				this.openFileAll(path, defaultPage, _swipeHorizontal, password)
			},
			openFilePasswordByPageAndDirection(path : string, password : string, defaultPage : number, swipeHorizontal : boolean) {
				this.openFileAll(path, defaultPage, swipeHorizontal, password)
			},
			openFileAll(path : string, defaultPage : number, swipeHorizontal : boolean, password : string) {
				if (path.startsWith("http://") || path.startsWith("https://")) {
					let okHttpClient = new OkHttpClient();
					let request = new Request.Builder().url(path).build();
					okHttpClient.newCall(request).enqueue(new MyCallback(this, defaultPage, password, swipeHorizontal));
				} else {
					var realJsonPath = UTSAndroid.getResourcePath(path)
					let file = new File(realJsonPath);
					let configurator = this.$el!.fromFile(file);
					configurator.defaultPage(defaultPage.toInt())
					// 渲染风格（就像注释，颜色或表单）
					configurator.enableAnnotationRendering(true)
					// 改善低分辨率屏幕上的渲染
					configurator.enableAntialiasing(true)
					configurator.pageFitPolicy(FitPolicy.BOTH)
					configurator.autoSpacing(true)
					configurator.enableAntialiasing(true)
					configurator.password(password)
					configurator.swipeHorizontal(swipeHorizontal)
					configurator.onTap(new MyOnTapListener(this));
					//设置翻页监听
					configurator.onPageChange(new MyOnPageChangeListener(this));
					configurator.load();
				}
			},
			getPageSize() {
				let page = this.$el!.getCurrentPage();
				let pageCount = this.$el!.getPageCount();
				UTSAndroid.getDispatcher("main").async(function (_) {
					this.$emit("pagechanged", { "page": page, "pageCount": pageCount })
				}, null);
			},
			getCategory() {
				let list = this.$el!.getTableOfContents();
				UTSAndroid.getDispatcher("main").async(function (_) {
					this.$emit("pagecategory", { "dataList": coverBookmark(list) })
				}, null);
			},
			jumpTo(page : number) {
				this.$el!.jumpTo(page.toInt(), true)
			}
		},
		/**
		 * [可选实现] 组件被创建，组件第一个生命周期，
		 * 在内存中被占用的时候被调用，开发者可以在这里执行一些需要提前执行的初始化逻辑
		 */
		created() {

		},
		/**
		 * [可选实现] 对应平台的view载体即将被创建，对应前端beforeMount
		 */
		NVBeforeLoad() {

		},
		/**
		 * [必须实现] 创建原生View，必须定义返回值类型
		 * 开发者需要重点实现这个函数，声明原生组件被创建出来的过程，以及最终生成的原生组件类型
		 * （Android需要明确知道View类型，需特殊校验）
		 */
		NVLoad() : PDFView {
			let pdfView = new PDFView($androidContext!, null);
			return pdfView;
		},
		/**
		 * [可选实现] 原生View已创建
		 */
		NVLoaded() {

		},
		/**
		 * [可选实现] 原生View布局完成
		 */
		NVLayouted() {

		},
		/**
		 * [可选实现] 原生View将释放
		 */
		NVBeforeUnload() {

		},
		/**
		 * [可选实现] 原生View已释放，这里可以做释放View之后的操作
		 */
		NVUnloaded() {
			this.$el!.recycle();
		},
		/**
		 * [可选实现] 组件销毁
		 */
		unmounted() {

		},
	}
</script>

<style>

</style>