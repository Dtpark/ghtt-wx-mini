<template>
  <div class="page">
    <!-- 解绑信息页面开始 -->
    <form class="page__bd page__bd_spacing" v-if="isBind" @submit="unbindEduSys">
      <div class="weui-cells__title">解绑教务系统</div>
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">学号</div>
          </div>
          <div class="weui-cell__bd">
            <input name="stuid" class="weui-input" disabled="true" :value="stuid" placeholder="学号">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">密码</div>
          </div>
          <div class="weui-cell__bd">
            <input
              name="pwd"
              class="weui-input"
              :password="isPassword"
              :value="pwd"
              disabled="true"
              placeholder="密码"
            >
          </div>
        </div>
        <div class="weui-cell weui-cell_switch">
          <div class="weui-cell__bd">显示密码</div>
          <div class="weui-cell__ft">
            <switch @change="switch_show_pwd"/>
          </div>
        </div>
      </div>
      <button class="weui-btn edubind" type="warn" form-type="submit">解绑</button>
    </form>
    <!-- 解绑信息页面结束 -->

    <!-- 绑定信息页面开始 -->
    <form class="page__bd page__bd_spacing" v-else @submit="bindEduSys">
      <div class="weui-cells__title">绑定教务系统</div>
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <div class="weui-label">学号</div>
          </div>
          <div class="weui-cell__bd">
            <input name="stuid" class="weui-input" placeholder="请输入学号">
          </div>
        </div>
        <div class="weui-cell weui-cell_input weui-cell_vcode">
          <div class="weui-cell__hd">
            <div class="weui-label">密码</div>
          </div>
          <div class="weui-cell__bd">
            <input name="pwd" class="weui-input" type="password" placeholder="请输入密码">
          </div>
        </div>
      </div>
      <div class="weui-cells__tips">提示:以上密码为选课系统密码，初始值为"1234"。若忘记密码，可以联系所在院系教学秘书进行重置。</div>
      <button class="weui-btn edubind" type="primary" form-type="submit">绑定</button>
      <button class="weui-btn edubind" type="default" form-type="reset">重置</button>
    </form>
    <!-- 绑定信息页面结束 -->
    <goHome ></goHome>
  </div>
</template>
<script>
import goHome from '@/components/goHome';
export default {
  components:{
    goHome
  },
  data() {
    return {
      isBind: false, // 是否已经绑定教务系统，true为绑定，false为未绑定
      stuid: null, // 解绑页面的学号信息
      pwd: null, // 解绑页面的密码
      isPassword: true
    };
  },

  methods: {
    /**
     * 绑定教务系统
     */
    bindEduSys: function(e) {
      let that = this;
      // console.log(e.detail.value);
      // 前台校验数据（提交的数据是否为空）
      if (e.mp.detail.value.stuid == "" || e.mp.detail.value.pwd == "") {
        // 数据不合法（为空），弹出提示框
        wx.showModal({
          title: "注意", //提示的标题,
          content: "学号或密码不能为空", //提示的内容,
          showCancel: false //是否显示取消按钮,
        });
        // return false;
      } else {
        // 数据合法（不为空），携带 session3rd 提交表单
        let session3rd = wx.getStorageSync("session3rd");
        let data = {
          stuid: e.mp.detail.value.stuid,
          pwd: e.mp.detail.value.pwd,
          session3rd: session3rd
        };
        wx.showLoading({
          title: "加载中", //提示的内容,
          mask: true //显示透明蒙层，防止触摸穿透
        });
        that.$wxAPI
          .request(that.$url.eduBindUrl, data, "POST")
          .then(
            successRes => {
              wx.hideLoading();
              /**
               * 接口调用成功处理登录信息
               * @ $errcode: 错误码
               * 0：绑定成功
               * 1：重新绑定
               * 10：重新登录
               */
              switch (successRes.data.errcode) {
                case 0:
                  wx.showToast({
                    title: "绑定成功", //提示的内容,
                    icon: "success", //图标,
                    duration: 2000, //延迟时间,
                    mask: true //显示透明蒙层，防止触摸穿透
                  });
                  wx.setStorageSync("edubind", "bind");
                  //   that.setData({
                  //     isBind: true,
                  //     stuid: e.detail.value.stuid,
                  //     pwd: e.detail.value.pwd
                  //   });
                  that.isBind = true;
                  that.stuid = e.mp.detail.value.stuid;
                  that.pwd = e.mp.detail.value.pwd;
                  break;
                case 1:
                  wx.showModal({
                    title: "提示", //提示的标题,
                    content: successRes.data.errmsg, //提示的内容,
                    showCancel: false //是否显示取消按钮,
                  });
                  break;
                case 10:
                  wx.showModal({
                    title: "提示", //提示的标题,
                    content: successRes.data.errmsg, //提示的内容,
                    success: res => {
                      if (res.confirm) {
                        // 用户点击确定执行登录流程
                        that.$login.doLogin();
                      }
                    }
                  });
                  break;
              }
            },
            fail => {
              wx.showModal({
                title: "提示", //提示的标题,
                content: "post请求接口调用失败", //提示的内容,
                showCancel: false //是否显示取消按钮
              });
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
    },

    /**
     * 解绑教务系统
     */
    unbindEduSys: function(e) {
      let that = this;
      wx.showModal({
        title: "提示", //提示的标题,
        content: "确定解除绑定？", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#3CC51F", //取消按钮的文字颜色,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#000000", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.showLoading({
              title: "加载中", //提示的内容,
              mask: true //显示透明蒙层，防止触摸穿透
            });
            let session3rd = wx.getStorageSync("session3rd");
            let data = {
              session3rd: session3rd
            };
            that.$wxAPI
              .request(that.$url.eduUnbindUrl, data, "POST")
              .then(successRes => {
                // 接口调用成功
                if (successRes.data.errcode == 0) {
                  // 解绑成功
                  wx.hideLoading();
                  wx.setStorageSync("edubind", "unbind");
                  wx.showToast({
                    title: "解绑成功", //提示的内容,
                    icon: "success", //图标,
                    duration: 2000, //延迟时间,
                    mask: true //显示透明蒙层，防止触摸穿透
                  });
                  //   that.setData({
                  //     isBind: false
                  //   });
                  that.isBind = false;
                } else if (successRes.data.errcode == 1) {
                  // 解绑失败
                  wx.hideLoading();
                  wx.showModal({
                    title: "提示", //提示的标题,
                    content: successRes.data.errmsg, //提示的内容,
                    showCancel: false, //是否显示取消按钮
                    confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: "#3CC51F" //确定按钮的文字颜色
                  });
                } else if (successRes.data.errcode == 10) {
                  // 登录过期重新登录
                  that.$login
                    .doLogin(e => {
                      wx.hideLoading();
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }
              })
              .catch(e => {
                console.log(e);
              });
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      });
    },

    /**
     * 显示/隐藏 密码
     */
    switch_show_pwd(e) {
      let that = this;
      // console.log(e);
      if (e.mp.detail.value == true && that.isPassword == true) {
        // 按钮开启，显示密码
        // that.setData({
        //   isPassword: false
        // });
        that.isPassword = false;
      } else if (e.mp.detail.value == false && that.isPassword == false) {
        // 按钮关闭，隐藏密码
        // that.setData({
        //   isPassword: true
        // });
        that.isPassword = true;
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    // 1.获取 storage 中教务系统绑定信息
    let eduBind = wx.getStorageSync("edubind");
    if (eduBind) {
      switch (eduBind) {
        case "unbind":
          if (that.isBind == true) {
            that.isBind = false;
          }
          break;
        case "bind":
          // 将页面显示为解绑页面
          if (that.isBind == false) {
            that.isBind = true;
          }
          // 从服务器请求学号密码信息
          let data = {
            session3rd: wx.getStorageSync("session3rd")
          };
          that.$wxAPI
            .request(that.$url.showInfoUrl, data, "POST")
            .then(successRes => {
              // 接口调用成功
              wx.hideLoading();
              if (successRes.data.errcode == 0) {
                // that.setData({
                //   stuid: successRes.data.stuid,
                //   pwd: successRes.data.pwd
                // });
                that.stuid = successRes.data.stuid;
                that.pwd = successRes.data.pwd;
              } else if (successRes.data.errcode == 10) {
                // 登录态过期,重新登录
                that.$login.doLogin();
              }
            })
            .catch(e => {
              console.log(e);
            });
          // wx.hideLoading();
          break;
      }
    } else {
      that.$login
        .doLogin()
        .then(res => {
          that.onLoad();
        })
        .catch(e => {
          console.log(e);
        });
    }
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
};
</script>
<style scoped>
.edubind {
  margin: 20rpx 30rpx;
}
</style>


