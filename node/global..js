// todo process 进程
/** 
 * process.platform 进程运行的平台  
 * process.argv 当前进程执行时所带的参数 默认是数组类型的，参数前两个是固定的
 * 1. 当前node的执行命令文件
 * 2. 当前执行的文件是谁 node+文件 执行时，可以传递参数，这些参数会放到数组的第三项
 * process.cwd() 当前里程执行的工作目录
 * process.env 当前进程的环境变量 会用来区分各种环境 => cross-env
 * process.nextTick node事件环
 */

//  解析用户传递的参数 
let result = process.argv.slice(2).reduce((memo, current, index, arr) => {
  if (current.startsWith('--')) {
    memo[current.slice(2)] = arr[index + 1]
  }
  return memo
}, {})

// ? commander包
const program = require('commander')
program.name('node')
program.usage('global.js')
program.version('1.0.0')
program.option('-p,--port <v>', 'please set you prot')
program.option('-c,--config <v>', 'please set you config file')
program.command('create').action(() => {
  console.log('创建项目')
})
program.on('--help', function() {
  console.log('\r\nRun command')
  console.log('\r\n node global -p 3000')
})
program.parse(process.argv)