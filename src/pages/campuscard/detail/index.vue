<template>
  <div class="page">
    <!-- 顶部tab开始 -->
    <div class="swiper-tab">
      <div
        class="swiper-tab-list"
        :class="{on:(currentTab==0)}"
        data-current="0"
        @click="swichNav"
      >账户信息</div>
      <div
        class="swiper-tab-list"
        :class="{on:(currentTab==1)}"
        data-current="1"
        @click="swichNav"
      >消费明细</div>
      <!-- <div class="swiper-tab-list {{currentTab==2 ? 'on' : ''}}" data-current="2" bindtap="swichNav">挂失/改密</div> -->
    </div>
    <!-- 顶部tab结束 -->

    <swiper
      :current="currentTab"
      class="swiper-box"
      duration="300"
      :style="{height:winHeight+'px'}"
      @change="bindChange"
    >
      <!-- 账户信息 -->
      <swiper-item>
        <div class="history-table-wrap" style="height:auto;">
          <div class="table">
            <div class="tr" v-for="(item, index) in user" :key="index">
              <div class="td td1">{{ item[0] }}</div>
              <div class="td td2">{{ item[1] }}</div>
            </div>
          </div>
        </div>
      </swiper-item>

      <!-- 消费明细 -->
      <swiper-item>
        <div class="history-table-wrap">
          <div class="table">
            <div class="tr">
              <div class="th th1">时间</div>
              <div class="th th2">地点</div>
              <div class="th th3">金额</div>
              <div class="th th4">余额</div>
            </div>
            <div class="tr" v-for="(item, index) in billsMore" :key="index">
              <div class="td td1">{{ item[0] }}</div>
              <div class="td td2">{{ item[4] }}</div>
              <div class="td td3">{{ item[5] }}</div>
              <div class="td td4">{{ item[6] }}</div>
            </div>
          </div>
        </div>
      </swiper-item>
      <!-- 挂失/改密 -->
      <!-- <swiper-item>
    <div>待开发……</div>
      </swiper-item>-->
    </swiper>

    <!-- 返回首页开始 -->
    <!-- <div class="goHome" @click="$index.goHome">
      <img src="/static/images/home.png">
    </div>-->
    <goHome></goHome>
    <!-- 返回首页结束 -->
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
      //页面配置
      winWidth: 0,
      winHeight: 0,
      // tab切换
      currentTab: 0,

      // 账户信息
      user: null,
      // 消费明细
      billsMore: null
    };
  },
  methods: {
    // 滑动切换tab
    bindChange(e) {
      let that = this;
      that.currentTab = e.mp.detail.current;
    },
    //点击tab切换
    swichNav(e) {
      var that = this;
      if (that.currentTab === e.mp.target.dataset.current) {
        return false;
      } else {
        that.currentTab = e.mp.target.dataset.current;
      }
    },
    /**
     * 判断是否绑定一卡通系统
     */
    isBind() {
      let that = this;
      let res = wx.getStorageSync("campuscardbind");
      return res;
    },
    /**
     * 请求一卡通信息
     */
    async loadInfo() {
      let that = this;
      let res = {
        errcode: null,
        errmsg: ""
      };
      let session3rd = wx.getStorageSync("session3rd");
      let data = {
        session3rd: session3rd
      };
      await that.$wxAPI
        .request(that.$url.expensesRecordUrl, data, "POST")
        .then(success => {
          res.errcode = success.data.errcode;
          res.errmsg = success.data.errmsg + "";
          if (res.errcode == 0) {
            // 请求成功
            that.user = success.data.data.user.data;
            that.billsMore = success.data.data.billsMore.data;
          }
        });
      return res;
    }
  },
  /**
   * 生命周期函数，监听页面加载
   */
  mounted() {
    let that = this;
    // 获取设备信息
    wx.getSystemInfo({
      success: function(res) {
        that.winWidth = res.windowWidth;
        that.winHeight = res.windowHeight;
      }
    });
  },
  /**
   * 生命周期函数——监听页面显示
   */
  async onShow() {
    let that = this;
    let loadRes;
    let params;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });

    // 检查一卡通系统绑定状态
    let bind = that.isBind();
    if (bind == "bind") {
      // 已经绑定了一卡通
      // 开始请求信息
      loadRes = await that.loadInfo();
      switch (loadRes.errcode) {
        case 0:
          // 请求成功,不做任何操作
          break;
        case 10:
          // 登录过期,弹窗提醒
          that.$wxAPI.isLoginModal();
          break;
        default:
          // 发生其他错误,弹窗提醒
          params = {
            title: "注意",
            content: loadRes.errmsg,
            showCancel: false
          };
          that.$wxAPI.showModal(params).then(res => {
            if (res.confirm) {
              // 用户点击确认,返回上一页
              wx.navigateBack({
                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
              });
            }
          });
      }
    } else if (bind == "unbind") {
      // 未绑定一卡通系统，弹窗提醒
      params = {
        title: "提示", //提示的标题,
        content: "您尚未绑定一卡通系统是否进行绑定？" //提示的内容,
      };
      that.$wxAPI.showModal(params).then(res => {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.navigateTo({ url: "/pages/campuscardsys/main" });
        } else if (res.cancel) {
          // console.log('用户点击取消')
          wx.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }
      });
    } else {
      // 尚未登录,弹窗提醒
      that.$wxAPI.isLoginModal('您尚未登录');
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
.swiper-tab {
  width: 100%;
  border-bottom: 1px solid #777777;
  text-align: center;
  line-height: 40px;
  position: fixed;
  z-index: 1;
}
.swiper-tab-list {
  font-size: 14px;
  display: inline-block;
  width: 50%;
  color: #777777;
}
.on {
  color: #53affd;
  border-bottom: 2.5px solid #53affd;
}
.swiper-box {
  display: block;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.swiper-box view {
  text-align: center;
}

.history-table-wrap {
  position: relative;
  width: 90%;
  height: 960rpx;
  /* left: 5%; */
  background: rgba(255, 255, 255, 1);
  /* margin-left: -334rpx; */
  /* top: 70rpx; */
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: center;
  margin-top: 60px;
  margin-left: 5%;
  border-radius: 10rpx;
}
/* 表格代码   */
.table {
  /* border:1px solid #dadada; */
  /* border-right:0;
    border-bottom: 0; */
  border-top: 1px solid #dadada;
  border-left: 1px solid #dadada;
  width: 95%;
  margin: 20rpx 2.5%;
}
.tr {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.th,
.td {
  padding: 20rpx;
  border-bottom: 1px solid #dadada;
  border-right: 1px solid #dadada;
  text-align: center;
  width: 100%;
}

.th {
  /* font-weight: 800; */
  /* background-color: #d6f1ff; */
  font-size: 16px;
  /* color: #1296db; */
}
.td {
  font-size: 14px;
  color: gray;
}
</style>


