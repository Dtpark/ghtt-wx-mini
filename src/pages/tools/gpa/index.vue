<template>
  <div>
    <web-view :src="url" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 网站链接
      url: "",
      stuid: 0,
      pwd: ""
    };
  },
  methods: {
    /**
     * 是否绑定教务系统
     */
    isBind() {
      let that = this;
      let status;
      status = wx.getStorageSync("edubind");
      return status;
    },
    /**
     * 获取学号密码，拼接链接
     */
    getEduSysInfo() {
      let that = this;
      let data = {
        session3rd: wx.getStorageSync("session3rd")
      };
      if (that.stuid == 0 || that.pwd == "") {
        // 没有缓存的学号和密码
        that.$wxAPI
          .request(that.$url.showInfoUrl, data, "POST")
          .then(successRes => {
            // 接口调用成功
            if (successRes.data.errcode == 0) {
              let stuid = successRes.data.stuid;
              let pwd = successRes.data.pwd_encode;
              that.url =
                that.$url.gpaUrl + "?stuid=" + stuid + "&passwd=" + pwd;
            } else if (successRes.data.errcode == 10) {
              // 登录态过期,重新登录
              that.$wxAPI.isLoginModal();
            }
          });
      }
    }
  },
  /**
   * 生命周期函数
   */
  async onShow() {
    let that = this;
    let bind;
    let params = {};
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    bind = that.isBind();
    if (bind == "bind") {
      // 已经绑定了教务系统
      // 获取学号密码，访问网页
      that.getEduSysInfo();
    } else if (bind == "unbind") {
      // 尚未绑定教务系统
      params = {
        content: "您尚未绑定教务系统，是否进行绑定？"
      };
      that.$wxAPI.showModal(params).then(success => {
        if (success.confirm) {
          // 用户点击确定
          wx.navigateTo({ url: "/pages/edusys/main" });
        } else if (success.cancel) {
          // 用户点击取消
          wx.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }
      });
    } else {
      // 没有登录
      that.$wxAPI.isLoginModal("尚未登录");
    }
    wx.hideLoading();
  }
};
</script>
<style>
</style>


