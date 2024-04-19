// 示例
function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data");
    }, 1000);
  });
}

async function test() {
  const data = await getData();
  console.log("data", data);
  const data2 = await getData();
  console.log("data2", data);
  return "success";
}
// 这样一个函数 应该在1秒后在打印一个data 再过一秒打印一个data 最后打印success
test().then((res) => console.log(res));

// ? 思路
// 对于这个简单的案例来说，如果我们把它用generator函数表达，会是怎么样的呢
function* testG() {
  // await编译成yield
  const data = yield getData();
  console.log("data", data);
  const data2 = yield getData();
  console.log("data2", data2);
  return "success";
}
let gen = testG();
let dataPromise = gen.next();

// 异步串行
dataPromise.then((value1) => {
  //data1的value被拿到了 继续调用next并且传递给data
  let data2Promise = gen.next(value1);
  // console.log('data', data)
  // 此时就会打印出data
  data2Promise.then((value2) => {
    // data2的value拿到了 继续调用next并且传递给value2
    gen.next(value2);
    // console.log('data2', data2)
    // 此时就会打印出data2
  });
});

function asyncToGenerator(generatorFunc) {
  // 返回的是一个新的函数
  return function () {
    // 先调用generator函数，生成迭代器
    // 对应 let gen = testG()
    const gen = generatorFunc.apply(this, arguments);

    // 返回一个promise因为外部是用.then的方法或者await的方法使用这个函数返回值的
    return new Promise((resolve, reject) => {
      // 内部定义一个step函数，用来一步一步的跨过yield的阻碍
      // key 有next 和 throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个 yield
      function step(key, arg) {
        let generatorResult;
        // 这个方法需要包装在try catch中
        // 如果报错了 就把promise给reject掉  外部通过.catch可以获取得到错误
        try {
          generatorResult = gen[key](arg);
        } catch (error) {
          return reject(error);
        }
        // gen.next() 得到的结果是一个{value, next}的结构
        const { value, done } = generatorResult;

        if (done) {
          // 如果已经完成了 就直接resolve这个promise
          // 这个done是在最后一次调用next后才会为true
          return resolve(value);
        } else {
          // 除了最后结束的时候外，每次调用gen.next()
          // 其实是返回｛value:Promise, done: false｝的结构
          // 这里要注意的是Promise.resolve可以接受一个promise为参数
          // 并且这个promise参数被resolve的时候，这个then才会被调用
          return Promise.resolve(
            // 这个value对应的是yield后面的promise
            value
          ).then(
            // value这个promise被resolve的时候，就会执行next
            // 并且只要done不是true的时候 就会递归的往下解开promise
            // 对应gen.next().value.then(value => {
            //    gen.next(value).value.then(value2 => {
            //       gen.next()
            //
            //      // 此时done为true了 整个promise被resolve了
            //      // 最外部的test().then(res => console.log(res))的then就开始执行了
            //    })
            // })
            function onResolve(val) {
              step("next", value);
            },
            // 如果promise被reject了，就再次进入step函数
            // 不同的是，这次的try catch中调用的是gen.throw(err)
            // 那么自然就被catch到 然后把promise给reject掉了
            function onReject(err) {
              step("throw", err);
            }
          );
        }
      }
      step("next");
    });
  };
}
