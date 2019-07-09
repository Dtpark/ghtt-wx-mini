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
      let bind;
      let status;
      status = wx.getStorageSync("edubind");
      switch (status) {
        case "bind":
          bind = true;
          break;
        case "unbind":
          bind = false;
          break;
        default:
          bind = false;
      }
      return bind;
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
    let user_status;
    let bind;
    let params = {};
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    // 判断是否登录
    user_status = await that.$login.isLogin();
    bind = that.isBind();
    if (user_status == 0 && bind) {
      // 已经登录 且 绑定了教务系统
      // 获取学号密码，访问网页
      that.getEduSysInfo();
    } else if (user_status == 10) {
      // 没有登录
      params = {
        content: "您尚未登录，是否登录?"
      };
      that.$wxAPI.showModal(params).then(success => {
        if (success.confirm) {
          // 用户点击确定
          that.$wxAPI.toLoginPage();
        } else if (success.cancel) {
          // 用户点击取消
          wx.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }
      });
    } else if (bind == false) {
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
    }
    wx.hideLoading();
  }
};
</script>
<style>
</style>


