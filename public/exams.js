const splitA = "---------------------------------------";
function title(t) {
  return splitA + t + splitA;
}
const exams = [
  {
    type: "项目",
    content: [
      {
        question: "项目难题性能优化",
        answer: `在华为应用市场付费推广这个项目中，除了负责日常页面模块的开发,还付出了大量的时间和精力做性能优化
性能优化原则-->根据经验总结：空间换时间，多使用内存、缓存或者其他方法，减少CPU计算量，减少网络加载耗时
为了加载更快
1.减少资源体积：压缩代码，如：
(1)webpack中mode：‘praduction’模式则是为了生产环境，会开启各种优化，比如压缩代码、混淆变量名等，使得最终的代码更小、运行更快，但是错误和警告信息会被减少或去除。
(2)使用 gzip 打包压缩，减少文件体积(打包通过compresion-webpack-plugin和 nignx 服务器开启 gzip 压缩)
(3)打包文件去掉map文件
2.减少访问次数
(1)路由懒加载
(2)推迟下载不必要的资源;保持较低的请求数量和较小的传输大小，从而减少网络请求
(3)使用HTTP缓存,长期不变的静态文件使用强缓存
3.使用cdn加速（如果库可以按需引入，则可以减少所占空间，不能按需的采用CDN外部加载）
(vue axios echarts通过配置webpack的externals不打包,真的放到内部CDN引入)
4.使用 Service Worker 进行缓存，提升加载速度
为了渲染更快
1.css放head，js放body最下面
2.尽早开始js，可用用DOMContentLoaded触发
3.懒加载分为(图片:大图片进行压缩,小图片使用svg,图片懒加载)(上滑加载更多)
4.对DOM查询进行缓存,如使用 keep-alive 缓存组件，减少重复渲染
5.防抖节流,当用户反复点击时减少请求
6.用户体验上的优化：（1.骨架屏 2.loading 3.使用动画提升用户体验 4.使用 PWA）

使用http2.0
http2.0大幅提升了加载性能，相比http1.0增加了多路复用、二进制分帧、header压缩等特性
开启了https协议，只要在Nginx配置文件中找到你要开启http2.0的域名server模块，
然后将 listen 443 ssl;改成 listen 443 ssl http2; 即可。`,
      },
      {
        question: "组件封装",
        answer: `
我们的前端，每一次去写不同的表单和表格,上面搜索,底下表格筛选出结果，这样的一整套的代码加上事件会占到300行左右，每一个column列需要自己去写,
每一个的表单内容需要用elementui组件去做。那我封装了这一块之后，我可以把整个的代码量从300行减少到10行，他们只需要一个page.config.js 配置文件去传入配置信息就行。

那么这个配置信息是包含
首先是头部的表单，它里面定义的是一个数组。数组里面有很多的对象,对象里面有type类型代表它是哪一个表单，input框,select框,级联选择框等
它的data的输入的信息input的value,change,input事件,附加信息是否清空,多选
那么用户只需要向头部的表单，比如想定义input框,只用在数组里面。加入type=input，然后data里面还有很多附加的属性 
像是否可以清空，是否多选等等, 这些东西和普通表单组件能够保持一致的。

table的config，最主要是columns列,width，label,actions自定义行为里面可以添加事件,删除,编辑，

那这个里面的难点
首先是多种表单的切换。我这里使用的是一个动态组件，然后动态组件映射到的最底层组件。每一个基础表单的根据type来取动态组件的一个映射

数据的传递
表单里面数据传递到表格里面。在最上层我有一个大的formtable的一个父级组件,这个formtable的组件的话，承载了from和table两个组件的融合，
定义一个大的对象的数据结构传进去，这个对象是共享的，
最底层的from input框输入的时候要让下面table来进行重新更新
利用了vue的响应式数据的原理，我把响应式数据通过props传到最底层的input框，然后input框输入的话，利用了$listens的方法，
直接将最底层的组件的事件通过$listen一层一层的往上回传，回传到from表单,然后form表单跟table在同一个父组件里，
就可以去响应到这个事件的监听

使用了vue watch，watch去监听的我传入的数据结构之后，只要是新老数据结构发生变化，我立马开启一个regetdata的方法
去让我的table表格来进行重新的获取。

整体的架构设计是我在最外层formTable去共享的数据,数据通过$attrs传递一层一层往下传，事件通过$listen一层一层往上传递
在最底层的设计，一旦它有任何的变动，那么它就会回传到最上面的事件,进而触发我的事件，触发数据的变动。
数据的变动的话，通过props传递到table table里面通过watch监听改变拿取到我在config配置里面到table里面的一个regetData方法,
调用之后直接的让table重新的渲染了

难点就的数据的传递,事件回调处理很多问题,
表单里面会涉及有seclet下拉框,会出现几百条条数据,用户除了无限的下拉加载之外,还要支持filter的搜索,
当用户不断加载滚动,元素加载过多就会出现卡顿,我对select进行了封装,我写了一个vue指令,叫做select-lazy
,用户只需要在配置项加lazy=true或就可以开启对应功能
`,
      },
      {
        question: "大文件上传",
        answer: `
日志文件大,用户感知差,频繁刷新,导致上传失败
掘金查找资料,通过大文件分片上传,实现进度条,断点续传和秒传的功能,
具体实现过程是使用 Blob.prototype.slice,将一个大文件进行切片每个切片大小10M
对于切片需要标记下,因为服务端需要知道切片是否属于同一个文件,使用contentHash根据文件生成唯一的hash,库spark-md5进行hash,每个切片的命名采用大文件hash+索引
计算hash非常耗时,使用web-work开了一个线程,hash结束通过postMessage发送主线程
把所有切片放入 new formData 中,使用 Promise.all 并发上传,上传完毕,通知服务端进行切片合并
这是大文件上传的基本流程,下面还实现了:
断点续传
分为暂停: 所有切片对象保存成数组requestList,上传成功一个切片就从数组删除,点击暂停调用xhr abort方法取消请求,并将正在上传没有上传成功切片从数组删除
点击继续上传:上传过了不需要重复上传有2个方案
把上传过的名称保存到loaclstorage里面,用户换浏览器或手动删除会失效,
放到服务器,上传前先调用接口,返回已传的切片,filter 过滤上传过的切片
秒传
基于之前对每个文件生成唯一的hash,上传前向服务器请求这个hash是否已经接收过,如果上传过直接返回上传成功
并发控制
对同一个域名连接上限是6个,占满会堵塞,使用async-pool并发控制,了解其原理: 建立一个线程池,给一个maxcount=4,设置正在发送的切片数runCount++,切片发送完毕
rounCount--,使runCount< maxcount,小于就继续发送
进度条
单个切片上传进度,整个文件上传进度
监听 upload.onprogress,工厂函数,返回不同的监听函数
总进度条,单个切片累计/整个文件大小,使用 vue 的计算属性
Bug 处理
点击暂停清空 xhr 请求,点击恢复,重新创建了 xhr 导总进度条倒退
假进度条,基于总文件进度条,只会停止和增加
vue监听属性,真的增加也增加,真的的减少就暂停`,
      },
      {
        question: "首屏优化",
        answer: `
首屏计算:
开始是使用performance.timing中的responseEnd-startTime计算
和performance.getEntriesByName取的FCP,最后经过实测发现对于页面取的结果都不准确

自动实现了一套计算首屏的方法:

利用 MutationObserver 接口，监听 DOM 对象的节点变化
this.observerData 数组用来记每次录DOM变化的时间以及变化的得分（变化的剧烈程度）

使用函数 traverseEl 获取变化一次score和timing
traverseEl(el,depth,switch){
  1 + (层数 * 0.5) + 该层children的所有得分
  return 
}
从 body 元素开始递归计算，第一次调用为 traverseEl(body, 1, false)
排除无用的element节点，如 script、style、meta、head
如果元素高度超出屏幕可视高度直接返回 0 分

分数减少的去掉,因为页面渲染过程中如有大量 DOM 节点被删除，由于得分小，则会忽略掉(取最大递归子序列)

依次遍历 observerData，取前后得分score差值,差值最大(dom幅度变化最大)的时间为首屏时间

优化
采用递归,dom比较复杂会影响性能,放到work.js辅助线程进行操作

白屏计算:
1. document.elementFromPoint(100,200),获取当前视口内指定坐标处内由里向外排列的元素
2. 横纵中心线取宽 10 份 高 10 份,共选取18个点,判断当前点是html,body,#container标签,就判定为空白点
3. 如果空白点的数量>16个,就判断为白屏

减少网络请求
对打包后资源进行分析
大图片进行压缩,小图片使用svg,图片懒加载
使用HTTP缓存,长期不变的静态文件使用强缓存

gzip压缩
打包通过compresion-webpack-plugin和 nignx 服务器开启 gzip 压缩

使用http2.0
http2.0大幅提升了加载性能，相比http1增加了多路复用、二进制分帧、header压缩等特性
开启了https协议，只要在Nginx配置文件中找到你要开启http2.0的域名server模块，
然后将 listen 443 ssl;改成 listen 443 ssl http2; 即可。

CDN加速
vue axios echarts通过配置webpack的externals不打包,真的放到内部CDN引入

工程化
路由懒加载
ui库组件按需引入
优化分包使用 splitchunks 通过设置 chunks,minSize, cacheGroups,对公共函数分包
Babel 为编译的文件插入了辅助代码,'@babel/plugin-transform-runtime',禁用 babel 对每个文件注入(默认的profile),使辅助代码从这里用

使用骨架屏幕

`,
      },
      {
        question: "打包优化",
        answer: `
流水线打包部署(重点: 打包优化)
前端通常打包,是通过npm run build生成 dist 目录,压缩通过xftp 或 xshell上传到服务器发布,但对于有还有规范检验的,
在多个环境频繁打包的就显得麻烦了,所以通过流水线部署,通过关联代码仓库,设定门禁系统(全量和增量),可信规范(codecheck 检测),
安全测试,多个环境一站式部署,可以设置定时发布,生成质量报告

打包优化

打包速度优化
开发环境开启sourceMap,devtool: eval-cheap-module-source-map
oneof 打包过程中每个文件都到经过所有 loader 处理,虽然正则没有匹配,但还是要过一遍就比较慢,使用 oneof,只要匹配一个剩下不匹配了
开启 cache 打包过程中,主要对 js 进行打包,都要经过 EsLint 检查和 babel 编译,缓存它们之前的结果,第二次打包就会快
多进程打包 thread-loader,打包主要文件是 js,处理 js 文件的主要有 eslint,babel 三个,要提升它们的运行速度,开启多进程同时处理 js,使用 thread-loader

打包体积优化
使用 webpack-bundle-anizlay-plugin 对打包资源进行分析
静态资源,视频和图片使用了 webp 对于不兼容使用压缩后的 png,经过压缩直接放到服务器的 public 中
使用 externals 提取公共依赖包,比如'vue axios echarts',并使用内部 cdn 进行引入
组件库 element 使用按需引入,如果使用 extranals 失去按需引入功能,只需加载组件和对应的样式
Babel 为编译的文件插入了辅助代码,'@babel/plugin-transform-runtime',禁用 babel 对每个文件注入,使辅助代码从这里用
'compression-webpack-plugin' 进行 gzip 压缩`,
      },
      {
        question: "vue3 Table变慢",
        answer: `工作中要把一处重要模块从 vue2 升级到 vue3,升级后发现 element-plus 内置Table表格性能相比于 vue2 严重下降,
表格是50行*300列的,有两列是自定义的一列选择框,一列开关,在切换开关打开时,耗时由200ms下降到2s,严重影响用户体验,
当时发现这个问题后,我去看了 element Table 的源码,发现传入的 table 参数data 与 columns都是使用 ref 进行响应式转换的,我又去看了 vue3 文档和源码,
当一个对象赋值给 ref时,本质还是通过reactive转为响应式, 当对象里面有子对象就会递归再次进行响应式转化,性能消耗是比较大的,如果要避免子对象的响应转换
可以使用shallowRef,shallowRef是浅层次作用,在源码getter中,当xx.value收集依赖,返回结果不再进行响应式处理,
也就不会进行依赖收集和触发,data,colums参数是多层的,使用ref就要进行层层递归依赖收集,性能消耗比较大的

当开关切换时卡顿时,我们通过 devtool 的performance面板测试性能,我们录制一个switch开关切换性能数据,发现在 main 中的有两个带红色longtask长任务,0.8+0.6,
整体耗时 1.4s 左右,我们点击观察对应的火焰图,发现紫色小块Render比较耗时,点击 render,在底部详情里面通过bottom-up和call tree中,
发现Element Table源码中一个函数 getColspanRealWidth 耗时 200ms 比较严重,
通过右侧的source map跳到对应源码进行分析,发现,函数依赖的参数是响应式的,使用一个函数对参数使用toRow处理非响应式的,修改为测试,
函数耗时从200ms到1ms,render性能提升

副作用
修改之后会不会对之前的功能有影响
我们每次列表数据更新,业务逻辑都会去请求列表设置list.value===xxx是可以正常触发 shallowRef 更新的
经过我们测试,switch 开关v-model绑定的scope.row.status变更也是正常的
手动点击选中,排序,分页都没有影响
当然,这种修改肯定不影响之前的业务前提下修改,修改之后,要多加测试,对之前有影响,就要换种方法

代码业务逻辑进行优化(2s 到 0.5s)
采用 注释加替换静态节点 的方法,找到具体哪里耗时,然后针对优化
发现自定义列中el-tooltip换成静态节点后,性能有大的提升,由于编译成静态节点,更新不用进行patch了
基于这个思路,el-tooltip 组件会的增加 patch 比对耗时,那我们减少它的数量就能提高性能
原本之前业务 el-tooltop 使用了 disabled 属性用于隐藏 tooltop,但元素还是会渲染,我们修改为v-if,减少了元素渲染,提高了页面性能
通过这次优化,自己也学到了很多东西
在分析性能时,自己要多借用 performance 面板工具对应录制分析,可以借助 vue-devtool 查看组件更新渲染耗时,
排查响应式数据问题
业务场景代码时,自己要采用注释+静态节点替换排查耗时比较长的逻辑,针对性优化
 `,
      },
      {
        question: "其它",
        answer: `${title("水印功能的实现")}
页面覆盖一个 position:fixed 的 div 盒子,透明度设置为 0.2,设置 pointer-events:none 样式实现点击穿透,在盒子内通过 js 循环生成小的水印 div,div 内显示水印内容

由于 js 循环创建了多个 dom 元素,性能不理想
使用 canvas 输出背景图:页面覆盖一个 position:fixed 盒子,创建一个 canvas 画布,绘制一个水印区域,通过 canvas.toDataURL 方法输出一个图片,
通过 backgrou-image 将这个图片设置为盒子的背景图,background-repeat:repeat 实现填满整个页面的效果

由于是在前端添加水印的,对于小白是有用的,但对于有前端知识的,可以通过开发者工具的审查元素面板定位到元素进行删除,对于这个问题,
我一开始想到的办法是通过设置一个定时器,每隔几秒种就检查水印元素是否存在,如果发生变化,再执行一次覆盖水印的方法.但这种方式,利用定时器频繁检查,性能不理想

在掘金上查阅文章,发现,可以利用'Mutation Observer'API 来监视 DOM 变动,这个 API 可以监听的 DOM 的子节点的增减,属性变动,文本内容变动;只能监听子节点变化,
对于自身被删除,没有办法被监听,通过监听父节点来实现,监听到变化就执行覆盖水印的方法

显性水印 和 隐性水印
图片加载后画到 canvas 中,在 canvas 中绘制水印,通过 canvas.toDataUrl()获得 base64 并替换原来的图片路径
canvas.getImageData()

${title("Echarts踩坑")}
随父元素实时更新(详情页面要用图表展示日志分析结果,当数据比较多时,需要用户拖动放大,来看到详细的信息)
Echarts 官方文档给出了方法 resize()进行图表缩放
通常浏览器提供了窗口的缩放事件 window.resize,当窗口缩放时,我们监听这个事件,调用 Echarts 提供的 resize 方法,就能实现更新
但当固定窗口,缩放父元素时,浏览器没有提供元素的 resize 方法,所以元素缩放时没办法进行监听
开始时通过查找资料,发现元素缩放时,会触发 transtion 事件,所以开始时,监听 transtionstart 事件,缩放开始时,通过设置一个 setInterval 定时器,
进行 Echarts.resize 执行,监听 transtionend 事件,清除定时器,来解决,但发现 2 个问题,1.window 的 resize 并不会触发 transtion 方法,
所以还要单独添加 window.resize 监听 2. 使用定时器,比较消耗性能
后来在掘金文章发现了一个方法'ResizeObserver',能监听元素的缩放,通过'const ro =new ResizeObserver(cb);ro.observer(el)'来解决了上面出现两个问题

折线图 tooptip
当折线图过多时会出现 tooltip 内容过长的情况，此时需要对 tooltip 进行特殊处理
处理方法:判断当前项折线是否大于 10(此处以十条为例子)，tooltip 支持 html 写法，写一个固定宽高的容器，当其大于十条就用容器将其包裹一层，
让他出现滚动条可以进行滚动查看。此处需要给 tooltip 设置 enterable:true 属性，否则鼠标滚动不会生效
超出容器会被隐藏，需要给其设置 appendToBody: true
注意:同一个页面有多个图表,加上 appendToBody:true 后，tooltip 出现时可能造成页面抖动，要给 tooltip 加上属性 transitionDuration:0(提示框浮层的移动动画过渡时间)

${title("两栏布局拉伸组件")}
我们有个页面左边是使用流程介绍,右边用来代码展示,类似leetcode答题页面,为了更好的编辑右边代码,需要拖动中间来扩展右边范围

1 最开始,采用flex布局,左右固定宽度,右边给flex:1,使用mouse相关事件,通过监听mousedown mouseup事件,来设置左边的宽度来实现,发现mouse事件,
鼠标一拖动过快,就脱离了拖动栏;最后查阅MDN发现了drag方法,通过监听dragstart,dragend,drag事件进行处理,由于drag事件是实时触发的,开始时使用定时器采用节流处理,
开发时自己在电脑chrome测试比较流畅,
但在别的电脑上会出现卡顿和闪屏现象;对于卡顿,采用了requestframeanimation来替代定时器,拖动时比较流畅;闪屏通过performance录制屏幕截图,
在dragend结束时发现对event.x获取不到,最后进行了真值判断解决了;但采用drag会出现拖动时,出现禁止符号,这个自已去查找资料说的是禁止默认事件,
这时自己添加了不生效,没解决这个问题

2 通过阅读掘金文章,发现可以使用css 为overflow不为auto 元素设置resize进行处理;在firefox下只有下面一小块区域可以拉伸,使用了伪元素设置图片进行兼容处理
.resizable {
  width: 200px;
  height: 200px;
  overflow: scroll;
  resize: horizontal;
  cursor: ew-resize;
  opacity: 0;
  min-width: 200px; 
}
.content {
  margin: 0;
  height: 200px;
  position: absolute;
  top: 0;
  /* 留出5px为了鼠标放上去可以显示拖拽 */
  right: 5px;
  bottom: 0;
  left: 0;
  border: 1px solid;
}
<div class="container">
<!-- resizable 用于拖拽的工具 -->
<div class="resizable"></div>
<!-- content 要展示的内容区域 -->
<div class="content">content</div>
</div>
`,
      },
      {
        question: "SDK监控",
        answer: `SDK 埋点监控平台
整体流程
性能采集jsSDk(数据采集,上报) -> 大数据处理(数据存储,清洗,回流到mysql) -> 数据可视化(指数计算,数据可视化) -> 性能预警(数据分析,问题预警,问题处理)

${title("手动实现页面白屏的计算")}
白屏时间计算:
MutationObserver监听body变化
1. document.elementFromPoint(100,200),获取当前视口内指定坐标处内由里向外排列的元素
2. 横纵中心线取宽 10 份 高 10 份,共选取18个点,判断当前点是html,body,#container标签,就判定为空白点
3. 如果空白点的数量>16个,就判断为白屏


数据采集
  页面性能
    方式
      performance.timing 精确到ms

      performance.getEntries() void:performanceNavigationTiming对象 精确到ns // 只能在当前点分析,如果在onload之后要采集性能指标(额外的dom,动画要加载),就
      采集不到

      performanceObserver // 性能监听
      function observer_cb(list,observer){
        list.getEntries().forEach(e=>{
          console.log(e)
        })
      }
      let observer = new PerformanceObserver(observer_cb)
      observer.observe({entryTypes: ['paint','resource','mark']})
      window.perrormance.mark('own') // 手动打点测试
  错误异常(${title("页面错误异常采集, 并针对代码错误实现源码映射")})
      我们写了一个通用的错误采集函数,这个函数参数传入 type,error(原生:错误对象行列,堆栈;组件:错误对象,触发错误组件,错误来源(生命周期))对象
      什么时间收集
          原生错误
            try-catch
            error
          异步错误
            promise.reject unhandledrejection
          组件错误
            vue 提供组件生命周期钩子 errorCaptured 可以对组件错误进行捕获,
            我们项目中采用,配置全局的 app.config.errorHandler,进行捕获
          接口错误
            前期项目中使用的是 axios,就采用了 axios 提供了拦截函数 intercpetor(axios.interceptors.response.use())
            后续其他项目使用了 fetch,后面修改使用 XMLHttpRequest.prototype.send 进行监听
        错误堆栈的反解与聚合(源码映射sourcemap)
        JS 异常监控的目标是：
          开发者迅速感知到 JS 异常发生
          通过监控平台迅速定位问题
        线上代码经过压缩,可读性差,上报的堆栈信息对应不到原始的代码,通过soucemap解决(输入混淆后的行列号，就能够获得对应的原始代码的行列号)
        我们不能将代码放到生产环境,暴露给使用者,将打包后sourcemap文件放到监控平台服务器,并有权限才能访问
          错误堆栈信息反解
            sourcemap文件放到监控平台
            发送信息 包括 版本 项目名称,通过soucemap映射找到具体的信息
  用户行为
      手动埋点
        优点: 可控性强,可自定义上报信息
        缺点: 业务侵入性强,需要一个个手动添加埋点代码
      可视化埋点
        系统代替手工埋点
      无痕埋点
          优点: 不侵入业务代码
          缺点: 只能上报基本的行为信息,无法自定义上报,上报次数多,服务器压力大
      pv
          hash: 监听 popState
          history: 监听 popstate,重写了 pushstate 和 replacestate,自定义事件上报
      uv
          初始化时,init 会传入 userid
数据上报(${title("采用合理的上报策略,避免影响主业务以及上报丢失")})
  xhr 上报
      缺点:
          监控服务和页面服务是两个,需要解决跨域;
          页面关闭时,上报会丢失
  img 图片上报
      优点
        缓存避免重复上报
      缺点
          浏览器对 url 的长度限制,不适合数据量大
          刷新或关闭页面,也存在上报丢失
  sendBeacon 打点标记
      缺点
          兼容性不好
      优点
          埋点量身制作,不存在跨域限制问题
          不存在数据丢失问题
  合并上报(优化:上报队列)(${title("使用队列,实现延迟上报")})
  堆栈聚合策略
  如果我们只是上报一条存一条，并且给用户展示一条错误，那么在平台侧，我们的异常错误列表会被大量的重复上报占满，
  对于错误类型进行统计，后续的异常分配操作都无法正常进行。
  在这种情况下，我们需要对堆栈进行分组和聚合。也就是，将具有相同特征的错误上报，归类为统一种异常，并且只对用户暴露这种聚合后的异常
  将 error 相关的信息(name,message,stack)利用提取为 指纹，每一次上报如果能够获得相同的 指纹，它们就可以归为一类
  
  新增错误上报
  对于指定版本、最新版本的新增异常报警，我们会分析该报警的 指纹 是否为该版本代码中首次出现。

  而对于全体版本，我们则将"首次”的范围增加了时间限制(48小时,48小时出现过就不在上报,48小时后再次出现,会继续上报),
  对于某个错误，如果在长期没有出现后又突然出现，他本身还是具有通知的意义的，
  如果不进行时间限制，这个错误就不会通知到用户，可能会出现信息遗漏的情况。
  
  cachelist()
  最大缓存数上报:  自定义上报个数,达到10个错误进行一次上报 
  延迟上报: 自定义时间,超过10s内没有新数据添加就进行上报 采用防抖
  
  SDK 的设计。
    SDK 如何降低侵入，减少用户性能损耗？
    常需要尽早执行，其资源加载通常也会造成一定的性能影响。更大的资源加载可能会导致更慢的 Load，LCP，TTI 时间，影响用户体验。
    为了进一步优化页面加载性能，我们采用了 JS Snippets 来实现异步加载 + 预收集

    异步加载(async)
      script 脚本并追加到页面中，新增的 script 脚本默认会携带 async 属性，这意味着这这部分代码将通过async方式延迟加载
    预收集
    script必须置于业务逻辑最前端，这是因为若异常先于监控代码加载发生，当监控代码就位时，是没有办法捕获到这之前发生过的异常的。
    但将script置于前端将不可避免的对用户页面造成一定阻塞，且用户的页面可能会因此受到我们监控 sdk 服务可用性的影响。
    同步的加载一段精简的代码，在其中启动 addEventListener 来采集先于监控主要逻辑发生的错误。并存储到一个全局队列中，这样，当监控代码就位，
    我们只需要读取全局队列中的缓存数据并上报，就不会出现漏报的情况了
`,
      },
      {
        question: "智慧金融",
        answer: `${title("虚拟列表滚动")}
开发时,提供测试数据比较少用户账单直接用v-for进行渲染的,后来一个用户查询了近3年的账单,接近2000条,由于用户手机比较旧,加载出现了卡顿

只加载可视区域的列表项,滚动时动态计算获取可视区域的数据,把非可视区域列表删除
  // html
  <div class="viewport">
    <div class="bar"></div>
    <div class="list"></div>
  </div>

  1. 视口postion:relation相对定位,list position:absolution绝对定位
  2. 计算出视口高度/账单列表高度,计算出能加载的列表数量
  3. 通过视口scrollTop / 账单列表高度,计算滑动的列表数量, 进而数据初始和终止索引,list.slice()获得视口需要加载的数据
  4. list块相对定位也会发生上移,通过list.transform设置translateY(-scrollTop),平移下来
  5. 实现 长列表滚动

${title("宝贝任务页面在折叠屏手机展开时布局错乱")}
测试过程中,我们一直都是用普通机型进行测试的,后来增加了 三星盖乐世折叠屏手机,在展开时,页面出现了问题(当时还出现了一个问题,由于只有一个测试机,
大家都急着借用测试自己的页面问题,最后发现可以在浏览器开发者工具自定义机型,来模拟折叠屏手机)

1. 当时我们页面是采用flex+rem进行适配的,在开发时,我们是以750px设计稿为标准开发的,分为50份,根元素的font-size设置为15px,在折叠屏展开时,整个页面宽度变大,
采用flex布局,主轴设置了'space-bettween'剩余空间就大了 看下来丑陋;通过设置'媒体查询'当屏幕宽度大于960px,
我们就根元素font-size固定为15px,实现了在大屏幕上居中,来适配

2. 在宝贝任务页面,下滑到存钱罐,在ios会存在'橡皮筋效果',整个app都会跟着下滑,当时通过查找资料,发现要禁用window'touchmove'事件来解决,但禁用后,整个页面是不能下滑了,
由于在折叠屏手机上,高度是超出屏幕高度的,底部账户信息需要下滑才能看到,不能滑动,导致信息不能完全显示;在调试过程中,发现普通机型的'宽/高'比例是大于1.5的,
这时整个屏幕信息就可以显示完整,不会出现纵向滚动条,但在折叠屏手机上,宽高比例是小于1.5的,由于我们是默认屏幕宽度设置根元素的fontsize,当小于1.5时,
设置以屏幕高度来设置根元素的fontsize,当离开宝贝任务页面时,再恢复过来,就能使页面在折叠屏手机上完美展示

${title("宝贝卡存钱罐金币抛洒效果")}
宝贝任务开发上线后,刚开始是静态的,由于是对儿童使用的,产品经理说加上动画才能吸引小孩,自己通过掘金查找资料,想了两种方案
1 使用gif动图,让ui出了一个gif图片加一张静态图片,默认展示一张静态图片,当用户下滑任务到存钱罐时,用动态图替换,动效执行完毕后(定时器判断),再把图片用静态图替换掉;
测试过程中发现2个问题:1是切换图片时,由于是元素直接替换的会出现'闪屏',当时通过设置定时器延时解决了;2是由于gif图片是循环播放的,在页面第一次加载动画时是正常的,
但当第二次执行动画时,出现了错乱,最后后查找原因,发现首次加载图片后浏览器会缓存图片,第二次切换时,由于是从缓存中拿到gif图片,图片在内存中是一直循环动画的,
第二次动画开始的时间就不确定了,形成了错乱,最后是反图片元素删除再重新append解决了这个问题;但每次要删除图片再append,不能很好利用浏览器缓存,浪费性能,
最后决定自己实现动画
2 通过掘金文章发现了几种方案:1 采用绝对定位,设置setInterval定时器,结合Math.sin+cos(正弦和余弦)设置金币的bottom和left坐标,实现动画,但由于是采用定时器,
就比较消耗性能2 利用css3的animation,它有一个animation-timing-function中的steps函数来做,这种中适用帧数少的抛物线动画,由于帧数少,
不流畅
3 animation根据抛物线的起始和结束坐标,再取抛物线的坐标,利用keyframes来做,由于是单帧动画,效果比较流畅.但取中间坐标点比较麻烦;
4 利用animation中的贝塞尔曲线和抛物线的起始和结束坐标结合实现,自己当时也花时间了解了贝塞尔曲线,最后是通过在线网站,通过在线拖拽,找到合适的抛物线,
最终自己采用了这种方案

${title("iOS 上视频播放 video 标签时间轴不显示")}
宝贝卡模块,宝贝理财页面,需要用视频宣传自己的理财产品,由于理财产品,是经常更新的,所以对应的视频是放到了服务器的,当加载视频时,安卓上正常显示,
在开发工具模拟手机,也是正常的 发现在真机上ios系统上,显示,视频video标签的时间轴不显示,有的手机,显示'直播'二字

当时,出现这个问题一直没头绪,因为这个问题不好搜索,自己去stackoverflow查找也没找到答案,当时自己花了2周时间去测试,开始,以为是http请求头和响应头的原因,
自己就和后端一起设置各种请求头,都不行,自己把视频下载下来,放到本地引用,在ios是正常显示的,

由于当时这个任务不是太紧急,自己就去网上查找资料,最后也是通过搜索各种提问,在stackoverflow上,看到就,在ios上,请求资源时,要主动发1个字节去预请求资源信息,
第二次再携带信息去请求完整资源,最后通过设置,解决了这个问题

通过这个问题,自己要多利用搜索,去网上搜索资料,也要学会使用关键词搜索问题
`,
      },
      {
        question: "管理经验",
        answer: `
带过团队 带过3个人:H5智慧金融APP,存款组,

每周末进行一次组内会议
询问组员的工作进度,工作难题,
根据组员的情况,进行下周的任务安排
每周进行一次周报统计

工作日临近下班,会在讨论组里,问下组员当天的比作进度

解决问题, 帮助团队更好的成长,
有一个月存款工作需求非常多, 一个人负责好几个需求,当时我评估了下工作量,就是我们组几个前端是干不完的,
就算加班也很难完成,于是我向隔壁理财组借了两个前端同事来帮我们
当时,我想着向其它兄弟部门借几个同事来帮我们完成,虽然他们对我们的业务不太熟悉,但我这边已经规划好了,
把一些紧急但难度不大的工作交给他们来做,于是我主动向领导提出这个事件
领导就让我和隔壁理财组负责人进行了沟通,阐述了需求和工作任务量,沟通完成之后,同意派2个前端同事来支援我们组单个月,
我这边就把这种可能会延期或做不完的工作解决了,这种跨组或部门在
工作中经常发生,涉及到不到组或部门的沟通问题,这次他帮助我们,等下次他们有工作量,我们也会派组员帮助他们.
我作为这边一个前端小组长,对于这种跨组或部门的问题,我这边也是有经验,可以沟通好的
`,
      },
    ],
  },
  {
    type: "Vue",
    content: [
      {
        question: "keep-alive",
        answer: `
用 keep-alive 包裹动态组件时，可以实现组件缓存，当组件切换时不会对当前组件进行卸载。
keep-alive 的中还运用了 LRU(最近最少使用) 算法，选择最近最久未使用的组件予以淘汰。

动态组件<component :is="currentComponent"></component>

实现原理
在vue的生命周期中，用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

两个属性 include / exclude
include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。

两个生命周期 activated / deactivated
用来得知当前组件是否处于活跃状态。
当keep-alive中的组件被点击时，activated生命周期函数被激活执行一次，切换到其它组件时，deactivated被激活。
如果没有keep-alive包裹，没有办法触发activated生命周期函数。

LRU 算法
LRU算法 就是维护一个队列；
当新数据来时，将新数据插入到尾部；
当缓存命中时，也将数据移动到尾部；
当队列满了，就把头部的数据丢弃；`,
      },
      {
        question: "diff 算法",
        answer: `
vue中diff执行的时刻是组件内响应式数据变更触发实例执行其更新函数时，更新函数会再次执行render函数获得最新的虚拟DOM，
然后执行patch函数，并传入新旧两次虚拟DOM，通过比对两者找到变化的地方，最后将其转化为对应的DOM操作。

patch过程是一个递归过程，遵循深度优先、同层比较的策略；以vue3的patch为例：
更新子节点时又分了几种情况：
新的子节点是文本，老的子节点是数组则清空，并设置文本；

新的子节点是文本，老的子节点是文本则直接更新文本；

新的子节点是数组，老的子节点是文本则清空文本，并创建新子节点数组中的子元素；

新的子节点是数组，老的子节点也是数组，那么比较两组子节点(使用双端算法),diff对比

对比过程:
三个指针i e1 e2
左端比较
右端比较
i>e1 i<=e2 新子节点有剩余新增
i>e2 i<=e1 老子节点有剩余删除
其它(中间对比):
利用key,建立keyMap,复杂度On
不写key ,复杂度On2
建立一个newArr数组,初为0
遍历之后,对这个newArr获取最长递增子序列(稳定序列)采用贪心+二分查找(复杂度Onlogn)
进行倒序遍历
索引不在稳定序列,进行移动
newArr为0,进行新子节点新增


vue3中引入的更新策略：编译期优化patchFlags、block等

vue3为了尽可能的减少移动，采用 贪心 + 二分查找 去找最长递增子序列`,
      },
      {
        question: "Vue3新特性",
        answer: `
在 API 特性方面：
Composition API：可以更好的逻辑复用和代码组织，同一功能的代码不至于像以前options API一样分散

SFC Composition API语法糖<script setup>

Teleport传送门(内置组件)：可以让子组件能够在视觉上跳出父组件(如父组件overflow:hidden)

Fragments：支持多个根节点，Vue2 中，编写每个组件都需要一个父级标签进行包裹，而Vue3 不需要，内部会默认添加 Fragments类型

SFC CSS变量：支持在 <style v-bind></style> ，给 CSS 绑定 JS 变量(color: v-bind(str))，且支持 JS 表达式 (需要用引号包裹起来)；

Suspense(内置组件)：可以在组件渲染之前的等待时间显示指定内容，比如loading；

v-memo：新增指令可以缓存 html 模板，比如 v-for 列表不会变化的就缓存，简单说就是用内存换时间

在 框架 设计层面：
代码打包体积更小：许多Vue的API可以被Tree-Shaking，因为使用了es6module，tree-shaking 依赖于 es6模块的静态结构特性；

响应式的优化：用 Proxy 代替 Object.defineProperty，可以监听到数组下标变化，及对象新增属性，因为监听的不是对象属性，而是对象本身，还可拦截 apply、has 等方法；

虚拟DOM的优化：保存静态节点直接复用(静态提升)、以及添加更新类型标记（patchflag）（动态绑定的元素）

静态提升：静态提升就是不参与更新的静态节点，只会创建一次，在之后每次渲染的时候会不停的被复用；

更新类型标记：在对比VNode的时候，只对比带有更新类型标记的节点，大大减少了对比Vnode时需要遍历的节点数量；还可以通过 flag 的信息得知当前节点需要对比的内容类型；

优化的效果：Vue3的渲染效率不再和模板大小成正比，而是与模板中的动态节点数量成正比；

Diff算法 的优化：Diff算法 使用 最长递增子序列 优化了对比流程，使得 虚拟DOM 生成速度提升 200%

在 兼容性 方面：
Vue3 不兼容 IE11，因为IE11不兼容Proxy

其余 特点
v-if的优先级高于v-for，不会再出现vue2的v-for，v-if混用问题；

vue3中v-model可以以v-model:xxx的形式使用多次，而vue2中只能使用一次；多次绑定需要使用sync

Vue3 用 TS 编写，使得对外暴露的 api 更容易结合 TypeScript。`,
      },
      {
        question: "key作用",
        answer: `
key主要是为了更高效的更新虚拟DOM：它会告诉diff 算法，在更改前后它们是同一个DOM节点，这样在diff新旧vnodes时更高效。

如果不使用 key，它默认使用“就地复用”的策略。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

vue2-就地更新
当 Vue 正在更新使用 v-for 渲染的元素列表时，它默认使用“就地复用”的策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，
而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。
这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出。

使用 key 的注意点
有相同父元素的子元素必须有独特的key。重复的 key 会造成渲染错误。
v-for 循环中尽量不要使用 index 作为 key 值

为什么不建议使用 index 作为 key 值
因为在数组中key的值会跟随数组发生改变（比如在数组中添加或删除元素、排序），而key值改变，diff算法就无法得知在更改前后它们是同一个DOM节点。会出现渲染问题。`,
      },
      {
        question: "组件通信",
        answer: `
父子组件
props
$emit/$on
$parent / $children
ref
$attrs / $listeners

兄弟组件
$parent
eventbus
vuex

跨层级
provide/inject
$root
eventbus
vuex`,
      },
      {
        question: "vue响应式",
        answer: `
Vue2 
是采用数据劫持结合观察者（发布者-订阅者）模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者（watcher），
触发相应的监听回调来更新DOM

Vue2 响应式的创建、更新流程
当一个 Vue 实例创建时，vue 会遍历 data 选项的属性，用 Object.defineProperty 为它们设置 getter/setter 并且在内部追踪相关依赖，
在属性被访问和修改时分别调用 getter 和setter 。
每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，
观察者 Wacher 自动触发重新 render 当前组件，生成新的虚拟 DOM 树
Vue 框架会遍历并对比新旧虚拟 DOM 树中每个节点的差别，并记录下来，最后将所有记录的不同点，局部修改到真实 DOM 树上。（判断新旧节点的过程在vue2和vue3也有不同）

Vue 的异步更新策略原理
Vue的 DOM 更新是异步的，当数据变化时，Vue 就会开启一个队列，然后把在同一个 事件循环 中观察到数据变化的 watcher 推送进这个队列；
同时如果这个 watcher 被触发多次，只会被推送到队列一次；
而在下一个 事件循环 时，Vue会清空这个队列，并进行必要的 DOM 更新；
这也就是响应式的数据 for 循环改变了100次视图也只更新一次的原因。

vue2缺点
Object.defineProperty 是可以监听通过数组下标修改数组的操作，通过遍历每个数组元素的方式
但是 Vue2 无法监听，原因是性能代码和用户体验不成正比，其次即使监听了，也监听不了数组的原生方法进行操作；
出于性能考虑，Vue2 放弃了对数组元素的监听，改为对数组原型上的 7 种方法进行劫持；

Object.defineProperty 无法检测直接通过 .length 改变数组长度的操作；
Object.defineProperty 只能监听属性，所以需要对对象的每个属性进行遍历，因为如果对象的属性值还是对象，还需要深度遍历。因为这个api并不是劫持对象本身。
也正是因为 Object.defineProperty 只能监听属性而不是对象本身，所以对象新增的属性没有响应式；因此新增响应式对象的属性时，需要使用 Set 进行新增；
不支持 Map、Set 等数据结构

push、pop、shift、unshift、splice、sort、reverse这七个数组方法，在Vue2内部重写了所以可以监听到，除此之外可以使用 set()方法，
Vue.set()对于数组的处理其实就是调用了splice方法

Vue3
Vue3 中为了解决这些问题，使用 Proxy结合Reflect代替Object.defineProperty，
支持监听对象和数组的变化，
对象嵌套属性只代理第一层，运行时递归，用到才代理，也不需要维护特别多的依赖关系，性能取得很大进步；
并且能拦截对象13种方法，动态属性增删都可以拦截，新增数据结构全部支持，
Vue3 提供了 ref 和 reactive 两个API来实现响应式；

Vue3 响应式对数组的处理
Vue3 对数组实现代理时，也对数组原型上的一些方法进行了重写；
原因：
还比如使用 includes、indexOf,lastindexOf等对数组元素进行查找时，可能是使用代理对象进查找，
也可能使用原始值进行查找需要重写查找方法，让查找时先去响应式对象中查找，没找到再去原始值中查找；

Vue3 惰性响应式
Vue2对于一个深层属性嵌套的对象做响应式，就需要递归遍历这个对象，将每一层数据都变成响应式的；
而在Vue3中使用 Proxy 并不能监听到对象内部深层次的属性变化，它的处理方式是在 getter 中去递归响应式，好处是真正访问到的内部属性才会变成响应式，减少性能消耗

Proxy 只会代理对象的第一层，Vue3 如何处理
判断当前 Reflect.get 的返回值是否为 Object，如果是则再通过 reactive 方法做代理，这样就实现了深度观测
检测数组的时候可能触发了多个 get/set，那么如何防止触发多次呢？我们可以判断 key 是否是当前被代理的 target 自身属性；

Vue3 解构丢失响应式
对Vue3响应式数据使用ES6解构出来的是一个引用对象类型时，它还是响应式的，但是结构出的是基本数据类型时，响应式会丢失。
因为Proxy只能监听对象的第一层，深层对象的监听Vue是通过reactive方法再次代理，所以返回的引用仍然是一个Proxy对象；而基本数据类型就是值；

Vue3 响应式 对 Set、Map 做的处理
Vue3 对 Map、Set做了很多特殊处理，这是因为Proxy无法直接拦截 Set、Map，因为 Set、Map的方法必须得在它们自己身上调用；Proxy 返回的是代理对象；
所以 Vue3 在这里的处理是，封装了 toRaw() 方法返回原对象，通过Proxy的拦截，在调用诸如 set、add方法时，在原对象身上调用方法；
其实还有一个方法是，用Class搞一个子类去继承 Set、Map，然后用子类new的对象就可以通过proxy来代理，而Vue没有采用此方法的原因，猜测是：calss只兼容到 Edge13`,
      },
      {
        question: "虚拟dom",
        answer: `
虚拟dom顾名思义就是虚拟的dom对象，它本身就是一个 JavaScript 对象，只不过它是通过不同的属性去描述一个视图结构。

通过引入vdom我们可以获得如下好处：

将真实元素节点抽象成 VNode，有效减少直接操作 dom 次数，从而提高程序性能
直接操作 dom 是有限制的，比如：diff、clone 等操作，一个真实元素上有许多的内容，如果直接对其进行 diff 操作，会去额外 diff 一些没有必要的内容；
同样的，如果需要进行 clone 那么需要将其全部内容进行复制，这也是没必要的。但是，如果将这些操作转移到 JavaScript 对象上，那么就会变得简单了。
操作 dom 是比较昂贵的操作，频繁的dom操作容易引起页面的重绘和回流，但是通过抽象 VNode 进行中间处理，可以有效减少直接操作dom的次数，从而减少页面重绘和回流。

方便实现跨平台
同一 VNode 节点可以渲染成不同平台上的对应的内容，比如：渲染在浏览器是 dom 元素节点，
渲染在 Native( iOS、Android) 变为对应的控件、可以实现 SSR 、渲染到 WebGL 中等等
Vue3 中允许开发者基于 VNode 实现自定义渲染器（renderer），以便于针对不同平台进行渲染`,
      },
      {
        question: "VUE模版编译",
        answer: `
vue 的模版编译过程主要如下：template -> parse __ast___> transform __ast__>gernerate-> render 函数字符串

解析阶段: 调用 parse 方法将 template 转化为 ast（抽象语法树）
  解析过程：利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来构造 AST 树
  AST元素节点总共三种类型：type 为 1表示普通元素(<a-z 标签)、2为表达式 {{ 、3为纯文本 text

优化阶段: 对静态节点做优化 transform(深度优先搜索)
  深度遍历 AST，查看每个子树的节点元素是否为静态节点或者静态节点根。如果为静态节点，给其打一个标记,后续更新渲染可以直接跳过静态节点，优化渲染更新

生成阶段: 将 ast抽象语法树编译成 render 字符串并将静态部分放到 staticRenderFns 中，最后通过 new Function(' render') 生成 render 函数
render 函数会返回一个虚拟 DOM，然后 通过 patch 方法将虚拟 DOM 渲染成真实 DOM
大致分为: 1.Object 类型processComponent组件类，创建组件实例对象，setup等，然后递归patch处理子节点
 2.string类型 processElement 元素类  直接 createElement 创建元素节点，递归patch处理子节点
 3.fragment类型 processFragment 片段类
 4.text类型 processText 纯文本类
`,
      },
      {
        question: "双向绑定",
        answer: `
vue中双向绑定是一个指令v-model，可以绑定一个动态值到视图，同时视图中变化能改变该值。v-model是语法糖，默认情况下相当于:value和@input。

使用v-model可以减少大量繁琐的事件处理代码，提高开发效率，代码可读性也更好

通常在表单项上使用v-model
原生的表单项可以直接使用v-model，自定义组件上如果要使用它需要在组件内绑定value并处理输入事件

我做过测试，输出包含v-model模板的组件渲染函数，发现它会被转换为value属性的绑定以及一个事件监听，事件回调函数中会做相应变量更新操作，是vue的编译器完成的`,
      },
      {
        question: "SPA和SSR",
        answer: `
SPA（Single Page Application）即单页面应用。一般也称为 客户端渲染（Client Side Render）， 简称 CSR。
SSR（Server Side Render）即 服务端渲染。一般也称为 多页面应用（Mulpile Page Application），简称 MPA。
SPA应用只会首次请求html文件，后续只需要请求JSON数据即可，因此用户体验更好，节约流量，服务端压力也较小。但是首屏加载的时间会变长，而且SEO不友好。
为了解决以上缺点，就有了SSR方案，由于HTML内容在服务器一次性生成出来，首屏加载快，搜索引擎也可以很方便的抓取页面信息。但同时SSR方案也会有性能，开发受限等问题。
在选择上，如果我们的应用存在首屏加载优化需求，SEO需求时，就可以考虑SSR。
但并不是只有这一种替代方案，比如对一些不常变化的静态网站，SSR反而浪费资源，我们可以考虑预渲染（prerender）方案。
另外nuxt.js/next.js中给我们提供了SSG（Static Site Generate）静态网站生成方案也是很好的静态站点解决方案，结合一些CI手段，可以起到很好的优化效果，且能节约服务器资源。

SSR
安装vue-server-renderer包。
在Vue组件中使用render函数来渲染HTML字符串。
在服务器端使用createRenderer函数创建一个渲染器对象。
使用renderToString接收一个 Vue 应用实例作为参数，返回一个 Promise，当 Promise resolve 时得到应用渲染的 HTML。
将生成的HTML字符串发送到浏览器。
Vue 需要执行一个激活步骤。在激活过程中，Vue 会创建一个与服务端完全相同的应用实例，然后将每个组件与它应该控制的 DOM 节点相匹配，并添加 DOM 事件监听器。
为了在激活模式下挂载应用，我们应该使用 createSSRApp() 而不是 createApp()

此外，为了在浏览器中加载客户端文件，我们还需要：
在 server.js 中添加 server.use(express.static('.')) 来托管客户端文件。
将 <script type="module" src="/client.js"></script> 添加到 HTML 外壳以加载客户端入口文件。
通过在 HTML 外壳中添加 Import Map 以支持在浏览器中使用 import * from 'vue'`,
      },
      {
        question: "vue性能优化",
        answer: `
Vue3在以下几个方面做了很大改进，如：易用性、框架性能、扩展性、可维护性、开发体验等

易用性方面主要是API简化，比如v-model在Vue3中变成了Vue2中v-model和sync修饰符的结合体，用户不用区分两者不同，也不用选择困难。

类似的简化还有用于渲染函数内部生成VNode的h(type, props, children)，其中props不用考虑区分属性、特性、事件等，框架替我们判断，易用性大增。

开发体验方面，新组件Teleport传送门、Fragments 、Suspense等都会简化特定场景的代码编写，SFC Composition API语法糖更是极大提升我们开发体验。

扩展性方面提升如独立的reactivity模块，custom renderer API等

可维护性方面主要是Composition API，更容易编写高复用性的业务逻辑。还有对TypeScript支持的提升。

性能方面的改进也很显著，例如编译期优化、基于Proxy的响应式系统

Vue性能优化:

例如：代码分割、服务端渲染、组件缓存、长列表优化等

最常见的路由懒加载：有效拆分App尺寸，访问时才异步加载

keep-alive缓存页面：避免重复创建组件实例，且能保留缓存组件状态

使用v-show复用DOM：避免重复创建组件

v-for 遍历避免同时使用 v-if：实际上在Vue3中已经是个错误写法

v-once和v-memo：不再变化的数据使用v-once

按条件跳过更新时使用v-momo：下面这个列表只会更新选中状态变化项

长列表性能优化：如果是大数据长列表，可采用虚拟滚动，只渲染少部分区域的内容

事件的销毁：Vue 组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件

对于图片过多的页面，为了加速页面加载速度，所以很多时候我们需要将页面内未出现在可视区域内的图片先不做加载， 等到滚动到可视区域后再去加载

第三方插件按需引入 像element-plus这样的第三方组件库可以按需引入避免体积太大

服务端渲染/静态网站生成：SSR/SSG`,
      },
      {
        question: "MVVM/MVC",
        answer: `
MVVM
MVVM 分为 Model、View、ViewModel：
    Model 代表数据模型，数据和业务逻辑都在 Model 层中定义；
    View 代表 UI 视图，负责数据的展示；
    ViewModel 负责监听 Model 中数据的改变并且控制视图的更新，处理用户交互操作；
Model 和 View 并无直接关联，而是通过 ViewModel 来进行联系的，Model 和 ViewModel 之间有着双向数据绑定的联系。
因此当 Model 中的数据改变时会触发 View 层的刷新，View 中由于用户交互操作而改变的数据也会在 Model 中同步。
这种模式实现了 Model 和 View 的数据自动同步，因此开发者只需要专注于数据的维护操作即可，而不需要自己操作 DOM。

MVC
MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，
以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。
Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了，
通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新。

MVP
MVP 模式与 MVC 唯一不同的在于 Presenter 和 Controller。在 MVC 模式中使用观察者模式，来实现当 Model 层数据发生变化的时候，通知 View 层的更新。
这样 View 层和 Model 层耦合在一起，当项目逻辑变得复杂的时候，可能会造成代码的混乱，并且可能会对代码的复用性造成一些问题。
MVP 的模式通过使用 Presenter 来实现对 View 层和 Model 层的解耦。MVC 中的 Controller 只知道 Model 的接口，因此它没有办法控制 View 层的更新，
MVP 模式中，View 层的接口暴露给了 Presenter 因此可以在 Presenter 中将 Model 的变化和 View 的变化绑定在一起，以此来实现 View 和 Model 的同步更新。
这样就实现了对 View 和 Model 的解耦，Presenter 还包含了其他的响应逻辑。`,
      },
      {
        question: "watch/watchEff",
        answer: `
watchEffect立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数。watch侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数。

watchEffect(effect)是一种特殊watch，传入的函数既是依赖收集的数据源，也是回调函数。如果我们不关心响应式数据变化前后的值，只是想拿这些数据做些事情，
那么watchEffect就是我们需要的。watch更底层，可以接收多种数据源，包括用于依赖收集的getter函数，因此它完全可以实现watchEffect的功能，同时由于可以指定getter函数，
依赖可以控制的更精确，还能获取数据变化前后的值，因此如果需要这些时我们会使用watch。

watchEffect在使用时，传入的函数会立刻执行一次。watch默认情况下并不会执行回调函数，除非我们手动设置immediate选项。

从实现上来说，watchEffect(fn)相当于watch(fn,fn,{immediate:true})`,
      },
      {
        question: "生命周期",
        answer: `
生命周期钩子是如何实现的
Vue 的生命周期钩子核心实现是利用发布订阅模式先把用户传入的的生命周期钩子订阅好（内部采用数组的方式存储）然后在创建组件实例的过程中会依次执行对应的钩子方法（发布）

生命周期v2	                 生命周期v3	                            描述
beforeCreate	            beforeCreate	                      组件实例被创建之初
created	                  created	                            组件实例已经完全创建
beforeMount	              beforeMount                         组件挂载之前
mounted	                  mounted	                            组件挂载到实例上去之后
beforeUpdate	            beforeUpdate	                      组件数据发生变化，更新之前
updated	                  updated	                            数据数据更新之后
beforeDestroy	            beforeUnmount	                      组件实例销毁之前
destroyed	                unmounted	                          组件实例销毁之后
activated	                activated	keep-alive                缓存的组件激活时
deactivated	              deactivated	keep-alive              缓存的组件停用时调用
errorCaptured	            errorCaptured	                      捕获一个来自子孙组件的错误时被调用
-	                        renderTracked	                      调试钩子，响应式依赖被收集时调用
-	                        renderTriggered	                    调试钩子，响应式依赖被触发时调用
-	                        serverPrefetch	ssr only，          组件实例在服务器上被渲染前调用
`,
      },
      {
        question: "computed/watch",
        answer: `
两者的区别
computed 是计算一个新的属性，并将该属性挂载到 Vue 实例上，而 watch 是监听已经存在且已挂载到 Vue 示例上的数据，调用对应的方法。
computed 计算属性的本质是一个惰性求值的观察者computed watcher，具有缓存性，只有当依赖变化后，第一次访问 computed 属性，才会计算新的值
从使用场景上说，computed 适用一个数据被多个数据影响，而 watch 适用一个数据影响多个数据；

数据放在 computed 和 methods 的区别
computed 内定义的视为一个变量；而 methods 内定义的是函数，必须加括号()；
在依赖数据不变的情况下，computed 内的值只在初始化的时候计算一次，之后就直接返回结果；而 methods 内调用的每次都会重写计算。

Computed 的实现原理
computed 本质是一个惰性求值的观察者computed watcher。其内部通过this.dirty 属性标记计算属性是否需要重新求值。
当 computed 的依赖状态发生改变时,就会通知这个惰性的 watcher,computed watcher 通过 this.dep.subs.length 判断有没有订阅者,
有订阅者就是重新计算结果判断是否有变化，变化则重新渲染。
没有的话,仅仅把 this.dirty = true (当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，即具备 lazy（懒计算）特性。)

Watch的 实现原理
Watch 的本质也是一个观察者 watcher，监听到值的变化就执行回调；
watch 的初始化在 data 初始化之后，此时的data已经通过 Object.defineProperty 设置成了响应式；
watch 的 key 会在 Watcher 里进行值的读取，也就是立即执行 get 获取 value，此时如果有 immediate属性就立马执行 watch 对应的回调函数；
当 data 对应的 key 发生变化时，触发回调函数的执行`,
      },
      {
        question: "$nextTick",
        answer: `
$nextTick 可以让我们在下次 DOM 更新结束之后执行回调，用于获得更新后的 DOM；
使用场景在于响应式数据变化后想获取DOM更新后的情况；

NextTick 的原理
$nextTick 本质是对事件循环原理的一种应用，它主要使用了宏任务和微任务，采用微任务优先的方式去执行 nextTick 包装的方法；
并且根据不同环境，为了兼容性做了很多降级处理：
2.6版本中的降级处理：Promise > MutationObserver > setImmediate > setTimeout
因为 Vue是异步更新的，NextTick 就在更新DOM的微任务队列后追加了我们自己的回调函数

Vue 的异步更新策略原理
Vue的 DOM 更新是异步的，当数据变化时，Vue 就会开启一个队列，然后把在同一个 事件循环 中观察到数据变化的 watcher 推送进这个队列；
同时如果这个 watcher 被触发多次，只会被推送到队列一次；
而在下一个 事件循环 时，Vue会清空这个队列，并进行必要的 DOM 更新；
这也就是响应式的数据 for 循环改变了100次视图也只更新一次的原因。`,
      },
      {
        question: "指令",
        answer: `
自定义指令的钩子函数（生命周期）
bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
update：被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
componentUpdated：被绑定元素所在模板完成一次更新周期时调用。
unbind：只调用一次，指令与元素解绑时调用。

Vue3 指令的钩子函数
created: 已经创建出元素，但在绑定元素 attributes之前触发
beforeMount：元素被插入到页面上之前
mounted：父元素以及父元素下的所有子元素都插入到页面之后
beforeUpdate： 绑定元素的父组件更新前调用
updated：在绑定元素的父组件及他自己的所有子节点都更新后调用
beforeUnmount：绑定元素的父组件卸载前调用
unmounted：绑定元素的父组件卸载后

指令回调中传递四个参数：
el: 绑定指令的节点元素
binding: 绑定值，里面包含表达式值、修饰符、参数等
vnode: 当前 vnode 值
oldVnode: 变更前的 vnode 值

实现过的指令
v-loading 
v-lazy
v-focus
v-copy(一键copy)
slect-lazy = true

全局指令
Vue.directive('lazy',{
  bind: function (el, binding, vnode,oldVnode) {
    el.focus()
  },
  update: function (el, binding) {

  },
  unbind: function (el, binding) {
      el.instance && el.instance.$destroy()
  }
})
组件内指令
directives:{
  copy:{
    inserted: function(el){
      el.focus()
    }
  }
}
`,
      },
      {
        question: "Reactive/Ref",
        answer: `
Ref 和 Reactive 定义响应式数据
在 vue2 中， 定义数据都是在data中， 而vue3中对响应式数据的声明，可以使用 ref 和reactive，reactive的参数必须是对象，而ref可以处理基本数据类型和对象
ref在JS中读值要加.value，可以用isRef判断是否ref对象，reactive不能改变本身，但可以改变内部的值
在模板中访问从 setup 返回的 ref 时，会自动解包；因此无须再在模板中为它写 .value；
Vue3区分 ref 和 reactive 的原因就是 Proxy 无法对原始值进行代理，所以需要一层对象作为包裹；

Ref 原理
ref内部封装一个RefImpl类，并设置get/set，当通过.value调用时就会触发劫持，从而实现响应式。
当接收的是对象或者数组时，内部仍然是 reactive 去实现一个响应式；

Reactive 原理
reactive内部使用Proxy代理传入的对象，从而实现响应式。
使用 Proxy 拦截数据的更新和获取操作，再使用 Reflect 完成原本的操作（get、set）

使用注意点
reactive内部如果接收Ref对象会自动解包（脱ref）；
Ref 赋值给 reactive 属性 时，也会自动解包；
值得注意的是，当访问到某个响应式数组或 Map这样的原生集合类型中的 ref 元素时，不会执行 ref 的解包。
响应式转换是深层的，会影响到所有的嵌套属性，如果只想要浅层的话，只要在前面加shallow即可（shallowRef、shallowReactive）`,
      },
      {
        question: "Composition/option API",
        answer: `
Options API 的问题
难以维护：Vue2 中只能固定用 data、computed、methods 等选项来组织代码，在组件越来越复杂的时候，一个功能相关的属性和方法就会在文件上中下到处都有很分散，
变越来越难维护
不清晰的数据来源、命名冲突： Vue2 中虽然可以用 minxins 来做逻辑的提取复用，但是 minxins里的属性和方法名会和组件内部的命名冲突，还有当引入多个 minxins 的时候，
我们使用的属性或方法是来于哪个 minxins 也不清楚

Composition API
更灵活的代码组织：Composition API 是基于逻辑相关性组织代码的，将零散分布的逻辑组合在一起进行维护，也可以将单独的功能逻辑拆分成单独的文件；提高可读性和可维护性。
更好的逻辑复用：解决了过去 Options API 中 mixins 的各种缺点；
同时兼容Options API；
更好的类型推导：组合式 API主要利用基本的变量和函数，它们本身就是类型友好的。用组合式 API重写的代码可以享受到完整的类型推导
不用关心this指向问题

Composition API 命名冲突
通过在解构变量时对变量进行重命名来避免相同的键名

SFC Composition API语法糖（script setup）
是在单文件组件中使用组合式 API 的编译时语法糖。
有了它，我们可以编写更简洁的代码；
在添加了setup的script标签中，定义的变量、函数，均会自动暴露给模板（template）使用，不需要通过return返回
引入的组件可以自动注册，不需要通过components 进行注册

setup 生命周期
setup是vue3.x新增的，它是组件内使用Composition API的入口，在组件创建挂载之前就执行；
由于在执行setup时尚未创建组件实例，所以在setup选型中没有this，要获取组件实例要用getCurrentInstance()
setup中接受的props是响应式的， 当传入新的props时，会及时被更新。

Teleport传送门
Teleport是vue3推出的新功能，也就是传送的意思，可以更改dom渲染的位置。
比如日常开发中很多子组件会用到dialog，此时dialog就会被嵌到一层层子组件内部，处理嵌套组件的定位、z-index和样式都变得困难。Dialog从用户感知的层面，
应该是一个独立的组件，我们可以用<Teleport>包裹Dialog, 此时就建立了一个传送门，传送到任何地方：<teleport to="#footer">

Fragments
Fragments 的出现，让 Vue3 一个组件可以有多个根节点（Vue2 一个组件只允许有一个根节点）
因为虚拟DOM是单根树形结构的，patch 方法在遍历的时候从根节点开始遍历，这就要求了只有一个根节点；
而 Vue3 允许多个根节点，就是因为引入了 Fragment，这是一个抽象的节点，如果发现组件是多根的，就会创建一个 Fragment 节点，将多根节点作为它的 children`,
      },
      {
        question: "Vuex",
        answer: `
Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样可以方便地跟踪每一个状态的变化
export default new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    }
  },
  mutations: { // 处理同步
    increment (state) {
      // 变更状态
      state.count++
    }
  },
  actions: { // 处理异步,先触发 actions，actions 再触发 mutation
    increment (context) {
      context.commit('increment')
    }
  },
  modules: {
    a: moduleA,
    b: moduleB
  }
})


Vuex 和 localStorage 的区别
1. vuex 存储在内存中, localstorage存储在本地，只能存储字符串类型的数据
2. 刷新页面时 Vuex 存储的值会丢失，localstorage 不会。
3. Vuex里面定义数据是有响应式的,可以追踪数据的变化
  `,
      },
      {
        question: "渲染劫持",
        answer: `渲染劫持的概念是控制组件从另外一个组件输出的能力
在高阶组件中，组合渲染和条件渲染都是渲染劫持的一种，
通过反向继承不仅可以实现以上两点，还可以增强由原组件render函数产生的react元素
实际的操作中通过操作 state,props 都可以实现渲染劫持
        `
      },
      
    ],
  },
  {
    type: "JS",
    content: [
      {
        question: "深/浅拷贝",
        answer: `
  浅拷贝（藕断丝连）
  结构赋值 [...arr] 一维数组对象是深拷贝，多维是浅拷贝
  Object.assign() 浅拷贝
  1.JSON.parse(JSON.stringify()) 无法拷贝函数
  2.递归方式实现深拷贝
  3.lodash库的cloneDeep()
  4.jquery的$.extend实现深拷贝
        `
      },
      {
        question: "数据类型和原型链",
        answer: `
基本数据类型（原始类型）：undefined、null、boolean、number、string、symbol
引用数据类型：object （arry、function、data）

原型: 
prototype(显示原型)只有函数对象才有的属性（箭头函数没有）指向函数的原型对象
__proto__(隐式原型)指向创建当前对象的函数的prototype,每个对象都有的属性（除了null）

原型链: 对象在查找属性时，如果找不到就会沿着__proto__(隐式原型)去它的原型上找，直到找到顶层null为止
特点: JavaScript对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变。`,
      },
      {
        question: "闭包",
        answer: `
闭包是指有权访问另一个函数作用域中变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，创建的函数可以访问到当前函数的局部变量。

用途:
1.保护私有变量：模块化中可以防止外部代码直接访问和修改
2.实现数据封装：可以创建类似于面向对象的对象实例，通过闭包来访问和操作
3.实现回调函数：在异步操作完后执行回调函数
4.实现函数工厂：创建定制函数，可以生成特定行为或者配置

因为闭包函数保留了这个变量对象的引用，所以这个变量对象不会被回收，因此变量会常驻内存，得不到释放，
所以不能滥用闭包，否则会造成网页的性能问题，很可能导致内存泄露`,
      },
      {
        question: "Promise",
        answer: `
 Promise（承诺、规范） 的出现是为了统一js中的异步实现方案，提供统一的 API，各种异步操作都可以用同样的方法进行处理

有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。
一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。
new Promise((resolve,reject)=>{}) 调用resolve()成功，调用reject()失败
resolve不同值的区别
1.普通值会作为then回调的参数
2.Promise值会觉得当前Promise的状态
3.对象实现then方法，会根据then方法的结果决定Promise的状态
Promise.resolve用法相当于new Promise并执行resolve页区分三种不同值
reject不区分三种不同值，都走catch

Promise.All （按照数组顺序返回，有一个失败直接返回）
多个实例同时运行,状态由实例结果决定，分成两种情况。
全部成功状态都变成fulfilled状态才会变成fulfilled
只要有一个被rejected，状态就变成rejected。

Promise.allSettled()
一组异步操作都结束了，不管每一个操作是成功还是失败，再进行下一步操作

Promise.race()竞技/竞赛,先返回就用水的状态（成功/失败）
如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve()方法，将参数转为 Promise 实例
只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数

Promise.any()至少等一个成功返回，如果全部失败会返回一个new合计错误
只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态

Promise.resolve()
转成fulfilled状态的实例

Promise.reject()
转成rejected状态的实例`,
      },
      {
        question: "异步解决方案async/await",
        answer: `
异步解决方案:回调函数、Promise、Generator（迭代器）、async/await
Generator（迭代器）：function* 关键字声明，并在需要时使用 yield 关键字返回一个值(箭头函数不能使用Generator)

async/await 其实是Generator 的语法糖，它能实现的效果都能用 then 链来实现，它是为优化 then链而开发出来的
async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成
async 函数返回的是一个 Promise 对象。如果return 一个直接量，async 通过 Promise.resolve() 封装成 Promise 对象

优势
代码读起来更加同步，Promise 虽然摆脱了回调地狱，但是 then 的链式调⽤也会带来额外的阅读负担
Promise 传递中间值⾮常麻烦，⽽ async/await ⼏乎是同步的写法，⾮常优雅
错误处理友好，async/await 可以⽤成熟的 try/catch，Promise 的错误捕获⾮常冗余
调试友好，Promise 的调试很差，由于没有代码块，你不能在⼀个返回表达式的箭头函数中设置断点，如果你在⼀个.then 代码块中使⽤调试器的步进(step-over)功能，
调试器并不会进⼊后续的.then 代码块，因为调试器只能跟踪同步代码的每⼀步

try-catch进行异常捕获
async function fn(){
  try{
      let a = await Promise.reject('error')
  }catch(error){
      console.log(error)
  }
}`,
      },
      {
        question: "this指向",
        answer: `
默认绑定：window 函数独立调用（闭包、setTimeout中的this默认指向window）

隐式绑定：包含在对象中，方法调用，this隐式绑定该对象(obj.fn())

显式绑定：call(obj,arg1,arg2)，apply(obj,[arg1,arg2])，bind 返回新绑定this的函数  

new绑定： 构建函数内部返回对象，this指向对象，否则指向实例

箭头函数没有this，指向外层函数的作用域，箭头函数不允许被作为构造函数
`,
      },
      {
        question: "箭头函数",
        answer: `
比普通函数更加简洁

没有自己的 this,this指向最近外层作用域

不能作为构造函数使用,使用new报错

没有 arguments

没有 prototype`,
      },
      {
        question: "ES6 常用",
        answer: `
promise
箭头函数
async await
展开运算符, 解构赋值
let 和 const(和var的区别：不存在变量提升、同一个作用域下不能重复定义、有严格的块作用域)
set 和 map
proxy
symbol
class 类
es module`,
      },
      {
        question: "CommonJS 和 ESM",
        answer: `
CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。`,
      },
      {
        question: "Node事件循环",
        answer: `
Node.js 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js 采用 V8 作为 js 的解析引擎，
而 I/O 处理方面使用了自己设计的 libuv,libuv 是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API,事件循环机制也是它。

在浏览器中，JavaScript 是单线程的，但是通过异步编程可以实现并发执行。当一个任务完成时，下一个任务会立即开始执行。
这种方式称为“回调地狱”，因为它会导致代码变得复杂和难以维护。为了避免这种情况，JavaScript 引入了 Promise、async/await 等技术来简化异步编程 `,
      },
      {
        question: "数组方法",
        answer: `
影响:
pop()---删除数组的最后一个元素并返回删除的元素。
push()---向数组的末尾添加一个或更多元素，并返回新的长度。
shift()---删除并返回数组的第一个元素。
unshift()---向数组的开头添加一个或更多元素，并返回新的长度。
reverse()---反转数组的元素顺序。
sort()---对数组的元素进行排序。
splice()---用于插入、删除或替换数组的元素。

不影响:
concat()---连接两个或更多的数组，并返回结果。
every()---检测数组元素的每个元素是否都符合条件。
some()---检测数组元素中是否有元素符合指定条件。
filter()---检测数组元素，并返回符合条件所有元素的数组。
indexOf()---搜索数组中的元素，并返回它所在的位置。
join()---把数组的所有元素放入一个字符串。
toString()---把数组转换为字符串，并返回结果。
lastIndexOf()---返回一个指定的字符串值最后出现的位置，在一个字符串中的指定位置从后向前搜索。
map()---通过指定函数处理数组的每个元素，并返回处理后的数组。
slice()---选取数组的的一部分，并返回一个新数组。
valueOf()---返回数组对象的原始值。
reduce(callback,initvalue)---接收一个函数作为累加器，callback第一个参数上次的结果，第二个当前元素，第三个索引，第四个数组对象`,
      },
      {
        question: "对象继承",
        answer: `
new Object() 等同于 {} 
new Object({}) 指定原型为 {} （null的话没有原型）
原型链的方式来实现继承，缺点是，在包含有引用类型的数据时，会被所有的实例对象所共享，容易造成修改的混乱。还有就是在创建子类型的时候不能向超类型传递参数。

借用构造函数的方式，通过在子类型的函数中调用超类型的构造函数，解决了不能向超类型传递参数 缺点是无法实现函数方法的复用，并且超类型原型定义的方法子类型也不能访问到。

组合继承，将原型链和借用构造函数组合起来使用。通过借用构造函数的方式来实现类型的属性的继承，通过将子类型的原型设置为超类型的实例来实现方法的继承。
这种方式解决了上面的两种模式单独使用时的问题，但是由于我们是以超类型的实例来作为子类型的原型，所以调用了两次超类的构造函数，造成了子类型的原型中多了不必要的属性。

原型式继承，基于已有的对象来创建新的对象，实现的原理是，向函数中传入一个对象，然后返回一个以这个对象为原型的对象。
这种继承的思路主要不是为了实现创造一种新的类型，只是对某个对象实现一种简单继承，ES5 中定义的 Object.create() 方法就是原型式继承的实现。缺点与原型链方式相同。

寄生式继承，是创建一个用于封装继承过程的函数，通过传入一个对象，然后复制一个对象的副本，然后对象进行扩展，最后返回这个对象。
这个扩展的过程就可以理解是一种继承。这种继承的优点就是对一个简单对象实现继承，如果这个对象不是自定义类型时。缺点是没有办法实现函数的复用。

寄生式组合继承，组合继承的缺点就是使用超类型的实例做为子类型的原型，导致添加了不必要的原型属性。寄生式组合继承的方式是使用超类型的原型的副本来作为子类型的原型，
这样就避免了创建不必要的属性`,
      },
      {
        question: "new操作符",
        answer: `
首先创建了一个新的空对象

设置原型，将对象的原型设置为函数的prototype对象。

让函数的this指向这个对象，执行构造函数的代码（为这个新对象添加属性）

判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象`,
      },
      {
        question: "npm、npx、nvm",
        answer: `
1.npm 是node.js官网提供的包管理工具
2.cnpm淘宝团队做的国内镜像包管理工具，每10分钟同步一次
3.npx是执行npm依赖包的二进制
4.yarn 为了弥补npm5.0之前的缺陷而出现的包管理工具
5.pnpm 运行非常快，超过了npm和yarn
6.nvm管理node版本
7.nrm 切换npm源管理器
        `
      },
      {
        question: "Pxory/defineProperty",
        answer: `
Proxy是ES6中的方法，Proxy用于创建一个目标对象的代理，在对目标对象的操作之前提供了拦截，可以对外界的操作进行过滤和改写，这样我们可以不直接操作对象本身，
而是通过操作对象的代理对象来间接来操作对象；

defineProperty 和 Proxy 的区别
Object.defineProperty 是 Es5 的方法，Proxy 是 Es6 的方法
defineProperty 是劫持对象属性，Proxy 是代理整个对象；
defineProperty 监听对象和数组时，需要迭代对象的每个属性；
defineProperty 不能监听到对象新增属性，Proxy 可以
defineProperty 不兼容 IE8，Proxy 不兼容 IE11
defineProperty 不支持 Map、Set 等数据结构
defineProperty 只能监听 get、set，而 Proxy 可以拦截多达13种方法；
Proxy 兼容性相对较差，且无法通过 pollyfill 解决；所以Vue3不支持IE；

为什么需要 Reflect
使用 Reflect 可以修正 Proxy 的this指向问题；
Proxy 的一些方法要求返回 true/false 来表示操作是否成功，比如set方法，这也和 Reflect 相对应；
之前的诸多接口都定义在 Object 上，历史问题导致这些接口越来越多越杂，所以干脆都挪到 Reflect 新接口上，目前是13种标准行为，可以预期后续新增的接口也会放在这里；`,
      },
      {
        question: "事件冒泡、捕获",
        answer: `
1.事件冒泡的事件流从内而外去触发事件
2.事件捕获的事件流从外而内触发
3.addEventListener(event,function,useCapture)第三个参数默认false为冒泡事件，true事件捕获
4.先捕获再冒泡
5.事件委托：利用冒泡的原理，当多个元素需要绑定事件可使用事件委托给父级添加事件函数，例：li标签
6.取消冒泡事件
  event.stopPropagetion()
event.preventDefault()阻止默认行为
e.target.nodeName=='A'获取节点名
  target.matches(xx)是否满足选择器判断是否触发元素
不能使用冒泡的事件：scroll、mouseleave、blur、change
`
      },
      {
        question: "Map/Set",
        answer: `
set 和 weakSet 区别
set 无序的
Set 允许存储任何类型的唯一值（不能重复），无论是原始值或者是对象引用；
WeakSet 成员都是弱引用的对象，会被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏；
WeakSet 不可迭代，不能用在 for-of 循环中
WeakSet 没有 size 属性

map 和 weakMap 的区别
Map的key可以是任意的数据类型（基础类型、对象、函数等）；weakmap的键只能是非null的对象引用；
Map的key是强引用（只要键不释放就会一直占着内存，不会被GC），weakmap的key是弱引用的对象，所以不会计入垃圾回收引用次数（在没有其他引用存在时垃圾回收能正确进行）；
Map 能轻易转化为数组（扩展运算符）；weakmap 做不到
由于 key 随时会被回收，所以 weakmap 的key 不可枚举，相应地也就不能获取 size 等，它能做的事情也就只有 has/get/set/delete 四种操作；map 相对比较丰富，has/get/set/delete 之外，支持 entries/size/foreach/keys/values 等

Map 和 普通Obejct的区别
Object 无序的 Map是有序结构 
过去通常用object实现，但是obj只能用字符串作为key，有很大限制，所以出现map，支持任意类型作为key；`,
      },
      {
        question: "iframe优缺",
        answer: `
优:代码模块化，跨域通信，独立性里面样式和js不影响外面
缺:加载速度慢、SEO不由好、安全问题、很多移动端兼容性差、浏览器后退按钮无效`
      },
      {
        question: "JSBridge",
        answer: `
JSBridge 是一种 JS 实现的 Bridge，连接着桥两端的 Native 和 H5。它在 APP 内方便地让 Native 调用 JS，JS 调用 Native ，是双向通信的通道。
JSBridge 主要提供了 JS 调用 Native 代码的能力，实现原生功能如查看本地相册、打开摄像头、指纹支付,获取位置信息等。

原理:
Web端和Native可以类比于Client/Server模式，Web端调用原生接口时就如同Client向Server端发送一个请求类似，JSB在此充当类似于HTTP协议的角色

JavaScript 调用 Native 的方式，主要有两种：注入 API 和 拦截 URL SCHEME
1､注入API

注入 API 方式的主要原理是，通过 WebView 提供的接口，向JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，
直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。

对于 iOS 的 UIWebView，实例如下：

复制
JSContext *context = [uiWebView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"]; 
context[@"postBridgeMessage"] = ^(NSArray<NSArray *> *calls) { 
// Native 逻辑 
}; 
前端调用方式： 
window.postBridgeMessage(message); 

拦截 URL SCHEME

先解释一下 URL SCHEME：URL SCHEME是一种类似于url的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 protocol 和 host 一般是自定义的，

例如: qunarhy://hy/url?url=ymfe.tech，protocol 是 qunarhy，host 则是 hy。

拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，之后 Native 拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。

在时间过程中，这种方式有一定的缺陷：

1) 使用 iframe.src 发送 URL SCHEME 会有 url 长度的隐患。

2) 创建请求，需要一定的耗时，比注入 API 的方式调用同样的功能，耗时会较长。

因此：JavaScript 调用 Native 推荐使用注入 API 的方式




Native 调用 JavaScript 的方式

拼接的JavaScript代码字符串，传入JS解析器执行就可以，JS解析器在这里就是webView

对于 iOS 的 UIWebView，示例如下：

result = [uiWebview stringByEvaluatingJavaScriptFromString:javaScriptString]; 
* javaScriptString为JavaScript 代码串 

对于 iOS 的 WKWebView，示例如下：

[wkWebView evaluateJavaScript:javaScriptString completionHandler:completionHandler];
`,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "CSS",
    content: [
      {
        question: "水平剧中",
        answer: `
        方法1：margin和和width实现
        在容器上定义一个固定的宽度，然后配合margin 左右的值为auto。
        优点：实现简单，浏览器兼容性强
        缺点：效果实现了，扩展性不强，因为宽度无法确定，也就无法确定容器宽度。
        方法2：inline-block和父元素text-align
        元素的父容器中设置text-align的属性为“center”，子类设置display:inline-block
        优点：简单易懂，扩展性强
        缺点：需要额外处理inline-block的浏览器兼容性问题
        方法三：设置 position:relative 和 left:50%;
        父元素设置 float，然后给父元素设置 position:relative 和 left:50%,给子元素设置 position:relative 和 left:-50% 来实现水平居中。
        `,
      },
      {
        question: "水平垂直剧中",
        answer: `
        方法1：text-align + line-height实现单行文本水平垂直居中
        text-align: center
        
        方法2：text-align + vertical-align
        文字：在父元素设置text-align和vertical-align，并将父元素设置为table-cell元素，子元素设置为inline-block元素
        子元素是图片：
        可不使用table-cell，而是其父元素用行高替代高度，且字体大小设为0。子元素本身设置vertical-align:middle
        
        方法三：margin + vertical-align(垂直对齐)
        要想在父元素中设置vertical-align，须设置为table-cell元素；要想让margin:0 auto实现水平居中的块元素内容撑开宽度，须设置为table元素。而table元素是可以嵌套在tabel-cell元素里面的，就像一个单元格里可以嵌套一个表格

        方法4：使用absolute 绝对定位
         1.利用绝对定位元素的盒模型特性，在偏移属性为确定值的基础上，设置margin:auto
         2.利用绝对定位元素的偏移属性和translate(-50%，-50%)函数的自身偏移达到水平垂直居中的效果
         3.在子元素宽高已知的情况下，可以配合margin负值达到水平垂直居中效果

        方法5：使用flex
         1.在伸缩项目上使用margin:auto
         2.在伸缩容器上使用主轴对齐justify-content和侧轴对齐align-items
        
        方法6：使用grid
         1.在网格项目中设置justify-self、align-self或者margin:  auto
         2.在网格容器上设置justify-items、align-items或justify-content、align-content
        `,
      },
      {
        question: "自适应布局",
        answer: `
## 视口布局
// 单位
rem + flex

vw, vh, vmin, vmax

自适应正方形
1.width:50%;height:50vw; // 1vw=1% viewoart width
2.width:50%;height:0;padding-bottom:100% // 垂直方向的padding撑开容器（padding百分比是分局块的width来去欸顶的就是父元素的width）
3.双层嵌套，父类div:position:relativd;padding-top:100%;height:0;width:50%
子类：position:absolute;width:100%;height:100%';top:0;left:0

width 单位
// 计算方法
{
  width: 80vmin // 取视口宽度( vw )和视口高度( vh )小的值
  width: 80vmax // 取视口宽度( vw )和视口高度( vh )大的值
  width: max(50vw,500px,100em)
  height: min(50vh,500px,100em)
  width: clamp(100px, 50vw, 500px) // 理想选择
  // 内在尺寸
  width: min-content // 内容内的最小宽度
  width: max-content // 内容本身的最大宽度
  width: fit-content // 自适宽度
  width: avaliable // 可用空间
  }

### clamp 方法使用
// demo
:root {
  --ideal-viewprot-width: 750; // 理想宽度(设计稿宽度)
  --current-viewport-width: 100vw; // 视口宽度
  --min-viewport-width: 320px; // 最小
  --max-viewport-width: 1440px; // 最大
  --clamped-viewport-width: clamp(
    var(--min-viewport-width),
    var(--current-viewport-width),
    var(--max-viewport-width)
  );
}

## 容器查询(微观布局)
.container {
  container-type: inline-size; // 重要属性
}

@container (width > 400px){

}

## 媒体布局(宏观布局)
@media screen and (min-width: 900px) { // >900

}


## 记要
BEM 命名
CSS -> SASS -> BEM -> CSS Modules -> Styled Components

# 自适应布局
> 网站 web.dev codepen.io(新花样demo) w3cplus.com

> 书箱 CSS-tricks 图解CSS3 windicss TailwindCSS

> 大佬博客  css-tricks.com ishadeed.com
`,
      },
      {
        question: "图文样式line-height如何继承",
        answer: `body{
          font-size:20px;
          line-height:200%;
        }
        p{
          font-size:16px;
        }
        问P的行高多少？20px*200%=40px
        1.如果line-height是数字，则继承该值
        2.如果是1.5那就是16*1.5=24px
        3.如果写了百分比，则继承计算出来的值
        `
      },
      {
        question: "选择器优先级",
        answer: `
对于选择器的优先级：
标签选择器、伪元素选择器：1
类选择器、伪类选择器、属性选择器：10
id 选择器：100
内联样式(style)：1000
!important 声明的样式的优先级最高

注意事项：
!important 声明的样式的优先级最高；
如果优先级相同，则最后出现的样式生效；
继承得到的样式的优先级最低；
通用选择器（*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0 ；
样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。`,
      },
      {
        question: "BFC",
        answer: `
块格式化上下文（Block Formatting Context，BFC）是 Web 页面的可视化 CSS 渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。
通俗来讲：BFC 是一个独立的布局环境，可以理解为一个容器，在这个容器中按照一定规则进行物品摆放，并且不会影响其它环境中的物品。如果一个元素符合触发 BFC 的条件，
则 BFC 中的元素布局不受外部影响。

创建 BFC 的条件：
根元素：body；
元素设置浮动：float 除 none 以外的值；
元素设置绝对定位：position (absolute、fixed)；
display 值为：inline-block、table-cell、table-caption、flex 等；
overflow 值为：hidden、auto、scroll；

BFC 的特点：
垂直方向上，自上而下排列，和文档流的排列方式一致。
在 BFC 中上下相邻的两个容器的 margin 会重叠
计算 BFC 的高度时，需要计算浮动元素的高度
BFC 区域不会与浮动的容器发生重叠
BFC 是独立的容器，容器内部元素不会影响外部元素
每个元素的左 margin 值和容器的左 border 相接触

BFC 的作用：
解决 margin 的重叠问题：由于 BFC 是一个独立的区域，内部的元素和外部的元素互不影响，将两个元素变为两个 BFC，就解决了 margin 重叠的问题。
解决高度塌陷的问题：在对子元素设置浮动后，父元素会发生高度塌陷，也就是父元素的高度变为 0。解决这个问题，只需要把父元素变成一个 BFC。
常用的办法是给父元素设置overflow:hidden。
创建自适应两栏布局：可以用来创建自适应两栏布局：左边的宽度固定，右边的宽度自适应`,
      },
      {
        question: "文本溢出",
        answer: `
单行文本溢出
overflow: hidden; // 溢出隐藏
text-overflow: ellipsis; // 溢出用省略号显示
white-space: nowrap; // 规定段落中的文本不进行换行

多行文本溢出
overflow: hidden; // 溢出隐藏
text-overflow: ellipsis; // 溢出用省略号显示
display: -webkit-box; // 作为弹性伸缩盒子模型显示。
-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
-webkit-line-clamp: 3; // 显示的行数`,
      },
      {
        question: "position定位",
        answer: `
static(默认值):元素按照正常的文档流进行定位，不会相对于其他元素移动。

relative:元素相对于其正常位置进行定位，可以通过top、bottom、left、right等属性来控制元素相对于其正常位置的偏移量。

absolute:元素相对于最近的非static定位的祖先元素进行定位，可以通过top、bottom、left、right等属性来控制元素相对于其祖先元素的偏移量。
如果没有非static定位的祖先元素，则相对于初始包含块进行定位。

fixed:元素相对于浏览器窗口进行定位，可以通过top、bottom、left、right等属性来控制元素相对于浏览器窗口的偏移量。

sticky:元素在滚动范围内相对于其最近的固定定位祖先元素进行定位，可以通过top、bottom、left、right等属性来控制元素相对于其祖先元素的偏移量。
如果没有固定定位的祖先元素，则相对于初始包含块进行定位`,
      },
      {
        question: "CSS3动画",
        answer: `
animation
css3的animation是css3新增的动画属性，这个css3动画的每一帧是通过@keyframes来声明的
.text{
  animation: show 2s ease-in 1s infinite reverse both running;
}

@keyframes show {
  50%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}


transition
主要由以下几种变换,rotate(旋转),scale(缩放),skew(扭曲),translate(移动)和matrix(矩阵变换).
transform本身是没有过渡效果的,它只是对元素做大小、旋转、倾斜等各种变换,
通过和transition或者animation相结合,可以让这一变换过程具有动画的效果
transform
/* property name | duration | timing function | delay */
transition: margin-right 4s ease-in-out 1s;

transform: scale(2, 0.5);

transform: translate(12px, 50%);


transition 和 animation 以及 transform 的区别
transform 本身没有动画效果，它实现动画需要依赖其余两者; Animation和transition大部分属性是相同的，他们都是随时间改变元素的属性值

transition 设置的是 css 属性变化时的过渡动画，而 animation 动画会自动执行；

transition 定义的动画触发一次执行一次，想再次执行就需要再次触发；animation 可以执行指定次数或者无数次；

transition定义的动画只有两个状态,开始态和结束态,animation可以定义多个动画中间态,且可以控制多个复杂动画的有序执行.

如何优化动画性能
开启GPU加速(translate3d(),will-change,filter,opacity)

尽量减少js动画，使用对性能友好的 requestAnimationFrame

requestAnimationFrame() 方法，会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成

requestIdleCallback() 方法，它指定只有当一帧的末尾有空闲时间，才会执行回调函数

手写动画的最小时间间隔是多久
多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms。

transform 的 rotate translateX 先后顺序有何不同？
如果先旋转再平移的话，会按照旋转后的坐标系进行平移。哪个在前就先执行。`,
      },
      {
        question: "盒模型",
        answer: `
盒子模型的组成为：content（元素内容） + padding（内边距） + border（边框） + margin（外边距）

CSS的盒模型有两种：标准盒子模型和IE盒子模型
标准盒子模型：盒子实际总宽=content+ border + padding
IE盒子模型：盒子实际总宽=content

如何设置盒模型
可以通过设置box-sizing的值来改变盒模型；
box-sizing: content-box为标准盒子模型；也是默认值；
box-sizing: border-box为IE盒模型；

box-sizing的应用场景在于
是否想让子元素因为padding和border溢出

盒模型 margin 负值问题
margin-top 元素自身会向上移动，同时会影响下方的元素会向上移动；
margin-botom 元素自身不会位移，但是会减少自身供css读取的高度，从而影响下方的元素会向上移动。
margin-left 元素自身会向左移动，同时会影响其它元素；
margin-right 元素自身不会位移，但是会减少自身供css读取的宽度，从而影响右侧的元素会向左移动；`,
      },
      {
        question: "CSS场景题目",
        answer: `
自适应正方形(宽高相等)
.quare{
  width: 10vw;
  height: 10vw;
}
.quare {
  width: 20%;
  height: 0;
  padding-top: 20%
  background-color: #bfa;
}

三栏布局
- position margin
- flex
-grid

三角形/扇形
{
  width: 0;
  height: 0,
  border: 100px solid transtion;
  border-top-color: red;
}
        
{
  border-radius: 100px;
}

单行/多行文本溢出
{
  overflow: hidden;
  text-overflow: essilaple;
  white-space: nowrap
}
{
  overflow: hidden;
  text-overflow: essilaple;
  display: -webkit-box;
  -webkit-box-orient: vertiacl;
  -webkit-line-clmp:3;
}
        
1px问题
- 伪元素先放大,再缩小
- viewport 缩放        
`,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "HTML",
    content: [
      {
        question: "onload/DomContentLoaded",
        answer: `
window.onload 资源全部加载完才能执行，包括图片
DomContentLoaded Dom渲染完成即可，图片可能尚未下载
`,
      },
      {
        question: "HTML5新增",
        answer: `
<header></header>  头部
<nav></nav>  导航栏
<section></section>  区块（有语义化的div）
<main></main>  主要区域
<article></article>  主要内容
<aside></aside>  侧边栏
<footer></footer>  底部

新增选择器 document.querySelector、document.querySelectorAll
拖拽释放(Drag and drop) API
媒体播放的 video 和 audio
本地存储 localStorage 和 sessionStorage
离线应用 manifest
桌面通知 Notifications
语意化标签 article、footer、header、nav、section
增强表单控件 calendar、date、time、email、url、search
地理位置 Geolocation
多任务 webworker
全双工通信协议 websocket
历史管理 history
跨域资源共享(CORS) Access-Control-Allow-Origin
页面可见性改变事件 visibilitychange
跨窗口通信 PostMessage
Form Data 对象
绘画 canvas

H5移除的元素：
纯表现的元素：basefont、big、center、font、s、strike、tt、u
对可用性产生负面影响的元素：frame、frameset、noframes`,
      },
      {
        question: "defer和async",
        answer: `
如果没有 defer 或 async 属性，浏览器会立即加载并执行相应的脚本。它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样就阻塞了后续文档的加载

defer 和 async 属性都是异步去加载外部的 JS 脚本文件，它们都不会阻塞页面的解析，其区别如下：

执行顺序: 
多个带 async 属性的标签，不能保证加载的顺序；多个带 defer 属性的标签，按照加载顺序执行；

否并行执行：
async 属性，表示后续文档的加载和执行与 js 脚本的 加载和执行 是并行进行的，即异步执行；
defer 属性，加载后续文档的过程和 js 脚本的 加载 (此时仅加载不执行)是并行进行的(异步)，
js 脚本需要等到文档所有元素解析完成之后才执行，OMContentLoaded 事件触发执行之前`,
      },
      {
        question: "RAF/RIC",
        answer: `
requestAnimationFrame
window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
该方法需要传入一个回调函数作为参数,该回调函数会在浏览器下一次重绘之前执行。
回调函数执行次数通常是每秒 60 次，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。
window.requestAnimationFrame(()=>{
  // ...
})

requestIdleCallback
window.requestIdleCallback()这个函数将在浏览器空闲时期被调用能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，

如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。
你可以在空闲回调函数中调用 requestIdleCallback()，以便在下一次通过事件循环之前调度另一个回调

requestIdleCallback(()=>{
  // ...
}, {tiemout:1000})
`,
      },
      {
        question: "5个observer",
        answer: `
IntersectionObserver
自动“观察”元素是否可见，由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做“交叉观察器”（intersection oberserver）。
var observer = new IntersectionObserver(callback, options);
observer.observe(el)

MutationObserver
接口提供了监视对 DOM 树所做更改的能力(删除添加子元素)
// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);
// 以上述配置开始观察目标节点
observer.observe(targetNode, config);
// 之后，可停止观察
observer.disconnect();

ResizeObserver 
监听元素大小改变
避免了通过回调函数调整大小时，通常创建的无限回调循环和循环依赖项。它只能通过在后续的帧中处理 DOM 中更深层次的元素来做到这一点

performanceObserver
页面性能进行监听
var observer = new PerformanceObserver(function(list, obj) {
  var entries = list.getEntries();
  for (var i=0; i < entries.length; i++) {
    // Process "mark" and "frame" events
  }
});
observer.observe({entryTypes: ["mark", "frame"]});`,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "工程化",
    content: [
      {
        question: "webpack性能优化",
        answer: `
1.babel-loader 开启缓存
 {
  test:/\.js$/,
  use:['babel-loader?cacheDirectory'], // 开启
  incloude:path.resolve(__dirname,'src') // 明确范围
 }
2.IgnorePlugin 避免引入无用模块(直接不引入代码中没有)
 new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
3.noParse 避免重复打包 如:.min.js 引入但不打包
 module: {
   noParse: /\.min\.js$/
 }
4.happypack 开启多进程打包,提高构建速度（特别多核CPU）
 const HappyPack = require('happypack');
5.DllPlugin 动态链接库插件 提高构建速度
 DllPlugin 的主要目的是将一些第三方库（如 React、Vue、Lodash 等）分离出来，单独打包成动态链接库
 DllReferencePlugin 引入dll文件
 plugins: [
  // ...
  new DllPlugin({
    filename: 'manifest.json',
    library: '[name]',
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, 'dist/manifest.json'),
  }),
],
`
      },
      {
        question: "webpack流程",
        answer: `
初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数

开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译

确定入口：根据配置中的 entry 找出所有的入口文件

编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系

输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统`,
      },
      {
        question: "webpack五大",
        answer: `
entry（入口）
指示 Webpack 从哪个文件开始打包

output（输出）
指示 Webpack 打包完的文件输出到哪里去，如何命名等

module.loader（加载器）
webpack 本身只能处理 js、json 等资源，其他资源需要借助 loader，Webpack 才能解析

plugins（插件）
扩展 Webpack 的功能

mode(模式):development production`,
      },
      {
        question: "SpChunks(分包)",
        answer: `
optimization: {
  // 代码分割配置
  splitChunks: {
    chunks: "all", // 对所有模块都进行分割
    // 以下是默认值
    // minSize: 20000, // 分割代码最小的大小
    // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
    // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
    // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
    // maxInitialRequests: 30, // 入口js文件最大并行请求数量
    // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
    // cacheGroups: { // 组，哪些模块要打包到一个组
    //   defaultVendors: { // 组名
    //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
    //     priority: -10, // 权重（越大越高）
    //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
    //   },
    //   default: { // 其他没有写的配置会使用上面的默认值
    //     minChunks: 2, // 这里的minChunks权重更大
    //     priority: -20,
    //     reuseExistingChunk: true,
    //   },
    // },
    // 修改配置
    cacheGroups: {
      // 组，哪些模块要打包到一个组
      // defaultVendors: { // 组名
      //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //   priority: -10, // 权重（越大越高）
      //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      // },
      default: {
        // 其他没有写的配置会使用上面的默认值
        minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  }`,
      },
      {
        question: "externals",
        answer: `
externals: {
  // key是包名, Value为挂载到window全局变量名,自执行函数拿到,区分不同的环境

  'Echarts': 'Echarts',
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'axios': 'Axios',
}

CDN容错
<script title="cdn" src="https://xx-cdn.com/vue/vue-2.6.11.min.js" onerror="fallback('vue-2.6.11.min.js')"></script>
function fallback(fallbackUrl, local) {
  fallbackUrl = local ? fallbackUrl : myServer + fallbackUrl; // 和后面的资源刷新的代码有关系
  let fallbackScript = document.createElement("script"); // 创建一个<script>标签
  fallbackScript.src = fallbackUrl; // 绑好script标签的src值
  document.head.appendChild(fallbackScript); // 重新获取资源
}`,
      },
      {
        question: "entry",
        answer: `
// 单入口        
module.exports = {
    entry: './path/to/my/entry/file.js'
}

// key 代表 输出的chunk名
module.exports = {
    entry: {
        main: './path/to/my/entry/file.js'
    }
}

// 多入口
module.exports = {
    entry: {
        main1: './path/to/my/entry/file.js',
        main2: './path/to/my/entry/file.js'
    }
}

module.exports = {
    entry: ['./src/file_1.js', './src/file_2.js'],
    output: {
        filename: 'bundle.js'
    }
}

对象其它配置
dependOn：当前入口所依赖的入口。它们必须在该入口被加载前被加载
filename：指定要输出的文件名称
import：启动时需加载的模块
library：指定library选项，为当前entry构建一个library
runtime：运行时chunk 的名字，如果设置了，就会创建一个新的运行时chunk，在 webpack 5.43.0 之后可将其设为 false 以避免一个新的运行时chunk
publicPath：当该入口的输出文件在浏览器中被引用时，为它们指定一个公共URL地址`,
      },
      {
        question: "loader/plugin",
        answer: `
loader 用于对模块的"源代码"进行转换，在 import 或"加载"模块时预处理文件
写在 module.rules 属性中，属性介绍如下：
rules 是一个数组的形式，因此我们可以配置很多个 loader
每一个 loader 对应一个对象的形式，对象属性 test 为匹配的规则，一般情况为正则表达式
属性 use 针对匹配到文件类型，调用对应的 loader 进行处理

style-loader: 将 css 添加到 DOM 的内联样式标签 style 里
css-loader :允许将 css 文件通过 require 的方式引入，并返回 css 代码
less-loader: 处理 less
sass-loader: 处理 sass
postcss-loader: 用 postcss 来处理 CSS
autoprefixer-loader: 处理 CSS3 属性前缀，已被弃用，建议直接使用 postcss
file-loader: 分发文件到 output 目录并返回相对路径
url-loader: 和 file-loader 类似，但是当文件小于设定的 limit 时可以返回一个 Data Url
html-minify-loader: 压缩 HTML
babel-loader :用 babel 来转换 ES6 文件到 ES

Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情。
Loader 运行在 Node.js 中，我们可以调用任意 Node.js 自带的 API 或者安装第三方模块进行调用
Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下 Loader 处理二进制文件时，
需要通过 exports.raw = true 告诉 Webpack 该 Loader 是否需要二进制数据
尽可能的异步化 Loader，如果计算量很小，同步也可以
Loader 是无状态的，我们不应该在 Loader 中保留状态
使用 loader-utils 和 schema-utils 为我们提供的实用工具
加载本地 Loader 方法: Npm linkResolveLoader

手写了md-loader,md内容进行ast遍历加工和转义,转为vue的模版信息,再借助vue-loader,相当于把md文件转为vue文件再传给vue-loader运行,出来的静态页面

plugin
plugin 赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 webpack 的不同阶段（钩子 / 生命周期），贯穿了 webpack 整个编译周期，
目的在于解决 loader 无法实现的其他事。
通过配置文件导出对象中 plugins 属性传入 new 实例对象

HTMLwebpackplugin
compressionwebpackplugin gzip压缩
IgnorePlugin 排除
MinChunkSizePlugin chunk大小限制
webpack-bundle-anizlay-plugin 输出打包资源分析

webpack 在运行的生命周期中会广播出许多事件,Plugin 可以监听这些事件
compiler 暴露了和 Webpack 整个生命周期相关的钩子
compilation 暴露了与模块和依赖有关的粒度更小的事件钩子
插件需要在其原型上绑定 apply 方法，才能访问 compiler 实例
传给每个插件的 compiler 和 compilation 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
找出合适的事件点去完成想要的功能
emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
watch-run 当依赖的文件发生变化时会触发
异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住`,
      },
      {
        question: "tree-shake",
        answer: `
运行过程中静态分析模块之间的导入导出，确定模块中哪些导出值没有其它模块使用，将其删除。

实现
先标记出模块导出值哪些没有被用过，使用trerser删掉这些没被用到的导出语句
Make阶段：收集模块导出变量并记录到模块依赖关系图ModuleGraph变量中
Seal阶段：遍历ModuleGraph标记模块导出变量有没有被使用
生成产物时，变量没有被其它模块使用删除对应的导出语句。`,
      },
      {
        question: "sourceMap",
        answer: `
devtool: eval-cheap-module-source-map

js对象:
version：Source map的版本，目前为3。
file：转换后的文件名。
sourceRoot：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
sources：转换前的文件。该项是一个数组，表示可能存在多个文件合并。
names：转换前的所有变量名和属性名。
mappings：记录位置信息的字符串，下文详细介绍。
第一层是行对应，以分号（;）表示，每个分号对应转换后源码的一行。所以，第一个分号前的内容，就对应源码的第一行，以此类推。
第二层是位置对应，以逗号（,）表示，每个逗号对应转换后源码的一个位置。所以，第一个逗号前的内容，就对应该行源码的第一个位置，以此类推。
第三层是位置转换，以VLQ编码表示，代表该位置对应的转换前的源码位置。`,
      },
      {
        question: "vite",
        answer: `
Vite 核心原理
Vite其核心原理是利用浏览器现在已经支持ES6的import，碰见import就会发送一个HTTP请求去加载文件。
Vite启动一个 koa 服务器拦截这些请求，并在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再以ESM格式返回给浏览器。
Vite整个过程中没有对文件进行打包编译，做到了真正的按需加载，所以其运行速度比原始的webpack开发编译速度快出许多！

它具有以下特点：
快速的冷启动：采用No Bundle和esbuild预构建，速度远快于Webpack
高效的热更新：基于ESM实现，同时利用HTTP头来加速整个页面的重新加载，增加缓存策略：源码模块使用协商缓存，依赖模块使用强缓；因此一旦被缓存它们将不需要再次请求。
基于 Rollup 打包：生产环境下由于esbuild对css和代码分割并使用Rollup进行打包；

vite 会直接启动开发服务器，不需要进行打包操作，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。
利用现代浏览器支持 ES Module 的特性，当浏览器请求某个模块的时候，再根据需要对模块的内容进行编译，这种方式大大缩短了编译时间。
区别 在热模块 HMR 方面，当修改一个模块的时候，仅需让浏览器重新请求该模块即可，无须像 webpack 那样需要把该模块的相关依赖模块全部编译一次，效率更高

基于 ESM 的 Dev server
在Vite出来之前，传统的打包工具如Webpack是先解析依赖、打包构建再启动开发服务器，Dev Server 必须等待所有模块构建完成后才能启动，
当我们修改了 bundle模块中的一个子模块， 整个 bundle 文件都会重新打包然后输出。项目应用越大，启动时间越长。
而Vite利用浏览器对ESM的支持，当 import 模块时，浏览器就会下载被导入的模块。先启动开发服务器，当代码执行到模块加载时再请求对应模块的文件，本质上实现了动态加载。

基于 ESM 的 HMR 热更新
所有的 HMR 原理：
目前所有的打包工具实现热更新的思路都大同小异：主要是通过WebSocket创建浏览器和服务器的通信监听文件的改变，当文件被修改时，服务端发送消息通知客户端修改相应的代码，
客户端对应不同的文件进行不同的操作的更新。

Vite 的表现：
Vite 监听文件系统的变更，只用对发生变更的模块重新加载，这样HMR 更新速度就不会因为应用体积的增加而变慢
而 Webpack 还要经历一次打包构建。
所以 HMR 场景下，Vite 表现也要好于 Webpack。

基于 Esbuild 的依赖预编译优化
Vite预编译之后，将文件缓存在node_modules/.vite/文件夹下

为什么需要预编译 & 预构建
支持 非ESM 格式的依赖包：Vite是基于浏览器原生支持ESM的能力实现的，因此必须将commonJs的文件提前处理，转化成 ESM 模块并缓存入 node_modules/.vite
减少模块和请求数量：Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。
如果不使用esbuild进行预构建，浏览器每检测到一个import语句就会向服务器发送一个请求，如果一个三方包被分割成很多的文件，
这样就会发送很多请求，会触发浏览器并发请求限制；

为什么用 Esbuild
Esbuild 打包速度太快了，比类似的工具快10~100倍，

Esbuild 为什么这么快
Esbuild 使用 Go 语言编写，可以直接被转化为机器语言，在启动时直接执行；
而其余大多数的打包工具基于 JS 实现，是解释型语言，需要边运行边解释；
JS 本质上是单线程语言，GO语言天生具有多线程的优势，充分利用 CPU 资源；`,
      },
      {
        question: "Babel原理",
        answer: `
babel 的转译过程也分为三个阶段，这三步具体是：

解析 Parse: 将代码解析⽣成抽象语法树（AST），即词法分析与语法分析的过程；
转换 Transform: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在此过程中进⾏添加、更新及移除等操作；
⽣成 Generate: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator。`,
      },
      {
        question: "Git",
        answer: `
git rebase 和 merge 的区别(代码分支合并

合并策略:
git rebase策略倾向于将当前的commit应用到其他分支上
git merge策略则是将当前分支合并到其他分支

提交历史：
Git rebase操作会保留所有的commit历史，并且将这些历史提交按照时间顺序应用到目标分支上，因此提交历史看起来更加清晰。
Git merge操作会在合并过程中创建一个新的commit，将两个分支的修改内容合并在一起，同时保留所有的commit历史，但按照时间先后顺序记录看起来可能会有些混乱。

reset 和revert区别(版本回退)

git reset是用于彻底回退到指定的commit版本，这意味着该commit后的所有commit都将被清除
git revert是用于撤销指定commit的修改，但并不影响后续的commit

Demo: 
你按时间顺序提交了a、b、c三个版本，如果想要撤销到a版本，那么只需要使用git revert a1234即可。
这样，b和c版本的改动都会被保留，而a版本的改动则会被撤销。
如果你误提交了某个版本（比如a1234），想要撤销这个提交但不引起历史提交的变更，可以使用git revert a1234进行操作。
`,
      },
      {
        question: "",
        answer: ``,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "网络协议",
    content: [
      {
        question: "HTTP强缓存",
        answer: `
http请求
   |
 有缓存
   |
缓存是否过期 ——Y—— 有Etag/lastModeifed ——Y—— 向服务器发http请求带If-Modified-Since/If-None-Match
   |N                     |N                               |
读取缓存               向服务器发                           |
   |                      |                                |
   |                    服返回 <————200——— 服务器判断缓存是否可用
   |                      |                                |304
   |———强缓存———> 页面呈现 <————协商缓存——— 读缓存
Etag->传给后台if-none-match(资源唯一标识)
HTTP1.1
将上次返回的Etag发送给服务器，询问Etag是否有更新，Etag优先级比last-modified更高。

last-modified->传给后台if-modified-since（最后修改时间）
HTTP1.0
本地文件最后修改日期，如果本地打开缓存文件，就会造成last-modified被修改
强缓存(状态码200)
cache-control
HTTP1.1 相对时间，max-age,设置强缓存

expires
HTTP1.0 绝对时间，修改本地时间，缓存失效

cache-control
属性:
no-store 缓存中不得存储任何关于客户端请求和服务端响应的内容，每次请求下载完整内容。

no-cache 缓存中存储服务端响应内容，每次请求缓存都要向服务端评估缓存是否可用，根据返回状态码304使用本地资源

public || private public 表示响应可以被任何中间人比如中间代理，CDN缓存。 默认private，中间人不级缓存，只能用于浏览器私有缓存中。

max-age: 距离请求发起的时间的秒数。

must-revalidate 缓存过期后的任何情况下都必须重新验证。

协商缓存(状态码304)
cache-control: no-cache; // 设置协商缓存`,
      },
      {
        question: "输入URL",
        answer: `
首先会对 URL 进行解析
缓存判断
DNS 解析
建立TCP连接
发送请求
服务器收到请求返回数据
页面渲染
涉及阻塞:
  dom解析
    js阻塞
    css不阻塞

  dom渲染
    js css都阻塞
浏览器渲染主要有以下步骤：
浏览器从最初接收请求来的HTML，CSS，javascript等资源，然后解析，构建树，渲染布局，绘制最后显示页面。
构建DOM树
  DOM树构建会被JS的加载而执行阻塞
  display：none元素也会在DOM树中
  注释也会在DOM树中
  script标签也会在DOM树中

构建CSSOM规则树
  css解析和dom解析同时进行
  css解析与script的执行互斥
  解析CSS文件生成CSSOM，
  webkit内核进行了script执行优化，只有js访问css才发生互斥。

构建渲染树（render tree）
  先从dom树的根节点开始遍历每个可见节点，对每个可见节点找到适配的css样式规则并应用。
  Render Tree和DOMTree不完全对应
  display：none 元素不在Render tree中

布局（layout）
  渲染树根节点开始遍历，通过节点Render Object对象的样式信息。确定每个节点对象在页面的大小和位置。
  float，absolute，fixed发生位置偏移
  脱离文档流，就是脱离Render Tree

绘制（painting）
  遍历渲染树，调用paint方法显示内容。`,
      },
      {
        question: "http headers",
        answer: `
Request Headers（请求头）包含了客户端向服务器发送请求时的一些信息。常见的请求头：
1.Accept(/ekspt/):浏览器可接收的数据格式，如 "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8"
2. Accept-Encoding：指定客户端可以支持的编码方式，如 "gzip, deflate, br"。
3. Accept-Language：指定客户端希望使用的语言，如 "en-US,en;q=0.8"。
4. Connection：指定客户端与服务器之间的连接类型，如 "keep-alive"。
5. Cookie：包含客户端之前与服务器交互时服务器设置的 Cookie 信息。
6. Host：指定请求的目标服务器地址和端口
7. User-Agent：包含客户端的浏览器信息，如 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"。
8. Referer：指定客户端从哪个页面跳转过来的，通常用于统计和防盗链。
9. Authorization：包含客户端的认证信息，如 "Bearer "。
10. Content-Type：指定请求的内容类型，如 "application/x-www-form-urlencoded" 或 "application/json"。
11. Content-Length：指定请求的内容长度。
12. Host：指定请求的目标服务器地址和端口。
13. Range：指定请求的资源范围，如 "bytes=0-99"。
14. If-Modified-Since：指定客户端认为资源的最后修改时间，服务器会检查资源是否在此时间之后有更新，如果没有更新，则返回 304 Not Modified。
15. If-None-Match：指定客户端认为资源的唯一标识，服务器会检查资源是否与该标识匹配，如果匹配，则返回 304 Not Modified。

Response Headers（响应头）包含了服务器向客户端发送响应时的一些信息。常见的响应头：
1. Access-Control-Allow-Origin：指定允许跨域请求的来源，通常用于处理跨域问题。
2. Access-Control-Allow-Methods：指定允许跨域请求的 HTTP 方法，如 "GET, POST, PUT, DELETE, OPTIONS"。
3. Access-Control-Allow-Headers：指定允许跨域请求的请求头，如 "Content-Type, Authorization"。
4. Content-Type：指定响应的内容类型，如 "text/html; charset=utf-8"。
5. Content-Length：指定响应的内容长度。
6. Server：包含服务器的信息，如 "Apache/2.4.6 (Red Hat)".
7. Set-Cookie：包含服务器向客户端设置的 Cookie 信息。
8. Vary：指定响应的内容 vary 头，用于指定响应的内容根据请求头中的某个字段进行变化。
9. WWW-Authenticate：指定客户端需要进行认证的类型，如 "Bearer realm=example.com"。`
      },
      {
        question: "HTTP状态码",
        answer: `
1xx(消息状态码)
100：Continue 继续。客户端应继续其请求。
101：Switching Protocols 切换协议。服务器根据客户端的请求切换协议。只能切换到更高级的协议，例如，切换到 HTTP 的新版本协议。

2xx(成功状态码)
200：OK 请求成功。一般用于 GET 与 POST 请求。
201：Created 已创建。成功请求并创建了新的资源
202：Accepted 已接受。已经接受请求，但未处理完成。
203：Non-Authoritative Information    非授权信息。请求成功。但返回的 meta 信息不在原始的服务器，而是一个副本。
204：No Content 无内容。服务器成功处理，但未返回内容。在未更新网页的情况下，可确保浏览器继续显示当前文档。
205：Reset Content    重置内容。服务器处理成功，用户终端（例如：浏览器）应重置文档视图。可通过此返回码清除浏览器的表单域。
206：Partial Content     部分内容。服务器成功处理了部分 GET 请求。

3xx(重定向状态码)
300：Multiple Choices 多种选择。请求的资源可包括多个位置，相应可返回一个资源特征与地址的列表用于用户终端（例如：浏览器）选择。
301：Moved Permanently 永久移动。请求的资源已被永久的移动到新 URI，返回信息会包括新的 URI，浏览器会自动定向到新 URI。
302：Found 临时移动，与 301 类似。但资源只是临时被移动。客户端应继续使用原有URI。
303：See Other    查看其它地址。与 301 类似。使用 GET 和 POST 请求查看。
304：Not Modified    未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。
305：Use Proxy    使用代理。所请求的资源必须通过代理访问。
306：Unused 已经被废弃的 HTTP 状态码。
307：Temporary Redirect 临时重定向。与 302 类似。使用 GET 请求重定向

4xx(客户端错误状态码)
400：Bad Request 客户端请求的语法错误，服务器无法理解。
401：Unauthorized 请求要求用户的身份认证。
402：Payment Required    保留，将来使用。
403：Forbidden    服务器理解请求客户端的请求，但是拒绝执行此请求。
404：Not Found 服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置"您所请求的资源无法找到"的个性页面。
405：Method Not Allowed 客户端请求中的方法被禁止。
406：Not Acceptable 服务器无法根据客户端请求的内容特性完成请求。
407：Proxy Authentication Required 请求要求代理的身份认证，与 401 类似，但请求者应当使用代理进行授权。
408：Request Time-out 服务器等待客户端发送的请求时间过长，超时。
409：Conflict 服务器完成客户端的 PUT 请求时可能返回此代码，服务器处理请求时发生了冲突。
410：Gone 客户端请求的资源已经不存在。410 不同于 404，如果资源以前有现在被永久删除了可使用 410 代码，网站设计人员可通过 301 代码指定资源的新位置。
411：Length Required 服务器无法处理客户端发送的不带 Content-Length 的请求信息。
412：Precondition Failed 客户端请求信息的先决条件错误。
413：Request Entity Too Large 由于请求的实体过大，服务器无法处理，因此拒绝请求。为防止客户端的连续请求，服务器可能会关闭连接。
414：Request-URI Too Large    请求的 URI 过长（URI通常为网址），服务器无法处理。
415：Unsupported Media Type    服务器无法处理请求附带的媒体格式。
416：Requested range not satisfiable    客户端请求的范围无效。
417：Expectation Failed    服务器无法满足 Expect 的请求头信息

5xx(服务端错误状态码)
500：Internal Server Error 服务器内部错误，无法完成请求。
501：Not Implemented 服务器不支持请求的功能，无法完成请求。
502：Bad Gateway 作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应。
503：Service Unavailable 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中。
504：Gateway Time-out 充当网关或代理的服务器，未及时从远端服务器获取请求。
505：HTTP Version not supported 服务器不支持请求的HTTP协议的版本，无法完成处理 `,
      },
      {
        question: "XSS/CSRF/DDOS",
        answer: `
XSS
XSS(Cross-Site Scripting，跨站脚本攻击)是一种代码注入攻击。攻击者在目标网站上注入恶意代码，当被攻击者登陆网站时就会执行这些恶意代码，
这些脚本可以读取 cookie，session tokens，或者其它敏感的网站信息，对用户进行钓鱼欺诈
避免
XSS: 标签进行转义,httponly,使用csp建立白名单,对外部资源加载进行限制

CSRF
CSRF（Cross-site request forgery 跨站请求伪造：）攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。
利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。
避免
CSRF: 使用post接口 同源检测请求头referer token 验证码 设置cookie Samesite为严格模式

DDOS
DDoS(Distributed Denial of Service，分布式拒绝服务攻击)
通常利用大量的代理服务器（也称为“僵尸”或“肉鸡”）向目标服务器发送请求，使得目标服务器无法处理所有的请求，从而使得真正的用户无法访问目标服务器上的服务

DDoS攻击有几种常见的类型：
TCP/UDP FLOOD：这种类型的攻击通过向目标服务器发送大量的TCP或UDP数据包，使其无法处理所有的请求。
ICMP FLOOD：这种类型的攻击通过向目标服务器发送大量的ICMP数据包，使其无法处理所有的请求。
SYN FLOOD：这种类型的攻击通过向目标服务器发送大量的虚假SYN连接请求，使其无法处理所有的请求。
HTTP FLOOD：这种类型的攻击通过向目标服务器发送大量的HTTP请求，使其无法处理所有的请求。

防御DDoS攻击:
使用云服务提供商的DDoS防御服务：许多云服务提供商都提供了DDoS防御服务，可以帮助用户防御DDoS攻击。
增加带宽或提升服务器性能：增加带宽可以使得目标服务器能够处理更多的请求，从而减少DDoS攻击的影响。提升服务器性能可以通过升级硬件、优化软件配置等方式实现。
限制流量速率：通过限制流量速率可以使得目标服务器不会被过多的请求淹没。
过滤不必要的请求：通过过滤不必要的请求可以使得目标服务器只处理真正的用户请求。
使用负载均衡或集群技术：通过使用负载均衡或集群技术可以使得目标服务器的负载得到分散，从而减少DDoS攻击的影响。

CC攻击
CC攻击是一种DDoS攻击的一种形式，攻击者借助代理服务器生成指向受害主机的合法请求，实现DDoS和伪装，因此CC攻击主要也是用来攻击页面的。
防御CC攻击
完善日志。保留完整日志，通过对日志的深入分析，可以发现攻击者的源IP，然后在IIS（Web页面服务组件）或防火墙中设置屏蔽该IP
使用安全硬件设备。使用专门的安全硬件设备如调度器和防火墙，可以快速减轻大流量攻击。通过允许将流量分散到不同的服务器中，硬件设备可以快速降低服务器负荷
使用带高防服务器。高防服务器有专门的防CC防火墙架构，可以根据不同的CC攻击调整专门的CC防护策略来拦截攻击。
安装软防。可以在服务器里面安装软件防火墙，从而在一定程度上阻止CC攻击。
`,
      },
      {
        question: "TCP/UDP",
        answer: `
              UDP	                                            TCP
是否连接	    无连接	                                        面向连接
是否可靠	    不可靠传输(不使用流量控制和拥塞控制)	             可靠传输（数据顺序和正确性），使用流量控制和拥塞控制
连接个数	    支持一对一 ,一对多，多对一和多对多交互通信	        只能是一对一通信
传输方式	    面向报文	                                       面向字节流
首部开销	    首部开销小，仅 8 字节	                            首部最小 20 字节，最大 60 字节
适用场景	    适用于实时应用，例如视频会议、直播	                适用于要求可靠传输的应用，例如文件传输`,
      },
      {
        question: "Get/Post",
        answer: `
GET 在浏览器可以正常回退，而 POST 会再次提交请求。

GET 会被浏览器主动 cache，而 POST 不会，需要手动设置。

GET只能进行 url 编码，POST 支持多种编码方式。

GET 请求参数会被完整保留在浏览器历史记录里，而 POST参数不会被保留。

Get 浏览器限制URL中传送的参数长度，而 POST 不限制长度。

GET 参数通过 URL 传递，POST 放在 Request body 中

安全性
Get参数直接暴露在 URL 上，不能用来传递敏感信息。
新增了一些请求方法 delete patch/put 
`,
      },
      {
        question: "http/https",
        answer: `
HTTP 和 HTTPS 协议的主要区别如下：
HTTPS 协议需要 CA 证书，费用较高；而 HTTP 协议不需要；
HTTP 协议是超文本传输协议，信息是明文传输的，HTTPS 则是具有安全性的 SSL 加密传输协议；
使用不同的连接方式，端口也不同，HTTP 协议端口是 80，HTTPS 协议端口是 443；
HTTP 协议连接很简单，是无状态的；HTTPS 协议是有 SSL 和 HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 更加安全。

SSL的实现这些功能主要依赖于三种手段：
对称加密：采用协商的密钥对数据加密，一个key同时负责加密解密
非对称加密：实现身份认证和密钥协商，一对Key，A加密之后，只能用B来解密
https证书:使用第三方证书或浏览器校验证书
摘要算法：验证信息的完整性
数字签名：身份验证

1.第三方机构得到key/pubkey       2.非对称加密key/pubkey                   3.对称加密
        C     S                  c            s                          c         s
        |     |                  |    ->      |                          |   ->    | key
        |  -> |           pubkey |   <-pubkey | 根据key/pubkey        key|    <-   |
浏验N告警|  <- |            'abc' |  XXX->     | 解得到‘abc’         key| xxx—> |key
Y通过                     得到key |   -> <-    | key                     | <-XXX   |

`,
      },
      {
        question: "HTTP1/2/3",
        answer: `
 HTTP1.0：
浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个TCP连接

HTTP1.1：
引入了持久连接，即TCP连接默认不关闭，可以被多个请求复用
在同一个TCP连接里面，客户端可以同时发送多个请求
虽然允许复用TCP连接，但是同一个TCP连接里面，所有的数据通信是按次序进行的，服务器只有处理完一个请求，才会接着处理下一个请求。
如果前面的处理特别慢，后面就会有许多请求排队等着
新增了一些请求方法 delet put option
新增了一些请求头和响应头

HTTP2.0：
采用二进制格式而非文本格式
完全多路复用，而非有序并阻塞的、只需一个连接即可实现并行（例如一个html文件中需要用到其他资源就直接这样使用，不会再次请求）
使用报头压缩，降低开销（下次再发送只留取差异部分）
服务器推送（允许服务端推送资源给客户端

HTTP 3.0
基于google的QUIC协议，而quic协议是使用udp实现的；
减少了tcp三次握手时间，以及tls握手时间；
解决了http 2.0中前一个stream丢包导致后一个stream被阻塞的问题；
优化了重传策略，重传包和原包的编号不同，降低后续重传计算的消耗；
连接迁移，不再用tcp四元组确定一个连接，而是用一个64位随机数来确定这个连接；
更合适的流量控制。`,
      },
      {
        question: "WebSocket/SSE",
        answer: `
WebSocket 是 HTML5 提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于 TCP 传输协议，并复用 HTTP 的握手通道。浏览器和服务器只需要完成一次握手，
两者之间就直接可以创建持久性的连接， 并进行双向数据传输。
WebSocket 的出现就解决了半双工通信的弊端。它最大的特点是：服务器可以向客户端主动推动消息，客户端也可以主动向服务器推送消息。
WebSocket 原理：客户端向 WebSocket 服务器通知（notify）一个带有所有接收者 ID（recipients IDs）的事件（event），服务器接收后立即通知所有活跃的（active）客户端，
只有 ID 在接收者 ID 序列中的客户端才会处理这个事件。

WebSocket 特点的如下：
支持双向通信，实时性更强
可以发送文本，也可以发送二进制数据‘’
建立在 TCP 协议之上，服务端的实现比较容易
数据格式比较轻量，性能开销小，通信高效
没有同源限制，客户端可以与任意服务器通信
协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL
与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

Server-Sent Events(SSE)
服务器主动向浏览器推送信息
就是服务器向客户端声明，接下来要发送的是流信息（streaming）。也就是说，发送的不是一次性的数据包，而是一个数据流，会连续不断地发送过来
客户端不会关闭连接，会一直等着服务器发过来的新的数据流
SSE 就是利用这种机制，使用流信息向浏览器推送信息。它基于 HTTP 协议，目前除了 IE/Edge，其他浏览器都支持。
代码:
var source = new EventSource(url, { withCredentials: true })
source.onopen = function (event) {
  // ...
};
source.onmessage = function (event) {
  var data = event.data;
};

二者区别:
WebSocket 更强大和灵活。因为它是全双工通道，可以双向通信; SSE 是单向通道，只能服务器向浏览器发送
WebSocket 是一个独立协议; SSE 使用 HTTP 协议，现有的服务器软件都支持。
WebSocket 协议相对复杂; SSE 属于轻量级，使用简单；
WebSocket 需要自己实现断线重连; SSE 默认支持断线重连，
WebSocket 默认支持传送二进制数据; SSE一般只用来传送文本，二进制数据需要编码后传送
SSE 支持自定义发送的消息类型
`,
      },
      {
        question: "DNS解析/劫持",
        answer: `
解析:
作用： 将域名解析为 IP 地址

dns寻址过程(递归搜索):
浏览器缓存 – 浏览器会缓存DNS记录一段时间（2分钟到30分钟不等）

系统缓存 – (host文件)

路由器缓存 – 前面的查询请求发向路由器，它一般会有自己的DNS缓存。

ISP DNS (互联网服务商的服务器缓存)

最后,发至13台根DNS,返回一个负责该顶级域名服务器的IP,继续向该顶级域名服务器IP发送请求,
该服务器如果无法解析，则会找到负责这个域名的下一级DNS服务器(如http://baidu.com)的IP给本地DNS服务器，
循环往复直至查询到映射，将解析结果返回本地DNS服务器，再由本地DNS服务器返回解析结果，查询完成

DNS劫持
运营商劫持
使用HTTPS协议。通过使用HTTPS协议，可以加密浏览器和服务器之间的通信，使得数据在传输过程中不会被中间人攻击，从而避免运营商的劫持。

检查请求头reforencer 检测从浏览器发送的所有请求，发现请求不是从合法的源头发送的，就将其屏蔽或者上报给服务器。

使用特定的浏览器插件或工具。有些浏览器插件或工具可以帮助用户检测和防止运营商劫持，例如“网络通”、“网络锁”等。

限制浏览器广告插件。一些广告插件容易被恶意利用，导致运营商劫持的发生。
`,
      },
      {
        question: "TCP/HTTPS握手",
        answer: `TCP握手
第一步：客户端发送SYN报文到服务端发起握手
第二步：服务端收到SYN报文之后回复SYN和ACK报文给客户端
第三步：客户端收到SYN和ACK，向服务端发送一个ACK报文

为什么 TCP 建立连接需要三次握手，而不是两次
防止出现失效的连接请求报文段被服务端接收的情况，从而产生错误

HTTPS握手
客户端发起 HTTPS 请求，发送客户端生成的随机数和支持的加密算法列表；
服务端返回证书、服务端生成的随机数、选择的加密方法给客户端；
客户端对证书进行合法性验证，验证通过后再生成一个随机数
客户端通过证书中的公钥对随机数进行加密传输到服务端，服务端接收后通过私钥解密得到随机数
三次握手此时已经完成，之后客户端和服务端都会根据这三个随机数，生成一个随机对称密钥，之后的数据都通过随机对称密钥进行加密传输。
`,
      },
    ],
  },
  {
    type: "浏览器",
    content: [
      {
        question: "浏览器渲染",
        answer: `
        www.baidu.com > dns(域名解析)>找到ip服务器地址 > 解析返回一个html > 解析html 遇到css/js文件 下载到浏览器中，然后浏览器开始渲染页面

  浏览器内核又可以分成两部分：渲染引擎(layout engineer或Rendering Engine)和JS引擎

  渲染引擎：
  拿到HTML 浏览器内核的 HTML Parser 会将html解析成Dom tree ,
以及拿到 Style Sheets 浏览器会进行 CSS Parser将css解析成的 Style rules(css规则) > Attachment(附加)结合在一起>生成Render tree渲染树 >painting(绘制)>Display展示

JS引擎：
js代码 > Parse(解析成 词法分析 和 语法分析) > AST(抽象语法树) > lgnition(解释器/转化器) >  生成bytecode字节码（不直接转成机器代码是因为可能JS跑的环境不同所以产生的机器代码也不同，如可能跑在Mac浏览器，window浏览器或Linux）> 机器代码(汇编码) > CPU运行结果

`,
      },
      {
        question: "浏览器多线程",
        answer: `

GUI渲染线程：负责渲染浏览器界面，包括解析HTML、CSS，构建DOM树和RenderObject树，进行布局和绘制等。
当界面需要重绘或由于某种操作引发回流时，该线程就会执行。
要注意的是，GUI渲染线程与JS引擎线程是互斥的，当JS引擎执行时GUI线程会被挂起，GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行。

JS引擎线程：也称为JS内核，负责处理Javascript脚本程序。JS引擎线程是单线程的

事件监听线程：用来完成事件处理，例如click、mouseover等。

计时器线程：负责处理定时器。

浏览器插件进程:

网络请求线程:

下载线程:
`,
      },
      {
        question: "重排/重绘",
        answer: `
reflow(重排) 页面构建 render 树。每个页面至少进行一次重排(第一次加载页面的时候)
此外，当页面造成文档结构发生改变(即元素大小,位置改变)，都会发生重排

以下操作发生重排：
添加或删除元素
改变某个元素的大小或位置
浏览器窗口大小改变(resize 事件触发)

repaint(重绘)根据 render 树绘制页面，它的性能损耗比重排要小。每次重排一定会发生重绘,但重绘不一定需要重排

以下操作发生重绘：
改变元素的颜色、透明度 ,背景颜色
fontsize: text-align 等

减少重排和重绘方法:

样式使用 class 类集中修改

使用DocumentFragment缓存需要修改的DOM元素(轻量级的文档对象，可以用于在文档中添加或插入多个节点，而不会引起多次重排和重绘)
fragment = document.createDocumentFragment();
fragment.appendChild('Hello')

尽量只修改position：absolute或fixed元素，对其他元素影响不大

使用transform属性来移动元素，而不是直接设置left、top等属性。这样可以避免因为元素位置改变而导致的重排和重绘。

使用flexbox布局或grid布局来排列元素，这些布局方式可以自动调整元素的位置和大小，避免了手动计算和设置位置的过程。

避免创建 嵌套层级 比较深的DOM，内部DOM元素修改涉及到的父元素都要进行重绘

使用CSS3的动画效果来代替JavaScript中的定时器，避免因为频繁调用定时器而导致的重排和重绘。

避免在页面上使用大量的内联样式(style标签)，并且会导致浏览器重新渲染整个页面

开启GPU加速方法
transform: translate3d(12px, 50%, 3em);
配合:
opacity
filter
will-change

动画开始GPU加速，transform 不重绘，不回流
当对一个元素应用了transform和opacity属性后，这个元素会被提升到单独的图层（GraphicsLayer）中，
避免频繁的布局计算和重绘，从而实现更高效的渲染`,
      },
      {
        question: "防抖/节流",
        answer: `
防抖:(游戏中回城)
设定一个时间 在设定定时间内没有再次触发才会执行,如果在设定时间一直触发,就重置这个设定时间,继续等待

应用:
搜索框搜索输入。只需用户最后一次输入完，再发送请求
表单提交,用户一直点击提交按钮

节流:(游戏中的技能冷却)
设定一个时间,连续触发，在设定时间内只执行一次

应用:
浏览器滚动加载事件
浏览器窗口缩放事件
`,
      },
      {
        question: "跨域",
        answer: `
同源策略限制了从同一个源加载的文档或脚本如何与另一个源的资源进行交互。这是浏览器的一个用于隔离潜在恶意文件的重要的安全机制。
同源指的是：协议、端口号、域名必须一致。

解决跨域
ajax 请求时浏览器要求当前网页和server必须是同源策略
ajax 核心API 1.xhr=new XMLHttpRequest() 2.xhr.open('GET','/api',true)第三个参数是异步请求false是同步请求
3.xhr.onreadystatechange=function(){
  if(xhr.readyState==4){状态(0:尚未调用open 1:open方法被调用 2:send方法被调用 3:下载中 responseText已有部分 4:done下载完成)
    if(xhr.status==200)
  }
}
4.xhr.send()将请求发送到服务器

CORS
对于简单请求
浏览器会直接发出CORS请求，它会在请求的头信息中增加一个Orign字段，该字段用来说明本次请求来自哪个源（协议+端口+域名），
服务器会根据这个值来决定是否同意这次请求。如果Orign指定的域名在许可范围之内，服务器返回的响应就会多出信息头：
Access-Control-Allow-Origin: http://api.bob.com  // 和Orign一直
Access-Control-Allow-Credentials: true   // 表示是否允许发送Cookie
Access-Control-Expose-Headers: FooBar   // 指定返回其他字段的值
Content-Type: text/html; charset=utf-8   // 表示文档类型

非简单请求过程
非简单请求是对服务器有特殊要求的请求，比如请求方法为DELETE或者PUT等。非简单请求的CORS请求会在正式通信之前进行一次HTTP查询请求，称为预检请求。
浏览器会询问服务器，当前所在的网页是否在服务器允许访问的范围内，以及可以使用哪些HTTP请求方式和头信息字段，只有得到肯定的回复，才会进行正式的HTTP请求，否则就会报错。
预检请求使用的请求方法是OPTIONS，表示这个请求是来询问的。他的头信息中的关键字段是Orign，表示请求来自哪个源。除此之外，头信息中还包括两个字段：
Access-Control-Request-Method：该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法。
Access-Control-Request-Headers： 该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段。
服务器在收到浏览器的预检请求之后，会根据头信息的三个字段来进行判断，如果返回的头信息在中有Access-Control-Allow-Origin这个字段就是允许跨域请求，
如果没有，就是不同意这个预检请求，就会报错。

JSONP
jsonp的原理就是利用<script>标签没有跨域限制，通过<script>标签src属性，发送带有callback参数的GET请求，服务端将接口返回数据拼凑到callback函数中，
返回给浏览器，浏览器解析执行，从而前端拿到callback函数返回的数据。

nginx反向代理接口跨域
跨域问题：同源策略仅是针对浏览器的安全策略。服务器端调用HTTP接口只是使用HTTP协议，不需要同源策略，也就不存在跨域问题。
实现思路：通过Nginx配置一个代理服务器域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，
方便当前域cookie写入，实现跨域访问。

nodejs 中间件代理跨域
node中间件实现跨域代理，原理大致与nginx相同，都是通过启一个代理服务器，实现数据的转发，也可以通过设置cookieDomainRewrite参数修改响应头中cookie中域名，
实现当前域的cookie写入，方便接口登录认证`,
      },
      {
        question: "垃圾回收",
        answer: `
垃圾回收的概念
垃圾回收：JS代码运行时，需要分配内存空间来储存变量和值。当变量不在参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收。

回收机制：
JS具有自动垃圾回收机制，会定期对那些不再使用的变量、对象所占用的内存进行释放，原理就是找到不再使用的变量，然后释放掉其占用的内存。

JS中存在两种变量：局部变量和全局变量。
全局变量的生命周期会持续要页面卸载；
而局部变量声明在函数中，它的生命周期从函数执行开始，直到函数执行结束，这些局部变量不再被使用，它们所占有的空间就会被释放。
但闭包情况，在函数执行结束后，函数外部的变量依然指向函数内部的局部变量，此时局部变量依然在被使用，所以不会回收。

垃圾回收的方式
浏览器通常使用的垃圾回收方法有两种：标记清除，引用计数。
1）标记清除
标记清除是浏览器常见的垃圾回收方式，当变量进入执行环境时，就标记这个变量“进入环境”，被标记为“进入环境”的变量是不能被回收的，因为他们正在被使用。
当变量离开环境时，就会被标记为“离开环境”，被标记为“离开环境”的变量会被内存释放。
垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，
原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。
2）引用计数
另外一种垃圾回收机制就是引用计数，这个用的相对较少。引用计数就是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是 1。
相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减 1。当这个引用次数变为 0 时，说明这个变量已经没有价值，因此，在在机回收期下次再运行时，
这个变量所占有的内存空间就会被释放出来。
这种方法会引起循环引用的问题：例如： obj1和obj2通过属性进行相互引用，两个对象的引用次数都是 2。当使用循环计数时，由于函数执行完后，两个对象都离开作用域，函数执行结束，
obj1和obj2还将会继续存在，因此它们的引用次数永远不会是 0，就会引起循环引用`,
      },
      {
        question: "内存泄露",
        answer: `
意外的全局变量： 由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。

被遗忘的计时器或回调函数： 设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。

脱离 DOM 的引用： 获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。

闭包： 不合理的使用闭包，从而导致某些变量一直被留在内存当中`,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "手写",
    content: [
      {
        question: "深浅拷贝",
        answer: `// 浅拷贝
Object.assagin [...] 
Array.prototyep.Slice 
Array.prototype.concat()

// 深拷贝
JSON.parse/JSON.stringify  
lodash.cloneDeep

// 手动递归实现 深拷贝
function isObject(obj) {
  return obj && typeof obj === "object";
}
function deepClone(obj, map = new WeakMap()) {
  if (!isObject(obj)) return obj;

  if (map.has(obj)) {
    return map.get(obj);
  }

  const target = Array.isArray(obj) ? [] : {};
  map.set(obj, target);

  Object.keys(obj).forEach((key) => {
    if (isObject(obj[key])) {
      target[key] = deepClone(obj[key]);
    } else {
      target[key] = obj[key];
    }
  });
  return target;
}
const obj1 = { age: 18, children: [1, 2, 3], fn: (a, b) => a + b, reg: null }
const obj2 = deepClone(obj1)
`,
      },
      {
        question: "柯里化",
        answer: `
function currying(fn, ...args) {
  const length = fn.length;
  let allArgs = [...args]

  const res = (...newArgs) => {
    allArgs = [...allArgs, ...newArgs];
    if (allArgs.length === length) {
      return fn(...allArgs);
    } else {
      return res;
    }
  }
  return res
}
// const add = (a,b,c)=>a + b + c
// const fn = currying(add)
// console.log(fn(1)(2,3));`,
      },
      {
        question: "数组扁平化",
        answer: `
function flatter(arr) {
  if (!arr.length) return;
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      return [...pre, ...flatter(cur)]
    } else {
      return [...pre, cur]
    }
  }, [])
}`,
      },
      {
        question: "JS类型判断",
        answer: `
function detailType(obj) {
  const typeList = ['Array', 'Date', 'RegExp', 'Object', 'Error']
  if (obj === null) return String(null);
  if (typeof obj === 'object') {
    for (let i = 0; i < typeList.length; i++) {
      const type = Object.prototype.toString.call(obj)
      if (type === '[object \${typeList[i]}]') {
        return typeList[i].toLowerCase()
      }
    }
  }
  return typeof obj
}`,
      },
      {
        question: "发布订阅",
        answer: `class EventEmitter {
  constructor() {
    this.events = {};
  }
  // 实现订阅
  on(type, callBack) {
    if (!this.events[type]) {
      this.events[type] = [callBack];
    } else {
      this.events[type].push(callBack);
    }
  }
  // 删除订阅
  off(type, callBack) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter((item) => {
      return item !== callBack;
    });
  }
  // 只执行一次订阅事件
  once(type, callBack) {
    function fn() {
      callBack();
      this.off(type, fn);
    }
    this.on(type, fn);
  }
  // 触发事件
  emit(type, ...rest) {
    this.events[type] &&
      this.events[type].forEach((fn) => fn.apply(this, rest));
  }
}`,
      },
      {
        question: "Promise并发",
        answer: `class Scheduler {
  constructor(limit) {
    this.queue = [];
    this.maxCount = limit;
    this.runCounts = 0;
  }
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, time);
      });
    };
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    this.queue
      .shift()()
      .then(() => {
        this.runCounts--;
        this.request();
      });
  }
}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
  scheduler.add(time, order);
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
scheduler.taskStart();`,
      },
      {
        question: "new",
        answer: `
function myNew(fn, ...args) {
  let obj = Object.create(fn.prototype);
  let res = fn.call(obj, ...args);
  if (res && (typeof res === "object" || typeof res === "function")) {
    return res;
  }
  return obj;
}`,
      },
      {
        question: " call /apply/bind",
        answer: `
Function.prototype.myCall = function (context, ...args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this; //this指向调用call的函数
  // 执行函数并返回结果 相当于把自身作为传入的context的方法进行调用了
  return context[fn](...args);
};

// apply原理一致  只是第二个参数是传入的数组
Function.prototype.myApply = function (context, args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this;
  // 执行函数并返回结果
  return context[fn](...args);
};

//bind实现要复杂一点  因为他考虑的情况比较多 还要涉及到参数合并(类似函数柯里化)

Function.prototype.myBind = function (context, ...args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this;
  let _this = this;
  //  bind情况要复杂一点
  const result = function (...innerArgs) {
    // 第一种情况 :若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，则不绑定传入的 this，而是将 this 指向实例化出来的对象
    // 此时由于new操作符作用  this指向result实例对象  而result又继承自传入的_this 根据原型链知识可得出以下结论
    // this.__proto__ === result.prototype   //this instanceof result =>true
    // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype; //this instanceof _this =>true
    if (this instanceof _this === true) {
      // 此时this指向指向result的实例  这时候不需要改变this指向
      this[fn] = _this;
      this[fn](...[...args, ...innerArgs]); //这里使用es6的方法让bind支持参数合并
    } else {
      // 如果只是作为普通函数调用  那就很简单了 直接改变this指向为传入的context
      context[fn](...[...args, ...innerArgs]);
    }
  };
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 实现继承的方式: 使用Object.create
  result.prototype = Object.create(this.prototype);
  return result;
};`,
      },
      {
        question: "instanceof",
        answer: `
function myInstanceof(left, right) {
while (true) {
  if (left === null) {
    return false;
  }
  if (left.__proto__ === right.prototype) {
    return true;
  }
  left = left.__proto__;
}
}`,
      },
      {
        question: "防抖节流",
        answer: `
// 防抖
function debounce(fn, delay = 300) {
  //默认300毫秒
  let timer;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args); // 改变this指向为调用debounce所指的对象
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  debounce(() => {
    console.log(111);
  }, 1000)
);

// 节流
// 设置一个标志
function throttle(fn, delay) {
  let flag = true;
  return () => {
    if (!flag) return;
    flag = false;
    timer = setTimeout(() => {
      fn();
      flag = true;
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  throttle(() => {
    console.log(111);
  }, 1000)
);`,
      },
      {
        question: "LRU",
        answer: `
//  一个Map对象在迭代时会根据对象中元素的插入顺序来进行
// 新添加的元素会被插入到map的末尾，整个栈倒序查看
class LRUCache {
  constructor(capacity) {
    this.secretKey = new Map();
    this.capacity = capacity;
  }
  get(key) {
    if (this.secretKey.has(key)) {
      let tempValue = this.secretKey.get(key);
      this.secretKey.delete(key);
      this.secretKey.set(key, tempValue);
      return tempValue;
    } else return -1;
  }
  put(key, value) {
    // key存在，仅修改值
    if (this.secretKey.has(key)) {
      this.secretKey.delete(key);
      this.secretKey.set(key, value);
    }
    // key不存在，cache未满
    else if (this.secretKey.size < this.capacity) {
      this.secretKey.set(key, value);
    }
    // 添加新key，删除旧key
    else {
      this.secretKey.set(key, value);
      // 删除map的第一个元素，即为最长未使用的
      this.secretKey.delete(this.secretKey.keys().next().value);
    }
  }
}`,
      },
      {
        question: "Promise相关",
        answer: `
class Mypromise {
  constructor(fn) {
    // 表示状态
    this.state = "pending";
    // 表示then注册的成功函数
    this.successFun = [];
    // 表示then注册的失败函数
    this.failFun = [];

    let resolve = (val) => {
      // 保持状态改变不可变（resolve和reject只准触发一种）
      if (this.state !== "pending") return;

      // 成功触发时机  改变状态 同时执行在then注册的回调事件
      this.state = "success";
      // 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里为模拟异步
      setTimeout(() => {
        // 执行当前事件里面所有的注册函数
        this.successFun.forEach((item) => item.call(this, val));
      });
    };

    let reject = (err) => {
      if (this.state !== "pending") return;
      // 失败触发时机  改变状态 同时执行在then注册的回调事件
      this.state = "fail";
      // 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里模拟异步
      setTimeout(() => {
        this.failFun.forEach((item) => item.call(this, err));
      });
    };
    // 调用函数
    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // 实例方法 then

  then(resolveCallback, rejectCallback) {
    // 判断回调是否是函数
    resolveCallback =
      typeof resolveCallback !== "function" ? (v) => v : resolveCallback;
    rejectCallback =
      typeof rejectCallback !== "function"
        ? (err) => {
            throw err;
          }
        : rejectCallback;
    // 为了保持链式调用  继续返回promise
    return new Mypromise((resolve, reject) => {
      // 将回调注册到successFun事件集合里面去
      this.successFun.push((val) => {
        try {
          // 执行回调函数
          let x = resolveCallback(val);
          //（最难的一点）
          // 如果回调函数结果是普通值 那么就resolve出去给下一个then链式调用  如果是一个promise对象（代表又是一个异步）
          // 那么调用x的then方法 将resolve和reject传进去 等到x内部的异步 执行完毕的时候（状态完成）就会自动执行传入的resolve 
          // 这样就控制了链式调用的顺序
          x instanceof Mypromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      });

      this.failFun.push((val) => {
        try {
          //    执行回调函数
          let x = rejectCallback(val);
          x instanceof Mypromise ? x.then(resolve, reject) : reject(x);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  //静态方法
  static all(promiseArr) {
    let result = [];
    //声明一个计数器 每一个promise返回就加一
    let count = 0;
    return new Mypromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        //这里用 Promise.resolve包装一下 防止不是Promise类型传进来
        Promise.resolve(promiseArr[i]).then(
          (res) => {
            //这里不能直接push数组  因为要控制顺序一一对应(感谢评论区指正)
            result[i] = res;
            count++;
            //只有全部的promise执行成功之后才resolve出去
            if (count === promiseArr.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
  //静态方法
  static race(promiseArr) {
    return new Mypromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        Promise.resolve(promiseArr[i]).then(
          (res) => {
            //promise数组只要有任何一个promise 状态变更  就可以返回
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
}`,
      },
      {
        question: "",
        answer: ``,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "算法",
    content: [
      {
        question: "快排",
        answer: `
var sortArray = function(nums) {

  main(0,nums.length-1)
  
  return nums
      function main(a,b){
          if(b-a+1 <2)return
          let i = a,j=b
          let base = nums[a]
  
          while(a<b){
              while(nums[b]>=base && a < b){
                  b--
              }
              nums[a]  = nums[b]
  
              while(nums[a]<=base && a < b){
                  a++
              }
              nums[b] = nums[a]
          }
          nums[a] = base
          main(i,a-1)
          main(a+1,j)
  
      }
  
  };`,
      },
      {
        question: "反转链表",
        answer: `
var reverseList = function(head) {
  if(!head)return null
  let pre = null,curr=head,next = head.next

  while(next){
      curr.next = pre
      
      pre = curr
      curr = next
      next = next.next
  }

  curr.next = pre

  return curr
};`,
      },
      {
        question: "合并链表",
        answer: `
var mergeTwoLists = function(list1, list2) {
  let curr = new ListNode(-1)
  let dumy = curr
  
  while(list1&&list2){
      if(list1.val > list2.val){
          curr.next = new ListNode(list2.val)
          list2 = list2.next
      }else{
          curr.next = new ListNode(list1.val)
          list1 = list1.next
      }
      curr = curr.next
  }

  if(list1){
      curr.next = list1
  }
  if(list2){
      curr.next = list2
  }

  return dumy.next
};`,
      },
      {
        question: "二分查找",
        answer: `
var search = function(nums, target) {
  let s =0 ,e=nums.length-1
  while(s<=e){
      c= Math.floor((s + e)/2)
      if(nums[c] > target){
          e = c-1
      }else if(nums[c]<target){
          s = c+1
      }else{
          return c
      }
  }
  return -1
};`,
      },
      {
        question: "岛屿面积",
        answer: `
var maxAreaOfIsland = function(grid) {
  let max =0,sum=0
  for(let i=0;i<grid.length;i++){
      for(let j=0;j<grid[0].length;j++){
          if(grid[i][j]===1){
              sum =0
              dfs(i,j)
              max = Math.max(sum,max)
          }
      }
  }

  return max
  function dfs(a,b){
      if(a<0 || a>=grid.length || b<0 || b>=grid[0].length || grid[a][b] ==0)return;
          sum++
          grid[a][b] = 0

            dfs(a-1,b)
            dfs(a+1,b)
            dfs(a,b-1)
            dfs(a,b+1)
  }
};`,
      },
      {
        question: "最长回文子串",
        answer: `
// 示例
// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。

var longestPalindrome = function (s) {
  let res = s[0], max = 0,temp=''
  for (let i = 0; i < s.length; i++) {
      main(i - 1, i + 1)
      main(i, i + 1)
  }
  return res
  function main(a, b) {
      if (a < 0 || b >= s.length) return
      if (s[a] === s[b]) {
          temp = s.slice(a, b + 1)
          if (max < temp.length) {
              res = temp
              max = temp.length
          }
        
          main(a - 1, b + 1)
      }
  }
};`,
      },
      {
        question: "最长递增子序列",
        answer: `
// 示例 1：
// 输入：nums = [10,9,2,5,3,7,101,18]
// 输出：4
// 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。

var lengthOfLIS = function(nums) {
  const dp  = Array(nums.length).fill(1)
  let max =1
  for(let i=1;i<nums.length;i++){
      let j = i-1

      while(j>-1){
          if(nums[j]<nums[i]){
              dp[i] = Math.max(dp[i],dp[j]+1)
              max = Math.max(dp[i],max)
          }
          j--
      }
  }

return max
};`,
      },
      {
        question: "",
        answer: ``,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "TS",
    content: [
      {
        question: "type/interface",
        answer: `
相同点：
1. 都可以描述 '对象' 或者 '函数' 
2. 都允许拓展(extends)

不同点：
type 可以声明 基本类型，联合类型，元组
type 使用 typeof 获取类型进行行赋值,interface不能
多个相同的 interface 声明可以进行自动合并,type不能合并
type 多用来描述‘类型关系’ ,interface 用来描述‘数据结构’`,
      },
      {
        question: "any/unknown",
        answer: `
any: 动态的变量类型（失去了类型检查的作用）。

never: 永不存在的值的类型。例如：never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。

unknown: 任何类型的值都可以赋给 unknown 类型，但是 unknown 类型的值只能赋给 unknown 本身和 any 类型。

null & undefined: 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和  undefined 赋值给 number 类型的变量。
当你指定了 --strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们自身。

void: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为void。`,
      },
      {
        question: "类型",
        answer: `
Typescript中的数据类型为：布尔值、数字、字符串、数组、元组、枚举、空值、任意值、类型断言。

null和undefined：默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给其他类型。

元组：一个已知元素数量和类型的数组，各元素的类型不必相同。

类型断言：手动指定一个值的类型，告诉编译器我知道自己在干嘛。注意不能直接从string指定为number，类型断言在原类型为any或unknown才能手动指定类型

内置：包括数字、字符串、布尔值、无效（void）、空值null和未定义undefined

用户定义：枚举、类、接口、数组、元组
`,
      },
      {
        question: "泛型",
        answer: `类型参数或者变量(函数参数类型不确定,想传入参数是什么类型，返回值就是什么类型)
// 函数
function id<T>(arg:T):T {
  return arg;
}

// 接口
interface Box<Type> {
  contents: Type;
}
let box:Box<string>;

// 类
class Pair<K, V> {
  key: K;
  value: V;
}`,
      },
      {
        question: "断言",
        answer: `
类型断言
编译器推断类型不准确, 不让编译器推断,直接给出类型
// 语法一：值 as 类型
value as Type

// 语法二：<类型>值
<Type>value


非空断言
那些可能为空的变量（即可能等于undefined或null），TypeScript 提供了非空断言，保证这些变量不会为空，写法是在变量名后面加上感叹号!

function f(x?:number|null) {
 x!.toFixed()
}

const root = document.getElementById('root')!;
`,
      },
      {
        question: "工具类型",
        answer: `
Exclude<T, U> 从 T 中排除出可分配给 U的元素。

Omit<T, K> 的作用是忽略T中的某些属性。

Merge<O1, O2> 是将两个对象的属性合并。

Compute<A & B> 是将交叉类型合并。

Intersection<T, U>的作用是取T的属性,此属性同样也存在与U。

Overwrite<T, U> 是用U的属性覆盖T的相同属性。`,
      },
      {
        question: "优点",
        answer: `
ts可以在写代码的时候给予很好的代码提示。

静态类型化是一种功能，可以在编码时检测错误，有了这项功能，就会允许开发人员编写更健壮的代码并对其进行维护，以便使得代码质量更好、更清晰。

ts引入了类中属性和方法的权限，可以实现对类的封装。

ts运行时，只能先编译成js，才能在浏览器或者node上运行。

ts不灵活。这一点也是他的优点吧。`,
      },
      {
        question: "装饰器",
        answer: `
装饰器（Decorator）是一种语法结构，用来在定义时修改类（class）的行为。
在语法上，装饰器有如下几个特征。

（1）第一个字符（或者说前缀）是@，后面是一个表达式。

（2）@后面的表达式，必须是一个函数（或者执行后可以得到一个函数）。

（3）这个函数接受所修饰对象的一些相关值作为参数。

（4）这个函数要么不返回值，要么返回一个新对象取代所修饰的目标对象。

function simpleDecorator() {
  console.log('hi');
}

@simpleDecorator
class A {} // "hi"
`,
      },
      {
        question: "命名空间与模块",
        answer: `
模块
TypeScript 与ECMAScript 2015 一样，任何包含顶级 import 或者 export 的文件都被当成一个模块
相反地，如果一个文件不带有顶级的import或者export声明，那么它的内容被视为全局可见的

命名空间
命名空间一个最明确的目的就是解决重名问题
命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的
这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其他名字空间中

namespace 是一种将相关代码组织在一起的方式，中文译为“命名空间”。
它出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。但是，自从有了 ES 模块，官方已经不推荐使用 namespace 了。
`,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "Node",
    content: [
      {
        question: "Node事件循环",
        answer: `
在 Node 当中，一段脚本总是自上而下执行，同步代码立即执行；
异步代码进入异步模块以非阻塞的方式执行，对应的异步回调函数会在异步代码执行完毕之后被派发到不同的任务队列当中。
同步代码执行完毕之后，会先执行 nextTick 队列 里的任务，再执行 微任务队列，然后进入 事件循环里的队列。事件循环里有3个队列，Timer队列，Poll队列，Check队列。

Timer 队列用于处理定时器的回调，如 setTimeOut，setInterval ；
Poll 队列用于处理 I/O 操作的回调，如文件读写，数据库操作，网络请求；
Check队列，用于处理 setImmediate 。

事件循环里的3个队列按照从上往下的顺序周而复始地执行，如果 Timer 和 Check 队列有任务，循环会一直进行，如果 Timer 和 Check 队列没有任务，
会在 Poll 队列处暂停，以等待 I/O 操作，因为默认情况下，最希望处理网络请求，尽快地给客户端响应。`,
      },
    ],
  },
  {
    type: "小程序",
    content: [
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "场景题",
    content: [
      {
        question: "弹窗组件",
        answer: `
完成页面结构和样式以及过渡动画
// 弹窗动画
.dialog-enter-active,
.dialog-leave-active {
    transition: opacity .5s;
}

定制弹窗标题、按钮和主题内容
按钮默认显示一个确认按钮，可以定制化确认按钮的文案，以及可以显示取消按钮，并且可定制化取消按钮的文案，以及它们的点击事件的处理。
主题内容建议使用slot插槽处理
.dialog-mark {
    position: absolute;
    top: 0;
    height: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
}

组件开关
开关由外部控制，但是没有直接使用show来直接控制。而是对show进行监听，赋值给组件内部变量showSelf。

z-index处理
首先我们要保证弹窗组件的层级z-inde足够高，其次要确保弹窗内容的层级比弹窗遮罩层的层级高。
后弹出的弹窗比早弹出的弹窗层级高

点击遮罩层关闭弹窗
监听点击事件,将组件开关设置为false

处理弹窗底部的页面内容不可滚动
组件挂载完成之后，通过给body设置overflow为hidden，来防止滑动弹窗时，弹窗下的页面滚动。
当点击遮罩层层时，我们在组件内部就可以将弹窗组件隐藏。v-if隐藏时也销毁组件

使用
在父组件中将弹窗组件引入
组件中components注册
在template中使用

挂载到全局(频繁使用)
// index.js
import Vue from "vue";
import login from "../components/LoginDialog/LoginDialog.vue"; // 引入弹窗组件

const LoginDialog = Vue.extend(login);

login.install = function(data) {
  let instance = new LoginDialog({
    data,
  }).$mount();

  document.body.appendChild(instance.$el);

  Vue.nextTick(() => {
    instance.open();
  });
};
export default login; // 导出

// main.js中
Vue.prototype.$login = login.install; // 全局可使用this.$login调用

通过 this.$toast 进行使用`,
      },
      {
        question: "",
        answer: ``,
      },
      {
        question: "",
        answer: ``,
      },
      {
        question: "",
        answer: ``,
      },
    ],
  },
  {
    type: "其它",
    content: [
      {
        question: "设计模式",
        answer: `
1.工厂
- 构造函数，更方便的去创建示例
vue中每个组件都会创建一个当前示例对象

2.单例模式
- 定义一个类，并生成一个实例，全局仅用这一个
例：(1).axios 封装-> class HttpRequest{}
(2).vuex的源码实现
(3).vue源码响应式Proxy实现中依赖收集，会创建公共的类 ReactiveEffect 来全局收集

3.策略模式
- 根据不同策略做不同事情，多个if 或者map来简化实现

4.适配器模式
- 将一种格式匹配成期望的格式

4.装饰器
- 动态给类或者对象添加扩展功能

5.代理模式
- 为对象提供一种代理访问，不直接访问元对象，例：vue中的响应式 proxy

6. 观察者
- 相当于2个对象 (目标对象: notify 观察者: update)
定义对象之间一对多关系，以便当一个对象状态发生改变其所有依赖对象都能得到通知，例：双向数据绑定，v-model

1. 发布订阅
- 3个对象,订阅者和发布者不互相依赖，中间有管理层（有统一的调度中心）

在发布订阅模式中，事件的发生者（发布者）不需要直接调用事件的处理者（订阅者），而是通过一个「发布-订阅中心」来管理事件的发生和处理。
具体来说，发布者将事件发布到「发布-订阅中心」中，订阅者可以向「发布-订阅中心」注册事件处理函数，
当事件发生时，「发布-订阅中心」会将事件通知给所有注册了该事件处理函数的订阅者，订阅者就可以处理该事件了。
例如：vue中的 eventBus 通过$emit 和 $on 实现发布订阅模式 $off取消监听

发布订阅模式的核心思想是解耦事件的发生和事件的处理，使得事件发生者和事件处理者之间不直接依赖，从而提高程序的灵活性和可维护性。
使用发布订阅模式可以将事件的发生和处理分开，使得不同的订阅者可以独立处理事件，同时也可以动态地添加或删除订阅者，满足不同的业务需求。`,
      },
    ],
  },
];

// const demo = {
//   question: "",
//   answer: ``,
// },
// {
//   question: "",
//   answer: ``,
// }

window.__exams = exams;
