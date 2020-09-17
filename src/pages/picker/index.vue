<template>
  <div>
    <view class="section">
      <view class="section__title">多列选择器</view>
      <picker
        mode="multiSelector"
        @change="bindMultiPickerChange"
        @columnchange="bindMultiPickerColumnChange"
        :value="multiIndex"
        :range="multiArray"
      >
        <view
          class="picker"
        >当前选择：{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}</view>
      </picker>
    </view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      multiArray: [
        ["无脊柱动物", "脊柱动物"],
        ["扁性动物", "线形动物", "环节动物", "软体动物", "节肢动物"],
        ["猪肉绦虫", "吸血虫"]
      ],
      objectMultiArray: [
        [
          {
            id: 0,
            name: "无脊柱动物"
          },
          {
            id: 1,
            name: "脊柱动物"
          }
        ],
        [
          {
            id: 0,
            name: "扁性动物"
          },
          {
            id: 1,
            name: "线形动物"
          },
          {
            id: 2,
            name: "环节动物"
          },
          {
            id: 3,
            name: "软体动物"
          },
          {
            id: 3,
            name: "节肢动物"
          }
        ],
        [
          {
            id: 0,
            name: "猪肉绦虫"
          },
          {
            id: 1,
            name: "吸血虫"
          }
        ]
      ],
      multiIndex: [0, 0, 0]
    };
  },
  methods: {
    bindMultiPickerChange: function(e) {
      console.log("picker发送选择改变，携带值为", e.mp.detail.value);
      //   this.setData({
      //     multiIndex: e.mp.detail.value
      //   });
      this.multiIndex = e.mp.detail.value;
    },

    bindMultiPickerColumnChange: function(e) {
      console.log(
        "修改的列为",
        e.mp.detail.column,
        "，值为",
        e.mp.detail.value
      );
      var data = {
        multiArray: this.multiArray,
        multiIndex: this.multiIndex
      };
      data.multiIndex[e.mp.detail.column] = e.mp.detail.value;
      switch (e.mp.detail.column) {
        case 0:
          switch (data.multiIndex[0]) {
            case 0:
              data.multiArray[1] = [
                "扁性动物",
                "线形动物",
                "环节动物",
                "软体动物",
                "节肢动物"
              ];
              data.multiArray[2] = ["猪肉绦虫", "吸血虫"];
              break;
            case 1:
              data.multiArray[1] = ["鱼", "两栖动物", "爬行动物"];
              data.multiArray[2] = ["鲫鱼", "带鱼"];
              break;
          }
          data.multiIndex[1] = 0;
          data.multiIndex[2] = 0;
          break;
        case 1:
          switch (data.multiIndex[0]) {
            case 0:
              switch (data.multiIndex[1]) {
                case 0:
                  data.multiArray[2] = ["猪肉绦虫", "吸血虫"];
                  break;
                case 1:
                  data.multiArray[2] = ["蛔虫"];
                  break;
                case 2:
                  data.multiArray[2] = ["蚂蚁", "蚂蟥"];
                  break;
                case 3:
                  data.multiArray[2] = ["河蚌", "蜗牛", "蛞蝓"];
                  break;
                case 4:
                  data.multiArray[2] = [
                    "昆虫",
                    "甲壳动物",
                    "蛛形动物",
                    "多足动物"
                  ];
                  break;
              }
              break;
            case 1:
              switch (data.multiIndex[1]) {
                case 0:
                  data.multiArray[2] = ["鲫鱼", "带鱼"];
                  break;
                case 1:
                  data.multiArray[2] = ["青蛙", "娃娃鱼"];
                  break;
                case 2:
                  data.multiArray[2] = ["蜥蜴", "龟", "壁虎"];
                  break;
              }
              break;
          }
          data.multiIndex[2] = 0;
          break;
      }
      // console.log(data.multiIndex);
      this.$set(this.multiArray,data.multiArray);
      this.$set(this.multiIndex,data.multiIndex);
    }
  }
};
</script>
<style scoped>
</style>


