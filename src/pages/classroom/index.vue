<template>
  <div class="page">
    <!-- 时间选择器开始 -->
    <picker
      mode="multiSelector"
      @change="bindDatePickerChange"
      @columnchange="bindDatePickerColumnChange"
      :value="dateIndex"
      :range="dateList"
    >
      <view class="picker_box">
        <view class="item_list">选择时间</view>
        <!-- 周次 -->
        <view class="item_list">第{{ dateList[0][dateIndex[0]] }}周</view>
        <!-- 天 -->
        <view class="item_list">星期{{ dateList[1][dateIndex[1]] }}</view>
        <text class="cuIcon-unfold text-black"></text>
      </view>
    </picker>
    <!-- 时间选择器结束 -->

    <!-- 地点选择器开始 -->
    <picker
      mode="multiSelector"
      @change="bindRoomPickerChange"
      @columnchange="bindRoomPickerColumnChange"
      :value="roomIndex"
      :range="roomList"
    >
      <view class="picker_box">
        <view class="item_list">选择地点</view>
        <!-- 楼号 -->
        <view class="item_list">{{ roomList[0][roomIndex[0]] }}楼</view>
        <!-- 层 -->
        <view class="item_list">{{ roomList[1][roomIndex[1]] }}层</view>
        <text class="cuIcon-unfold text-black"></text>
      </view>
    </picker>
    <!-- 地点选择器结束 -->

    <!-- 表格开始 -->
    <div class="table">
      <div class="tr">
        <div class="th th1"></div>
        <div class="th th2">1</div>
        <div class="th th2">2</div>
        <div class="th th2">3</div>
        <div class="th th2">4</div>
        <div class="th th2">5</div>
        <div class="th th2">6</div>
      </div>
      <div
        class="tr"
        v-for="(item, index) in roomInfo[ roomList[0][roomIndex[0]] ][roomList[1][roomIndex[1]]]"
        :key="index"
      >
        <div class="td td1">{{index}}</div>
        <div class="td td2 unavailable" v-if="item[1]">x</div>
        <div class="td td2 available" v-else>√</div>
        <div class="td td2 unavailable" v-if="item[2]">x</div>
        <div class="td td2 available" v-else>√</div>
        <div class="td td2 unavailable" v-if="item[3]">x</div>
        <div class="td td2 available" v-else>√</div>
        <div class="td td2 unavailable" v-if="item[4]">x</div>
        <div class="td td2 available" v-else>√</div>
        <div class="td td2 unavailable" v-if="item[5]">x</div>
        <div class="td td2 available" v-else>√</div>
        <div class="td td2 unavailable" v-if="item[6]">x</div>
        <div class="td td2 available" v-else>√</div>
      </div>
    </div>
    <!-- 表格结束 -->

    <!-- 提示开始 -->
    <div class="tips">
      <div>
        <p>重要提示：</p>
        <p>①M楼4层所有教室本学期无课，因此未显示，其他教学楼本学期无课的教室也未显示。建议平常自习时尽量不要选择这些教室，避免打扰考研的同学;</p>
        <p>②以上数据根据[教务系统]课程信息，由程序自动计算得出，如有错误请反馈;</p>
        <p>③课程数据库更新于{{ lasttime }}。</p>
      </div>
    </div>
    <!-- 提示结束 -->

    <!-- 返回首页开始 -->
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
      // 时间选择列表
      dateList: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        ["一", "二", "三", "四", "五", "六", "日"]
      ],
      // 时间选择的下标
      dateIndex: [0, 0],

      // 地点选择列表
      roomList: [["G", "H", "M", "N"], [1, 2]],
      // 地点选择的下标
      roomIndex: [0, 0],

      // 课程列表
      roomInfo: {
        G: {}
      },
      // 选择的周次
      week: null,
      // 选择的日期
      day: null,

      // 数据缓存的日期
      lasttime: "*"
    };
  },
  methods: {
    /**
     * 时间选择器确定时发生的事件
     */
    bindDatePickerChange(e) {
      let that = this;
      // console.log(e.mp)
      // return false;
      let week = e.mp.detail.value[0] + 1;
      let day = e.mp.detail.value[1] + 1;
      // 待查询的周次和天
      let data = {
        week: week,
        day: day
      };
      wx.showLoading({
        title: "加载中", //提示的内容,
        mask: true //显示透明蒙层，防止触摸穿透
      });
      that.$wxAPI
        .request(that.$url.classroomUrl, data, "POST")
        .then(success => {
          // 将课程信息写入
          that.roomInfo = success.data.roominfo;
          that.dateIndex = [week - 1, day - 1];
          wx.hideLoading();
        })
        .catch(e => {
          console.log(e);
        });
    },

    bindDatePickerColumnChange() {},

    /**
     * 地点选择器点击确定发生的事件
     */
    bindRoomPickerChange(e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      // e.detail.value 与 arrIndex 格式相同
    },

    /**
     * 地点选择器每列改变时发生的事件
     */
    bindRoomPickerColumnChange(e) {
      let that = this;
      // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      const data = {
        roomList: that.roomList,
        roomIndex: that.roomIndex
      };
      data.roomIndex[e.mp.detail.column] = e.mp.detail.value;
      switch (e.mp.detail.column) {
        case 0:
          // 第1列（选择楼这列）发生改变，将第2列（楼层列）赋予该楼所对应的楼层
          switch (data.roomIndex[0]) {
            case 0:
              // G楼
              //   console.log("g");
              data.roomList[1] = [1, 2];
              break;
            case 1:
              // H楼
              data.roomList[1] = [3, 4, 5];
              break;
            case 2:
              // M楼
              data.roomList[1] = [1, 2, 3];
              break;
            case 3:
              // N楼
              data.roomList[1] = [1, 2, 3, 4];
              break;
          }
          data.roomIndex[1] = 0;
          break;
      }
      //   that.setData(data);
      // that.roomList=data.roomList;
      // that.roomIndex=data.roomIndex;
      that.$set(that.roomList, data.roomList);
      that.$set(that.roomIndex, data.roomIndex);
    }
  },
  /**
   * 生命周期函数
   */
  async mounted() {
    let that = this;
    // console.log(wxAPI.request(url.classroomUrl, '', 'POST'));
    if (that.lasttime == "*") {
      // 已经有数据就不请求了（不是实时数据故不必要每次都刷新）
      wx.showLoading({
        title: "加载中", //提示的内容,
        mask: true //显示透明蒙层，防止触摸穿透
      });
      await that.$wxAPI
        .request(that.$url.classroomUrl, "", "POST")
        .then(success => {
          that.dateIndex = [success.data.week - 1, success.data.day - 1];
          that.roomInfo = success.data.roominfo;
          that.week = success.data.week;
          that.day = success.data.day;
          that.lasttime = success.data.lasttime;
          wx.hideLoading();
        })
        .catch(e => {
          console.log(e);
        });
    } else {
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>
<style scoped>
.picker_box {
  width: 90%;
  height: 60rpx;
  margin-left: 5%;
  margin-top: 20rpx;
  text-align: center;
  border-top: 2rpx solid darkgray;
  border-bottom: 2rpx solid darkgray;
  border-radius: 15rpx;
  background: #fff;
  color: rgba(13, 120, 205, 0.8);
  display: inline-block;
  font-size: 32rpx;
  overflow: hidden;
}

.item_list {
  display: inline-block;
  width: 30%;
  height: 100%;
  border-right: 2rpx solid darkgray;
}

.picker_box view:nth-child(1) {
  background: rgba(13, 120, 205, 0.8);
  color: white;
}

.picker_box view:nth-child(3) {
  border: none;
}

.picker_box > image {
  width: 4%;
  height: 30rpx;
}

/* 表格代码   */
.table {
  border: 2rpx solid #dadada;
  border-right: 0;
  border-bottom: 0;
  width: 90%;
  margin-left: 5%;
  margin-top: 20rpx;
  background: #fff;
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
.th1,
.td1 {
  width: 40%;
}
.th2,
.td2 {
  width: 10%;
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

.available {
  background: rgb(92, 184, 92);
}

.unavailable {
  background: rgba(217, 83, 79, 0.75);
}

/*提示样式 */
.tips {
  width: 90%;
  margin-left: 5%;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  background: rgba(217, 237, 247, 1);
  color: rgb(49, 131, 185);
  font-size: 24rpx;
  padding: 2%;
  /* border: 2rpx solid blue; */
  border-radius: 20rpx;
}

.tips > text {
  width: 100%;
}
</style>

