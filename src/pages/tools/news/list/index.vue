<template>
  <div class="page">
    <!-- 类型选择开始 -->
    <scroll-view
      scroll-x
      class="bg-white nav fixed"
      scroll-with-animation
      :scroll-left="scrollLeft"
    >
      <div
        class="cu-item"
        :class=" index==TabCur ? 'text-blue cur' : ''"
        v-for="(item, index) in newsType"
        :key="index"
        @click="tabSelect"
        :data-id="index"
      >{{ item }}</div>
    </scroll-view>
    <!-- 类型选择结束 -->

    <!-- 新闻列表开始 -->
    <div class="cu-list menu card-menu applet_news_list">
      <div
        @click="toDetail"
        :data-para="item"
        v-for="(item, index) in newsList"
        :key="index"
        class="cu-item"
      >
        <div class="content applet_newslist_title">
          <text class="text-grey">{{ item.title }}</text>
        </div>
        <div class="action">
          <text class="text-grey text-sm">{{ item.date }}</text>
        </div>
      </div>
    </div>
    <!-- 新闻列表结束 -->

    <!-- 页面选择开始 -->
    <div class="applet_page_select flex justify-center">
      <div class="flex bg-white padding-sm margin radius">
        <div @click="lastPage" class="applet_lastpage margin-right">
          <text class="cuIcon-back" :class="page_index == 1 ? 'text-gray' : 'text-black'"></text>
        </div>
        <div class="applet_currpage">
          <picker
            @change="changePage"
            :value="page_index-1"
            :range="pageList"
          >第{{ pageList[page_index-1] }}/{{ all_pages }}页</picker>
        </div>
        <div @click="nextPage" class="applet_next_page margin-left">
          <text class="cuIcon-right" :class="page_index == all_pages ? 'text-gray' : 'text-black'"></text>
        </div>
      </div>
    </div>
    <!-- 页面选择结束 -->
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
      // 新闻类别列表
      newsType: {
        "1023": "学校要闻",
        "1024": "通知公告",
        "1025": "院系通知",
        "1026": "校园动态",
        "1027": "教学广角",
        "1028": "学术科研",
        "1029": "学生工作",
        "1030": "对外交流",
        "1031": "管理服务",
        "1032": "招标信息",
        "1033": "人物风采",
        "1034": "近期活动",
        "1035": "校园指南"
      },
      scrollLeft: 0,
      // 类别下标
      TabCur: 1023,
      // 新闻列表
      newsList: [],
      // 当前页数
      page_index: 1,
      // 总条数
      all_count: 0,
      // 总页数
      all_pages: 0,
      // 页数列表
      pageList: [],
      // 每页条数
      per_page: 0
    };
  },
  methods: {
    /**
     *  切换tab
     */
    tabSelect(e) {
      let that = this;
      // console.log(e);
      that.TabCur = e.mp.currentTarget.dataset.id;
      that.scrollLeft = (e.mp.currentTarget.dataset.id - 1023) * 60;
      that.LoadNewsList(that.TabCur);
    },

    /**
     * 加载新闻列表
     */
    LoadNewsList(column = 1023, page = 1) {
      let that = this;
      let data = {
        column: column,
        page: page
      };
      wx.showLoading({
        title: "加载中", //提示的内容,
        mask: true //显示透明蒙层，防止触摸穿透
      });
      that.$wxAPI
        .request(that.$url.hitwhNewsUrl, data, "POST")
        .then(success => {
          that.newsList = success.data.news;
          that.page_index = success.data.page.curr_page;
          that.all_count = success.data.page.all_count;
          that.all_pages = success.data.page.all_pages;
          that.pageList = that.generateArray(
            1,
            parseInt(success.data.page.all_pages)
          );
          that.per_page = success.data.page.per_page;
          // 返回顶部
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 600
          });
          wx.hideLoading();
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 跳转到详情页
     */
    toDetail(event) {
      let that = this;
      let news = event.mp.currentTarget.dataset.para;
      wx.navigateTo({
        url:
          "/pages/tools/news/detail/main?id=" +
          news.id +
          "&date=" +
          news.date +
          "&column=" +
          that.TabCur
      });
    },
    /**
     * 上一页
     */
    lastPage() {
      let that = this;
      if (that.page_index > 1) {
        that.LoadNewsList(that.TabCur, parseInt(that.page_index) - 1);
      } else {
        wx.showToast({
          title: "已是首页", //提示的内容,
          icon: "none", //图标,
          duration: 2000, //延迟时间,
          mask: true //显示透明蒙层，防止触摸穿透
        });
      }
    },
    /**
     * 跳页
     */
    changePage(e) {
      let that = this;

      // console.log(e.mp);
      // return false;
      // that.page_index = e.mp.detail.value + 1;
      that.LoadNewsList(that.TabCur, parseInt(e.mp.detail.value) + 1);
    },
    /**
     * 下一页
     */
    nextPage() {
      let that = this;
      if (that.page_index < parseInt(that.all_pages)) {
        that.LoadNewsList(that.TabCur, parseInt(that.page_index) + 1);
      } else {
        wx.showToast({
          title: "已是末页", //提示的内容,
          icon: "none", //图标,
          duration: 2000, //延迟时间,
          mask: true //显示透明蒙层，防止触摸穿透
        });
      }
    },
    /**
     * 生成一个从 start 到 end 的连续数组
     * @param start
     * @param end
     */
    generateArray(start, end) {
      return Array.from(new Array(end + 1).keys()).slice(start);
    }
  },
  /**
   * 生命周期函数
   */
  mounted() {
    let that = this;
    let TabCur = that.TabCur;
    let page_index = that.page_index;
    if (that.newsList == "") {
      that.LoadNewsList(TabCur, page_index);
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 下拉刷新新闻列表
   */
  onPullDownRefresh() {
    let that = this;
    that.LoadNewsList(that.TabCur,that.page_index);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
};
</script>
<style>
.applet_news_list {
  margin-top: 120rpx;
}
.applet_newslist_title {
  /* width: 100rpx; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>


