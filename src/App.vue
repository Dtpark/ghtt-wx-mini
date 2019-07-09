<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

  //   let logs
  //   if (mpvuePlatform === 'my') {
  //     logs = mpvue.getStorageSync({key: 'logs'}).data || []
  //     logs.unshift(Date.now())
  //     mpvue.setStorageSync({
  //       key: 'logs',
  //       data: logs
  //     })
  //   } else {
  //     logs = mpvue.getStorageSync('logs') || []
  //     logs.unshift(Date.now())
  //     mpvue.setStorageSync('logs', logs)
  //   }
  // },
  // log () {
  //   console.log(`log at:${Date.now()}`)
  // wx.showShareMenu();
  },
  onLaunch() {
    wx.showShareMenu({ withShareTicket: true });
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
page{
  background: #efefef;
}
.weui-cells__title {
  margin-top: 0.77em;
  margin-bottom: 0.3em;
  padding-left: 15px;
  padding-right: 15px;
  color: #999;
  font-size: 14px;
}

.tips {
  margin: 20rpx 30rpx;
  width: 690rpx;
  height: auto;
  padding: 10px 15px;
  border-radius: 10px;
  background: rgba(217, 237, 247, 1);
  color: rgb(49, 131, 185);
  font-size: 12px;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
