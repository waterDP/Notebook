## 组件通信
- props + emit / 同步数据 v-model/.sync
- provide, inject 会造成单向数据流混乱 自己实现工具类的话 需要采用这个方式
- (尽量不要直接更改父组件数据)
- $parent $children 可以直接触发儿子的事件或者父亲的事件 （尽量不要使用）
- $broadcast $dispatch
- $attr $listener 表示所有属性和方法的合集 (inheritAttrs: false) 可以使用v-bind 或者 v-on传递
- ref
- eventBus 可以任意组件中通信 只适合小规模的 通信  大规模会导致事件不好维护
- slot 插槽的用法  slot-scope 数据插槽