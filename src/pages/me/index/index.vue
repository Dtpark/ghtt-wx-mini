<template>
  <div class="page">
    <div class="UCenter-bg">
      <!-- <img :src="avatarUrl" class="cu-avatar round"> -->
      <open-data type="userAvatarUrl" class="cu-avatar round UCenter-bg-image"></open-data>
      <div class="margin-top-sm text-xl">
        <open-data type="userNickName"></open-data>
        <!-- <text class="text-df">v2.0</text> -->
      </div>
      <img src="https://image.weilanwl.com/gif/wave.gif" class="gif-wave" />
    </div>
    <div class="padding flex text-center text-grey bg-white shadow-warp"></div>

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
    </div>

    <div class="cu-list menu card-menu margin-top-x1 margin-bottom-xl shadow-lg radius">
      <div class="cu-item arrow">
        <navigator class="content" :url="settingUrl" hover-class="none">
          <text class="cuIcon-settingsfill text-black"></text>
          <text class="text-grey">设置</text>
        </navigator>
      </div>
    </div>

    <div class="cu-tabbar-height"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      eduSysUrl: "/pages/edusys/main", // 教务系统 绑定/解绑 页面地址
      campuscardSysUrl: "/pages/campuscardsys/main",
      settingUrl: "/pages/setting/main"
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // mounted() {
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>

<style lang="wxss">
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

.UCenter-bg-image {
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

.cu-avatar {
  align-items: unset;
  overflow: hidden;
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
</style>

