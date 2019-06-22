<template functional>
  <div>
    <div class="cu-custom" :style="{height:CustomBar +'px'}">
      <div
        class="cu-bar fixed"
        :style="style"
        :class="{'none-bg text-white bg-img':bgImage, bgColor}"
      >
        <div class="action" @click="BackPage" v-if="isBack">
          <text class="cuIcon-back"></text>
          <slot name="backText"></slot>
        </div>
        <div @click="customClick" class="content" :style="{top:StatusBar + 'px'}">
          <slot name="content"></slot>
        </div>
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      StatusBar: null,
      CustomBar: null,
      Custom: null
    };
  },
  computed: {
    style() {
      let StatusBar = this.StatusBar;
      let CustomBar = this.CustomBar;
      let bgImage = this.bgImage;
      let style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
      if (this.bgImage) {
        style = `${style}background-image:url(${bgImage});`;
      }
      return style;
    }
  },
  props: {
    bgColor: {
      type: String,
      default: ""
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ""
    },
    customClick: {
      type: Function,
      default: ""
    }
  },
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    }
  },
  mounted() {
    let that = this;
    wx.getSystemInfo({
      success: e => {
        that.StatusBar = e.statusBarHeight;
        let Custom = wx.getMenuButtonBoundingClientRect();
        that.CustomBar = Custom.bottom + Custom.top - e.statusBarHeight;
      }
    });
    that.customClick();
  }
};
</script>
<style lang="wxss">
</style>



