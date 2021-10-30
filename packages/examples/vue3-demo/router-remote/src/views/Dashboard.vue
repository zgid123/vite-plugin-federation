<template>
  <el-card class="introduce">
    <div class="order">
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>今日订单数</span>
          </div>
        </template>
        <div class="item">1888</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>今日日活</span>
          </div>
        </template>
        <div class="item">36271</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>转化率</span>
          </div>
        </template>
        <div class="item">20%</div>
      </el-card>
    </div>
    <div id="zoom"></div>
  </el-card>
</template>

<script>
import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onUnmounted,
  onUpdated
} from 'vue'
import {ElCard} from 'element-plus'

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {BarChart} from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import {LabelLayout, UniversalTransition} from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {CanvasRenderer} from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

let myChart = null
export default {
  name: 'Dashboard',
  components: {ElCard},
  setup() {
    console.log(`The router-remote‘s Dashboard call its own setup.`);
    onMounted(() => {
      console.log(`The router-remote‘s Dashboard onMounted`);
      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(document.getElementById('zoom'))
      // 指定图表的配置项和数据
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    })
    onUnmounted(() => {
      myChart.dispose()
    })
    onBeforeMount(() => {
      console.log('onBeforeMount')
    })
    onMounted(() => {
      console.log('onMounted')
    })
    onBeforeUpdate(() => {
      console.log('onBeforeUpdate ')
    })
    onUpdated(() => {
      console.log('onUpdated')
    })
    onBeforeUnmount(() => {
      console.log('onBeforeUnmount')
    })
    onUnmounted(() => {
      console.log('onUnmounted')
    })
    onErrorCaptured(() => {
      console.log('onErrorCaptured')
    })
    onRenderTracked(() => {
      console.log('onRenderTracked')
    })
    onRenderTriggered(() => {
      console.log('onRenderTriggered ')
    })
    onActivated(() => {
      console.log('onActivated')
    })
    onDeactivated(() => {
      console.log('onDeactivated')
    })
  }
}
</script>

<style scoped>
.introduce .order {
  display: flex;
  margin-bottom: 50px;
}

.introduce .order .order-item {
  flex: 1;
  margin-right: 20px;
}

.introduce .order .order-item:last-child {
  margin-right: 0;
}

#zoom {
  min-height: 300px;
}
</style>
