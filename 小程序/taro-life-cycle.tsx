import { View, Text } from "@tarojs/components";
import {
  useDidHide,
  useDidShow,
  useLoad,
  usePageScroll,
  usePullDownRefresh,
  useReachBottom,
  useReady,
  useResize,
  useShareAppMessage,
} from "@tarojs/taro";
import "./index.less";

export default function Index() {
  useDidShow(() => {
    // 页面或组件显示时触发
  });

  useDidHide(() => {
    // 页面或组件隐藏时触发
  });

  useReady(() => {
    // 页面初次完成渲染时触发
  });

  usePullDownRefresh(() => {
    // 下拉刷新时触发，需在page.json中开启支持
  });

  useReachBottom(() => {
    // 滚动到底部触发，用于加载理多数数据
  });

  usePageScroll(() => {
    // 页面滚动时触发，返回滚动位置信息
  })  

  useResize(() => {
    // 页面尺寸变化时触发，适用于不同屏幕场景
  })

  useShareAppMessage(() => {
    // 用户触发分享动作时触发，返回分享内容配置
    return {
      title: '分享标题',
      path: '/pages/index/index',
    }
  })

  return (
    <View className="index">
      <Text>Hello world!</Text>
    </View>
  );
}
