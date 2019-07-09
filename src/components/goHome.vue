<template functional>
  <div class="goHome">
    <div @click="goHome" class="goHome-cell">
      <img class="goHome-cell-img" src="/static/images/home.png">
    </div>
    <div @click="scrollToTop" class="scroll-to-top" v-if="scroll_show">
      <img class="scroll-to-top-img" src="/static/images/top.png">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scroll_show: false
    };
  },
  methods: {
    goHome() {
      wx.switchTab({ url: "/pages/index/main" });
    },
    /**
     * 返回顶部
     */
    scrollToTop() {
      let that = this;
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 600
        });
      } else {
        wx.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
      that.scroll_show = false;
    }
  },
  /**
   * 监听页面滚动--显示返回顶部按钮
   */
  onPageScroll(e) {
    let that = this;
    if (e.scrollTop >= 600) {
      that.scroll_show = true;
    } else {
      that.scroll_show = false;
    }
  }
};
</script>
<style>
/* 返回首页按钮样式开始 */
/* .goHome{
  width: 80rpx;
  overflow: hidden;
  position: fixed;
  bottom: 80rpx;
  right: 40rpx;
}
.goHome img{
  width: 80rpx;
  height: 80rpx;
  opacity: 0.6;
} */
.goHome-cell {
  z-index: 100;
  position: fixed;
  right: 50rpx;
  bottom: 170rpx;
  width: 88rpx;
  height: 88rpx;
}

.goHome-cell-img {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  opacity: 0.8;
}

.scroll-to-top {
  z-index: 100;
  position: fixed;
  right: 50rpx;
  bottom: 50rpx;
  width: 90rpx;
  height: 90rpx;
}

.scroll-to-top-img {
  background-color: #1296db;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  opacity: 0.9;
}
</style>


