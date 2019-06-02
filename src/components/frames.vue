<template>
  <div class="frameContainers">
    <!-- 标题栏开始 -->
    <header
      class="headNav"
      :style="{ paddingTop: statusBarHeight + 'px', height: navHeight + 'px' }"
    >
    <!-- 标题栏内容区域开始 -->
      <section
        class="headArea"
        :style="{ height: headAreaHeight + 'px', marginTop: headAreaMarTop + 'px' }"
      >
      <!-- 标题栏自定义内容开始 -->
        <div class="leftBox">
            <!-- 返回按钮开始 -->
            <!-- <div class="back_btn">123</div> -->
            <!-- 返回按钮结束 -->
        </div>
        <!-- 标题栏自定义内容结束 -->

        <!-- 胶囊区域开始 -->
        <div class="rightBox" :style="{ width: headRightBoxW + 'px' }"></div>
        <!-- 胶囊区域结束 -->
      </section>
      <!-- 标题栏内容区域结束 -->
    </header>
    <!-- 标题栏结束 -->
  </div>
</template>

<script>
import index from "@/utils/index";
export default {
  props: ["text"],
  data() {
    return {
      pixelRatio: index.getSysInfo().pixelRatio, //系统像素比
      statusBarHeight: index.getSysInfo().statusBarHeight, //系统状态栏高度
      navHeight: "", //顶部导航栏高度
      headAreaHeight:
        index.getSysInfo().pixelRatio * 35 / index.getSysInfo().pixelRatio, //顶部内容区域高度
      headAreaMarTop: "", //顶部内容区域外边距
      headleftBoxW: "", //顶部内容左侧区域外边距
      headRightBoxW: "", //顶部内容右侧区域外边距
      containersHeight: "" //页面内容区域高度
    };
  },
  mounted() {
    //IOS 与 安卓进行差异化处理
    if (index.getSysInfo().system.substring(0, 3) == "iOS") {
      this.navHeight = this.pixelRatio * 40 / this.pixelRatio;
      this.headAreaMarTop = this.pixelRatio * 0.5 / this.pixelRatio;
      this.headleftBoxW =
        index.getSysInfo().windowWidth -
        this.pixelRatio * 100 / this.pixelRatio;
      this.headRightBoxW = this.pixelRatio * 100 / this.pixelRatio;
      this.containersHeight =
        index.getSysInfo().windowHeight -
        (this.statusBarHeight + this.pixelRatio * 40 / this.pixelRatio);
    } else {
      this.navHeight = this.pixelRatio * 45 / this.pixelRatio;
      this.headAreaMarTop = this.pixelRatio * 2.5 / this.pixelRatio;
      this.headleftBoxW =
        index.getSysInfo().windowWidth -
        this.pixelRatio * 110 / this.pixelRatio;
      this.headRightBoxW = this.pixelRatio * 110 / this.pixelRatio;
      this.containersHeight =
        index.getSysInfo().windowHeight -
        (this.statusBarHeight + this.pixelRatio * 45 / this.pixelRatio);
    }
  }
};
</script>

<style scope>
.frameContainers {
  width: 100%;
  height: 100%;
}
.headNav {
  background-color: red;
  display: flex;
  align-items: center;
}
.headArea {
  width: 100%;
  background-color: aqua;
}
/* .contentArea {
  background-color: yellow;
} */

.rightBox {
  width: 18vh;
  height: 100%;
  background-color: cadetblue;
  float: right;
}
</style>