<template>
  <div class="page">
    <div class="cu-list menu margin-top-xl margin-bottom-xl shadow-lg radius">
      <div class="cu-item arrow">
        <navigator class="content" :url="indexMoudelUrl" hover-class="none">
          <text class="cuIcon-apps text-cyan"></text>
          <text class="text-grey">首页模块</text>
        </navigator>
      </div>
    </div>

    <div class="cu-list menu margin-top-x1 margin-bottom-xl shadow-lg radius">
      <div class="cu-item arrow">
        <button class="cu-btn content" open-type="feedback">
          <text class="cuIcon-writefill text-orange"></text>
          <text class="text-grey">意见反馈</text>
        </button>
      </div>
      <div class="cu-item arrow">
        <button class="content" open-type="contact" hover-class="none">
          <text class="cuIcon-message text-grey"></text>
          <text class="text-grey">联系客服</text>
        </button>
      </div>
    </div>
    <goHome></goHome>
  </div>
</template>
<script>
import goHome from "@/components/goHome";
export default {
  components: {
    goHome
  },
  data() {
    return {
      indexMoudelUrl: "/pages/me/indexMoudel/main"
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>

<style scoped>
.cu-list.menu > .cu-item ._button.content {
  text-align: left;
}
</style>

