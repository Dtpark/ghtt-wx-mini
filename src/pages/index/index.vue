<template>
  <div class="page">
    <!-- 顶部banner开始 -->
    <div class="applet_banner">
      <swiper
        indicator-dots="true"
        autoplay="true"
        interval="3000"
        duration="1000"
        indicator-color="rgba(255,255,255,0.3)"
        indicator-active-color="#ffffff"
      >
        <block v-for="(item, index) in bannerImgUrls" :key="index">
          <swiper-item>
            <img class="applet_banner_img" :src="item">
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- 顶部banner结束 -->
    <!-- 分割线开始 -->
    <div class="applet_br"></div>
    <!-- 分割线结束 -->

    <!-- 通知公告开始 -->
    <div class="applet_notice">
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_appmsg">
          <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
            <img class="weui-media-box__thumb" src="/static/images/notice.png">
          </div>
          <div v-if="noticeList != ''" class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <swiper
              class="applet_notice_swiper"
              vertical="true"
              autoplay="true"
              interval="3000"
              :display-multiple-items="number"
            >
              <block v-for="(item, index) in noticeList" :key="index">
                <swiper-item>
                  <div
                    @click="showNoticeDetail"
                    :data-para="item"
                    class="weui-media-box__desc"
                    hover-class="weui-cell_active"
                  >[ {{item['type']}} ] {{ item['title'] }}</div>
                </swiper-item>
              </block>
            </swiper>
          </div>
          <div v-else>
            <div class="weui-media-box__desc">暂无通知~</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 通知公告结束 -->

    <!-- 分割线开始 -->
    <div class="applet_br"></div>
    <!-- 分割线结束 -->

    <!-- 今日课表开始 -->
    <!-- 已经绑定教务系统开始 -->
    <div v-if="eduSysBind" class="applet_panel_card">
      <div @click="onclick_week_curriculum" class="weui-cell weui-cell_access applet_cell_link">
        <div class="weui-cell__bd">今日课表</div>
        <div class="weui-cell__ft weui-cell__ft_in-access">完整课表</div>
      </div>
      <scroll-view scroll-x="true" class="applet_curriculm_list">
        <div
          v-if="todayCurriculum.length === 0"
          class="applet_curriculm_item applet_curriculm_none"
        >
          <div class="applet_curriculm_item_name">今日无课~</div>
        </div>
        <div v-else>
          <block v-for="(item, index) in todayCurriculum" :key="index">
            <div class="applet_curriculm_item" :style="backgroundcolor[index]">
              <div class="applet_curriculm_item_name">{{ item.name }}</div>
              <div class="applet_curriculm_item_time">第{{ item.time }}大节</div>
              <div class="applet_curriculm_item_room">@{{ item.room }}</div>
            </div>
          </block>
        </div>
      </scroll-view>
    </div>
    <!-- 已经绑定教务系统结束 -->
    <!-- 未绑定教务系统开始 -->
    <div v-else>
      <div class="weui-loadmore weui-loadmore_line">
        <div class="weui-loadmore__tips weui-loadmore__tips_in-line">暂无数据</div>
        <div>您尚未绑定教务系统，部分功能无法使用，请先绑定~</div>
        <button class="btn__edubind" size="mini" type="warn" @click="onclickBindEdu">绑定教务系统</button>
      </div>
    </div>
    <!-- 未绑定教务系统结束 -->
    <!-- 今日课表结束 -->

    <!-- 分割线开始 -->
    <div class="applet_br"></div>
    <!-- 分割线结束 -->

    <!-- 今日消费（一卡通）开始 -->
    <!-- 已经绑定一卡通系统开始 -->
    <div v-if="campuscardBind" class="applet_panel_card">
      <div @click="onclick_detail_campuscard" class="weui-cell weui-cell_access applet_cell_link">
        <div class="weui-cell__bd">一卡通</div>
        <div class="weui-cell__ft weui-cell__ft_in-access">完整记录</div>
      </div>
      <div class="applet_campuscard_box">
        <div class="applet_campuscard_detail">
          <div class="applet_campuscard_hd">
            <div class="applet_campuscard_hd_left">{{ date }}</div>
            <div class="applet_campuscard_hd_right">第{{ week }}周 星期{{ day2text }}</div>
          </div>
          <div class="applet_campuscard_bd">
            <div class="applet_campuscard_label">余额：</div>
            <div class="applet_campuscard_label applet_campuscard_balance">{{ balance }}</div>
            <div class="applet_campuscard_label">元</div>
          </div>
          <div class="applet_campuscard_ft">
            <div class="applet_campuscard_ft_title">今日交易:</div>
            <div v-if="bills && bills['data'].length > 0" class="applet_campuscard_ft_content">
              <swiper vertical="true" autoplay="true" interval="4000">
                <block v-for="(item, index) in bills['data']" :key="index">
                  <swiper-item class="applet_campuscard_expenses_item">
                    <div class="applet_campuscard_expenses_left">
                      [ {{ item[3] }} ] {{ item[0] }}
                      {{ item[4] }}
                    </div>
                    <div class="applet_campuscard_expenses_right">{{ item[5] }}</div>
                  </swiper-item>
                </block>
              </swiper>
            </div>
            <div v-else-if="bills && bills['data'] == 0" class="applet_campuscard_ft_content">
              <div class="applet_campuscard_expenses_item">您今日尚未刷卡消费</div>
            </div>
            <div v-else class="applet_campuscard_ft_content">
              <div class="applet_campuscard_expenses_item">加载中……</div>
              <!-- <swiper vertical="true" autoplay="true" interval="4000">
                <swiper-item class="applet_campuscard_expenses_item">
                  <div class="applet_campuscard_expenses_left">[ 消费 ] 12:11 家家悦购物中心111222333</div>
                  <div class="applet_campuscard_expenses_right">-100</div>
                </swiper-item>
                <swiper-item class="applet_campuscard_expenses_item">
                  <div class="applet_campuscard_expenses_left">[ 消费 ] 12:11 家家悦购物中心</div>
                  <div class="applet_campuscard_expenses_right">-100</div>
                </swiper-item>
              </swiper>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已经绑定一卡通系统结束 -->
    <!-- 未绑定一卡通系统开始 -->
    <div v-else>
      <div class="weui-loadmore weui-loadmore_line">
        <div class="weui-loadmore__tips weui-loadmore__tips_in-line">暂无数据</div>
        <div>您尚未一卡通系统，部分功能无法使用，请先绑定~</div>
        <button class="btn__edubind" size="mini" type="warn" @click="onclickBindCard">绑定一卡通系统</button>
      </div>
    </div>
    <!-- 未绑定一卡通系统结束 -->
    <!-- 今日消费（一卡通）结束 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 轮播图链接：
      bannerImgUrls: [
        "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640",
        "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640",
        "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
      ],
      // 通知列表
      noticeList: null,
      // 每次显示的通知条数
      number: 1,

      // 教务系统是否绑定
      eduSysBind: false,
      // 一卡通系统是否绑定
      campuscardBind: false,

      // 本周周次
      week: "*",
      // 星期几
      day2text: "*",
      // 今日课表数组
      todayCurriculum: [],
      // 课程背景色
      backgroundcolor: [
        "background: linear-gradient(to right, rgb(112, 230, 255) , rgb(166, 218, 245));",
        "background: linear-gradient(to right, rgb(172, 137, 238) , rgb(173, 197, 255));",
        "background: linear-gradient(to right, rgb(107, 221, 106) , rgb(192, 243, 169));",
        "background: linear-gradient(to right, rgb(250, 206, 155) , rgb(253, 241, 142));",
        "background: linear-gradient(to right, rgb(112, 230, 255) , rgb(166, 218, 245));",
        "background: linear-gradient(to right, rgb(112, 230, 255) , rgb(166, 218, 245));"
      ],

      // 一卡通余额
      balance: "*",
      // 今日账单
      bills: null,
      // 今日日期
      date: null
    };
  },
  methods: {
    /**
     * 获取轮播图url 和 今日日期
     */
    getBanner(that) {
      // let that = this;
      that.$wxAPI.request(that.$url.getBannerUrl, {}, "POST").then(success => {
        switch (success.data.errcode) {
          case 0:
            that.bannerImgUrls = success.data.urlArr;
            break;
          case 404:
            break;
        }
        // 获取今日日期
        let date = new Date();
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        that.date = year + "/" + month + "/" + day;
      });
    },
    /**
     * 获取通知公告列表
     */
    getNoticeList(that) {
      // let that = this;
      that.$wxAPI
        .request(that.$url.getNoticeListUrl, {}, "POST")
        .then(success => {
          if (success.data.count > 1) {
            that.noticeList = success.data.noticeList;
            that.number = 2;
          } else {
            that.noticeList = success.data.noticeList;
            // that.$set(that.number , 1);
            that.number = 1;
          }
          that.$forceUpdate();
        });
    },
    /**
     * 跳转到公告详情页
     */
    showNoticeDetail(event) {
      // 获取点击的通知信息
      let notice = event.mp.currentTarget.dataset.para;
      switch (notice.type) {
        case "公告":
          // 跳转到公告详情
          wx.navigateTo({
            url: "/pages/notice/detail/main?id=" + notice.id
          });
          break;
        case "十大":
          wx.navigateTo({
            url: "/pages/forum/detail/main?tid=" + notice.id
          });
          break;
      }
      return false;
    },

    /**
     * 判断是否绑定教务系统
     */
    isBindEduSys(that) {
      // let that = this;
      let edubind = wx.getStorageSync("edubind");
      // console.log(edubind);
      // return false;
      switch (edubind) {
        case "unbind":
          // console.log(that.eduSysBind);
          if (that.eduSysBind == true) {
            that.eduSysBind = false;
          }
          break;
        case "bind":
          // console.log(that);
          // console.log(that.eduSysBind);
          // console.log(that.number);
          // console.log(that.$options.data().number);
          if (that.eduSysBind == false) {
            that.eduSysBind = true;
          }
          break;
      }
    },

    /**
     * 绑定教务系统按钮--跳转到绑定/解绑页面
     */
    onclickBindEdu() {
      wx.navigateTo({
        url: "/pages/edusys/main"
      });
    },
    /**
     * 获取今日课表
     */
    getTodayTable(that) {
      // let that = this;
      // 取出登录态标识
      let session3rd = wx.getStorageSync("session3rd");
      let edubind = wx.getStorageSync("edubind");
      if (session3rd && edubind == "bind" && that.week == "*") {
        let data = {
          session3rd: session3rd
        };
        // 请求API
        that.$wxAPI
          .request(that.$url.todayCurriculumUrl, data, "POST")
          .then(success => {
            // 请求成功，判断登录态是否过期
            switch (success.data.errcode) {
              case 0:
                // 登录态有效
                // 对所用信息赋值
                that.week = success.data.today.week;
                that.day2text = success.data.today.day2text;
                that.todayCurriculum = success.data.todayTable;
                that.$forceUpdate();
                break;
              case 10:
                // 登录过期，重新登录
                that.$login.doLogin();
                break;
              default:
                wx.showModal({
                  title: "提示", //提示的标题,
                  content: success.data.errmsg, //提示的内容,
                  showCancel: true //是否显示取消按钮
                });
            }
          });
      }
    },

    /**
     * 跳转到按周显示课表页面
     */
    onclick_week_curriculum: function() {
      wx.navigateTo({
        url: "/pages/curriculum/week/main"
      });
    },

    /**
     * 判断是否绑定一卡通系统
     */
    isBindCampuscard(that) {
      // let that = this;
      let campuscardbind = wx.getStorageSync("campuscardbind");
      switch (campuscardbind) {
        case "unbind":
          if (that.campuscardBind == true) {
            that.campuscardBind = false;
          }
          break;
        case "bind":
          if (that.campuscardBind == false) {
            that.campuscardBind = true;
          }
          break;
      }
    },

    /**
     * 绑定一卡通系统按钮--跳转到绑定/解绑页面
     */
    onclickBindCard() {
      wx.navigateTo({
        url: "/pages/campuscardsys/main"
      });
    },

    /**
     * 获取今日账单
     */
    getTodayExpenses(that) {
      // let that = this;
      let session3rd = wx.getStorageSync("session3rd");
      let campuscard_bind = wx.getStorageSync("campuscardbind");
      if (session3rd && campuscard_bind) {
        let data = {
          session3rd: session3rd
        };
        that.$wxAPI
          .request(that.$url.todayExpensesUrl, data, "POST")
          .then(success => {
            // console.log(success.data);
            switch (success.data.errcode) {
              case 0:
                that.balance = success.data.balance;
                that.bills = success.data.bills;
                that.$forceUpdate();
                break;
              case 10:
                // 登录过期，重新登录
                that.$login.doLogin();
                break;
              default:
                wx.showModal({
                  title: "提示", //提示的标题,
                  content: success.data.errmsg, //提示的内容,
                  showCancel: true //是否显示取消按钮
                });
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    /**
     * 跳转到一卡通详情
     */
    onclick_detail_campuscard() {
      wx.navigateTo({ url: "/pages/campuscard/detail/main" });
    }
  },

  /**
   * 生命周期函数
   */
  mounted() {
    let that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    // 判断是否登录
    that.$login
      .isLogin()
      .then(() => {
        // 已经登录
        // 获取轮播图
        that.getBanner(that);
        // 获取通知公告[放在onshow（）]
        that.getNoticeList(that);
        // 检查教务系统绑定状态
        that.isBindEduSys(that);
        // 检查一卡通绑定状态
        that.isBindCampuscard(that);

        let date = new Date();
        let hour = date.getHours();
        let day = date.getDay();
        if (that.week == "*" || that.balance == "*") {
          // 没有获取到课表和消费信息
          // 查看是否绑定教务系统
          if (wx.getStorageSync("edubind") == "bind" && that.week == "*") {
            // 绑定了教务系统,获取今日课表
            that.getTodayTable(that);
          }
          // 查看是否绑定一卡通系统
          if (
            wx.getStorageSync("campuscardbind") == "bind" &&
            that.balance == "*" &&
            hour >= 8 &&
            hour < 18 &&
            day != 6 &&
            day != 0
          ) {
            // 绑定了一卡通系统,获取消费信息
            that.getTodayExpenses(that);
          }
        }

        wx.hideLoading();
      })
      .catch(e => {
        console.log(e);
      });
  },
  onShow() {
    let that = this;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    // 获取通知公告列表
    // that.getNoticeList(that);

    // console.log(that.week);
    // 检查教务系统绑定状态
    that.isBindEduSys(that);
    // 检查一卡通绑定状态
    that.isBindCampuscard(that);

    wx.hideLoading();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    let that = this;

    // 获取通知公告列表
    that.getNoticeList(that);
    let date = new Date();
    let hour = date.getHours();
    let day = date.getDay();
    // console.log(that.week);
    if (that.week == "*" || that.balance == "*") {
      // 没有获取到课表和消费信息
      // 查看是否绑定教务系统
      if (wx.getStorageSync("edubind") == "bind" && that.week == "*") {
        // 绑定了教务系统,获取今日课表
        that.getTodayTable(that);
      }
      // 查看是否绑定一卡通系统
      if (
        wx.getStorageSync("campuscardbind") == "bind" &&
        that.balance == "*" &&
        hour >= 8 &&
        hour < 18 &&
        day != 6 &&
        day != 0
      ) {
        // 绑定了一卡通系统,获取消费信息
        that.getTodayExpenses(that);
      }
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>

<style lang="wxss">
page {
  /* overflow: hidden; */
  background: white;
}
.page {
  width: 100%;
  overflow: hidden;
}

/* banner样式开始 */
.applet_banner {
  width: 100%;
  height: 375rpx;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
}
.applet_banner > swiper {
  width: 100%;
  height: 375rpx;
}
.applet_banner_img {
  width: 100%;
  height: 375rpx;
}
/* banner样式结束 */

/* 分割线样式开始 */
.applet_br {
  width: 690rpx;
  margin-left: 30rpx;
  height: 2px;
  background: rgba(255, 255, 255, 1);
  border-bottom: darkgray solid 1px;
}
/* 分割线样式结束 */

/* notice样式开始 */
.applet_notice {
  background: rgba(255, 255, 255, 1);
  width: 100%;
  height: auto;
}
.weui-media-box {
  padding: 10rpx 30rpx;
}
.weui-media-box__hd_in-appmsg {
  width: 60rpx;
  height: 60rpx;
  margin-right: 0.5em;
}

.weui-media-box__desc {
  margin: 10rpx;
  font-size: 28rpx;
  color: black;
  width: 550rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.applet_notice_swiper {
  height: 85rpx;
}
/* notice样式结束 */

/* 今日课表样式开始 */
.applet_panel_card {
  background: rgba(255, 255, 255, 1);
  width: 100%;
  padding-bottom: 20rpx;
}
.applet_cell_link {
  color: black;
  font-size: 28rpx;
}
.weui-cell__bd {
  font-size: 32rpx;
  font-weight: 600;
}

.applet_curriculm_list {
  padding: 0 30rpx;
  white-space: nowrap;
  overflow-x: hidden;
  display: flex;
}
.applet_curriculm_item {
  width: 200rpx;
  /* min-height: 100rpx; */
  margin: 0 24rpx 0 0;
  border-radius: 20rpx;
  background: linear-gradient(to right, rgb(112, 230, 255), rgb(166, 218, 245));
  color: white;
  text-align: left;
  display: inline-block;
  padding: 5rpx 30rpx;
  overflow: hidden;
}

/* .applet_curriculm_none{
    margin: 0 auto;
} */

.applet_curriculm_item_name {
  font-size: 32rpx;
  font-weight: 500;
}
.applet_curriculm_item_time {
  font-size: 28rpx;
}
.applet_curriculm_item_room {
  font-size: 28rpx;
}
/* 今日课表样式结束 */

/* 一卡通（今日消费）样式开始 */
.applet_campuscard_box {
  /* overflow: auto; */
  padding: 20rpx 30rpx;
}

.applet_campuscard_detail {
  width: 100%;
  height: 414rpx;
  border-radius: 20rpx;
  /* background: linear-gradient(to right, rgb(107, 221, 106) , rgb(192, 243, 169)); */
  /* background: linear-gradient(to right, rgb(150,0,164) , rgb(35,6,37)); */
  background: linear-gradient(to right, rgb(45, 150, 242), rgb(115, 229, 254));
  /* background: linear-gradient(to right, lightgray , darkgray);  */

  color: white;
  margin: 0 auto;
  position: relative;
}

.applet_campuscard_hd {
  font-size: 28rpx;
  display: flex;
  padding: 30rpx 30rpx;
}
.applet_campuscard_hd_left {
  width: 50%;
  float: left;
  text-align: left;
  display: inline;
}
.applet_campuscard_hd_right {
  width: 50%;
  float: right;
  text-align: right;
  display: inline;
}

.applet_campuscard_bd {
  /* font-size: 16px; */
  width: 100%;
  text-align: center;
  display: inline-block;
  margin-top: 75rpx;
  text-align: center;
}
.applet_campuscard_label {
  display: inline;
  font-size: 32rpx;
  font-weight: 600;
}
.applet_campuscard_balance {
  font-size: 32rpx;
  font-weight: 600;
}

.applet_campuscard_ft {
  width: 100%;
  height: 30rpx;
  font-size: 28rpx;
  position: absolute;
  bottom: 10rpx;
  padding: 30rpx 30rpx;
  /* display: inline-block; */
}
.applet_campuscard_ft_title {
  width: 22%;
  float: left;
  text-align: left;
  display: inline-block;
}
.applet_campuscard_ft_content {
  display: inline-block;
  width: 70%;
  float: left;
  height: 100%;
}
.applet_campuscard_expenses_item {
  width: 95%;
  height: 100%;
  display: inline-block;
  /* margin-left: -10rpx;
  z-index: 101; */
}

.applet_campuscard_expenses_left {
  width: 85%;
  float: left;
  text-align: left;
  display: inline;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.applet_campuscard_expenses_right {
  width: 15%;
  float: right;
  text-align: right;
  display: inline;
}
/* 一卡通（今日消费）样式结束 */

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>


