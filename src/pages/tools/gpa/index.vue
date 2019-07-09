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
              wx.showToast({
                title: "请下拉刷新", //提示的内容,
                icon: "none", //图标,
                duration: 2000, //延迟时间,
                mask: true //显示透明蒙层，防止触摸穿透
              });
              that.$login.doLogin();
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
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    // 判断是否登录
    user_status = await that.$login.isLogin();
    if (user_status == 0) {
      // 登录成功

      // 判断是否绑定教务系统
      let edubind = wx.getStorageSync("edubind");
      switch (edubind) {
        case "bind":
          // 已经绑定
          // 获取学号和密码
          that.getEduSysInfo();
          wx.hideLoading();
          break;
        case "unbind":
          wx.hideLoading();
          wx.showModal({
            title: "提示", //提示的标题,
            content: "您尚未绑定教务系统，是否绑定？", //提示的内容,
            showCancel: true, //是否显示取消按钮,
            cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
            cancelColor: "#000000", //取消按钮的文字颜色,
            confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: "#3CC51F", //确定按钮的文字颜色,
            success: res => {
              if (res.confirm) {
                //   console.log('用户点击确定')
                wx.navigateTo({ url: "/pages/edusys/main" });
              } else if (res.cancel) {
                //   console.log('用户点击取消')
                wx.navigateBack({
                  delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                });
              }
            }
          });
          break;
      }
    }
  }
};
</script>
<style>
</style>


