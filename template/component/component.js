Component({
  /**
   * 组件间代码共享
   */
  behaviors: [],

  /**
   * 自定义组件配置
   */
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {},

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    title: '组件模板',
  },

  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show() {},
    hide() {},
  },

  /**
   * 组件的的生命周期
   */
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },

  /**
   *  组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用
   */
  methods: {},
})
