<script>
export default {
  created() {
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
    wx.setStorageSync("loadIndexMoudel", "true");
  },

  /**
   * 生命周期函数————监听小程序显示
   */
  async onShow() {
    let that = this;
    // 获取用户各个系统绑定状态
    let session3rd = wx.getStorageSync("session3rd");
    let old_edubind = wx.getStorageSync("edubind");
    let old_campuscardbind = wx.getStorageSync("campuscardbind");
    let success; // 向服务器请求绑定情况的返回结果
    let res; // 执行登录操作的返回结果
    if (session3rd) {
      let data = {
        session3rd: session3rd
      };
      success = await that.$wxAPI.request(
        that.$url.bindStatusUrl,
        data,
        "POST"
      );

      if (success.data.errcode == 0) {
        let edubind = success.data.eduSys;
        let campuscardbind = success.data.campus_card;

        if (old_edubind != edubind) {
          wx.setStorageSync("edubind", edubind);
          wx.setStorageSync("loadIndexMoudel", "true");
        }

        if (old_campuscardbind != campuscardbind) {
          wx.setStorageSync("campuscardbind", campuscardbind);
          wx.setStorageSync("loadIndexMoudel", "true");
        }
      } 
      else if (success.data.errcode == 10) {
        // 登录过期，重新登录刷新令牌
        // res = await that.$login.doLogin();        
      }
    }
  }
};
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
page {
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
