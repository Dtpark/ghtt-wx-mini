<template>
  <div class="page">
    <!-- 公众号关注组件开始 -->
    <official-account></official-account>
    <!-- 公众号关注组件结束 -->
    <!-- 顶部banner开始 -->
    <div class="applet_banner">
      <swiper
        class="screen-swiper square-dot"
        indicator-dots="true"
        circular="true"
        autoplay="true"
        interval="3000"
        duration="1000"
      >
        <block v-for="(item, index) in bannerImgUrls" :key="index">
          <swiper-item @click="toBannerDetail" :data-para="item">
            <img class="applet_banner_img" :src="item['image_url']" mode="aspectFill" />
            <!-- <video src="{{item.url}}" autoplay loop muted show-play-btn="{{false}}" controls="{{false}}" objectFit="cover" wx:if="{{item.type=='video'}}"></video> -->
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- 顶部banner结束 -->

    <!-- 分割线开始 -->
    <!-- <div class="applet_br"></div> -->
    <!-- 分割线结束 -->

    <!-- 通知公告开始 -->
    <div class="applet_notice">
      <div class="weui-media-box weui-media-box_appmsg">
        <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
          <img class="weui-media-box__thumb" src="/static/images/notice.png" />
        </div>
        <div v-if="noticeList" class="weui-media-box__bd weui-media-box__bd_in-appmsg">
          <swiper
            class="applet_notice_swiper"
            vertical="true"
            autoplay="true"
            interval="3000"
            circular="true"
            :display-multiple-items="number"
          >
            <block v-for="(item, index) in noticeList" :key="index">
              <swiper-item>
                <div
                  @click="showNoticeDetail"
                  :data-para="item"
                  class="weui-media-box__desc"
                  style="font-size: 14px;"
                  hover-class="weui-cell_active"
                >
                  <span class="applet_notice_type margin-right-xs">[ {{item['type']}} ]</span>
                  <span class="applet_notice_title">{{ item['title'] }}</span>
                </div>
              </swiper-item>
            </block>
          </swiper>
        </div>
        <div v-else-if="noticeList == null">
          <div class="weui-media-box__desc">加载中……</div>
        </div>
        <div v-else>
          <div class="weui-media-box__desc">暂无通知~</div>
        </div>
      </div>
    </div>
    <!-- 分割线开始 -->
    <div class="applet_br"></div>
    <!-- 分割线结束 -->
    <!-- 通知公告结束 -->

    <!-- 登录可见部分开始 -->
    <div v-if="isLogin">
      <!-- 今日课表开始 -->
      <div v-if="showTimeTable">
        <!-- 已经绑定教务系统开始 -->
        <div v-if="eduSysBind" class="applet_panel_card">
          <div @click="onclick_week_curriculum" class="weui-cell weui-cell_access applet_cell_link">
            <div class="weui-cell__bd">今日课表</div>
            <div class="weui-cell__ft weui-cell__ft_in-access">完整课表</div>
          </div>
          <scroll-view scroll-x="true" class="applet_curriculm_list">
            <div v-if="todayCurriculum == ''" class="applet_curriculm_item applet_curriculm_none">
              <div class="applet_curriculm_item_name">今日无课~</div>
            </div>
            <div
              v-else-if="todayCurriculum === null"
              class="applet_curriculm_item applet_curriculm_none"
            >
              <div class="applet_curriculm_item_name">加载中……</div>
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

        <!-- 分割线开始 -->
        <div class="applet_br"></div>
        <!-- 分割线结束 -->
      </div>
      <!-- 今日课表结束 -->

      <!-- 今日消费（一卡通）开始 -->
      <div v-if="showCampusCard">
        <!-- 已经绑定一卡通系统开始 -->
        <div v-if="campuscardBind" class="applet_panel_card">
          <div
            @click="onclick_detail_campuscard"
            class="weui-cell weui-cell_access applet_cell_link"
          >
            <div class="weui-cell__bd">一卡通</div>
            <div class="weui-cell__ft weui-cell__ft_in-access">完整记录</div>
          </div>
          <div class="applet_campuscard_box shadow-blur">
            <div class="applet_campuscard_detail">
              <div class="applet_campuscard_hd">
                <div class="applet_campuscard_hd_left">{{ date }}</div>
                <div
                  v-if="week != '*'"
                  class="applet_campuscard_hd_right"
                >第{{ week }}周 星期{{ day2text }}</div>
              </div>
              <div class="applet_campuscard_bd">
                <div class="applet_campuscard_label">余额：</div>
                <div class="applet_campuscard_label applet_campuscard_balance">{{ balance }}</div>
                <div class="applet_campuscard_label">元</div>
              </div>
              <div class="applet_campuscard_ft">
                <div class="applet_campuscard_ft_title">今日交易:</div>
                <div v-if="bills && bills['data'].length > 0" class="applet_campuscard_ft_content">
                  <swiper vertical="true" autoplay="true" interval="4000" circular="true">
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
      </div>
      <!-- 今日消费（一卡通）结束 -->
    </div>
    <!-- 登录可见部分结束 -->
    <!-- 未登录提示开始 -->
    <div v-else>
      <div class="weui-loadmore">
        <div>您尚未登录，部分功能无法使用，请先登录~</div>
        <button class="btn__edubind" size="mini" type="warn" @click="onclickLogin">前往登录</button>
      </div>
    </div>
    <!-- 未登录提示结束 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 轮播图链接：
      bannerImgUrls: [
        {
          image_url:
            "https://ghttdata.hitwh.cc/data/attachment/forum/201907/08/151218k9m51mm5f61mk5v9.png",
          type: 0
        }
      ],
      // 通知列表
      noticeList: null,
      // 每次显示的通知条数
      number: 1,

      // 用户是否登录标志
      isLogin: false,

      // 是否显示今日课表
      showTimeTable: true,

      // 教务系统是否绑定
      eduSysBind: false,
      // 一卡通系统是否绑定
      campuscardBind: false,

      // 本周周次
      week: "*",
      // 星期几
      day2text: "*",
      // 今日课表数组
      todayCurriculum: null,
      // 课程背景色
      backgroundcolor: [
        "background: linear-gradient(to right, #0081ff , #1cbbb4);",
        "background: linear-gradient(to right, #39b54a , #8dc63f);",
        "background: linear-gradient(to right, #f43f3b , #ec008c);",
        "background: linear-gradient(to right, #ff9700 , #ed1c24);",
        "background: linear-gradient(to right, #9000ff , #5e00ff);",
        "background: linear-gradient(to right, #ec008c , #6739b6);"
      ],

      // 是否显示一卡通
      showCampusCard: true,

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
    getBanner() {
      let that = this;
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
        that.date = year + "-" + month + "-" + day;
      });
    },

    /**
     * 跳转到banner详情页
     */
    toBannerDetail(event) {
      let that = this;
      let banner = event.mp.currentTarget.dataset.para;
      // console.log(banner);
      switch (banner.type) {
        // 判断banner类型
        case 0:
          // 纯图片，不跳转
          break;
        case 9:
          // 跳转到其他小程序（微信）
          wx.navigateToMiniProgram({
            appId: banner.detail_id,
            path: "",
            extraData: {},
            success(res) {
              // 打开成功
              // console.log('111');
            },
            fail(res) {
              // 打开失败
              wx.showToast({
                title: '跳转失败', //提示的内容,
                icon: 'none',
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
            }
          });
          break;
      }
      return false;
    },

    /**
     * 获取通知公告列表
     */
    getNoticeList() {
      let that = this;
      that.$wxAPI
        .request(that.$url.getNoticeListUrl, {}, "POST")
        .then(success => {
          // console.log(typeof success.data.count)
          if (success.data.count > 1) {
            if (that.number != 2) {
              that.number = 2;
            }
            that.noticeList = success.data.noticeList;
          } else {
            if (that.number != 1) {
              that.number = 1;
            }
            that.noticeList = success.data.noticeList;
            // that.$set(that.number , 1);
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
        case "新闻":
          wx.navigateTo({
            url:
              "/pages/tools/news/detail/main?column=1024&id=" +
              notice.id +
              "&date=" +
              notice.date
          });
      }
      return false;
    },

    /**
     * 判断是否登录
     */
    checkLogin() {
      let that = this;
      let user_status;
      let status;
      user_status = wx.getStorageSync("session3rd");
      if (user_status) {
        // 登录过，暂认为登录态有效
        status = 0;
        that.isLogin = true;
      } else {
        // 没登录过
        status = 10;
        that.isLogin = false;
      }
      return status;
    },

    /**
     * 登录
     */
    async onclickLogin() {
      let that = this;
      that.$wxAPI.toLoginPage();
    },

    /**
     * 加载登录可见的各个模块
     */
    async loadMoudel() {
      let that = this;
      let TT_errcode = 0;
      let TE_errcode = 0;
      let params;
      if (that.isLogin) {
        // 是否显示课表模块
        let timeTableMoudel = await that.isShowTimeTable();
        switch (timeTableMoudel) {
          case true:
            // 显示课表模块
            // 获取今日课表
            TT_errcode = await that.getTodayTable();
            break;
          case false:
            // 隐藏课表模块
            break;
        }

        // 是否显示一卡通模块
        // let campusCardMoudel = await that.isShowCampusCard();
        let campusCardMoudel = false;
        switch (campusCardMoudel) {
          case true:
            // 显示一卡通模块
            // 获取消费信息
            TE_errcode = await that.getTodayExpenses();
            break;
          case false:
            break;
        }
        // 判断各模块加载状态
        if (TT_errcode == 10 || TE_errcode == 10) {
          // 登录过期
          params = {
            content: "登录过期，是否重新登录?"
          };
          that.$wxAPI.showModal(params).then(success => {
            if (success.confirm) {
              that.$wxAPI.toLoginPage();
            } else if (success.cancel) {
              // 用户点击取消
              that.isLogin = false;
              wx.removeStorageSync("session3rd");
            }
          });
        }
      }
    },

    /**
     * 判断是否显示今日课表
     */
    isShowTimeTable() {
      let that = this;
      let flag;
      let status = wx.getStorageSync("showTimeTable");
      switch (status) {
        case "true":
          that.showTimeTable = true;
          flag = true;
          break;
        case "false":
          that.showTimeTable = false;
          flag = false;
          break;
        default:
          that.showTimeTable = true;
          flag = true;
      }
      return flag;
    },

    /**
     * 判断是否绑定教务系统
     */
    isBindEduSys() {
      let that = this;
      let flag;
      let edubind = wx.getStorageSync("edubind");
      switch (edubind) {
        case "unbind":
          if (that.eduSysBind == true) {
            that.eduSysBind = false;
          }
          flag = false;
          break;
        case "bind":
          if (that.eduSysBind == false) {
            that.eduSysBind = true;
          }
          flag = true;
          break;
      }
      return flag;
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
    async getTodayTable() {
      let that = this;
      let errcode;
      // 取出登录态标识
      let session3rd = wx.getStorageSync("session3rd");
      // 判断是否绑定教务系统
      let edubind = that.isBindEduSys();
      if (session3rd && edubind) {
        let data = {
          session3rd: session3rd
        };
        // 请求API
        await that.$wxAPI
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
                errcode = 0;
                break;
              case 10:
                // 登录过期，重新登录
                errcode = 10;
                break;
              default:
                errcode = success.data.errcode;
                wx.showModal({
                  title: "提示", //提示的标题,
                  content: success.data.errmsg, //提示的内容,
                  showCancel: true //是否显示取消按钮
                });
            }
          });
      } else {
        // 没登录或者没有绑定教务系统，不执行该操作
        errcode = 404;
      }
      return errcode;
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
     * 判断是否显示一卡通
     */
    isShowCampusCard() {
      let that = this;
      let flag;
      let status = wx.getStorageSync("showCampusCard");
      switch (status) {
        case "true":
          that.showCampusCard = true;
          flag = true;
          break;
        case "false":
          that.showCampusCard = false;
          flag = false;
          break;
        default:
          that.showCampusCard = true;
          flag = true;
      }
      return flag;
    },

    /**
     * 判断是否绑定一卡通系统
     */
    isBindCampuscard() {
      let that = this;
      let flag;
      let campuscardbind = wx.getStorageSync("campuscardbind");
      switch (campuscardbind) {
        case "unbind":
          if (that.campuscardBind == true) {
            that.campuscardBind = false;
          }
          flag = false;
          break;
        case "bind":
          if (that.campuscardBind == false) {
            that.campuscardBind = true;
          }
          flag = true;
          break;
      }
      return flag;
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
    async getTodayExpenses() {
      let that = this;
      let errcode;
      let session3rd = wx.getStorageSync("session3rd");
      // 是否绑定一卡通系统
      let campuscard_bind = that.isBindCampuscard();
      if (session3rd && campuscard_bind) {
        let data = {
          session3rd: session3rd
        };
        await that.$wxAPI
          .request(that.$url.todayExpensesUrl, data, "POST")
          .then(success => {
            // console.log(success.data);
            switch (success.data.errcode) {
              case 0:
                that.balance = success.data.balance;
                that.bills = success.data.bills;
                that.$forceUpdate();
                errcode = 0;
                break;
              case 10:
                // 登录过期，重新登录
                errcode = 10;
                break;
              default:
                errcode = success.data.errcode;
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
      } else {
        // 未登录或未绑定一卡通系统，不执行操作
        errcode = 404;
      }
      return errcode;
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
  async mounted() {
    let that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    // 获取轮播图
    that.getBanner();
    // 获取通知公告[]
    that.getNoticeList();

    wx.hideLoading();
  },
  async onShow() {
    let that = this;
    let user_status;
    let isLoadMoudel;
    // 检查是否登录
    user_status = that.checkLogin();
    if (user_status == 0) {
      // 用户已登录
      isLoadMoudel = wx.getStorageSync("loadIndexMoudel");
      if (isLoadMoudel == "true") {
        wx.removeStorage({
          key: "loadIndexMoudel",
          success: res => {
            // console.log('remove succsee');
          }
        });
        wx.showLoading({
          title: "加载中", //提示的内容,
          mask: true //显示透明蒙层，防止触摸穿透
        });
        await that.loadMoudel();
      }
    }
    wx.hideLoading();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    let that = this;
    let user_status;
    // 获取通知公告列表
    that.getNoticeList();
    // 检查是否登录
    user_status = await that.checkLogin();
    if (user_status == 0) {
      // 加载各登录可见模块
      await that.loadMoudel();
      wx.showToast({
        title: "刷新成功", //提示的内容,
        icon: "success", //图标,
        duration: 2000, //延迟时间,
        mask: true //显示透明蒙层，防止触摸穿透
      });
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
};
</script>

<style>
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
  border-bottom: #e5e5e5 solid 1rpx;
}
/* 分割线样式结束 */

/* notice样式开始 */
.weui-media-box {
  padding: 15px;
  position: relative;
}
.weui-media-box:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1rpx solid #e5e5e5;
  color: #e5e5e5;
  left: 15px;
}
.weui-media-box:first-child:before {
  display: none;
}
.weui-media-box__desc {
  margin: 10rpx;
  width: 600rpx;
  color: black;
  font-size: 14px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.weui-media-box_appmsg {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.weui-media-box__thumb {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.weui-media-box__hd_in-appmsg {
  margin-right: 0.8em;
  width: 70rpx;
  height: 70rpx;
  margin-right: 0.5em;
  line-height: 60px;
  text-align: center;
}
.weui-media-box__bd_in-appmsg {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  min-width: 0;
}
.weui-cell_active {
  background-color: #ececec;
}

.applet_notice {
  background: rgba(255, 255, 255, 1);
  width: 100%;
  height: auto;
}
.weui-media-box {
  padding: 10rpx 30rpx;
}

.applet_notice_swiper {
  height: 100rpx;
}
/* notice样式结束 */

.weui-cell {
  padding: 10px 15px;
  padding: 20rpx 30rpx 10rpx 30rpx;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.weui-cell_access {
  color: inherit;
}
.weui-cell__bd {
  font-size: 32rpx;
  font-weight: 600;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.weui-cell__ft {
  text-align: right;
  color: #999;
}
.weui-cell__ft_in-access {
  padding-right: 16px;
  position: relative;
}
.weui-cell__ft_in-access:after {
  content: " ";
  display: inline-block;
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  position: relative;
  top: -2px;
  position: absolute;
  top: 50%;
  margin-top: -4px;
  right: 2px;
}
.weui-loadmore {
  width: 65%;
  margin: 1.5em auto;
  line-height: 1.6em;
  font-size: 14px;
  text-align: center;
}
.weui-loadmore__tips {
  display: inline-block;
  vertical-align: middle;
}
.weui-loadmore_line {
  border-top: 1px solid #e5e5e5;
  margin-top: 2.4em;
}
.weui-loadmore__tips_in-line {
  position: relative;
  top: -0.9em;
  padding: 0 0.55em;
  background-color: #fff;
  color: #999;
}

/* 今日课表样式开始 */
.applet_panel_card {
  background: rgba(255, 255, 255, 1);
  width: 100%;
  /* padding-bottom: 20rpx; */
}
.applet_cell_link {
  color: black;
  font-size: 28rpx;
}

.applet_curriculm_list {
  padding: 0rpx 30rpx 10rpx 30rpx;
  white-space: nowrap;
  overflow-x: hidden;
  display: flex;
}
.applet_curriculm_item {
  /* width: 200rpx; */
  width: 276rpx;
  /* min-height: 100rpx; */
  margin: 0 24rpx 0 0;
  border-radius: 10rpx;
  /* background: linear-gradient(to right, rgb(112, 230, 255), rgb(166, 218, 245)); */
  background: linear-gradient(to right, #0081ff, #1cbbb4);
  color: white;
  text-align: left;
  display: inline-block;
  padding: 10rpx 20rpx;
  padding-right: 5rpx;
  overflow: hidden;
}

.applet_curriculm_none {
  width: auto;
  padding-right: 20rpx;
}

.applet_curriculm_item_name {
  font-size: 32rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  background-size: 100%;
  background-image: url(https://image.weilanwl.com/color2.0/cardBg.png);
  background-repeat: no-repeat;
  background-color: #1296db;
  /* background-color: linear-gradient(to right, rgb(45, 150, 242), rgb(115, 229, 254)); */
  /* background: linear-gradient(to right, #0081ff , #1cbbb4); */
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
  margin-top: 80rpx;
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
  bottom: 30rpx;
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
  width: 78%;
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
</style>


