<template>
  <div class="page">
    <!-- 周次选择开始 -->
    <div class="applet_curriculum_week_select">
      <picker @change="bindWeekChange" :value="week" :range="weeklist">
        <div class="applet_curriculum_picker">
          <div class="applet_curriculum_picker_left">第{{ weeklist[week] }}周</div>
          <img class="applet_curriculum_picker_right" src="/static/images/pulldown.png">
        </div>
      </picker>
    </div>
    <!-- 周次选择结束 -->

    <!-- 课表开始 -->
    <div>
      <!-- 顶部星期条开始 -->
      <div class="top">
        <div
          v-for="(item, index) in ['一','二','三','四','五','六','日']"
          :key="index"
          class="top-text"
        >周{{item}}</div>
      </div>
      <!-- 顶部星期条结束 -->

      <!-- 课表滚动区域开始 -->
      <scroll-view scroll-y="true" class="scroll">
        <div style="height:1200rpx;width:730rpx;display:flex;">
          <!-- 侧边节次号开始 -->
          <div class="sidebar">
            <div v-for="(item, index) in [1,2,3,4,5,6]" :key="index" class="left">{{ item }}</div>
          </div>
          <!-- 侧边节次号结束 -->
          <!-- 按节次分割线开始 -->
          <div v-for="(item, index) in [1,2,3,4,5,6]" :key="index">
            <div
              :style="{width:'750rpx',height:'1px', top: (index+1)*200+'rpx', position: 'absolute', borderBottom: (index == 1 || index == 3)?('red solid 1px'):('lightgray') +' solid 1px'}"
            ></div>
          </div>
          <!-- 按节次分割线结束 -->

          <!--课表开始-->
          <div v-for="(item, index) in wlist" :key="index">
            <div
              class="flex-item kcb-item"
              @click="showCarddiv"
              data-statu="open"
              :style="{marginLeft:(item.day-1)*96+'rpx', marginTop: (item.time-1)*200+5 +'rpx', height:'195rpx',backgroundColor:kch2color[item.kch]}"
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
    <!-- 未安排周次的课程开始 -->
    <div class="applet_lack_week_class">
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
    </div>
    <!-- 未安排周次的课程结束 -->
    <!-- 返回首页开始 -->
    <goHome></goHome>
    <!-- 返回首页结束 -->
  </div>
</template>
<script>
import goHome from "@/components/goHome";
export default {
  components:{
    goHome
  },
  data() {
    return {
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
        27,
        28,
        29,
        30
      ],
      // 第几周
      week: null,
      // 课程号颜色
      kch2color: null,
      // 未安排周次的课程
      lack_of_week: null,
      // 本周
      thisWeek: null
    };
  },
  methods: {
    /**
     * 获取周次课表信息
     */
    getWeekTimeTable(week = "") {
      let that = this;
      let session3rd = wx.getStorageSync("session3rd");
      let data = {
        session3rd: session3rd,
        week: week
      };
      that.$wxAPI
        .request(that.$url.weekCurriculumUrl, data, "POST")
        .then(success => {
          switch (success.data.errcode) {
            case 0:
              // that.setData({
              //   wlist: success.data.wlist,
              //   week: success.data.week,
              //   thisWeek: success.data.today.week,
              //   kch2color: success.data.kch2color,
              //   lack_of_week: success.data.lack_of_week
              // });
              that.wlist = success.data.wlist;
              that.week = success.data.week;
              that.thisWeek = success.data.today.week;
              that.kch2color = success.data.kch2color;
              that.lack_of_week = success.data.lack_of_week;
              break;
            case 10:
              // 登录过期，重新登录
              that.$login.doLogin();
              that.onShow();
              break;
            default:
              wx.showModal({
                title: "提示", //提示的标题,
                content: success.data.errmsg //提示的内容
              });
          }
        });
    },

    /**
     * 周次切换
     */
    bindWeekChange(e) {
      // console.log(e.detail.value);
      let that = this;
      that.getWeekTimeTable(e.mp.detail.value);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;
    wx.showLoading({
      title: '加载中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透
    });
    that.$login
      .isLogin()
      .then(res => {
        // console.log(res);
        that.getWeekTimeTable();
        wx.hideLoading();
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>
<style lang='wxss'>
page {
  background: white;
}
/* 周次选择器样式开始 */
.applet_curriculum_week_select {
  margin: 10rpx auto;
  width: 200rpx;
  height: 60rpx;
  overflow: hidden;
  background: white;
  border: black solid 1px;
  border-radius: 10rpx;
}
.applet_curriculum_week_select > picker {
  width: 100%;
  height: 50rpx;
}
.applet_curriculum_picker {
  width: 100%;
  height: auto;
  display: inline-block;
}
.applet_curriculum_picker_left {
  width: 70%;
  height: auto;
  float: left;
  text-align: center;
  font-size: 32rpx;
  /* line-height: 5rpx; */
}
.applet_curriculum_picker_right {
  width: 20%;
  height: 50rpx;
  float: left;
  text-align: center;
  vertical-align: middle;
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
  /* background-color: #d6f1ff; */
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
  /* background-color: rgba(255, 255, 255, 0.6); */
  height: 400px;
  z-index: 101;
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
  height: 200rpx;
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
</style>


