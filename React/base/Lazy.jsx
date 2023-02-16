// todo React.lazy
/* 
  fallback属性接受任何在组件加载过程中你想展示的React元素
  你可以将Suspense组件置于懒加载组件之上的任何位置。你甚至可以用一个Suspense组件包裹多个懒加载组件
*/
import React, {Suspense} from 'react'  

const OtherComponent = React.lazy(() => import('./OtherComponent'))
const AnotherComponent = React.lazy(() => import('./AnotherComponent'))

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  )
}

// ! 异常捕获边界
/**
 * 如果模块模块加载失败（如网络问题），它会触发一个错误。你可以通过异常捕获边界
 * 技术来处理这些情况，以显示良好的用户体验并管理恢复事宜
 */
import React, {Suspense} from 'react'
import MyErrorBoundary from './MyErrorBoundary'

const OtherComponent = React.lazy(() => import('./OtherComponent'))
const AnotherComponent = React.lazy(() => import('./AnotherComponent'))

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
)


// todo 基于路由的代码分割
import React, {Suspense, lazy} from 'react' 
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

const Home = lazy(() => import('./routes/Home'))
const About = lazy(() => import('./routes/About'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
)