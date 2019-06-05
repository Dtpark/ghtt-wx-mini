<template>
  <div class="page">
    <!-- 头部开始 -->
    <div class="header-fix">
      <div class="fix-btn" @click="toIndex">
        <img class="detail-icon" src="/static/images/index.png">
        首页
      </div>
      <button class="fix-btn share-btn" open-type="share">
        <img class="detail-icon" src="/static/images/share.png">分享
      </button>
    </div>
    <!-- 头部结束 -->

    <!-- 帖子页面页开始 -->
    <div class="container">
      <div class="page-body">
        <div class="page__bd">
          <!-- 帖子标题开始 -->
          <div class="thread_title-cell">
            <div class="thread_data-title">{{thread_data.subject}}</div>
            <div class="thread_data-sub">
              <div class="thread_data-info">
                <!-- 浏览量 -->
                <img class="detail-icon" src="/static/images/views.png">
                <div>{{thread_data.views}}</div>
                <!-- 回复数 -->
                <img class="detail-icon" src="/static/images/reply.png">
                <div>{{thread_data.replies}}</div>
              </div>
              <!-- 版块名称 -->
              <block v-if="thread_data.fid_name">
                <div class="thread_data-fid">{{thread_data.fid_name}}</div>
              </block>
              <block v-else>
                <div class="thread_data-fid">群组</div>
              </block>
            </div>
          </div>
          <!-- 帖子标题结束 -->

          <!-- 主题内容开始 -->
          <div class="thread_content-cell">
            <!-- 楼主信息开始 -->
            <div class="article-info">
              <div class="article-author">
                <!-- 头像开始 -->
                <div class="article-author-avatar">
                  <img class="article-author-icon" :src="thread_data.author_avatar">
                </div>
                <!-- 头像结束 -->
                <div class="article-author-info">
                  <!-- 用户名 -->
                  <div>{{thread_data.author}}</div>
                  <!-- 发帖时间 -->
                  <div>{{thread_data.create_time}}</div>
                </div>
              </div>
              <!-- 楼层号开始 -->
              <div class="article-author-position">
                <div>楼主</div>
              </div>
              <!-- 楼层号结束 -->
            </div>
            <!-- 楼主信息结束 -->

            <!-- 主题内容开始 -->
            <wxParse :content="thread_data.message"/>
            <!-- <template is="wxParse" data="{{wxParseData:thread_data.message.nodes}}"/> -->
            <!-- 主题内容结束 -->

            <!-- <text>
          {{thread_data.message}}
            </text>-->
            <!-- 图片展示开始 -->
            <div>
              <block v-for="(image, imageId) in thread_data.image_list" :key="imageId">
                <div>
                  <img class="thread_image" mode="widthFix" :src="image" @click="predivImage">
                </div>
              </block>
            </div>
            <!-- 图片展示结束 -->
          </div>
          <!-- 主题内容结束 -->

          <!-- 提醒附件和收费贴开始 -->
          <block v-if="thread_data.un_image_attach || thread_data.price != 0">
            <div class="extend-notice">
              <block v-if="thread_data.un_image_attach">
                <div class="alert">本帖有 {{thread_data.un_image_attach}} 个附件可供下载</div>
              </block>
              <block v-if="thread_data.price != 0">
                <div class="alert">本帖售价为 {{thread_data.price}} 金币</div>
              </block>
              <div class="to-mould">
                请移步至
                <p>观海听涛</p>官网，进行查看。
              </div>
            </div>
          </block>
          <!-- 提醒附件和收费帖结束 -->

          <!-- 回复列表开始 -->
          <div>
            <div class="resp-head">全部回复（{{thread_data.replies}}）</div>

            <block v-for="(postItem, postIndex) in articleList" :key="postIndex">
              <div class="article">
                <!-- 回复者信息开始 -->
                <div class="article-info">
                  <div class="article-author">
                    <!-- 头像开始 -->
                    <div>
                      <img class="article-author-icon" :src="postItem.author_avatar">
                    </div>
                    <!-- 头像结束 -->
                    <!-- 昵称&回复时间开始 -->
                    <div class="article-author-info">
                      <div>{{postItem.author}}</div>
                      <div>{{postItem.create_time}}</div>
                    </div>
                    <!-- 昵称&回复时间结束 -->
                  </div>
                  <!-- 楼层号开始 -->
                  <div class="article-author-position">
                    <div>{{postItem.position}}楼</div>
                  </div>
                  <!-- 楼层号结束 -->
                </div>
                <!-- 回复者信息结束 -->
                <!-- 回复内容开始 -->
                <!-- <block v-for="(item, index) in article.message" :key='index'> -->
                <!-- <block v-if="index == articleIndex"> -->
                <wxParse :content="postItem.message"/>
                <block v-if="postItem.post_image_list">
                  <block v-for="(itemlist, idx) in postItem.post_image_list" :key="idx">
                    <div>
                      <img
                        class="thread_image"
                        mode="widthFix"
                        :src="postItem.post_image_list[idx]"
                        @click="predivImage"
                      >
                    </div>
                  </block>
                </block>
                <!-- 回复内容结束 -->
              </div>
            </block>
            <div class="page-tail-space"></div>
          </div>
          <!-- 回复列表结束 -->
        </div>
      </div>
      <div class="page-tail">
        <navigator class="need-login" url>下载观海app即可参与互动</navigator>
      </div>
      <!-- 返回顶部按钮开始 -->
      <block v-if="scroll_show">
        <div class="scroll-to-top" @click="scrollToTop">
          <img class="scroll-to-top-img" src="/static/images/top.png">
        </div>
      </block>
      <!-- 返回顶部按钮结束 -->
    </div>
    <!-- 帖子页面结束 -->
    <div class="weui-footer" :v-show="isBottom">
      <div class="weui-footer__text">-没有更多了-</div>
    </div>
  </div>
</template>
<script>
import wxParse from "mpvue-wxparse";

export default {
  components: {
    wxParse
  },
  data() {
    return {
      thread_data: {
        un_image_attach: 0,
        price: 0
      },
      imageList: [],
      // 回复列表
      articleList: {},
      // 主题tid
      tid: 205994,
      // 第几页
      page_index: 0,
      // 每次请求主题+回复条数
      page_size: 5,
      // 是否是新读者（增加浏览量）
      new_reader: 0,
      // 是否显示返回顶部按钮
      scroll_show: false,
      // 是否没有新数据
      isBottom: false
    };
  },
  methods: {
    /**
     * 预览图片
     */
    previewImage(e) {
      let current = e.mp.target.dataset.src;
      let urls = e.mp.target.dataset.image_list;
      wx.previewImage({
        current: current,
        urls: urls
      });
    },
    /**
     * 加载帖子详情
     */
    reloadIndex() {
      let that = this;
      // console.log(that);
      let data = {
        tid: that.tid,
        new_reader: that.new_reader,
        page_size: that.page_index,
        page_index: that.page_index
      };
      that.$wxAPI
        .request(that.$url.forumDetailUrl, data, "POST")
        .then(resp => {
          if (resp.data.err_code == 0) {
            // 请求数据成功
            that.articleList = resp.data.data.post_list;
            that.thread_data = resp.data.data.thread_data;
            that.new_reader = 0;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 返回首页
     */
    toIndex() {
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
   * 生命周期函数--监听页面加载
   */
  async mounted() {
    let that = this;
    let options = that.$root.$mp.query;
    wx.showLoading({
      title: "加载中", //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透
    });
    // console.log(options);
    if (options.tid) {
      // 有参数
      let tid = options.tid;
      that.tid = tid;
      that.new_reader = 1;

      // 获取帖子内容
      await that.reloadIndex();
      wx.hideLoading();
    } else {
      wx.hideLoading();
      // 没有帖子id参数, 返回首页
      wx.showModal({
        title: "提示", //提示的标题,
        content: "没有该内容，请返回首页", //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            // console.log('用户点击确定')
            // wx.switchTab({ url: "/pages/index/main" });
          }
        }
      });
    }
  },
  /**
   * 监听页面滚动
   * 判断是否显示返回顶部按钮
   */
  onPageScroll(e) {
    let that = this;
    // console.log(e);
    if (e.scrollTop >= 600) {
      that.scroll_show = true;
    } else {
      that.scroll_show = false;
    }
  },
  /**
   * 触底上拉函数
   */
  onReachBottom() {
    let that = this;
    if (that.page_index * that.page_size > that.thread_data.replies) {
      that.isBottom = true;
      return false;
    } else {
      if (that.isBottom == true) {
        that.isBottom = false;
      }
    }
    let data = {
      page_size: that.page_size,
      page_index: that.page_index + 1,
      tid: that.tid
    };
    // return false;
    that.$wxAPI
      .request(that.$url.forumDetailUrl, data, "POST")
      .then(resp => {
        if (resp.data.err_code == 0) {
          // 返回数据成功
          // 评论信息
          let respArticleList = resp.data.data.post_list;
          // 新的回复信息加入原回复数组
          that.articleList.push(...respArticleList);
          // 跟新当前页数
          that.page_index = data.page_index;
          // 将回复数更新
          that.thread_data.replies = resp.data.data.thread_data.replies;
        } else {
          // 返回数据失败
          wx.showModal({
            title: "提示", //提示的标题,
            content: resp.data.err_msg, //提示的内容,
            showCancel: false, //是否显示取消按钮
            confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: "#3CC51F", //确定按钮的文字颜色,
            success: res => {
              if (res.confirm) {
                // console.log("用户点击确定");
              }
            }
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>
<style>
@import url("~mpvue-wxparse/src/wxParse.css");
/* p{
  overflow-x: hidden;
  max-width: 100%;
} */
.page {
  width: 100%;
  overflow: hidden;
}
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
.header-fix {
  position: fixed;
  height: 80rpx;
  background: #fbfbfb;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  z-index: 100;
  border-bottom: 1rpx solid #dfdfdf;
}

.header-fix .fix-btn {
  display: flex;
  height: 100%;
  width: 50%;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  letter-spacing: 6rpx;
  color: #444;
}

.header-fix .share-btn {
  font-size: 28rpx;
  margin: 0;
  padding: 0;
  line-height: normal;
  border-radius: 0;
  color: #444;
  background: #fbfbfb;
}

.header-fix .share-btn::after {
  content: none;
}

.detail-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 15rpx;
}

.thread_title-cell {
  border-radius: 10rpx;
  margin: 80rpx 0 20rpx 0;
  padding: 20rpx 30rpx;
  background-color: white;
  display: felx;
  flex: row nowrap;
}

.thread_data-title {
  font-size: 36rpx;
  margin-bottom: 10rpx;
}

.thread_data-sub {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
}

.thread_data-info {
  display: flex;
  flex-direction: row;
  color: #c7c7c7;
}

.thread_data-info .zan-icon {
  color: #f44444;
  width: 30rpx;
}

.thread_data-info view {
  margin-right: 16rpx;
}

.thread_data-fid {
  height: 30rpx;
  line-height: 30rpx;
  font-size: 22rpx;
  border-radius: 5rpx;
  border: 0.1rpx solid #1296db;
  color: #1296db;
  padding: 2px 6rpx;
  margin-top: 5rpx;
}

.thread_content-cell {
  padding: 20rpx 30rpx;
  background-color: white;
  border-radius: 5rpx;
}

/* .new-post {
  border: 2px solid #ff6a6a;
} */

/* .new-post .article-info .article-author-info {
  padding: 0;
}

.new-post .article-info .article-author-position {
  color: #ff6a6a;
} */

.article-info {
  padding: 10rpx 0 15rpx 0;
  margin-bottom: 18rpx;
  color: gray;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #efefef;
}

.article-author {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
}

.article-author-avatar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
}

.article-author-icon {
  max-width: 68rpx;
  max-height: 68rpx;
  border-radius: 50%;
}

.article-author-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 24rpx;
  padding-left: 18rpx;
}

.article-author-position {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 24rpx;
  padding-left: 10rpx;
}

.thread_image {
  width: 100%;
  margin: 10rpx 0;
}

.resp-head {
  color: #1296db;
  margin: 20rpx 0 6rpx 10rpx;
  font-size: 26rpx;
}

.article {
  border-radius: 5rpx;
  margin-bottom: 15rpx;
  padding: 20rpx 30rpx;
  position: relative;
  align-items: center;
  background-color: white;
}

.article-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.article-title {
  font-size: large;
}

.article-sign {
  display: flex;
  flex-direction: row;
  font-size: small;
}

.article-sign-item {
  background-color: orange;
  color: white;
  padding: 0rpx 5rpx;
  margin: 0rpx 5rpx;
}

.article-reader {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-image {
  max-width: 150rpx;
  max-height: 150rpx;
}

.comment {
  padding: 0rpx 30rpx;
  position: relative;
  align-items: center;
  background-color: white;
}

.comment-item {
  padding: 20rpx 0rpx;
  border-top: 1rpx solid #d8d8d8;
}

.comment-info {
  color: gray;
  font-size: small;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.comment-author {
  display: flex;
  flex-direction: row;
}

.comment-op {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.comment-content {
  margin-left: 80rpx;
}

.comment-resp {
  margin-left: 80rpx;
  padding: 10rpx 10rpx;
  background-color: #eeeeee;
}

.page-tail-space {
  height: 110rpx;
}

.page-tail {
  left: 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #dfdfdf;
}

.resp-input-cell {
  width: 84%;
  margin-right: 20rpx;
}

.resp-input {
  height: 60rpx;
  padding-left: 20rpx;
  margin: 15rpx 0 15rpx 25rpx;
  border: 1px solid #ccc;
  border-radius: 30rpx;
}

.resp-btn {
  height: 60rpx;
  width: 16%;
  line-height: 60rpx;
  text-align: center;
  margin-right: 8rpx;
  color: #4b0;
  font-size: 30rpx;
}

.need-login {
  height: 90rpx;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #999;
}

.scroll-to-top {
  z-index: 100;
  position: fixed;
  right: 20rpx;
  bottom: 100rpx;
  width: 120rpx;
  height: 120rpx;
}

.scroll-to-top-img {
  background-color: #fff;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  opacity: 0.9;
}

.extend-notice {
  padding: 10rpx 20rpx;
  background: white;
  margin: 20rpx 0;
  border-radius: 5rpx;
  border: 2px solid #ff6a6a;
}

.extend-notice .alert,
.extend-notice .to-mould text {
  color: #ff6a6a;
}

video {
  width: 100%;
}

/* 解决内联元素过长撑开页面的问题：超过650rpx自动换行 */
.wxParse .inline {
  display: inline-block;
  margin: 0;
  padding: 0;
  max-width: 650rpx ;
  float: left;
  overflow: hidden ;
  text-overflow: ellipsis;
  white-space: normal ;
  word-wrap: break-word;
}
.wxParse .p{
  display: inline-block;
  max-width: 650rpx ;
  float: left;
  overflow: hidden ;
  text-overflow: ellipsis;
  white-space: normal ;
  word-wrap: break-word;
}
</style>


