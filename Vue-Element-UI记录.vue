	element-ui 表示行初始化选择
	this.$refs.multipleTable.toggleRowSelection(row, true);


=> Layout 布局
	通过基础的24分栏，迅速简便地创建布局；
	<el-row></el-row>
	<el-col :span="24"></el-col>

	Row组件提供gutter属性来指定每一栏之间的间隔
	<el-row :gutter="6"></el-row>
	
	>支持偏移指定的栏数
	通过制定col组件的offset属性可以指定分栏领衔偏移的栏数;
	<el-col :span="6" :offset="6"></el-col>

	>对齐方式
	通过flex布局来对分进行灵活的对齐
	将type属性赋值为'flex'，可以启用flex布局，并可通过justify属性来指定start,center,end,space-between,space-around其中的值来定义子元素的排版方式；
	<el-row type="flex" class="row-bg" justify="center">
  	<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  	<el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
  	<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
	</el-row>

	>响应式布局
	参照了Bootstrap的响应式布局，预设了五个响应尺寸：xs,sm,md,lg和xl。
	<el-row :gutter="10">
	  <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple"></div></el-col>
	  <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="grid-content bg-purple-light"></div></el-col>
	  <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="grid-content bg-purple"></div></el-col>
	  <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple-light"></div></el-col>
	</el-row>

	$$ Row Attributes
		gutter  栅格间隔                             number 
		type    布局模式，可选flex，现代浏览器下有效   string  
		justify flex布局下的水平排列方式              string  start/end/center/space-around/space-between
		algin   flex布局下的垂直排列方式              string  top/middle/bottom
		tag     自定义元素标签                        string

	$$ Col Attributes	
		span    栅格占据的列数                        number
		offset  栅格左侧的间隔格数                     number
		push    栅格向右移动格数                       number
		pull    栅格向左移动格数                       number
		xs      <768px 响应式格数或者栅格属性对象       number/object(例如：{span:4, offset:4})
		sm      ≥768px 响应式栅格数或者栅格属性对象     number/object (例如： {span: 4, offset: 4})
		md      ≥992px 响应式栅格数或者栅格属性对象     number/object (例如： {span: 4, offset: 4})
		lg	    ≥1200px 响应式栅格数或者栅格属性对象	   number/object (例如： {span: 4, offset: 4})
		xl	    ≥1920px 响应式栅格数或者栅格属性对象	   number/object (例如： {span: 4, offset: 4})
		tag	    自定义元素标签	                       string

=> Container 布局容器
	用于布局的窗口组件，方便快速搭建面面的基本结构：
	<el-container></el-container>: 外层容器。当子元素包含<el-header>或<el-footer>时，全部子元素垂直上下排列，否则会水平排列。
	<el-header>： 顶部容器。
	<el-aside>: 侧边容器。	
	<el-main>: 主要区域。
	<el-footer>: 底栏容器。
	
	[注]	以上的组件采用了flex布局，使用前请确定目标浏览器是否兼容。此外，<el-container>的子元素只能是后四者，后四者的父元素也只能是<el-container>



=> this.$message()
  /** Show a success message */
  success (text: string): ElMessageComponent

  /** Show a warning message */
  warning (text: string): ElMessageComponent

  /** Show an info message */
  info (text: string): ElMessageComponent

  /** Show an error message */
  error (text: string): ElMessageComponent		