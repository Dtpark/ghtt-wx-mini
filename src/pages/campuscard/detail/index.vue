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
    </div> -->
    <goHome ></goHome>
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
      var that = this;
      // that.setData({ currentTab: e.detail.current });
      that.currentTab = e.mp.detail.current;
    },
    //点击tab切换
    swichNav(e) {
      var that = this;
      if (that.currentTab === e.mp.target.dataset.current) {
        return false;
      } else {
        //   that.setData({
        //     currentTab: e.target.dataset.current
        //   })
        that.currentTab = e.mp.target.dataset.current;
      }
    }
  },
  onLoad: function() {
    let that = this;
    that.$login
      .isLogin()
      .then(() => {
        // 获取系统信息
        wx.getSystemInfo({
          success: function(res) {
            // that.setData({
            //   winWidth: res.windowWidth,
            //   winHeight: res.windowHeight
            // });
            that.winWidth = res.windowWidth;
            that.winHeight = res.windowHeight;
            // console.log(res);
          }
        });

        let session3rd = wx.getStorageSync("session3rd");
        let data = {
          session3rd: session3rd
        };
        that.$wxAPI
          .request(that.$url.expensesRecordUrl, data, "POST")
          .then(success => {
            // console.log(success.data);
            switch (success.data.errcode) {
              case 0:
                //   that.setData({
                //     user: success.data.data.user.data,
                //     billsMore: success.data.data.billsMore.data
                //   });
                that.user = success.data.data.user.data;
                that.billsMore = success.data.data.billsMore.data;
                break;
              case 10:
                that.$login.doLogin();
                break;
              default:
                wx.showModal({
                  title: "提示", //提示的标题,
                  content: success.data.errmsg, //提示的内容,
                  showCancel: false //是否显示取消按钮
                });
            }
          });
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>
<style scoped>
.swiper-tab{  
    width: 100%;
    border-bottom: 1px solid #777777;  
    text-align: center;  
    line-height: 40px;
    position: fixed;
    z-index: 1;
}  
.swiper-tab-list{  
    font-size: 14px;  
    display: inline-block;  
    width: 50%;  
    color: #777777;  
}  
.on{ 
    color: #53AFFD;  
    border-bottom: 2.5px solid #53AFFD;
}
.swiper-box{ 
    display: block;
    height: 100%; 
    width: 100%; 
    overflow: hidden; 
}  
.swiper-box view{  
    text-align: center;  
}  


.history-table-wrap{
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
  .table{
    /* border:1px solid #dadada; */
    /* border-right:0;
    border-bottom: 0; */
    border-top: 1px solid #dadada;
    border-left: 1px solid #dadada;
    width: 95%;
    margin: 20rpx 2.5%;
  }
  .tr{
    width:100%;
    display: flex;
    justify-content: space-between;
  }
  .th,.td{
    padding: 20rpx;
    border-bottom: 1px solid #dadada;
    border-right: 1px solid #dadada;
    text-align: center;
    width: 100%;
  }

  .th{
    /* font-weight: 800; */
    /* background-color: #d6f1ff; */
    font-size: 16px;
    /* color: #1296db; */
  }
  .td{
    font-size: 14px;
    color: gray;
  }
</style>


