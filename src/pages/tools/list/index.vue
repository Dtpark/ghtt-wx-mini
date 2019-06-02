<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-grids">
        <block v-for="(item, index) in toolsList" :key="index">
          <navigator :url="item.url" class="weui-grid" hover-class="weui-grid_active">
            <img class="weui-grid__icon" :src="item.logo" />
            <div class="weui-grid__label">{{ item.title }}</div>
          </navigator>
        </block>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      toolsList: null
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    wx.showLoading({
      title: '加载中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透
    });
    that.$wxAPI.request(that.$url.toolsListUrl)
    .then(success => {
      //   that.setData({
      //     'toolsList': success.data
      //   });
      that.toolsList = success.data;
      wx.hideLoading();
    })
    .catch(e => {
        console.log(e)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
//   onPullDownRefresh: function () {
//     let that = this;
//     that.onShow();    
//     wx.stopPullDownRefresh();
//   }
};
</script>
<style scoped>
.weui-grid {
  padding: 20px 10px;
  width: 25%;
}
</style>


