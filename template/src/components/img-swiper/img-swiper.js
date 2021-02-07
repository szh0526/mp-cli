Component({
  behaviors: [],

  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },

  /**
   * 组件的属性列表
   */
  properties: {
    imgList: {
      type: Array,
      observer: 'initImgPostion',
    },
    imgIndex: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,
    imgPostion: '',
    imgLength: 0,
  },

  pageLifetimes: {
    show() {
      // const { imgIndex } = this.data
      // this.setData({
      //   current: imgIndex,
      // })
      // this.setImgPostion(imgIndex)
    },
    hide() {
      // 页面被隐藏
    },
  },

  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initImgPostion(newValue) {
      if (newValue && newValue.length > 0) {
        this.data.imgLength = newValue.length
        this.setImgPostion(0)
      } else {
        this.data.imgLength = 0
      }
    },
    changCurrent(e) {
      const { current } = e.detail
      this.setImgPostion(current)
    },
    setImgPostion(index) {
      const current = index + 1
      this.setData({
        imgPostion: `${current}/${this.data.imgLength}`,
      })
    },
    // 商品详情轮播图预览
    previewHandle(event) {
      wx.previewImage({
        current: event.target.dataset.src,
        urls: this.properties.imgList,
      })
    },
  },
})
