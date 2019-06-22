<template functional>
    <div class="goHome">
        <!-- <text class="cuIcon-homefill text-blue" @click="goHome"></text> -->
        <img src="/static/images/home.png" @click="goHome">
    </div>
</template>
<script>
export default {
    methods:{
        goHome() {
            wx.switchTab({ url: '/pages/index/main' });
        }
    }
}
</script>
<style>
/* 返回首页按钮样式开始 */
.goHome{
  /* display: none; */
  width: 80rpx;
  overflow: hidden;
  position: fixed;
  bottom: 80rpx;
  right: 40rpx;
}
.goHome img{
  width: 80rpx;
  height: 80rpx;
  opacity: 0.6;
}
</style>


