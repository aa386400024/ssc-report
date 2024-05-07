<template>
    <view class="pdfbox">
        <syczuan-pdfview
            v-if="show"
            ref="pdfview"
            class="pdfview"
            @downloading="pdfDownloading"
            @load="pdfLoad"
            @change="pdfChange"
            @onTap="pdfTap"
            @pageError="pageError"
            @error="pdfError"
            @="pdfScroll"
            :config="config"
        />
    </view>
<view class="bottom_tool">
        <view class="tool_box">
            <text class="reload" @click="reload">Reload</text>
            <input class="page_inp" type="text" v-model="pages.current" />
            <text class="jump_btn" @click="jumpPage">跳转</text>
            <text class="jump_btn update_btn" @click="prevPage">↑</text>
      <text class="jump_btn update_btn" @click="nextPage">↓</text>
        </view>
    </view>
</template>

<script>
export default {
 data() {
        return {
            show: false,
            config: {
                // 文件路径 网络路径、本地绝对路径
                src: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
                // 自定义网络pdf保存路径(src为网络路径时保存的本地路径)
                // 如果自定义路径保存失败则继续使用缓存路径显示pdf
                customFilePath: '/xxx/xxx/xxx/test.pdf',
                // 默认显示第N页(默认1)
                defaultPage: 1,
                // 浏览方向 竖向(默认):vertical 横向:horizontal
                reverse: 'vertical',
                // pdf密码
                password: '',
                // 页码访问区间(默认[],仅android)
                scope: [],
                // 开启双击控制缩放(安卓关闭会导致onTap事件失效,可设置zoom代替，默认true)
                enableDoubletap: true,
                // 启用抗锯齿(默认false,仅android)
                enableAntialiasing: true,
                // 开启滑动阻塞(默认false,仅android)
                obstruct: false,
                // 页面间距(背景颜色跟随组件背景,默认0)
                spacing: 10,
                // 错误页背景色(默认#dddddd,仅android)
                errorColor: '#dddddd',
                // 是否开启单页模式(默认false,仅ios)
                singlePage: false,
                // 开启页面回弹(默认false,仅ios)
                bounces: false
            },
            pages: {
                total: 0,
                current: 1
            }
        };
    },
  async mounted() {
    // 加载本地pdf(不是绝对路径时需要使用plus.io.convertLocalFileSystemURL转换)
    this.config.src = plus.io.convertLocalFileSystemURL("filePath");

    // // 加载网络pdf
    // this.config.src = "http://xxx.xxx.xxx";
    // // 自定义保存路径(不是绝对路径时需要使用plus.io.convertLocalFileSystemURL转换)
        // this.config.customFilePath = "/xx/xx/test.pdf";

    // 显示pdf
        this.show = true;
    },
  methods: {
       // pdf滚动(仅android)
        pdfScroll(e) {
          console.log("pdfDownloading", e.detail);
        },
        // 网络pdf下载进度
        pdfDownloading(e) {
            console.log('pdfDownloading', e.detail);
        },
        // pdf加载完成
        pdfLoad(e) {
            console.log('pdfLoad', e.detail);
        },
        // pdf内点击
        pdfTap(e) {
            console.log('pdfTap', e.detail);
        },
        // pdf页码监听
        pdfChange(e) {
            console.log('pdfChange', e.detail);
        },
        // pdf单页加载失败(仅android)
        pageError(e) {
            console.log('pageError', e.detail);
        },
        // pdf加载失败
        pdfError(e) {
            console.log('pdfError', e.detail);
        },
        // 跳转指定页
        jumpPage() {
            this.$refs.pdfview.jumpTo({
              // 页码
              page: Number(this.pages.current),
              // 是否开启动画
              animation: false
            });
        },
        // 重新加载
        reload() {
            this.config.reverse = 'horizontal';
            this.$refs.pdfview.reload(this.config);
        },
        // 下一页
        nextPage() {
            this.$refs.pdfview.nextPage();
        },
        // 上一页
        prevPage() {
            this.$refs.pdfview.prevPage();
        },
        // 设置浏览模式(仅ios)
        setDisplayMode() {
            // singlePage:单页模式 continuous:连续模式
            this.$refs.pdfview.setDisplayMode('singlePage');
        },
        // 设置双击缩放规则(仅android)
        setDoubleTapZoom() {
            this.$refs.pdfview.setDoubleTapZoom({
               min: 1.0,
               mid: 1.75,
               max: 3.0,
            });
        },
        // 加载网络pdf时取消下载pdf
        cancelDownload() {
          this.$refs.pdfview.cancelDownload();
        },
  }
};
</script>

<style scoped>
.pdfbox {
    width: 750rpx;
    flex: 1;
}
.pdfview {
    flex: 1;
}

.bottom_tool {
    position: fixed;
    width: 750rpx;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.08);
    left: 0px;
    bottom: 0px;
}

.bottom_tool .tool_box {
    width: 750rpx;
    height: 50px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}

.tool_box .reload {
    color: #ffffff;
    font-size: 14px;
    position: absolute;
    left: 20rpx;
    padding: 6px 15rpx;
    background-color: rgba(133, 46, 46, 0.705);
    border-radius: 4px;
}

.tool_box .jump_btn {
    color: #ffffff;
    border-radius: 4px;
    background-color: rgba(45, 117, 234, 0.8);
    font-size: 14px;
    padding: 8px 30rpx;
}

.tool_box .page_inp {
    width: 100rpx;
    height: 32px;
    text-align: center;
    border: 1px solid #dddddd;
    border-radius: 4px;
    margin-right: 30rpx;
    font-size: 14px;
    color: #979797;
}

.tool_box .update_btn {
    margin-left: 20rpx;
  border-radius: 4px;
    background-color: rgba(45, 117, 234, 0.8);
  color: #ffffff;
  font-size: 14px;
    padding: 8px 30rpx;
  display: flex;
    align-items: center;
    justify-content: center;
}
</style>