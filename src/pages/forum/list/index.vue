<template>
  <div class="page">
    <div class="container">
      <div class="page-body">
        <div class="page__bd">
          <div>
            <div
              @click="toDetail"
              class="article"
              :data-tid="article.tid"
              v-for="(article, index) in articleList"
              :key="index"
            >
              <div class="article-content">
                <!-- 卡片头部开始 -->
                <div class="article-header">
                  <div class="article-author-avatar">
                    <img :src="article.avatar">
                  </div>
                  <div class="article-side-header">
                    <div class="article-sub-header">
                      <div class="article-title">{{article.subject}}</div>
                    </div>
                    <div class="article-info">
                      <div class="article-by">by</div>
                      <div class="article-author">{{article.author}}</div>
                    </div>
                  </div>
                </div>
                <!-- 卡片头部结束 -->
                <!-- 卡片body开始 -->
                <block v-if="!lite_switch">
                  <div class="article-img" v-if="article.image_list">
                    <div class="article-img-info">
                      <img class="article-img-item" :src="article.image_list[0]">
                    </div>
                  </div>
                  <div class="article-message" v-if="article.message">{{article.message}}</div>
                </block>
                <!-- 卡片body结束 -->
                <!-- 卡片底部开始 -->
                <div class="article-ext-info">
                  <div class="article-re">
                    <text class="cuIcon-attention text-blue"></text>
                    <div>{{article.views}}</div>
                    <text class="cuIcon-message text-blue"></text>
                    <div>{{article.replies}}</div>
                  </div>
                  <div class="article-post-time">{{article.create_time}}</div>
                </div>
                <!-- 卡片底部结束 -->
              </div>
            </div>
            <!-- 帖子列表结束 -->
          </div>
        </div>
        <div class="weui-loadmore">
          <div class="weui-loading"></div>
          <div class="weui-loadmore__tips">正在加载</div>
        </div>
        <!-- <template is="zan-loadmore" data="{{loading:have_data}}"></template>
        <template is="zan-loadmore" data="{{nodata:no_data}}"></template>
        <template is="zan-loadmore" data="{{nomore:nomore_data}}"></template>-->
        <div @click="goHome" class="edit-cell">
          <img class="edit-cell-img" src="/static/images/home.png">
        </div>
        <div @click="scrollToTop" class="scroll-to-top" v-if="scroll_show">
          <img class="scroll-to-top-img" src="/static/images/top.png">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      articleList: {},
      // 页面主题条数
      page_size: 10,
      page_index: 0,
      loading_hidden: true,
      loading_msg: "加载中...",
      scroll_show: false,
      no_data: false,
      have_data: false,
      nomore_data: false,
      lite_switch: false
    };
  },
  methods: {
    /**
     * 加载帖子列表
     */
    reloadIndex() {
      let that = this;
      let data = {
        page_size: that.page_size,
        page_index: 0
      };
      that.$wxAPI
        .request(that.$url.forumListUrl, data, "POST")
        .then(success => {
          if (success.data.err_code == 0) {
            if (success.data.data.forum_thread_data != "") {
              that.articleList = success.data.data.forum_thread_data;
              that.page_index = data.page_index;
              that.no_data = false;
              that.have_data = false;
              that.nomore_data = false;
            } else {
              that.articleList = success.data.data.forum_thread_data;
              that.page_index = data.page_index;
              that.no_data = true;
              that.have_data = false;
              that.nomore_data = false;
            }
          } else {
            // 接口获取数据失败
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 跳转到帖子详情
     */
    toDetail(e) {
      var pid = e.mp.currentTarget.dataset.pid;
      var tid = e.mp.currentTarget.dataset.tid;
      wx.navigateTo({
        url: "/pages/forum/detail/main?pid=" + pid + "&tid=" + tid
      });
    },
    /**
     * 返回首页
     */
    goHome() {
      wx.switchTab({ url: "/pages/index/main" });
    },
    /**
     * 返回顶部
     */
    scrollToTop() {
      let that = this;
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 600
        });
      } else {
        wx.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
      that.scroll_show = false;
    }
  },
  /**
   * 生命周期函数
   */
  mounted() {
    let that = this;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    that.reloadIndex();
    wx.hideLoading();
  },
  /**
   * 触底函数--加载更多帖子
   */
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    that.have_data = true;
    let data = {
      page_size: that.page_size,
      page_index: that.page_index + 1
    };
    that.$wxAPI
      .request(that.$url.forumListUrl, data, "POST")
      .then(success => {
        if (success.data.err_code == 0) {
          if (success.data.data.forum_thread_data) {
            that.articleList.push(...success.data.data.forum_thread_data);
            that.page_index = data.page_index;
          }
        }
        wx.hideLoading();
      })
      .catch(e => {
        console.log(e);
      });
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.reloadIndex();
    wx.stopPullDownRefresh();
  },
  /**
   * 监听页面滚动--显示返回顶部按钮
   */
  onPageScroll(e) {
    let that = this;
    if (e.scrollTop >= 600) {
      that.scroll_show = true;
    } else {
      that.scroll_show = false;
    }
  }
};
</script>
<style>
.container{
    padding: 10rpx 0;
}

.article {
  background-color: #fff;
  /* padding:20rpx; */
  padding: 10rpx 20rpx;
  margin: 20rpx 0;
  border-radius: 10rpx;
  color: #2d2e2f;
}

.article-header {
  height: 120rpx;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8rpx;
  /* padding-bottom:6rpx; */
  border-bottom: 1px solid #efefef;
}

.article-header .article-author-avatar {
  width: 15%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
}

.article-header .article-author-avatar image {
  /*
  width: 90rpx;
  height:90rpx;
  */
  width: 78rpx;
  height: 78rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.article-side-header {
  width: 85%;
}

.article-sub-header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.article-sub-header .article-title {
  color: #444;
  font-size: 30rpx;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.article-info {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.article-info .article-by {
  color: #c7c7c7;
  margin-right: 10rpx;
}

.article-info .article-author {
  color: #666;
  font-size: 26rpx;
}

.article-info .article-fid-item {
  font-size: 26rpx;
  color: #1296db;
}

.article-info .article-in {
  color: #c7c7c7;
  margin: 0 20rpx;
}

.article-img {
  position: relative;
  width: 100%;
  height: 200rpx;
  overflow: hidden;
  background-position: 50%;
  background-size: cover;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  margin-bottom: 10rpx;
}

.article-img-info {
  position: absolute;
  top: 50%;
  left: 0;
  height: 100%;
  width: 100%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  overflow: hidden;
}

.article-img-item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
}

.article-message {
  margin: 10rpx 0;
  color: #909090;
  font-size: 30rpx;
}

.article-ext-info {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  /* margin-top: 10rpx; */
  color: #c7c7c7;
}

.article-ext-info .article-re {
  display: flex;
  flex-flow: row nowrap;
}

.article-ext-info .article-re .zan-icon {
  color: #1296db;
}

.article-ext-info .article-re view {
  margin-right: 20rpx;
}

.scroll-to-top {
  z-index: 100;
  position: fixed;
  right: 50rpx;
  bottom: 50rpx;
  width: 90rpx;
  height: 90rpx;
}

.scroll-to-top-img {
  background-color: #1296db;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  opacity: 0.9;
}

.edit-cell {
  z-index: 100;
  position: fixed;
  right: 50rpx;
  bottom: 170rpx;
  width: 88rpx;
  height: 88rpx;
}

.edit-cell-img {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  opacity: 0.8;
}
</style>


