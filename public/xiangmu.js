const exams = [
  {
    type: "项目",
    content: [
      {
        question: "项目难点",
        answer: `因为项目是angularJS项目前后台没分离的老项目，加上客户经常反馈页面操作不流畅的问题，代码维护也不方便，所以需要对项目进行重构。经过一系列考量之后，我们决定使用vue3来实现前端页面。计划一年时间完成项目迁移，我就开始自学vue3框架，快速搭建好项目脚手架。
        由于刚开始组内成员vue3不是很熟悉，我会组织培训学习，培训一些常用api可以让大家快速上手，然后开始写页面，每次写不同的查询搜索和表格，比如查询搜索条件只有五个的情况下再加上table以及分页，一整套代码下来会占到250行左右，每个Column都要写一遍。
        需要封装组件库，封装组件库的目的是为了提高开发效率，减少重复造轮子，封装组件库的方案是使用vue3的composition api，通过封装组件库，可以减少template代码量，提高开发效率。
        
        问题：但是开发效率上还是不太乐观，分析重复造轮子的地方过多，比如查询搜索条件只有五个的情况下再加上table以及分页 template的代码量达到250，也就是我一进页面就有250行HTML内容，想要看逻辑或者排查问题相对的也不直观
        目标：接下来目标提高开发效率
        方案：封装组件库，减少重复造轮子
        执行：封装select组件和table组件库以及组件库文档，template代码量缩减到30行。
        效率得到了很大的提升。
        我觉得还能再提升，页面结构相似的，可以做成模板，于是开始研究VScode插件，想让插件根据yaml生成我们需要的vue代码,我们接口文档都是yaml 格式，有URL，入参和出参。通过ast解析yaml然后生成vue代码。在家捣鼓之后，想在公司试验，发现公司不支持使用插件，因安全性问题被屏蔽了。就放弃了这个方案，改用了本地代码片段，来快速生成代码。`,
      },
    ],
  },
];
