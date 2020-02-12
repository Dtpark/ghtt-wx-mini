<template>
  <div class="page">
    <!-- 周次选择开始 -->
    <!-- <div class="applet_curriculum_week_select">
      <picker @change="bindWeekChange" :value="week" :range="weeklist">
        <div class="applet_curriculum_picker">
          第{{ weeklist[week] }}周
            <text class="cuIcon-unfold text-black"></text>
        </div>
      </picker>
    </div>-->
    <!-- 周次选择结束 -->
    <!-- 头部开始 -->
    <div class="bg-white solid-top solid-bottom">
      <div class="flex align-center">
        <div class="flex-sub"></div>
        <div class="flex-sub">
          <div class="applet_curriculum_week_select flex align-center">
            <picker @change="bindWeekChange" :value="week" :range="weeklist">
              <div class="applet_curriculum_picker">
                第{{ weeklist[week] }}周
                <text class="cuIcon-unfold text-black"></text>
              </div>
            </picker>
          </div>
        </div>
        <div class="flex-sub padding-right applet_timetable_hd_right">
          <span @click="add" class="cuIcon-add text-black lg"></span>
        </div>
      </div>
    </div>
    <!-- 头部结束 -->
    <!-- 课表开始 -->
    <div>
      <!-- 顶部星期条开始 -->
      <div class="top margin-top-sm">
        <div
          v-for="(item, index) in ['一','二','三','四','五','六','日']"
          :key="index"
          class="top-text"
        >周{{item}}</div>
      </div>
      <!-- 顶部星期条结束 -->

      <!-- 课表滚动区域开始 -->
      <scroll-view scroll-y="true" class="scroll" :style="{height:(winHeight*2-90-56-20)/2+'px'}">
        <div :style="{height:currHeight*6+'px',width:'730rpx',display:'flex'}">
          <!-- 侧边节次号开始 -->
          <div class="sidebar">
            <div
              v-for="(item, index) in [1,2,3,4,5,6]"
              :key="index"
              class="left"
              :style="{height:currHeight+'px'}"
            >{{ item }}</div>
          </div>
          <!-- 侧边节次号结束 -->
          <!-- 按节次分割线开始 -->
          <div v-for="(item, index) in [1,2,3,4,5,6]" :key="index">
            <div
              :style="{width:'650rpx',height:'1px', top: (index+1)*currHeight+'px', position: 'absolute', borderBottom: (index == 1 || index == 3)?('red solid 1px'):('lightgray solid 1px')}"
            ></div>
          </div>
          <!-- 按节次分割线结束 -->

          <!--课表开始-->
          <div v-for="(item, index) in wlist" :key="index">
            <div
              class="flex-item kcb-item"
              @click="showCourseDetail"
              :data-kch="item.kch"
              :data-name="item.name"
              :data-room="item.room"
              :data-time="item.time"
              :data-day="item.day"
              :data-kcsx="item.kcsx"
              :data-kslx="item.kslx"
              :data-type="item.type"
              data-statu="open"
              :style="{marginLeft:(item.day-1)*96.5+'rpx', marginTop: (item.time-1)*currHeight+3 +'px', height:currHeight-5+'px',backgroundColor:kch2color[item.kch]}"
            >
              <div class="smalltext">{{ item.name }}@{{ item.room }}</div>
            </div>
          </div>
          <!-- 课表结束 -->
        </div>
      </scroll-view>
      <!-- 课表滚动区域结束 -->
    </div>
    <!-- 课表结束 -->

    <!-- 模态框——课程详情开始 -->
    <div class="cu-modal" :class="{show:isShowModal}">
      <div class="cu-dialog">
        <div class="cu-bar bg-white justify-end">
          <div class="content">课程信息</div>
          <div class="action" @click="hideModal">
            <text class="cuIcon-close text-red"></text>
          </div>
        </div>
        <div class="padding-xl">
          <div class="cu-form-group margin-top">
            <div class="title">课程名称</div>
            <div>{{ courseInfo.name }}</div>
          </div>
          <div class="cu-form-group">
            <div class="title">上课时间</div>
            <div>第{{ courseInfo.week }}周，星期{{ courseInfo.day }},第{{ courseInfo.time }}大节</div>
          </div>
          <div class="cu-form-group">
            <div class="title">上课地点</div>
            <div>{{ courseInfo.room }}</div>
          </div>
          <div class="cu-form-group">
            <div class="title">类型</div>
            <div>{{ courseInfo.kcsx }}</div>
          </div>
          <div class="cu-form-group">
            <div class="title">考试类型</div>
            <div>{{ courseInfo.kslx }}</div>
          </div>
        </div>
        <div class="cu-bar bg-white justify-end">
          <div class="action">
            <button
              class="cu-btn line-red text-red"
              :style="{display:courseInfo.hideDel?'none':''}"
              @click="del"
              :data-kch="courseInfo.kch"
            >删除</button>
            <button class="cu-btn bg-green margin-left" @click="hideModal">确定</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 模态框——课程详情结束 -->
    <!-- 未安排周次的课程开始 -->
    <!-- <div class="applet_lack_week_class">
      <p>未安排周次的课程</p>
      <div class="table">
        <div class="tr">
          <div class="th th1">课程名</div>
          <div class="th th2">地点</div>
          <div class="th th3">时间</div>
          <div class="th th4">周次</div>
        </div>
        <div class="tr" v-for="(item, index) in lack_of_week" :key="index">
          <div class="td td1">{{ item.name }}</div>
          <div class="td td2">{{ item.room }}</div>
          <div class="td td3">星期{{ item.day }} 第{{ item.time }}大节</div>
          <div v-if="item.week" class="td td4">{{ item.week }}周上</div>
          <div v-else class="td td4">暂未安排</div>
        </div>
      </div>
    </div>-->
    <!-- 未安排周次的课程结束 -->
    <!-- 刷新按钮开始 -->
    <div class="applet_refresh_box" @click="refresh">
      <img class="applet_refresh_img" src="/static/images/refresh.png" />
    </div>
    <!-- 刷新按钮结束 -->
    <!-- 返回首页开始 -->
    <goHome></goHome>
    <!-- 返回首页结束 -->
  </div>
</template>
<script>
import goHome from "@/components/goHome";
// import frames from "@/components/frames";
// import navigationBar from "@/components/navigationBar";

export default {
  components: {
    goHome
  },
  data() {
    return {
      // 设备高度
      winHeight: null,
      // 每大节课的高度
      currHeight: null,

      // 课程列表
      wlist: null,
      // 待选择的周次
      weeklist: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27
      ],
      // 第几周
      week: null,
      // 课程号颜色
      kch2color: null,
      // 未安排周次的课程
      lack_of_week: null,
      // 本周
      thisWeek: null,
      // 模态框显示
      isShowModal: false,
      // 课程详情
      courseInfo: {}
    };
  },
  methods: {
    /**
     * 判断是否绑定教务系统
     */
    isBind() {
      let that = this;
      let status = wx.getStorageSync("edubind");
      return status;
    },
    /**
     * 获取周次课表信息
     * type = 0 为加载课表缓存， 为 1 为更新缓存
     */
    async getWeekTimeTable(week = "", type = 0) {
      let that = this;
      let res = {
        errcode: null,
        errmsg: ""
      };
      let session3rd = wx.getStorageSync("session3rd");
      let data = {
        session3rd: session3rd,
        type: type,
        week: week
      };
      await that.$wxAPI
        .request(that.$url.weekCurriculumUrl, data, "POST")
        .then(success => {
          res.errcode = success.data.errcode;
          res.errmsg = success.data.errmsg + "";
          if (res.errcode == 0) {
            // 获取成功
            that.wlist = success.data.wlist;
            that.week = success.data.week;
            that.thisWeek = success.data.today.week;
            that.kch2color = success.data.kch2color;
            that.lack_of_week = success.data.lack_of_week;
          }
        });
      return res;
    },

    /**
     * 周次切换
     */
    bindWeekChange(e) {
      // console.log(e.detail.value);
      let that = this;
      that.getWeekTimeTable(e.mp.detail.value);
    },
    /**
     * 添加自定义课程
     */
    add() {
      wx.navigateTo({ url: "/pages/curriculum/add/main" });
    },
    /**
     * 显示课程详情
     */
    showCourseDetail(e) {
      let that = this;
      let kch = e.mp.currentTarget.dataset.kch;
      let name = e.mp.currentTarget.dataset.name;
      let room = e.mp.currentTarget.dataset.room;
      let time = e.mp.currentTarget.dataset.time;
      let day = e.mp.currentTarget.dataset.day;
      let kcsx = e.mp.currentTarget.dataset.kcsx
        ? e.mp.currentTarget.dataset.kcsx
        : "未知";
      let kslx = e.mp.currentTarget.dataset.kslx
        ? e.mp.currentTarget.dataset.kslx
        : "未知";
      let hideDel = e.mp.currentTarget.dataset.type ? false : true;
      let courseInfo = {
        name: name,
        week: that.week,
        day: day,
        time: time,
        room: room,
        kcsx: kcsx,
        kslx: kslx,
        kch: kch,
        hideDel: hideDel
      };
      that.courseInfo = courseInfo;
      that.isShowModal = true;
    },
    /**
     * 删除自定义课程
     */
    del(e) {
      let that = this;
      wx.showModal({
        title: "提示", //提示的标题,
        content: "确定删除该自定义课程？", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#000000", //取消按钮的文字颜色,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            // console.log('用户点击确定')
            let kch = e.mp.currentTarget.dataset.kch;
            let session3rd = wx.getStorageSync("session3rd");
            let data = {
              session3rd: session3rd,
              kch: kch
            };
            that.$wxAPI
              .request(that.$url.delCurriculumUrl, data, "POST")
              .then(success => {
                if (success.data.errcode == 0) {
                  wx.showToast({
                    title: "删除成功", //提示的内容,
                    icon: "success", //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {
                      that.isShowModal = false;
                      that.getWeekTimeTable(that.week);
                    }
                  });
                } else if (success.data.errcode == 10) {
                  that.$wxAPI.isLoginModal();
                } else {
                  wx.showModal({
                    title: "提示", //提示的标题,
                    content: success.data.errmsg, //提示的内容,
                    showCancel: false, //是否显示取消按钮,
                    confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: "#3CC51F", //确定按钮的文字颜色,
                    success: res => {
                      if (res.confirm) {
                        // console.log('用户点击确定')
                      }
                    }
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
     * 隐藏模态框
     */
    hideModal() {
      let that = this;
      that.isShowModal = false;
    },

    /**
     * 刷新页面
     */
    async refresh() {
      let that = this;
      let params;
      let res = await that.getWeekTimeTable(that.week, 1);
      if (res.errcode == 0) {
        // 获取成功，弹窗显示成功
        wx.showToast({
          title: "更新成功", //提示的内容,
          icon: "success", //图标,
          duration: 2000, //延迟时间,
          mask: true //显示透明蒙层，防止触摸穿透
        });
      } else if (res.errcode == 10) {
        // 登录过期，重新登录
        that.$wxAPI.isLoginModal("登录过期", false);
      } else {
        // 其他错误
        params = {
          title: "注意",
          content: res.errmsg,
          showCancel: false
        };
        that.$wxAPI.showModal(params);
      }
    }
  },
  /**
   * 生命周期函数
   */
  mounted() {
    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        // 获取设备屏幕高度（px）
        that.winHeight = res.windowHeight;
        // 设置每大节的高度(px)
        that.currHeight = (res.windowHeight * 2 - 55 - 60) / 4 / 2;
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    let that = this;
    let bind;
    let loadTimeTable;
    let params;
    let res = {
      errcode: null,
      errmsg: ""
    };
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });

    // 判断是否绑定教务系统
    bind = that.isBind();

    if (bind == "bind") {
      // 用户已经绑定了教务系统
      // 若本地无课程信息 或 新增加了自定义课程 则获取课程信息
      loadTimeTable = wx.getStorageSync("loadTimeTable");
      if (that.wlist == null || loadTimeTable == "true") {
        if (loadTimeTable == "true") {
          wx.setStorage({
            key: "loadTimeTable",
            data: "false"
          });
        }
        res = await that.getWeekTimeTable();
        if (res.errcode == 0) {
          // 获取成功，不进行任何操作
        } else if (res.errcode == 10) {
          // 登录态过期，需要重新登录
          // 弹窗提示
          that.$wxAPI.isLoginModal();
        } else {
          // 其他错误
          params = {
            title: "注意",
            content: res.errmsg,
            showCancel: false
          };
          that.$wxAPI.showModal(params).then(success => {
            if (success.confirm) {
              // 用户点击确认,返回上一页
              wx.navigateBack({
                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
              });
            }
          });
        }
      }
    } else if (bind == "unbind") {
      // 用户未绑定教务系统
      params = {
        title: "提示", //提示的标题,
        content: "您尚未绑定教务系统是否进行绑定？" //提示的内容,
      };
      that.$wxAPI.showModal(params).then(res => {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.navigateTo({ url: "/pages/edusys/main" });
        } else if (res.cancel) {
          // console.log('用户点击取消')
          wx.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }
      });
    } else {
      // 用户未登录
      // 弹窗提示
      that.$wxAPI.isLoginModal("尚未登录");
    }

    wx.hideLoading();
  },
  /**
   * 下拉刷新
   */
  async onPullDownRefresh() {
    let that = this;
    that.refresh();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>
<style lang='wxss'>
page {
  background: white;
}
.page {
  width: 100%;
}
/* 头部样式开始 */
.applet_timetable_hd_right {
  text-align: right;
  font-size: 50rpx;
  font-weight: 600;
}
/* 头部样式结束 */

/* 周次选择器样式开始 */
.applet_curriculum_week_select {
  /* margin: 10rpx auto; */
  /* width: 200rpx; */
  width: 100%;
  height: 90rpx;
  overflow: hidden;
  background: white;
  /* border: black solid 1px; */
  /* border-radius: 10rpx; */
  text-align: center;
  /* display: inline-block; */
}
.applet_curriculum_week_select > picker {
  width: 100%;
  /* height: 100rpx; */
}
.applet_curriculum_picker {
  width: 100%;
  height: auto;
  text-align: center;
  font-size: 34rpx;
  display: inline-block;
}
/* 周次选择器样式结束 */

/* 课表样式开始 */
.flex-item {
  width: 95rpx;
  height: 200rpx;
}

.kcb-item {
  position: absolute;
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 10rpx;
}

.smalltext {
  font-size: 8pt;
  color: #fff;
  padding-left: 2px;
}

.top {
  display: flex;
  flex-direction: row;
  margin-left: 78rpx;
  background-color: #fff;
  color: rgb(136, 136, 136);
  border-bottom: lightgray solid 1rpx;
  padding-bottom: 20rpx;
}

.top-text {
  width: 96rpx;
  height: 35rpx;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  display: flex;
  align-items: center;
}

.scroll {
  /* background-color: rgba(255, 255, 255, 1); */
  /* height: 400px; */
  /* z-index: 101; */
  position: relative;
}

.sidebar {
  width: 78rpx;
  display: inline-block;
  background-color: rgb(247, 247, 247);
  color: rgb(164, 164, 164);
}

.left {
  width: 78rpx;
  /* height: 200rpx; */
  font-size: 9pt;
  justify-content: center;
  display: flex;
  align-items: center;
}
/* 课表样式结束 */

/* 未安排周次的课程样式开始 */
.applet_lack_week_class {
  margin: 30rpx auto;
  /* width: 600rpx;   */
  padding: 20rpx 30rpx;
  background-color: rgb(247, 247, 247);
  /* border: black solid 2rpx; */
  /* border-radius: 10rpx; */
}
.applet_lack_week_class > p {
  width: 50%;
  margin: 10rpx auto;
}

/* 表格代码   */
.table {
  border: 1px solid #dadada;
  border-right: 0;
  border-bottom: 0;
  width: 98%;
  margin-left: 1%;
}
.tr {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.th,
.td {
  padding: 10px;
  border-bottom: 1px solid #dadada;
  border-right: 1px solid #dadada;
  text-align: center;
  width: 100%;
}
/* .th1,.th2,.td1,.td2{
    width: 40%;
  } */
.th2,
.th4,
.td2,
.td4 {
  width: 40%;
}

.th {
  font-weight: 800;
  /* background-color: #d6f1ff; */
  font-size: 26rpx;
  /* color: #1296db; */
}
.td {
  font-size: 24rpx;
  color: black;
}

.list_tips {
  background-color: rgba(100, 255, 255, 0.6);
  width: 90%;
  margin-top: 30rpx;
  margin-left: 5%;
  /* margin-right: 5%; */
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  /* padding: 30rpx; */
}

/* 未安排周次的课程样式结束 */

/* 刷新按钮样式开始 */
.applet_refresh_box {
  z-index: 100;
  position: fixed;
  right: 50rpx;
  bottom: 290rpx;
  width: 88rpx;
  height: 88rpx;
}

.applet_refresh_img {
  background-color: #1296db;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  opacity: 0.8;
}
/* 刷新按钮样式结束 */
</style>


