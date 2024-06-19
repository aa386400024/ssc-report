# **概述**

XF-pdfReaderUTS封装了本地或者网络PDF预览功能。

## **模块调用**

```js
<pdf-reader ref="pdfReader" :hidden="hidden"
	:style="{width:widthNum+'rpx',height:heightNum+'px',background:yanse}" @tap="onTap"
	@pagechanged="onPageChanged" @pagecategory="onPageCategory">
</pdf-reader>
```

## **模块接口**

<div id="a1"></div>

# **openFile**

打开指定的pdf文件

openFile(path : string)

## 示例代码

```js
this.$refs["pdfReader"].openFile("/static/XF-appGray.pdf");
```

## 可用性

iOS、Android系统

可提供的1.0.0及更高版本


<div id="a2"></div>

# **openFileByPage**

打开指定的pdf文件

openFileByPage(path : string, defaultPage : number)

## 示例代码

```js
this.$refs["pdfReader"].openFileByPage("/static/XF-appGray.pdf");
```

## 可用性

iOS、Android系统

可提供的1.0.0及更高版本


<div id="a3"></div>

# **openFileByPageAndDirection**

打开指定的pdf文件

openFileByPageAndDirection(path : string, defaultPage : number, swipeHorizontal : boolean)

## 示例代码

```js
this.$refs["pdfReader"].openFileByPageAndDirection("/static/XF-appGray.pdf");
```

## 可用性

iOS、Android系统

可提供的1.0.0及更高版本



<div id="a4"></div>

# **openFilePassword**

打开指定的pdf文件

openFilePassword(path : string, password : string)

## 示例代码

```js
this.$refs["pdfReader"].openFilePassword("/static/XF-appGray.pdf");
```

## 可用性

iOS、Android系统

可提供的1.0.0及更高版本


<div id="a5"></div>

# **openFilePasswordByPage**

打开指定的pdf文件

openFilePasswordByPage(path : string, password : string, defaultPage : number)

## 示例代码

```js
this.$refs["pdfReader"].openFilePasswordByPage("/static/XF-appGray.pdf");
```

## 可用性

iOS、Android系统

可提供的1.0.0及更高版本


<div id="a6"></div>

# **openFilePasswordByPageAndDirection**

打开指定的pdf文件

openFilePasswordByPageAndDirection(path : string, password : string, defaultPage : number, swipeHorizontal : boolean)

## 示例代码

```js
this.$refs["pdfReader"].openFilePasswordByPageAndDirection("/static/XF-appGray.pdf");
```

## 可用性

iOS、Android系统

可提供的1.0.0及更高版本


<div id="a7"></div>

# **getPageSize**

获取PDF的总数页

getPageSize()


## 示例代码

```js
this.$refs["svgaPlayer"].getPageSize();
```

## 可用性
iOS、Android系统

可提供的1.0.0及更高版本


<div id="a8"></div>

# **getCategory**

获取PDF的目录

getCategory()


## 示例代码

```js
this.$refs["svgaPlayer"].getCategory();
```

## 可用性
Android系统

可提供的1.0.0及更高版本


<div id="a9"></div>

# **jumpTo**

设置要跳转的页数

jumpTo(page : number)

## 示例代码

```js
this.$refs["svgaPlayer"].jumpTo(1);
```

## 可用性
iOS、Android系统

可提供的1.0.0及更高版本