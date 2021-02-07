/*
 * 小程序公共分页器
 * 用于实现组件内的统一分页
 *
 * @Author: weixing13
 * @Date: 2019-12-05 18:25:10
 * @Last Modified by: weixing13
 * @Last Modified time: 2019-12-13 00:13:54
 */

const paginationBev = Behavior({
  data: {
    dataArray: [],
    currentPage: 1,
    pageSize: 10,
    total: null,
    totalPage: null,
    noneResult: false,
    loading: false,
    noMore: false,
  },
  methods: {
    setMoreData(dataArray) {
      const tempArray = [...this.data.dataArray, ...dataArray]
      this.setData({
        dataArray: tempArray,
      })
      // wx.nextTick(() => {
      //   this.setData({
      //     noMore: this.data.dataArray.length + 1 >= this.data.total,
      //   })
      // })
    },
    getCurrentStart() {
      return this.data.dataArray.length
    },
    getCurrentPage() {
      console.log(this.hasMore(), 'getCurrentPage')
      if (this.hasMore()) {
        return (this.data.currentPage + 1)
      }
      return (this.data.currentPage + 1)
    },
    getPageSize() {
      return this.data.pageSize
    },
    setTotal(total) {
      this.setData({
        total,
        noneResult: total === 0,
      })
    },
    setTotalPage(totalPage) {
      this.setData({
        totalPage,
      }, () => {
        this.setData({
          noMore: this.data.currentPage >= this.data.totalPage,
        })
      })
    },
    setCurrentPage(currentPage) {
      this.setData({
        currentPage,
      })
    },
    setPageSize(pageSize) {
      this.setData({
        pageSize,
      })
    },
    hasMore() {
      if (this.data.currentPage >= this.data.totalPage) {
        return false
      }
      return true
    },
    hasMoreBySize(requestPageSzie) {
      if (this.data.pageSize >= requestPageSzie) {
        return true
      }
      return false
    },
    initialize() {
      this.setData({
        dataArray: [],
        total: null,
        noneResult: false,
        loading: false,
      })
    },
    isLocked() {
      return this.data.loading === true
    },
    lock() {
      this.setData({
        loading: true,
      })
    },
    unlock() {
      this.setData({
        loading: false,
      })
    },
  },
})
export default paginationBev
