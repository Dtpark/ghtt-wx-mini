<template>
  <div class="page">
    <!-- 公告标题开始 -->
    <div class="applet_notice_detail_hd">
      <div class="applet_notice_title">{{ title }}</div>
      <div class="applet_notice_info">浏览量：{{ pv }} 发布时间：{{ publish_time }}</div>
    </div>
    <!-- 公告标题结束 -->

    <!-- 分割线开始 -->
    <div class="applet_br"></div>
    <!-- 分割线结束 -->

    <!-- 公告内容开始 -->
    <div class="applet_notice_bd">
      <wxParse :content="content"/>
      <!-- <template is="wxParse" data="{{wxParseData:content.nodes}}" /> -->
    </div>
    <!-- 公告内容结束 -->

    <!-- 返回首页开始 -->
    <div class="goHome" @click="$index.goHome">
      <img src="/static/images/home.png">
    </div>
    <!-- 返回首页结束 -->
  </div>
</template>

<script>
import wxParse from "mpvue-wxparse";

export default {
  components: {
    wxParse
  },
  data() {
    return {
      // 公告标题
      title: null,
      // 发布人
      author: null,
      // 浏览量
      pv: null,
      // 发布时间
      publish_time: null,
      // 内容
      content: null
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    // console.log(options);
    if (options.id) {
      // 有id传递过来
      // 获取公告详情
      that.$wxAPI
        .request(that.$url.getNoticeDetailUrl, { id: options.id }, "POST")
        .then(res => {
          switch (res.data.errcode) {
            case 0:
              // 获取成功
                that.title = res.data.data.n_title;
                that.pv = res.data.data.pv;
                that.publish_time = res.data.data.create_time;
                that.content = res.data.data.n_content;
              break;
            default:
              wx.showModal({
                title: "提示", //提示的标题,
                content: res.data.errmsg, //提示的内容,
                showCancel: false, //是否显示取消按钮,
                confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
                success: res => {
                  if (res.confirm) {
                    // console.log('用户点击确定')
                    wx.switchTab({ url: "/pages/index/main" });
                  }
                }
              });
          }
        });
    }
  }
};
</script>
<style>
/* @import url("~mpvue-wxparse/src/wxParse.css"); */
page{
    background: white;
}
.page{
    margin: 0 30rpx;
    width: 690rpx;
}
/* 公告标题部分样式开始 */
.applet_notice_detail_hd{
    width: 100%;
    padding: 10rpx auto;
    text-align: center;
}
.applet_notice_title{
    font-size: 40rpx;
    font-weight: 600;
    margin: 20rpx auto;
}
.applet_notice_info{
    font-size: 24rpx;
    color: darkgray;
}
/* 公告标题部分样式结束 */

/* 分割线样式开始 */
.applet_br{
    width: 690rpx;
    margin-left: 0rpx;
    height: 8rpx;
    background: rgba(255, 255, 255, 1);
    border-bottom: #eeeeee solid 1px;
  }
  /* 分割线样式结束 */

/* 公告内容部分样式开始 */
.applet_notice_bd{
    margin: 10rpx auto;
    padding: 10rpx 30rpx;
    font-size: 28rpx;
    color: #535353;
}
/* 公告内容部分样式结束 */
</style>


