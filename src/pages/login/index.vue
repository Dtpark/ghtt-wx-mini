<template>
  <div>
    <div class="header">
      <img src="/static/images/logo.png">
    </div>

    <div class="content">
      <div>申请获取以下权限</div>
      <p>获得你的公开信息(昵称，头像等)</p>
    </div>

    <button
      class="bottom"
      type="primary"
      open-type="getUserInfo"
      lang="zh_CN"
      @getuserinfo="bindGetUserInfo"
      @click="login"
    >授权登录</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastPage: "/pages/index/main"
    };
  },
  methods: {
    async bindGetUserInfo(e) {
      let that = this;
      let res;
      if (e.mp.detail.userInfo) {
        // 点击Button弹窗授权，如果授权了，执行login
        res = await that.$login.doLogin();
        if(res.errcode == 0){
          // 登录成功
          wx.setStorageSync('loadIndexMoudel','true');
          wx.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }else{
          // 登录失败，请重试
          wx.showToast({
            title: res.errmsg+'请重试', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
        }
      } else {
        // 用户点击拒绝，则弹窗提示
        // wx.showModal({
        //   title: "提示", //提示的标题,
        //   content: "您在授权登录后才能使用小程序", //提示的内容,
        //   showCancel: false //是否显示取消按钮
        // });
        wx.navigateBack({
          delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
        });
      }
    },
    /**
     * 点击授权登录按钮
     */
    login(){
      let that = this;
      // that.$login.doLogin();
    }
  },
  onLoad(options) {
    let that = this;
    // console.log(options);
    if (options.url) {
      // console.log(that);
      // console.log(that.lastPage);
      if (options.url != "/pages/login/main") {
        that.lastPage = options.url;
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
};
</script>

<style lang='wxss'>
page{
  background: white;
}
.header {
  margin: 90rpx 0 90rpx 50rpx;
  border-bottom: 1px solid #ccc;
  text-align: center;
  width: 650rpx;
  height: 300rpx;
  line-height: 450rpx;
}

.header img {
  width: 200rpx;
  height: 200rpx;
}

.content {
  margin-left: 50rpx;
  margin-bottom: 90rpx;
}

.content p {
  display: block;
  color: #9d9d9d;
  margin-top: 40rpx;
}

.bottom {
  border-radius: 80rpx;
  margin: 70rpx 50rpx;
  font-size: 35rpx;
}
</style>
