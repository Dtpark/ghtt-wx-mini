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
      @click="getUserInfoClick"
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
    bindGetUserInfo(e) {
      let that = this;
      if (e.mp.detail.userInfo) {
        // 点击Button弹窗授权，如果授权了，执行login
        // 因为Login流程中有wx.getUserInfo，此时就可以获取到了
        that.$login
          .doLogin()
          .then(() => {
            // 登录成功后，将用户信息存至全局后返回
            let userInfoRes = JSON.parse(wx.getStorageSync("userInfoRes"));
            //app.globalData.userInfo = userInfoRes.userInfo;

            if (
              that.lastPage == "/pages/index/main" ||
              that.lastPage == "/pages/tools/list/main" ||
              that.lastPage == "/pages/setting/main"
            ) {
              // 如果lastPage是tabbar页面则用wx.switchTab(Object object)跳转
              wx.switchTab({
                url: that.lastPage
              });
            } else {
              // 否则用wx.redirectTo(Object object)跳转
              wx.redirectTo({
                url: that.lastPage
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // 用户点击拒绝，则弹窗提示
        wx.showModal({
          title: "提示", //提示的标题,
          content: "您在授权登录后才能使用小程序", //提示的内容,
          showCancel: false //是否显示取消按钮
        });
      }
    }
  },
  onLoad(options) {
    let that = this;
    console.log(options);
    if (options.url) {
      // console.log(that);
      // console.log(that.lastPage);
      if (options.url != "/pages/login/main") {
        that.lastPage = options.url;
      }
    }
  }
};
</script>

<style scoped>
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
