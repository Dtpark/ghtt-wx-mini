<template>
  <div class="page">
    <div class="cu-list menu margin-top">
      <div class="cu-item">
        <div class="content padding-tb-sm">
          <div>
            <p class="cuIcon-calendar text-blue margin-right-xs"></p>今日课表
          </div>
        </div>
        <div class="action">
          <switch class="switch sm" :checked="showTimeTable" @change="switchTimeTable"></switch>
        </div>
      </div>
      <div class="cu-item">
        <div class="content padding-tb-sm">
          <div>
            <p class="cuIcon-card text-blue margin-right-xs"></p>一卡通
          </div>
        </div>
        <div class="action">
          <switch class="switch sm" :checked="showCampusCard" @change="switchCampusCard"></switch>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 今日课表是否开启
      showTimeTable: true,
      // 一卡通是否开启
      showCampusCard: true
    };
  },
  methods: {
    /**
     * 改变今日课表状态
     */
    switchTimeTable(e) {
      let that = this;
      let status = e.mp.detail.value;
      if (status == true && that.showTimeTable == false) {
        // 显示今日课表
        that.showTimeTable = true;
        wx.removeStorageSync("showTimeTable");
      } else if (status == false && that.showTimeTable == true) {
        // 关闭今日课表
        that.showTimeTable = false;
        wx.setStorageSync("showTimeTable", "false");
      }
      // 刷新首页模块
      wx.setStorageSync("loadIndexMoudel", "true");
    },
    /**
     * 改变一卡通显示状态
     */
    switchCampusCard(e) {
      let that = this;
      let status = e.mp.detail.value;
      if (status == true && that.showCampusCard == false) {
        // 显示一卡通模块
        that.showCampusCard = true;
        wx.removeStorageSync("showCampusCard");
      } else if (status == false && that.showCampusCard == true) {
        // 关闭一卡通模块
        that.showCampusCard = false;
        wx.setStorageSync("showCampusCard", "false");
      }
      // 刷新首页模块
      wx.setStorageSync("loadIndexMoudel", "true");
    }
  },
  /**
   * 生命周期函数——监听加载
   */
  onShow() {
    let that = this;
    // 获取今日课表模块显示状态
    let showTimeTable = wx.getStorageSync("showTimeTable");
    switch (showTimeTable) {
      case "true":
        that.showTimeTable = true;
        break;
      case "false":
        that.showTimeTable = false;
        break;
      default:
        // 状态不存在
        that.showTimeTable = true;
    }

    // 获取一卡通模块显示状态
    let showCampusCard = wx.getStorageSync("showCampusCard");
    switch (showCampusCard) {
      case "true":
        that.showCampusCard = true;
        break;
      case "false":
        that.showCampusCard = false;
        break;
      default:
        // 状态不存在
        that.showCampusCard = true;
    }
  }
};
</script>
<style>
</style>


