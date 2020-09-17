<template>
  <div class="page">
    <div class="container">
      <div class="page-body">
        <div class="page__bd">
          <!-- 版区头部开始 -->
          <div class="forum">
            <div class="forum_info">
              <div class="forum_title">{{forum_data.name}}</div>
              <div class="forum_note">主题：{{forum_data.threads}} 帖子：{{forum_data.posts}}</div>
            </div>
            <div class="top_subject" v-if="has_top">
              <div class="zan-tag zan-tag--primary">置顶贴</div>
              <!-- <div class="cu-tag bg-gh margin-top-sm">置顶贴</div> -->
              <div
                @click="toDetail"
                class="zan-ellipsis"
                :data-tid="item.tid"
                v-for="(item, index) in few_top_thread_data"
                :key="index"
              >{{item.subject}}</div>
              <div @click="show_more_top" class="top_subject_item" v-if="show_more">查看更多</div>
            </div>
          </div>
          <!-- 版区头部结束 -->
          <div>
            <!-- 帖子分类开始 -->
            <div class="thread_order">
              <div
                @click="get_recent_thread"
                class="thread_order_item"
                :class="(recent == 1)? 'thread_order_border':''"
              >最新</div>
              <div
                @click="get_hot_thread"
                class="thread_order_item"
                :class="order_by_views==1? 'thread_order_border':''"
              >热门</div>
              <div
                @click="get_digest_thread"
                class="thread_order_item"
                :class=" digest==1? 'thread_order_border':''"
              >精华</div>
            </div>
            <!-- 帖子分类结束 -->

            <!-- 帖子列表开始 -->
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
                    <text class="cuIcon-attention margin-right-xs text-gh"></text>
                    <div>{{article.views}}</div>
                    <text class="cuIcon-message margin-right-xs text-gh"></text>
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
         <div class="cu-load line-black" :class="isLoad? 'loading': 'over'"></div>
        <goHome ></goHome>
      </div>
    </div>
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
      fid: null,
      forum_data: {},
      few_top_thread_data: {},
      top_thread_data: {},
      show_more: false,
      articleList: {},
      page_size: 5,
      page_index: 0,
      recent: 1,
      digest: 0,
      order_by_views: 0,
      has_top: 0,
      reload_index: 1,
      isLoad: false,
      lite_switch: false
    };
  },
  methods: {
    reloadIndex() {
      let that = this;
      let data = {
        fid: that.fid,
        page_size: that.page_size,
        page_index: 0,
        digest: that.digest,
        order_by_views: that.order_by_views
      };
      that.$wxAPI
        .request(that.$url.forumListUrl, data, "POST")
        .then(success => {
          if (success.data.err_code == 0) {
            if (success.data.data.forum_thread_data != "") {
              that.articleList = success.data.data.forum_thread_data;
              that.page_index = data.page_index;
              that.isLoad = true;
            } else {
              that.articleList = success.data.data.forum_thread_data;
              that.page_index = data.page_index;
              that.isLoad = false;
            }
          } else {
            // 接口获取数据失败
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    get_forum_info() {
      let that = this;
      let data = {
        fid: that.fid
      };
      that.$wxAPI
        .request(that.$url.forumInfoUrl, data, "POST")
        .then(success => {
          if (success.data.err_code == 0) {
            that.forum_data = success.data.data.forum_data;
            that.few_top_thread_data = success.data.data.few_top_thread_data;
            that.top_thread_data = success.data.data.top_thread_data;
            that.show_more = success.data.data.show_more;
            that.has_top = success.data.data.has_top;
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
      // var pid = e.mp.currentTarget.dataset.pid;
      var tid = e.mp.currentTarget.dataset.tid;
      wx.navigateTo({
        url: "/pages/forum/detail/main?tid=" + tid
      });
    },
    /**
     * 显示全部置顶帖
     */
    show_more_top() {
      let that = this;
      that.few_top_thread_data = that.top_thread_data;
      that.show_more = 0;
    },
    /**
     * 显示最新帖子
     */
    get_recent_thread() {
      let that = this;
      that.recent = 1;
      that.digest = 0;
      that.order_by_views = 0;
      that.reloadIndex();
    },
    /**
     * 显示热门帖子
     */
    get_hot_thread() {
      let that = this;
      that.recent = 0;
      that.digest = 0;
      that.order_by_views = 1;
      that.reloadIndex();
    },
    /**
     * 显示精华帖子
     */
    get_digest_thread() {
      let that = this;
      that.recent = 0;
      that.digest = 1;
      that.order_by_views = 0;
      that.reloadIndex();
    }
  },
  async mounted() {
    let that = this;
    let options = that.$root.$mp.query;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    if (options.fid) {
      that.fid = options.fid;
      await that.reloadIndex();
      await that.get_forum_info();
      wx.hideLoading();
    } else {
      // 没有版块id参数, 返回首页
      wx.hideLoading();
      wx.showModal({
        title: "提示", //提示的标题,
        content: "没有该内容，按确定返回", //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateBack({
              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
          }
        }
      });
    }
  },
  onShow() {
    let that = this;
    if (that.reload_index == 1) {
      that.reloadIndex();
      that.get_forum_info();
      that.reload_index = 0;
    }
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
    let data = {
      fid: that.fid,
      page_size: that.page_size,
      page_index: that.page_index + 1,
      digest: that.digest,
      order_by_views: that.order_by_views
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
  }
};
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: space-between;
  font-size: 28rpx;
  padding: 0 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
.page-body {
  width: 100%;
  flex-grow: 1;
  overflow-x: hidden;
}

.page__bd {
  margin-top: 20rpx;
}

/* index开始 */
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

/* index结束 */

.article-info .article-by {
  color: #c7c7c7;
  margin-right: 20rpx;
}

.forum {
  padding: 20rpx;
  margin-top: 20rpx;
  background-color: #fff;
}

.forum_info {
  padding: 15rpx 0;
}

.top_subject {
  border-top: 1px solid #efefef;
}

.top_subject_item {
  font-size: 28rpx;
  color: #1296db;
}

.forum_title {
  font-size: 36rpx;
}

.forum_note {
  color: #999;
  font-size: 14px;
}

.top_subject .zan-tag {
  margin: 20rpx 0 10rpx 0;
}

.top_subject .zan-ellipsis {
  margin: 8rpx 0;
}

.thread_order {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: white;
  margin-top: 20rpx;
}

.thread_order_item {
  padding-top: 10rpx;
  padding-bottom: 10rpx;
  width: 33%;
  text-align: center;
}

.thread_order_border {
  border-bottom: 5rpx solid #1296db;
}
.detail-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 15rpx;
}

.cu-tag{
  font-size: 16px;
  padding: 0 5px;
}

/* 友赞样式 */
.zan-tag {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  line-height: 14px;
  padding: 0 5px;
  border-radius: 2px;
  font-size: 14px;
  background: #1296db;
  text-align: center;
  color: #fff;
}
</style>

