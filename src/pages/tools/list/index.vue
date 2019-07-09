<template>
  <div class="page">
    <div class="page__bd">
      <!-- 爱学习生活开始 -->
      <div v-if="toolsList[0] != ''">
        <div class="cu-bar bg-white solid-bottom margin-top">
          <div class="action">
            <text class="cuIcon-title text-red"></text>爱生活
          </div>
        </div>
        <div class="weui-grids bg-white">
          <block v-for="(item, index) in toolsList[0]" :key="index">
            <navigator :url="item.url" class="weui-grid" hover-class="weui-grid_active">
              <img class="weui-grid__icon" :src="item.logo" />
              <div class="weui-grid__label">{{ item.title }}</div>
            </navigator>
          </block>
        </div>
      </div>
      <!-- 爱生活结束 -->

      <!-- 爱学习开始 -->
      <div v-if="toolsList[1] != ''">
        <div class="cu-bar bg-white solid-bottom margin-top">
          <div class="action">
            <text class="cuIcon-title text-orange"></text>爱学习
          </div>
        </div>
        <div class="weui-grids bg-white">
          <block v-for="(item, index) in toolsList[1]" :key="index">
            <navigator :url="item.url" class="weui-grid" hover-class="weui-grid_active">
              <img class="weui-grid__icon" :src="item.logo" />
              <div class="weui-grid__label">{{ item.title }}</div>
            </navigator>
          </block>
        </div>
      </div>
      <!-- 爱学习结束 -->

      <!-- 爱观海开始 -->
      <div v-if="toolsList[2] != ''">
        <div class="cu-bar bg-white solid-bottom margin-top">
          <div class="action">
            <text class="cuIcon-title text-blue"></text>爱观海
          </div>
        </div>
        <div class="weui-grids bg-white">
          <block v-for="(item, index) in toolsList[2]" :key="index">
            <navigator :url="item.url" class="weui-grid" hover-class="weui-grid_active">
              <img class="weui-grid__icon" :src="item.logo" />
              <div class="weui-grid__label">{{ item.title }}</div>
            </navigator>
          </block>
        </div>
      </div>
      <!-- 爱观海结束 -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      toolsList: []
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  mounted() {
    let that = this;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    that.$wxAPI
      .request(that.$url.toolsListUrl)
      .then(success => {
        //   that.setData({
        //     'toolsList': success.data
        //   });
        that.toolsList = success.data;
        wx.hideLoading();
      })
      .catch(e => {
        console.log(e);
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    let that = this;
    that.$wxAPI
      .request(that.$url.toolsListUrl)
      .then(success => {
        that.toolsList = success.data;
      })
      .catch(e => {
        console.log(e);
      });
    wx.stopPullDownRefresh();
  }
};
</script>
<style lang='wxss'>
.weui-grids {
  border-top: 1rpx solid #d9d9d9;
  border-left: 1rpx solid #d9d9d9;
  overflow: hidden;
}
.weui-grid {
  position: relative;
  float: left;
  padding: 20px 10px;
  width: 33.33333333%;
  box-sizing: border-box;
  border-right: 1rpx solid #d9d9d9;
  border-bottom: 1rpx solid #d9d9d9;
}
.weui-grid_active {
  background-color: #ececec;
}
.weui-grid__icon {
  display: block;
  width: 28px;
  height: 28px;
  margin: 0 auto;
}
.weui-grid__label {
  margin-top: 5px;
  display: block;
  text-align: center;
  color: #000;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.weui-grid {
  padding: 20px 10px;
  width: 25%;
  border-right: 0rpx solid #d9d9d9;
  border-bottom: 0rpx solid #d9d9d9;
}
</style>


