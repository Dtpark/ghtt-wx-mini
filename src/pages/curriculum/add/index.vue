<template>
  <div class="page">
    <form @submit="add">
      <div class="cu-form-group margin-top">
        <div class="title">课程名称</div>
        <input name="name" placeholder="请输入课程名称">
      </div>
      <!-- <div class="cu-form-group">
        <div class="title">授课教师</div>
        <input name="teacher" placeholder="请输入授课教师姓名">
      </div>-->
      <div class="cu-form-group margin-top">
        <div class="title">上课周次</div>
        <picker
          mode="multiSelector"
          @change="weekChange"
          @columnchange="weekColChange"
          :value="weekIndex"
          :range="weekList"
        >
          <div
            class="picker"
          >{{weekList[0][weekIndex[0]]}},第{{ weekList[1][weekIndex[1]] }}周-第{{ weekList[2][weekIndex[2]] }}周</div>
        </picker>
      </div>
      <div class="cu-form-group">
        <div class="title">上课节次</div>
        <picker @change="timeChange" :value="timeIndex" :range="timeList">
          <div class="picker">第{{timeList[timeIndex]}}大节</div>
        </picker>
      </div>
      <div class="cu-form-group margin-top">
        <div class="title">上课地点</div>
        <input name="room" placeholder="请输入上课地点">
      </div>
      <div class="padding">
        <button class="cu-btn block bg-blue margin-tb-sm lg" form-type="submit" type>添加</button>
      </div>
    </form>
    <div class="tips">
      <p>提示:</p>
      <p>自定义添加课程若与原课程冲突，则原课程会被覆盖显示；</p>
    </div>
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
      // 周次选择器列表
      weekList: [
        ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        [
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
          23
        ],
        [
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
          23
        ]
      ],
      // 周次选择器下标
      weekIndex: [0, 0, 0],
      // 节次选择器列表
      timeList: [1, 2, 3, 4, 5, 6],
      // 节次选择器下标
      timeIndex: 0
    };
  },
  methods: {
    /**
     * 监听周次选择器
     */
    weekChange(e) {
      let that = this;
      //   console.log(e.mp.detail.value);
      if (parseInt(e.mp.detail.value[1]) > parseInt(e.mp.detail.value[2])) {
        // 后面的周比前面的周小
        wx.showModal({
          title: "提示", //提示的标题,
          content: "周次选择时候前者必须小于等于后者", //提示的内容,
          showCancel: false, //是否显示取消按钮,
          confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
          success: res => {
            if (res.confirm) {
              //   console.log('用户点击确定')
            }
          }
        });
      } else {
        // 格式正确，刷新列表数据
        that.weekIndex = e.mp.detail.value;
      }
    },
    /**
     * 监听节次选择器
     */
    timeChange(e) {
      let that = this;
      //   console.log(e.mp.detail.value);
      that.timeIndex = e.mp.detail.value;
    },
    /**
     * 添加课程
     */
    async add(e) {
      let that = this;
      // console.log(e.mp.detail.value);

      if (e.mp.detail.value.name == "" || e.mp.detail.value.room == "") {
        wx.showToast({
          title: "课程名称或上课地点不能为空", //提示的内容,
          icon: "none", //图标,
          duration: 2000, //延迟时间,
          mask: true //显示透明蒙层，防止触摸穿透
        });
      } else {
        wx.showModal({
          title: "提示", //提示的标题,
          content: "确定添加该课程？", //提示的内容,
          showCancel: true, //是否显示取消按钮,
          cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
          cancelColor: "#000000", //取消按钮的文字颜色,
          confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: "#3CC51F", //确定按钮的文字颜色,
          success: res => {
            if (res.confirm) {
              // console.log('用户点击确定')
              that.$login
                .isLogin()
                .then(() => {
                  let session3rd = wx.getStorageSync("session3rd");
                  let data = {
                    session3rd: session3rd,
                    name: e.mp.detail.value.name,
                    week: that.weekIndex,
                    time: that.timeIndex,
                    room: e.mp.detail.value.room
                  };
                  wx.showLoading({
                    title: "加载中", //提示的内容,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                  });
                  that.$wxAPI
                    .request(that.$url.addCurriculumUrl, data, "POST")
                    .then(success => {
                      // console.log(success.data);
                      if (success.data.errcode == 0) {
                        // 添加成功
                        wx.hideLoading();
                        wx.showToast({
                          title: "添加成功", //提示的内容,
                          icon: "success", //图标,
                          duration: 2000, //延迟时间,
                          mask: true, //显示透明蒙层，防止触摸穿透,
                          complete: res => {}
                        });
                        wx.navigateBack({
                          delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                        });
                      } else {
                        wx.hideLoading();
                        wx.showModal({
                          title: "提示", //提示的标题,
                          content: success.data.errmsg, //提示的内容,
                          showCancel: false, //是否显示取消按钮,
                          confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
                          confirmColor: "#3CC51F", //确定按钮的文字颜色,
                          success: res => {
                            if (res.confirm) {
                              //   console.log('用户点击确定')
                            } else if (res.cancel) {
                              //   console.log('用户点击取消')
                            }
                          }
                        });
                      }
                    });
                })
                .catch(e => {
                  console.log(e);
                });
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        });
      }
    }
  }
};
</script>
<style>
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
</style>


