<template>
  <div class="page">
    <!-- 解绑信息页面开始 -->
    <form class="page__bd page__bd_spacing" v-if="isBind" @submit="unbindEduSys">
      <div class="weui-cells__title">解绑教务系统</div>
      <div class="cu-form-group">
        <div class="title">学号</div>
        <input name="stuid" disabled="true" :value="stuid" placeholder="学号" />
      </div>
      <div class="cu-form-group">
        <div class="title">密码</div>
        <input name="pwd" :password="isPassword" :value="pwd" disabled="true" placeholder="密码" />
      </div>
      <div class="cu-form-group">
        <div class="title">显示密码</div>
        <switch @change="switch_show_pwd" />
      </div>
      <div class="padding flex flex-direction">
        <button class="cu-btn bg-red lg" form-type="submit">解绑</button>
      </div>
    </form>
    <!-- 解绑信息页面结束 -->

    <!-- 绑定信息页面开始 -->
    <form class="page__bd page__bd_spacing" v-else @submit="bindEduSys">
      <div class="weui-cells__title">绑定教务系统</div>
      <div class="cu-form-group">
        <div class="title">学号</div>
        <input name="stuid" placeholder="请输入学号" />
      </div>
      <div class="cu-form-group">
        <div class="title">密码</div>
        <input name="pwd" type="password" placeholder="请输入密码" />
      </div>
      <div class="padding flex flex-direction">
        <button class="cu-btn bg-green lg" form-type="submit">绑定</button>
        <button class="cu-btn bg-white margin-top-sm lg" form-type="reset">重置</button>
      </div>
      <div class="tips">
        <p>提示:</p>
        <p>以上密码为选课系统密码，初始值为"1234"。若忘记密码，可以联系所在院系教学秘书进行重置。</p>
      </div>
    </form>
    <!-- 绑定信息页面结束 -->
    <goHome></goHome>
  </div>
</template>
<script>
import goHome from "@/components/goHome";
export default {
  components: {
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
     * 判断是否绑定教务系统
     */
    checkBind() {
      let that = this;
      let bind;
      let status;
      status = wx.getStorageSync("edubind");
      switch (status) {
        case "bind":
          // 已经绑定教务系统
          bind = true;
          if (that.isBind == false) {
            that.isBind = true;
          }
          break;
        case "unbind":
          // 尚未绑定教务系的
          bind = false;
          if (that.isBind == true) {
            that.isBind = false;
          }
          break;
        default:
          // 尚未登录
          bind = false;
      }
      return bind;
    },
    /**
     * 获取学号和密码
     */
    async getInfo() {
      let that = this;
      let res = {
        errcode: 0,
        errmsg: ""
      };
      if (that.stuid == null || that.pwd == null) {
        // 从服务器请求学号密码信息
        let data = {
          session3rd: wx.getStorageSync("session3rd")
        };
        await that.$wxAPI
          .request(that.$url.showInfoUrl, data, "POST")
          .then(successRes => {
            // 接口调用成功
            res.errcode = successRes.data.errcode;
            res.errmsg = successRes.data.errmsg + "";
            if (successRes.data.errcode == 0) {
              that.stuid = successRes.data.stuid;
              that.pwd = successRes.data.pwd;
            }
          });
      }
      return res;
    },
    /**
     * 绑定教务系统
     */
    bindEduSys(e) {
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
  async onShow() {
    let that = this;
    let user_status;
    let bind;
    let loadRes;
    let params;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });

    // 1. 检查用户登录态
    user_status = await that.$login.isLogin();

    if (user_status == 0) {
      // 用户已经登录

      // 2. 判断是否绑定教务系统
      bind = that.checkBind();
      if (bind) {
        // 已经绑定了教务系统

        // 加载学号密码信息
        loadRes = await that.getInfo();
        if (loadRes.errcode == 0) {
          // 加载成功，啥也不干
        } else if (loadRes.errcode == 10) {
          // 登录过期，重新登录
          params = {
            title: "注意",
            content: "登录过期，是否重新登录"
          };
          that.$wxAPI.showModal(params).then(res => {
            if (res.confirm) {
              // 用户点击确定
              that.$wxAPI.toLoginPage();
            } else {
              // 用户点击取消
              wx.navigateBack({
                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
              });
            }
          });
        }
      }
    } else if (user_status == 10) {
      // 登录过期
      params = {
        title: "注意",
        content: "登录过期，是否重新登录"
      };
      that.$wxAPI.showModal(params).then(res => {
        if (res.confirm) {
          // 用户点击确定
          that.$wxAPI.toLoginPage();
        } else {
          // 用户点击取消
          wx.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }
      });
    }
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>
<style scoped>
</style>


