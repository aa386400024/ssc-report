<template>
	<view class="defaultStyles">
	</view>
</template>
<script lang="uts">
	import { UTSComponent } from "DCloudUTSFoundation"
	import { PDFDisplayDirection, PDFDocument, PDFView, PDFViewDelegate } from "PDFKit";
	import { Notification, NotificationCenter, URL } from "Foundation";
	import { UIGestureRecognizer, UITapGestureRecognizer } from "UIKit";

	class PDFViewTool {
		static pdfView : PDFView | null;
		static component : UTSComponent<PDFView> | null

		// 监听截屏
		static listenCaptureScreen(component : UTSComponent<PDFView> | null, pdfView : PDFView | null) {
			this.component = component
			this.pdfView = pdfView

			const method = Selector("handlePageChanged")
			NotificationCenter.default.addObserver(this, selector = method, name = Notification.Name.PDFViewPageChanged, object = pdfView);

			const method1 = Selector("onDoubleTap:")
			let tapGestureRecognizer = UITapGestureRecognizer.init(target = this, action = method1);
			tapGestureRecognizer.numberOfTapsRequired = 1;
			this.pdfView?.addGestureRecognizer(tapGestureRecognizer);
		}

		// 捕获截屏回调的方法
		// target-action 的方法前需要添加 @objc 前缀
		@objc static handlePageChanged() {
			// let currentPage = this.pdfView?.document?.index(for = this.pdfView!.currentPage!);
			let page = this.pdfView?.document?.index(for = this.pdfView!.currentPage!) as unknown as number;
			let pageCount = this.pdfView?.document?.pageCount ?? 0;

			let ret : Map<string, any> = new Map();
			ret.set("page", page);
			ret.set("pageCount", pageCount);

			let detail : Map<string, any> = new Map();
			detail.set("detail", ret)
			this.component?.$emit("pagechanged", detail);
		}

		@objc static onDoubleTap(recognizer : UITapGestureRecognizer) {
			if (recognizer.state == UIGestureRecognizer.State.ended) {
				let ret : Map<string, any> = new Map();
				let detail : Map<string, any> = new Map();
				detail.set("detail", ret)
				this.component?.$emit("tap", detail)
			}
		}
		// 移除监听事件
		static removeListen() {
			this.pdfView = null
			NotificationCenter.default.removeObserver(this)
		}
	}


	//原生提供以下属性或方法的实现
	export default {
		data() {
			return {
			};
		},
		name: "pdf-reader",
		emits: ["tap", "pagechanged", "pagecategory", "error"],
		/**
		 * 属性声明，组件的使用者会传递这些属性值到组件
		 */
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
		 * 属性变化监听器实现
		 */
		watch: {
			"hidden": {
				handler(newValue : boolean, oldValue : boolean) {
					if (newValue) {
						this.$el.isHidden = true
					} else {
						this.$el.isHidden = false
					}

				},
				immediate: false //创建时是否通过此方法更新属性，默认值为false  
			},
		},
		expose: ['openFile', 'openFileByPage', 'openFileByPageAndDirection', 'openFilePassword', 'openFilePasswordByPage', 'openFilePasswordByPageAndDirection', 'getPageSize', 'getCategory', 'jumpTo'],
		methods: {
			openFile(path : string) {
				let _defaultPage = 0;
				let _swipeHorizontal = false;
				this.openFileAll(path, _defaultPage, _swipeHorizontal, null)
			},
			openFileByPage(path : string, defaultPage : number) {
				let _swipeHorizontal = false;
				this.openFileAll(path, defaultPage, _swipeHorizontal, null)
			},
			openFileByPageAndDirection(path : string, defaultPage : number, swipeHorizontal : boolean) {
				this.openFileAll(path, defaultPage, swipeHorizontal, null)
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
			openFileAll(path : string, defaultPage : number, swipeHorizontal : boolean, password ?: string) {
				this.$el.autoScales = true;
				this.$el.minScaleFactor = this.$el.scaleFactorForSizeToFit;
				this.$el.maxScaleFactor = 4.0;
				this.$el.scaleFactor = this.$el.scaleFactorForSizeToFit;
				if (swipeHorizontal) {
					this.$el.displayDirection = PDFDisplayDirection.horizontal;
				} else {
					this.$el.displayDirection = PDFDisplayDirection.vertical;
				}
				this.$el.usePageViewController(true)

				var fileUrl : URL | null
				if (path.hasPrefix("http")) {
					fileUrl = new URL(string = path)
				} else {
					const filePath = UTSiOS.getResourcePath(path)
					fileUrl = new URL(fileURLWithPath = filePath)
				}

				let document = PDFDocument.init(url = fileUrl!);
				let isEncrypted = document?.isEncrypted ?? false;
				if (password != null && isEncrypted) {
					document?.unlock(withPassword = password!);
				}
				let pdfPage = document?.page(at = defaultPage.toInt());
				this.$el.document = document!;
				this.$el.go(to = pdfPage!);
			},
			getPageSize() {
				let page = this.$el.document?.index(for = this.$el.currentPage!) as number;
				let pageCount = this.$el.document?.pageCount ?? 0;

				let ret : Map<string, any> = new Map();
				ret.set("page", page);
				ret.set("pageCount", pageCount);

				let detail : Map<string, any> = new Map();
				detail.set("detail", ret)
				this.$emit("pagechanged", detail);
			},
			getCategory() {
				let list = this.$el.document?.outlineRoot;

				let ret : Map<string, any> = new Map();
				ret.set("dataList", coverBookmark(list));

				let detail : Map<string, any> = new Map();
				detail.set("detail", ret)
				this.$emit("pagecategory", detail);
			},
			jumpTo(page : number) {
				let pdfPage = this.$el.document?.page(at = page.toInt());
				this.$el.go(to = pdfPage!);
			},
			coverBookmark(rootOutline ?: PDFOutline) : Array<Map<string, any>> {
				let dataList : Array<Map<string, any>> = new Array<Map<string, any>>();

				let count = rootOutline?.numberOfChildren ?? 0;
				let index = 0;
				while (true) {
					if (index >= count) {
						break;
					}
					let item = rootOutline?.child(at = index.toInt())!;

					if (item != null) {
						let res : Map<string, any> = new Map();
						res.set("title", item?.label)
						res.set("pageNum", item?.destination?.page?.label)
						res.set("children", coverBookmark(item))
						dataList.push(res);
					}

					index++;
				}

				return dataList;
			}
		},

		created() {

		},
		NVBeforeLoad() {

		},
		NVLoad() : PDFView {
			//必须实现
			pdfViewDelegate = new MyPDFViewDelegate(this)
			let pdfView = new PDFView()
			pdfView.delegate = pdfViewDelegate;
			PDFViewTool.listenCaptureScreen(this, pdfView);
			return pdfView
		},

		NVLoaded() {

		},
		NVLayouted() {

		},
		NVBeforeUnload() {

		},
		NVUnloaded() {
			PDFViewTool.removeListen();
		},
		unmounted() { }
	}

	class MyPDFViewDelegate implements PDFViewDelegate {
		private component : UTSComponent<PDFView>

		constructor(component : UTSComponent<PDFView>) {
			this.component = component
			super.init()
		}


	}

	/**
	 * 定义回调类或者代理类的实例
	 * [可选实现]
	 */
	let pdfViewDelegate : MyPDFViewDelegate | null = null
</script>

<style>

</style>