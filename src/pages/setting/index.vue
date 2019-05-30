<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-panel weui-panel_access">
        <div class="weui-panel__bd">
          <div class="me weui-media-box weui-media-box_appmsg">
            <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
              <img class="weui-media-box__thumb" :src="avatarUrl">
            </div>
            <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
              <div class="weui-media-box__title">{{ nickName }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="weui-cells__title">信息绑定</div>
      <div class="weui-cells weui-cells_after-title">
        <navigator :url="eduSysUrl" class="weui-cell weui-cell_access">
          <div class="weui-cell__bd">教务系统</div>
          <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator>
        <navigator :url="campuscardSysUrl" class="weui-cell weui-cell_access">
          <div class="weui-cell__bd">一卡通</div>
          <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator>
        <!-- <navigator url='' class='weui-cell weui-cell_access'>
          <div class="weui-cell__bd">图书馆</div>
           <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator>-->
      </div>
    </div>
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
      title: '加载中',
      mask: true
    });
    let that = this;
    // 判断是否登录
    that.$login.isLogin()
      .then(() => {
        // 已经登录
        let userInfoRes = JSON.parse(wx.getStorageSync('userInfoRes'));
         
        that.avatarUrl = userInfoRes.userInfo.avatarUrl;
        that.nickName = userInfoRes.userInfo.nickName;
      })
      .then(() => {
        wx.hideLoading();
      })
      .catch(e => {
        console.log(e);
      })


  }
};
</script>

<style scoped>
page{
    background: #eeeeee;
}
</style>

