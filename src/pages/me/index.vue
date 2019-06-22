<template>
  <div class="page">
    <div class="UCenter-bg">
      <img :src="avatarUrl" class="cu-avatar round">
      <div class="margin-top-sm text-xl">
        {{ nickName }}
        <!-- <text class="text-df">v2.0</text> -->
      </div>
      <!-- <div class="margin-top-sm">
        <p>{{ nickName }}</p>
      </div>-->
      <img src="https://image.weilanwl.com/gif/wave.gif" class="gif-wave">
    </div>
    <div class="padding flex text-center text-grey bg-white shadow-warp">
      <!-- <div class="flex flex-sub flex-direction solid-right">
      <div class="text-xxl text-orange">{{visitTotal}}</div>
      <div class="margin-top-sm">
        <text class="cuIcon-attentionfill"></text> div</div>
    </div>
    <div class="flex flex-sub flex-direction solid-right">
      <div class="text-xxl text-blue">{{starCount}}</div>
      <div class="margin-top-sm">
        <text class="cuIcon-favorfill"></text> Star</div>
    </div>
    <div class="flex flex-sub flex-direction">
      <div class="text-xxl text-green">{{forksCount}}</div>
      <div class="margin-top-sm">
        <text class="cuIcon-fork"></text> Fork</div>
      </div>-->
    </div>
    <div class="weui-cells__title">信息绑定</div>
    <div class="cu-list menu card-menu margin-bottom-xl shadow-lg radius">
      <div class="cu-item arrow">
        <navigator class="content" :url="eduSysUrl" hover-class="none">
          <text class="cuIcon-home text-cyan"></text>
          <text class="text-grey">教务系统</text>
        </navigator>
      </div>
      <div class="cu-item arrow">
        <navigator class="content" :url="campuscardSysUrl" hover-class="none">
          <text class="cuIcon-card text-green"></text>
          <text class="text-grey">一卡通</text>
        </navigator>
      </div>
      <!-- <div class="cu-item arrow">
        <navigator class="content" url="/pages/about/log/log" hover-class="none">
          <text class="cuIcon-formfill text-green"></text>
          <text class="text-grey">日志</text>
        </navigator>
      </div>
      <div class="cu-item arrow">
        <div class="content" bindtap="showQrcode">
          <text class="cuIcon-appreciatefill text-red"></text>
          <text class="text-grey">赞赏支持</text>
        </div>
      </div>
      <div class="cu-item arrow">
        <navigator class="content" url="/pages/about/test/list" hover-class="none">
          <text class="cuIcon-creativefill text-orange"></text>
          <text class="text-grey">Bug测试</text>
        </navigator>
      </div>-->
    </div>
    <div class="cu-list menu card-menu margin-top-x1 margin-bottom-xl shadow-lg radius">
      <div class="cu-item arrow">
        <button class="cu-btn content" open-type="feedback">
          <text class="cuIcon-writefill text-cyan"></text>
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
    <div class="cu-tabbar-height"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      avatarUrl: null, // 头像链接
      nickName: null, // 昵称
      eduSysUrl: "/pages/edusys/main", // 教务系统 绑定/解绑 页面地址
      campuscardSysUrl: "/pages/campuscardsys/main"
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    let that = this;
    // 判断是否登录
    that.$login
      .isLogin()
      .then(() => {
        // 已经登录
        let userInfoRes = JSON.parse(wx.getStorageSync("userInfoRes"));

        that.avatarUrl = userInfoRes.userInfo.avatarUrl;
        that.nickName = userInfoRes.userInfo.nickName;
      })
      .then(() => {
        wx.hideLoading();
      })
      .catch(e => {
        console.log(e);
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>

<style lang="wxss">
/* @import url('../../../static/style/main.css');
@import url('../../../static/style/icon.css'); */
page {
  background: #eeeeee;
}
.UCenter-bg {
  background-image: url(https://cdn.nlark.com/yuque/0/2019/jpeg/282518/1554615021701-assets/web-upload/e05df900-1201-4a8e-8069-91e950bc1fe7.jpeg);
  background-size: cover;
  height: 550rpx;
  display: flex;
  justify-content: center;
  padding-top: 40rpx;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-weight: 300;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.UCenter-bg text {
  opacity: 0.8;
}

.UCenter-bg image {
  width: 200rpx;
  height: 200rpx;
}

.UCenter-bg .gif-wave {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 99;
  mix-blend-mode: screen;
  height: 100rpx;
}

map,
.mapBox {
  left: 0;
  z-index: 99;
  mix-blend-mode: screen;
  height: 100rpx;
}

map,
.mapBox {
  width: 750rpx;
  height: 300rpx;
}
.cu-list.menu > .cu-item ._button.content {
  text-align: left;
}
</style>

