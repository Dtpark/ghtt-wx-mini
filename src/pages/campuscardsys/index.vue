<template>
  <div class="page">
    <!-- 解绑信息页面开始 -->
    <form class="page__bd page__bd_spacing" v-if="isBind" @submit="unbindCmpusCard">
      <div class="weui-cells__title">解绑一卡通系统</div>

      <div class="cu-form-group">
        <div class="title">账号</div>
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
    <form class="page__bd page__bd_spacing" v-else @submit="bindCampuscard">
      <div class="weui-cells__title">绑定校园一卡通</div>
      <div class="cu-form-group">
        <div class="title">账号</div>
        <input name="stuid" placeholder="请输入卡号" />
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
        <p>提示</p>
        <p>1.以上密码为一卡通查询密码，初始为身份证号后六位；若身份证号含有“X”，则为去掉“X”后的后六位；</p>
        <p>2.为了保护账号安全，绑定成功后，无法变更姓名，请绑定自己账号，切勿绑定他人账号。</p>
      </div>
    </form>
    <!-- 绑定信息页面结束 -->

    <!-- 引入返回首页的组件 -->
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
      stuid: null,
      pwd: null,
      isBind: false,
      isPassword: true
    };
  },
  methods: {
    /**
     * 判断是否绑定一卡通系统
     */
    checkBind() {
      let that = this;
      let status;
      status = wx.getStorageSync("campuscardbind");
      switch (status) {
        case "bind":
          // 已经绑定一卡通系统
          if (that.isBind == false) {
            that.isBind = true;
          }
          break;
        case "unbind":
          // 尚未绑定教务系的
          if (that.isBind == true) {
            that.isBind = false;
          }
          break;
      }
      return status;
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
          .request(that.$url.campuscardInfoUrl, data, "POST")
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
     * 绑定一卡通系统
     */
    bindCampuscard(e) {
      let that = this;
      // 前台校验数据（提交的数据是否为空）
      if (e.mp.detail.value.stuid == "" || e.mp.detail.value.pwd == "") {
        // 数据不合法（为空），弹出提示框
        wx.showModal({
          title: "注意", //提示的标题,
          content: "卡号或密码不能为空", //提示的内容,
          showCancel: false //是否显示取消按钮,
        });
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
          .request(that.$url.campuscardBindUrl, data, "POST")
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
                  wx.setStorageSync("campuscardbind", "bind");
                  wx.setStorageSync("loadIndexMoudel", "true");
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
                  // 登录过期，弹窗提示
                  that.$wxAPI.isLoginModal("登录过期", false);
                  break;
                default:
                  wx.showModal({
                    title: "提示", //提示的标题,
                    content: successRes.data.errmsg, //提示的内容,
                    showCancel: false //是否显示取消按钮
                  });
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
     * 解绑一卡通系统
     */
    unbindCmpusCard() {
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
              .request(that.$url.campuscardUnbindUrl, data, "POST")
              .then(successRes => {
                // 接口调用成功
                if (successRes.data.errcode == 0) {
                  // 解绑成功
                  wx.hideLoading();
                  wx.setStorageSync("campuscardbind", "unbind");
                  wx.setStorageSync("loadIndexMoudel", "true");
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
                  that.$wxAPI.isLoginModal("登录过期", false);
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
    let bind;
    let loadRes;
    let params;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });

    // 判断是否绑定一卡通系统
    bind = that.checkBind();
    if (bind == "bind") {
      // 已经绑定了一卡通系统
      // 加载学号密码信息
      loadRes = await that.getInfo();
      if (loadRes.errcode == 0) {
        // 加载成功，啥也不干
      } else if (loadRes.errcode == 10) {
        // 登录过期，重新登录
        that.$wxAPI.isLoginModal();
      }
    } else if (bind == "unbind") {
      // 尚未绑定一卡通系统
      // 啥也不干
    } else {
      // 用户没有登录
      that.$wxAPI.isLoginModal("您尚未登录");
    }
    wx.hideLoading();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
};
</script>
<style scoped>
</style>

