<template>
  <div>
    123
    <!-- 顶部banner开始 -->
    <!-- 顶部banner结束 -->

    <!-- 通知公告开始 -->
    <!-- 通知公告结束 -->

    <!-- 今日课表开始 -->
    <!-- 今日课表结束 -->

    <!-- 一卡通（今日消费）开始 -->
    <!-- 一卡通（今日消费）结束 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      home: "home"
    };
  },
  onLoad(options) {
    this.$login.isLogin()
    .then()
    .catch(e => {
      console.log(e);
    })
  }
};
</script>

<style scoped>
</style>

