<template>
  <div class="page">
    <div class="margin-xl bg-white padding-xl radius shadow-lg">
      <!-- 标题开始 -->
      <div class="text-center margin-bottom-sm text-lg text-grey">{{ title }}</div>
      <div class="applet_notice_info margin-bottom-sm">浏览量：{{ views }} 作者：{{ author }} 时间：{{ date }}</div>
      <!-- 标题结束 -->

      <!-- 分割线开始 -->
      <div class="applet_br margin-bottom"></div>
      <!-- 分割线结束 -->

      <!-- 正文开始 -->
      <div class="text-content margin-tb">
        <wxparser :rich-text="content" />
      </div>
      <!-- 正文结束 -->
      <!-- 返回首页开始 -->
      <goHome></goHome>
      <!-- 返回首页结束 -->
    </div>
  </div>
</template>
<script>
import goHome from "@/components/goHome";
let plugin = requirePlugin("wxparserPlugin");
export default {
  components: {
    goHome
  },
  data() {
    return {
      // 文章id
      id: 0,
      // 发布日期
      date: "",
      // 所属分类
      column: 0,
      // 文章标题
      title: "",
      // 文章内容
      content: "",
      // 发布员
      publisher: "",
      // 作者
      author: "未知",
      // 浏览量
      views: 0
    };
  },
  /**
   * 生命周期函数
   */
  mounted() {
    let that = this;
    let options = that.$root.$mp.query;
    if (options) {
      wx.showLoading({
        title: "加载中", //提示的内容,
        mask: true //显示透明蒙层，防止触摸穿透
      });
      let id = options.id;
      let date = options.date;
      let column = options.column;
      let data = {
        id: id,
        date: date,
        column: column
      };
      that.$wxAPI
        .request(that.$url.hitwhNewsDetailUrl, data, "POST")
        .then(success => {
          //   console.log(success.data);
          switch (success.data.errcode) {
            case 0:
              that.publisher = success.data.data.publisher;
              if (success.data.data.author != "") {
                that.author = success.data.data.author;
              }
              that.date = success.data.data.date;
              that.title = success.data.data.title;
              that.content = success.data.data.content;
              that.views = success.data.data.view;
              wx.hideLoading();
              break;
            default:
              wx.hideLoading();
              wx.showModal({
                title: "提示", //提示的标题,
                content: success.data.errmsg,
                showCancel: false, //是否显示取消按钮,
                confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: "#3CC51F", //确定按钮的文字颜色,
                success: res => {
                  if (res.confirm) {
                    //   console.log('用户点击确定')
                    wx.navigateBack({
                      delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    });
                  } else if (res.cancel) {
                    console.log("用户点击取消");
                  }
                }
              });
              break;
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      wx.showModal({
        title: "提示", //提示的标题,
        content: "当前文章不存在", //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            //   console.log('用户点击确定')
            wx.navigateBack({
              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>
<style>
.applet_notice_info {
  text-align: center;
  font-size: 20rpx;
  color: darkgray;
}
/* 分割线样式开始 */
.applet_br {
  /* width: 630rpx; */
  margin-left: 0rpx;
  border-bottom: #d8d8d8 solid 1rpx;
}
/* 分割线样式结束 */

.wxparser--wxParser-p {
  overflow: hidden;
  max-width: 100%;
  white-space:pre-line;
}

.wxparser--wxParser-inline {
  word-wrap: break-word;
  word-break: break-all;
  white-space: inherit;
}
.wxparser--wxParser-inline > text {
  word-wrap: break-word;
  word-break: break-all;
  white-space: inherit;
}
</style>


